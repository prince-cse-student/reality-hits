"""Complaint service — CRUD, stats, tracking, admin notes, timeline, department analytics"""
from bson import ObjectId
from datetime import datetime
from typing import List, Optional, Tuple


class ComplaintService:
    def __init__(self, db):
        self.collection = db["complaints"]

    async def generate_complaint_id(self) -> str:
        """Generate unique complaint ID like CV-2026-000145"""
        year = datetime.utcnow().year
        count = await self.collection.count_documents({})
        return f"CV-{year}-{str(count + 1).zfill(6)}"

    async def create_complaint(self, complaint_data: dict) -> dict:
        """Create a new complaint"""
        complaint_data["created_at"] = datetime.utcnow()
        complaint_data["updated_at"] = datetime.utcnow()
        complaint_data["status"] = "Submitted"
        result = await self.collection.insert_one(complaint_data)
        complaint_data["_id"] = result.inserted_id
        return complaint_data

    async def get_complaint_by_id(self, complaint_id: str) -> Optional[dict]:
        """Get complaint by MongoDB ObjectId"""
        try:
            return await self.collection.find_one({"_id": ObjectId(complaint_id)})
        except:
            return None

    async def get_by_complaint_id(self, complaint_id: str) -> Optional[dict]:
        """Get complaint by readable ID (CV-2026-XXXXXX)"""
        return await self.collection.find_one({"complaint_id": complaint_id.upper().strip()})

    async def get_by_email(self, email: str) -> List[dict]:
        """Get all complaints by citizen email"""
        return await self.collection.find(
            {"citizen_email": email.lower().strip()}
        ).sort("created_at", -1).limit(20).to_list(20)

    async def get_by_phone(self, phone: str) -> List[dict]:
        """Get all complaints by citizen phone"""
        cleaned = phone.strip()
        return await self.collection.find(
            {"citizen_phone": {"$regex": cleaned[-10:], "$options": "i"}}
        ).sort("created_at", -1).limit(20).to_list(20)

    async def get_all_complaints(self, skip: int = 0, limit: int = 10) -> Tuple[List[dict], int]:
        complaints = await self.collection.find().sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await self.collection.count_documents({})
        return complaints, total

    async def get_user_complaints(self, user_id: str, skip: int = 0, limit: int = 20) -> Tuple[List[dict], int]:
        query = {"user_id": user_id}
        complaints = await self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await self.collection.count_documents(query)
        return complaints, total

    async def get_filtered_complaints(self, filters: dict, skip: int = 0, limit: int = 20) -> Tuple[List[dict], int]:
        complaints = await self.collection.find(filters).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await self.collection.count_documents(filters)
        return complaints, total

    async def search_complaints_filtered(self, query: str, filters: dict, skip: int = 0, limit: int = 20) -> Tuple[List[dict], int]:
        search_filter = {
            **filters,
            "$or": [
                {"text": {"$regex": query, "$options": "i"}},
                {"title": {"$regex": query, "$options": "i"}},
                {"complaint_id": {"$regex": query, "$options": "i"}},
                {"location": {"$regex": query, "$options": "i"}},
            ]
        }
        complaints = await self.collection.find(search_filter).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await self.collection.count_documents(search_filter)
        return complaints, total

    async def update_complaint(self, complaint_id: str, update_data: dict) -> Optional[dict]:
        try:
            update_data["updated_at"] = datetime.utcnow()
            return await self.collection.find_one_and_update(
                {"_id": ObjectId(complaint_id)},
                {"$set": update_data},
                return_document=True
            )
        except:
            return None

    async def add_admin_note(self, complaint_id: str, admin_email: str, note: str):
        try:
            await self.collection.update_one(
                {"_id": ObjectId(complaint_id)},
                {"$push": {"admin_notes": {
                    "admin": admin_email,
                    "note": note,
                    "timestamp": datetime.utcnow().isoformat(),
                }}}
            )
        except:
            pass

    async def append_timeline_events(self, complaint_id: str, events: list):
        """Append events to complaint timeline array"""
        try:
            await self.collection.update_one(
                {"_id": ObjectId(complaint_id)},
                {"$push": {"timeline": {"$each": events}}}
            )
        except:
            pass

    # ─── Statistics ───
    async def get_total_complaints(self) -> int:
        return await self.collection.count_documents({})

    async def get_pending_complaints(self) -> int:
        return await self.collection.count_documents({"status": {"$in": ["Submitted", "Under Review", "Assigned"]}})

    async def get_resolved_complaints(self) -> int:
        return await self.collection.count_documents({"status": {"$in": ["Resolved", "Closed"]}})

    async def get_high_priority_complaints(self) -> int:
        return await self.collection.count_documents({"priority": "High"})

    async def get_category_stats(self) -> List[dict]:
        pipeline = [{"$group": {"_id": "$category", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
        result = await self.collection.aggregate(pipeline).to_list(None)
        return [{"category": item["_id"], "value": item["count"]} for item in result]

    async def get_priority_stats(self) -> List[dict]:
        pipeline = [{"$group": {"_id": "$priority", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
        result = await self.collection.aggregate(pipeline).to_list(None)
        return [{"priority": item["_id"], "count": item["count"]} for item in result]

    async def get_status_stats(self) -> List[dict]:
        pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
        result = await self.collection.aggregate(pipeline).to_list(None)
        return [{"status": item["_id"], "count": item["count"]} for item in result]

    async def get_department_stats(self) -> List[dict]:
        """Get complaints grouped by department"""
        pipeline = [{"$group": {"_id": "$department", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
        result = await self.collection.aggregate(pipeline).to_list(None)
        return [{"department": item["_id"], "count": item["count"]} for item in result]

    async def get_recent_activity(self, limit: int = 5) -> List[dict]:
        return await self.collection.find().sort("updated_at", -1).limit(limit).to_list(limit)

    async def search_complaints(self, query: str) -> List[dict]:
        return await self.collection.find({
            "$or": [
                {"text": {"$regex": query, "$options": "i"}},
                {"complaint_id": {"$regex": query, "$options": "i"}},
            ]
        }).limit(10).to_list(10)
