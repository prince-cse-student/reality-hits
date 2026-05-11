"""Department configuration — mapping, contacts, email registry"""

DEPARTMENT_MAP = {
    "Water": {
        "name": "Municipal Water Department",
        "email": "water@citizenvoice.local",
        "head": "Dr. Ramesh Sharma",
        "phone": "+91-11-2345-6701",
        "code": "DEPT-WTR",
        "response_sla": "48 hours",
    },
    "Water Supply": {
        "name": "Municipal Water Department",
        "email": "water@citizenvoice.local",
        "head": "Dr. Ramesh Sharma",
        "phone": "+91-11-2345-6701",
        "code": "DEPT-WTR",
        "response_sla": "48 hours",
    },
    "Electricity": {
        "name": "State Electricity Board",
        "email": "electricity@citizenvoice.local",
        "head": "Anil Kapoor",
        "phone": "+91-11-2345-6702",
        "code": "DEPT-ELC",
        "response_sla": "24 hours",
    },
    "Roads": {
        "name": "Municipal Engineering Division",
        "email": "roads@citizenvoice.local",
        "head": "Priya Verma",
        "phone": "+91-11-2345-6703",
        "code": "DEPT-RDS",
        "response_sla": "72 hours",
    },
    "Garbage": {
        "name": "Sanitation & Waste Management",
        "email": "sanitation@citizenvoice.local",
        "head": "Sunil Mehta",
        "phone": "+91-11-2345-6704",
        "code": "DEPT-SAN",
        "response_sla": "24 hours",
    },
    "Sanitation": {
        "name": "Sanitation & Waste Management",
        "email": "sanitation@citizenvoice.local",
        "head": "Sunil Mehta",
        "phone": "+91-11-2345-6704",
        "code": "DEPT-SAN",
        "response_sla": "24 hours",
    },
    "Transport": {
        "name": "Transport Authority",
        "email": "transport@citizenvoice.local",
        "head": "Kavita Singh",
        "phone": "+91-11-2345-6705",
        "code": "DEPT-TRN",
        "response_sla": "48 hours",
    },
    "Noise": {
        "name": "Pollution Control Board",
        "email": "pollution@citizenvoice.local",
        "head": "Rajesh Kumar",
        "phone": "+91-11-2345-6706",
        "code": "DEPT-PCB",
        "response_sla": "72 hours",
    },
    "Safety": {
        "name": "Public Safety Division",
        "email": "safety@citizenvoice.local",
        "head": "Inspector Deepak Nair",
        "phone": "+91-11-2345-6707",
        "code": "DEPT-SAF",
        "response_sla": "12 hours",
    },
    "Telecom": {
        "name": "Telecom Regulatory Authority",
        "email": "telecom@citizenvoice.local",
        "head": "Neha Gupta",
        "phone": "+91-11-2345-6708",
        "code": "DEPT-TLC",
        "response_sla": "48 hours",
    },
    "Consumer": {
        "name": "Consumer Disputes Forum",
        "email": "consumer@citizenvoice.local",
        "head": "Adv. Sunita Rao",
        "phone": "+91-11-2345-6709",
        "code": "DEPT-CON",
        "response_sla": "72 hours",
    },
    "Government": {
        "name": "General Administration Department",
        "email": "admin@citizenvoice.local",
        "head": "Commissioner Vikram Patel",
        "phone": "+91-11-2345-6700",
        "code": "DEPT-GAD",
        "response_sla": "48 hours",
    },
    "Banking": {
        "name": "Banking Ombudsman Office",
        "email": "banking@citizenvoice.local",
        "head": "CA Meera Joshi",
        "phone": "+91-11-2345-6710",
        "code": "DEPT-BNK",
        "response_sla": "72 hours",
    },
    "Housing": {
        "name": "Housing & Urban Development",
        "email": "housing@citizenvoice.local",
        "head": "Arjun Malhotra",
        "phone": "+91-11-2345-6711",
        "code": "DEPT-HUD",
        "response_sla": "72 hours",
    },
    "Travel": {
        "name": "Tourism & Travel Authority",
        "email": "travel@citizenvoice.local",
        "head": "Pooja Desai",
        "phone": "+91-11-2345-6712",
        "code": "DEPT-TRV",
        "response_sla": "48 hours",
    },
}

DEFAULT_DEPARTMENT = {
    "name": "General Grievance Department",
    "email": "grievance@citizenvoice.local",
    "head": "Commissioner Vikram Patel",
    "phone": "+91-11-2345-6700",
    "code": "DEPT-GEN",
    "response_sla": "72 hours",
}


def get_department(category: str) -> dict:
    """Look up department by AI-detected category"""
    return DEPARTMENT_MAP.get(category, DEFAULT_DEPARTMENT)


def get_all_departments() -> list:
    """Get unique departments list"""
    seen = set()
    result = []
    for cat, dept in DEPARTMENT_MAP.items():
        if dept["code"] not in seen:
            seen.add(dept["code"])
            result.append({**dept, "category": cat})
    return result
