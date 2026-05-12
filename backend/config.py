import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "reality_hits")

# LM Studio
LM_STUDIO_API_URL = os.getenv("LM_STUDIO_API_URL", "http://localhost:1234/v1/chat/completions")

# Gemini fallback
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_URL = os.getenv(
    "GEMINI_API_URL",
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
)

# JWT (admin only)
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
JWT_SECRET = os.getenv("JWT_SECRET", "")
if not JWT_SECRET and DEBUG:
    JWT_SECRET = "local-development-secret-change-me"
elif not JWT_SECRET:
    raise RuntimeError("JWT_SECRET must be set when DEBUG is false")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24

# App
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", BASE_DIR / "uploads")).resolve()
MAX_UPLOAD_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(5 * 1024 * 1024)))
ALLOWED_UPLOAD_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}
ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]

# One-time admin bootstrap. Existing admins are not overwritten.
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
ADMIN_FULL_NAME = os.getenv("ADMIN_FULL_NAME", "Administrator").strip()
ADMIN_ACCOUNTS = []
if ADMIN_EMAIL and ADMIN_PASSWORD:
    if len(ADMIN_PASSWORD) < 12 and not DEBUG:
        raise RuntimeError("ADMIN_PASSWORD must be at least 12 characters when DEBUG is false")
    ADMIN_ACCOUNTS.append({
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "full_name": ADMIN_FULL_NAME or "Administrator",
    })
