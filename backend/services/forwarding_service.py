"""Forwarding service — complaint routing, email simulation, tracking reference generation"""
import random
import string
from datetime import datetime
from typing import Dict, Any, Tuple
from services.department_config import get_department


def generate_tracking_reference() -> str:
    num = random.randint(10000, 99999)
    return f"CV-FWD-{num}"


def generate_email_subject(complaint_id: str, category: str, priority: str) -> str:
    priority_tag = f"[{priority.upper()}]" if priority.upper() == "HIGH" else ""
    return f"{priority_tag} Citizen Complaint {complaint_id} — {category} Issue Reported".strip()


def generate_email_body(complaint: dict, department: dict) -> str:
    return f"""<html><body style="font-family:Arial,sans-serif;color:#333;">
<h2 style="color:#1a56db;">CitizenVoice — Complaint Forwarded</h2><hr/>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px;font-weight:bold;">Complaint ID:</td><td>{complaint.get('complaint_id','N/A')}</td></tr>
<tr><td style="padding:8px;font-weight:bold;">Category:</td><td>{complaint.get('category','N/A')}</td></tr>
<tr><td style="padding:8px;font-weight:bold;">Priority:</td><td>{complaint.get('priority','Medium')}</td></tr>
<tr><td style="padding:8px;font-weight:bold;">Location:</td><td>{complaint.get('location','N/A')}</td></tr>
<tr><td style="padding:8px;font-weight:bold;">Filed By:</td><td>{complaint.get('citizen_name') or complaint.get('citizen_email') or 'Anonymous'}</td></tr>
</table>
<h3>Complaint Details</h3>
<p style="background:#f3f4f6;padding:12px;border-radius:8px;border-left:4px solid #1a56db;">{complaint.get('text','')}</p>
<h3>AI Analysis</h3>
<ul>
<li><strong>Category:</strong> {complaint.get('category','N/A')}</li>
<li><strong>Department:</strong> {department.get('name','N/A')}</li>
<li><strong>Priority:</strong> {complaint.get('priority','Medium')}</li>
<li><strong>Confidence:</strong> {complaint.get('ai_confidence',0)}%</li>
</ul>
<hr/><p style="font-size:12px;color:#666;">Routed by CitizenVoice AI | Dept Head: {department.get('head','N/A')} | SLA: {department.get('response_sla','N/A')}</p>
</body></html>"""


def create_forwarding_record(complaint: dict) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Create forwarding proof + email log for a complaint"""
    category = complaint.get("category", "Other")
    department = get_department(category)
    tracking_ref = generate_tracking_reference()

    forwarding = {
        "forwarded": True,
        "forwarded_to": department["name"],
        "department_code": department["code"],
        "department_email": department["email"],
        "department_head": department["head"],
        "department_phone": department["phone"],
        "response_sla": department["response_sla"],
        "forward_method": "Internal AI Routing",
        "forwarded_at": datetime.utcnow().isoformat(),
        "tracking_reference": tracking_ref,
    }

    email_log = {
        "to": department["email"],
        "subject": generate_email_subject(
            complaint.get("complaint_id", ""),
            category,
            complaint.get("priority", "Medium"),
        ),
        "body_html": generate_email_body(complaint, department),
        "status": "simulated",
        "sent_at": datetime.utcnow().isoformat(),
        "message_id": f"msg-{''.join(random.choices(string.ascii_lowercase + string.digits, k=12))}@citizenvoice.local",
        "delivery_status": "Simulated — SMTP not configured",
    }

    return forwarding, email_log


def create_initial_timeline(complaint: dict, forwarding: dict) -> list:
    """Generate initial complaint lifecycle timeline events"""
    now = datetime.utcnow()
    return [
        {
            "event": "complaint_submitted", "label": "Complaint Submitted",
            "description": f"Complaint {complaint.get('complaint_id', '')} filed by citizen",
            "timestamp": now.isoformat(), "status": "completed", "icon": "file-text",
        },
        {
            "event": "ai_analysis", "label": "AI Analysis Completed",
            "description": f"Category: {complaint.get('category', 'N/A')} | Priority: {complaint.get('priority', 'N/A')} | Confidence: {complaint.get('ai_confidence', 0)}%",
            "timestamp": now.isoformat(), "status": "completed", "icon": "cpu",
        },
        {
            "event": "department_identified", "label": "Department Identified",
            "description": f"Routed to {forwarding.get('forwarded_to', 'N/A')} ({forwarding.get('department_code', '')})",
            "timestamp": now.isoformat(), "status": "completed", "icon": "building",
        },
        {
            "event": "forwarded", "label": "Complaint Forwarded",
            "description": f"Forwarded via {forwarding.get('forward_method', 'Internal')} — Ref: {forwarding.get('tracking_reference', '')}",
            "timestamp": now.isoformat(), "status": "completed", "icon": "send",
        },
        {
            "event": "under_review", "label": "Under Review",
            "description": f"Pending review by {forwarding.get('department_head', 'Department Head')}. SLA: {forwarding.get('response_sla', 'N/A')}",
            "timestamp": now.isoformat(), "status": "active", "icon": "clock",
        },
        {
            "event": "resolution", "label": "Pending Resolution",
            "description": "Awaiting department action and resolution",
            "timestamp": None, "status": "pending", "icon": "check-circle",
        },
    ]
