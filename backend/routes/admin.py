"""Admin routes — complaint management, analytics, forwarding audit, timeline"""
from fastapi import APIRouter, Depends, HTTPException
from database.mongo import get_database
from services.complaint_service import ComplaintService
from middleware import get_current_admin
from datetime import datetime

router = APIRouter()

STATUSES = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"]


def get_service(db=Depends(get_database)) -> ComplaintService:
    return ComplaintService(db)


@router.get("/admin/complaints")
async def admin_get_complaints(
    skip: int = 0, limit: int = 20,
    status: str = None, priority: str = None, category: str = None,
    department: str = None, search: str = None,
    service: ComplaintService = Depends(get_service),
    admin: dict = Depends(get_current_admin),
):
    """Get all complaints with filters including department"""
    filters = {}
    if status: filters["status"] = status
    if priority: filters["priority"] = priority
    if category: filters["category"] = category
    if department: filters["department"] = department

    if search:
        complaints, total = await service.search_complaints_filtered(search, filters, skip, limit)
    else:
        complaints, total = await service.get_filtered_complaints(filters, skip, limit)

    return {"data": [_serialize(c) for c in complaints], "total": total, "skip": skip, "limit": limit}


@router.patch("/admin/complaints/{complaint_id}")
async def admin_update_complaint(
    complaint_id: str,
    status: str = None, department: str = None, priority: str = None,
    admin_note: str = None,
    service: ComplaintService = Depends(get_service),
    admin: dict = Depends(get_current_admin),
):
    """Update complaint — status, department, priority, add admin note + timeline"""
    update_data = {}
    timeline_events = []

    if status:
        update_data["status"] = status
        timeline_events.append({
            "event": f"status_{status.lower().replace(' ', '_')}",
            "label": f"Status: {status}",
            "description": f"Status changed to '{status}' by {admin['email']}",
            "timestamp": datetime.utcnow().isoformat(),
            "status": "completed" if status in ["Resolved", "Closed"] else "active",
            "icon": "check-circle" if status in ["Resolved", "Closed"] else "refresh-cw",
        })

    if department:
        update_data["department"] = department
        timeline_events.append({
            "event": "department_reassigned",
            "label": "Department Reassigned",
            "description": f"Reassigned to {department} by {admin['email']}",
            "timestamp": datetime.utcnow().isoformat(),
            "status": "completed",
            "icon": "building",
        })

    if priority:
        update_data["priority"] = priority

    complaint = await service.update_complaint(complaint_id, update_data)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if admin_note:
        await service.add_admin_note(complaint_id, admin["email"], admin_note)
        timeline_events.append({
            "event": "admin_note",
            "label": "Admin Note Added",
            "description": f"{admin['email']}: {admin_note[:80]}",
            "timestamp": datetime.utcnow().isoformat(),
            "status": "completed",
            "icon": "message-square",
        })

    if timeline_events:
        await service.append_timeline_events(complaint_id, timeline_events)

    complaint = await service.get_complaint_by_id(complaint_id)
    return _serialize(complaint)


@router.get("/admin/stats")
async def admin_stats(
    service: ComplaintService = Depends(get_service),
    admin: dict = Depends(get_current_admin),
):
    """Admin dashboard statistics including departments"""
    total = await service.get_total_complaints()
    pending = await service.get_pending_complaints()
    resolved = await service.get_resolved_complaints()
    high = await service.get_high_priority_complaints()
    cats = await service.get_category_stats()
    pris = await service.get_priority_stats()
    status_stats = await service.get_status_stats()
    dept_stats = await service.get_department_stats()
    recent = await service.get_recent_activity(limit=5)

    return {
        "total_complaints": total,
        "pending_complaints": pending,
        "resolved_complaints": resolved,
        "high_priority_complaints": high,
        "categories": cats,
        "priorities": pris,
        "statuses": status_stats,
        "departments": dept_stats,
        "recent_activity": [_serialize(c) for c in recent],
    }


@router.get("/admin/forwarding-logs")
async def get_forwarding_logs(
    skip: int = 0, limit: int = 20,
    admin: dict = Depends(get_current_admin),
):
    """Forwarding audit log"""
    db = get_database()
    logs = await db["forwarding_logs"].find().sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db["forwarding_logs"].count_documents({})
    for l in logs:
        l["_id"] = str(l["_id"])
        if "created_at" in l and hasattr(l["created_at"], "isoformat"):
            l["created_at"] = l["created_at"].isoformat()
    return {"data": logs, "total": total}


def _serialize(complaint: dict) -> dict:
    c = {**complaint, "_id": str(complaint["_id"])}
    for k in ["created_at", "updated_at"]:
        if k in c and hasattr(c[k], "isoformat"):
            c[k] = c[k].isoformat()
    return c
