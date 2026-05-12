from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─── Auth Schemas ───
class UserSignup(BaseModel):
    full_name: str
    email: str
    mobile: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    mobile: str
    role: str = "user"
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Complaint Schemas ───
class ComplaintCreate(BaseModel):
    text: str
    location: str
    language: str = "English"

class Complaint(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    complaint_id: str  # CV-2026-XXXXXX
    user_id: Optional[str] = None
    title: Optional[str] = None
    text: str
    location: str
    language: str
    category: str
    priority: str
    department: str
    ai_reasoning: str
    ai_summary: Optional[str] = None
    ai_confidence: Optional[int] = None
    status: str
    citizen_name: Optional[str] = None
    citizen_email: Optional[str] = None
    citizen_phone: Optional[str] = None
    admin_notes: Optional[List[dict]] = []
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    department: Optional[str] = None
    priority: Optional[str] = None
    admin_note: Optional[str] = None

class DashboardStats(BaseModel):
    total_complaints: int
    pending_complaints: int
    resolved_complaints: int
    high_priority_complaints: int
