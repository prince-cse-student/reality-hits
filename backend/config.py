import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "reality_hits")

# LM Studio
LM_STUDIO_API_URL = os.getenv("LM_STUDIO_API_URL", "http://localhost:1234/v1/chat/completions")

# JWT (admin only)
JWT_SECRET = os.getenv("JWT_SECRET", "citizenvoice_secret_key_2026_change_in_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24

# App
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Hardcoded admin accounts
ADMIN_ACCOUNTS = [
    {"email": "princekush6625@gmail.com", "password": "12345678", "full_name": "Prince Kushwaha"},
    {"email": "dineshvish888@gmail.com", "password": "12345678", "full_name": "Dinesh Vishwakarma"},
]
