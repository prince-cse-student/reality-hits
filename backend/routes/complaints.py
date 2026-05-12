"""Complaint routes — PUBLIC submit (no auth), track, list"""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from database.mongo import get_database
from middleware import get_current_admin
from services.complaint_service import ComplaintService
from services.ai_service import analyze_complaint_with_ai
from services.forwarding_service import create_forwarding_record, create_initial_timeline
from services.department_config import get_department
from config import (
    ALLOWED_UPLOAD_CONTENT_TYPES,
    ALLOWED_UPLOAD_EXTENSIONS,
    MAX_UPLOAD_SIZE_BYTES,
    UPLOAD_DIR,
)
import re
from pathlib import Path
from uuid import uuid4
from datetime import datetime

router = APIRouter()

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_service(db=Depends(get_database)) -> ComplaintService:
    return ComplaintService(db)


def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w\.\+\-]+@[\w\-]+\.[\w\-\.]+$', email))


def validate_phone(phone: str) -> bool:
    digits = re.sub(r'[\s\-\+]', '', phone)
    return len(digits) >= 10 and digits.isdigit()


async def save_upload(image: UploadFile) -> str:
    suffix = Path(image.filename or "").suffix.lower()
    if suffix not in ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(status_code=422, detail="Only JPG, PNG, WEBP, or GIF images are allowed")
    if image.content_type not in ALLOWED_UPLOAD_CONTENT_TYPES:
        raise HTTPException(status_code=422, detail="Invalid image content type")

    content = await image.read()
    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 5MB limit")

    filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid4().hex}{suffix}"
    filepath = UPLOAD_DIR / filename
    filepath.write_bytes(content)
    return f"/uploads/{filename}"


