"""Complaint routes — PUBLIC submit (no auth), track, list"""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from database.mongo import get_database
from services.complaint_service import ComplaintService
from services.ai_service import analyze_complaint_with_ai
from services.forwarding_service import create_forwarding_record, create_initial_timeline
from services.department_config import get_department
import os, re
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_service(db=Depends(get_database)) -> ComplaintService:
    return ComplaintService(db)


def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w\.\+\-]+@[\w\-]+\.[\w\-\.]+$', email))


def validate_phone(phone: str) -> bool:
    digits = re.sub(r'[\s\-\+]', '', phone)
    return len(digits) >= 10 and digits.isdigit()


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
            filename = f"{datetime.utcnow().timestamp()}_{image.filename}"
            filepath = os.path.join(UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(await image.read())
            image_url = f"/uploads/{filename}"

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
async def get_complaints(skip: int = 0, limit: int = 10, service: ComplaintService = Depends(get_service)):
    complaints, total = await service.get_all_complaints(skip, limit)
    return {"data": [_serialize(c) for c in complaints], "total": total}


@router.get("/complaints/track")
async def track_complaint(
    complaint_id: str = None, email: str = None, mobile: str = None,
    service: ComplaintService = Depends(get_service),
):
    """Track complaint by complaint_id, email, or mobile — any one field"""
    results = []

    if complaint_id:
        c = await service.get_by_complaint_id(complaint_id)
        if c:
            results = [c]
    elif email:
        results = await service.get_by_email(email)
    elif mobile:
        results = await service.get_by_phone(mobile)
    else:
        raise HTTPException(status_code=400, detail="Provide complaint_id, email, or mobile")

    if not results:
        raise HTTPException(status_code=404, detail="No complaints found")

    # Return single or list
    if len(results) == 1:
        return _serialize(results[0])
    return {"data": [_serialize(c) for c in results], "total": len(results)}


@router.get("/complaints/{complaint_id}")
async def get_complaint(complaint_id: str, service: ComplaintService = Depends(get_service)):
    complaint = await service.get_complaint_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return _serialize(complaint)


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
