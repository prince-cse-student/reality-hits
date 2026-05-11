from fastapi import APIRouter, Depends
from database.mongo import get_database
from services.complaint_service import ComplaintService

router = APIRouter()

def get_complaint_service(db=Depends(get_database)) -> ComplaintService:
    return ComplaintService(db)

@router.get("/dashboard/stats")
async def get_dashboard_stats(service: ComplaintService = Depends(get_complaint_service)):
    """Get dashboard statistics"""
    total = await service.get_total_complaints()
    pending = await service.get_pending_complaints()
    resolved = await service.get_resolved_complaints()
    high_priority = await service.get_high_priority_complaints()
    
    return {
        "total_complaints": total,
        "pending_complaints": pending,
        "resolved_complaints": resolved,
        "high_priority_complaints": high_priority,
    }

@router.get("/dashboard/categories")
async def get_category_stats(service: ComplaintService = Depends(get_complaint_service)):
    """Get complaints by category"""
    return await service.get_category_stats()

@router.get("/dashboard/priorities")
async def get_priority_stats(service: ComplaintService = Depends(get_complaint_service)):
    """Get complaints by priority"""
    return await service.get_priority_stats()