@router.post("/complaints")
async def submit_complaint(
    text: str = Form(...),
    location: str = Form(...),
    citizen_name: str = Form(...),
    citizen_email: str = Form(...),
    citizen_phone: str = Form(...),
    language: str = Form(default="English"),
    title: str = Form(default=""),
    image: UploadFile = File(None),
    service: ComplaintService = Depends(get_service),
):
    """Submit complaint — PUBLIC, no login required"""
    # Validate citizen info
    if not citizen_name.strip():
        raise HTTPException(status_code=422, detail="Full name is required")
    if not validate_email(citizen_email):
        raise HTTPException(status_code=422, detail="Valid email is required")
    if not validate_phone(citizen_phone):
        raise HTTPException(status_code=422, detail="Valid mobile number is required (min 10 digits)")
    if not text.strip() or len(text.strip()) < 10:
        raise HTTPException(status_code=422, detail="Complaint must be at least 10 characters")
    if not location.strip():
        raise HTTPException(status_code=422, detail="Location is required")

    try:
        # 1. AI analysis
        analysis = await analyze_complaint_with_ai(text, location, language)

        # 2. Save image
        image_url = None
        if image:
            image_url = await save_upload(image)

        # 3. Generate complaint ID
        complaint_id = await service.generate_complaint_id()

        # 4. Department lookup
        category = analysis.get("category", "Other")
        dept_info = get_department(category)

        # 5. Build complaint doc
        complaint_data = {
            "complaint_id": complaint_id,
            "citizen_name": citizen_name.strip(),
            "citizen_email": citizen_email.lower().strip(),
            "citizen_phone": citizen_phone.strip(),
            "title": title.strip() or text[:80],
            "text": text.strip(),
            "location": location.strip(),
            "language": language,
            "category": category,
            "priority": analysis.get("priority", "Medium"),
            "department": dept_info["name"],
            "ai_reasoning": analysis.get("reason", ""),
            "ai_summary": analysis.get("summary", ""),
            "ai_confidence": analysis.get("confidence", 0),
            "image_url": image_url,
            "admin_notes": [],
        }

        # 6. Save
        complaint = await service.create_complaint(complaint_data)

        # 7. Forwarding
        forwarding, email_log = create_forwarding_record(complaint)

        # 8. Timeline
        timeline = create_initial_timeline(complaint, forwarding)

        # 9. Update with forwarding + timeline
        await service.update_complaint(str(complaint["_id"]), {
            "forwarding": forwarding,
            "email_logs": [email_log],
            "timeline": timeline,
            "status": "Under Review",
        })

        # 10. Forwarding log
        db = get_database()
        await db["forwarding_logs"].insert_one({
            "complaint_id": complaint_id,
            "complaint_oid": str(complaint["_id"]),
            **forwarding,
            "email_log": email_log,
            "created_at": datetime.utcnow(),
        })

        return {
            "id": str(complaint["_id"]),
            "complaint_id": complaint_id,
            "citizen_name": complaint_data["citizen_name"],
            "category": complaint_data["category"],
            "priority": complaint_data["priority"],
            "department": dept_info["name"],
            "ai_confidence": complaint_data["ai_confidence"],
            "ai_summary": complaint_data.get("ai_summary", ""),
            "status": "Under Review",
            "forwarding": forwarding,
            "tracking_reference": forwarding["tracking_reference"],
            "response_sla": dept_info["response_sla"],
            "created_at": complaint["created_at"].isoformat(),
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/complaints")
async def get_complaints(
    skip: int = 0,
    limit: int = 10,
    service: ComplaintService = Depends(get_service),
    admin: dict = Depends(get_current_admin),
):
    complaints, total = await service.get_all_complaints(skip, limit)
    return {"data": [_serialize(c) for c in complaints], "total": total}


@router.get("/complaints/track")
async def track_complaint(
    complaint_id: str = None, email: str = None, mobile: str = None,
    service: ComplaintService = Depends(get_service),
):
    """Track complaint by complaint ID plus matching email or mobile."""
    results = []

    if not complaint_id or not (email or mobile):
        raise HTTPException(status_code=400, detail="Provide complaint ID plus registered email or mobile")

    c = await service.get_by_complaint_id(complaint_id)
    if c and _contact_matches(c, email, mobile):
        results = [c]

    if not results:
        raise HTTPException(status_code=404, detail="No complaints found")

    return _serialize_public(results[0])


@router.get("/complaints/{complaint_id}")
async def get_complaint(complaint_id: str, service: ComplaintService = Depends(get_service)):
    complaint = await service.get_complaint_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return _serialize_public(complaint)


@router.get("/departments")
async def get_departments():
    from services.department_config import get_all_departments
    return get_all_departments()


def _serialize(complaint: dict) -> dict:
    c = {**complaint, "_id": str(complaint["_id"])}
    for k in ["created_at", "updated_at"]:
        if k in c and hasattr(c[k], "isoformat"):
            c[k] = c[k].isoformat()
    return c


def _contact_matches(complaint: dict, email: str = None, mobile: str = None) -> bool:
    if email and complaint.get("citizen_email", "").lower().strip() == email.lower().strip():
        return True
    if mobile:
        submitted = re.sub(r"\D", "", complaint.get("citizen_phone", ""))
        provided = re.sub(r"\D", "", mobile)
        return submitted[-10:] and submitted[-10:] == provided[-10:]
    return False


def _mask_email(email: str) -> str:
    if not email or "@" not in email:
        return "N/A"
    name, domain = email.split("@", 1)
    return f"{name[:2]}***@{domain}"


def _mask_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) < 4:
        return "N/A"
    return f"******{digits[-4:]}"


def _serialize_public(complaint: dict) -> dict:
    c = _serialize(complaint)
    return {
        "_id": c["_id"],
        "complaint_id": c.get("complaint_id"),
        "citizen_name": c.get("citizen_name", "")[:1] + "***" if c.get("citizen_name") else "N/A",
        "citizen_email": _mask_email(c.get("citizen_email")),
        "citizen_phone": _mask_phone(c.get("citizen_phone")),
        "title": c.get("title"),
        "location": c.get("location"),
        "language": c.get("language"),
        "category": c.get("category"),
        "priority": c.get("priority"),
        "department": c.get("department"),
        "ai_summary": c.get("ai_summary"),
        "ai_confidence": c.get("ai_confidence"),
        "status": c.get("status"),
        "image_url": c.get("image_url"),
        "forwarding": {
            "forwarded": c.get("forwarding", {}).get("forwarded", False),
            "forwarded_to": c.get("forwarding", {}).get("forwarded_to"),
            "response_sla": c.get("forwarding", {}).get("response_sla"),
            "tracking_reference": c.get("forwarding", {}).get("tracking_reference"),
        },
        "timeline": c.get("timeline", []),
        "created_at": c.get("created_at"),
        "updated_at": c.get("updated_at"),
    }
