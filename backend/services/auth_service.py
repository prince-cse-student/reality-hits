"""Authentication service — admin-only login, token generation"""
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRY_HOURS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(user_id: str, email: str, role: str = "admin") -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


class AuthService:
    def __init__(self, db):
        self.admins = db["admins"]

    async def login_admin(self, email: str, password: str) -> dict:
        """Authenticate admin"""
        admin = await self.admins.find_one({"email": email.lower().strip()})
        if not admin or not verify_password(password, admin["password_hash"]):
            raise ValueError("Invalid admin credentials")
        return admin

    async def seed_admins(self, admin_list: list):
        """Seed missing admin accounts from config without resetting existing users."""
        for admin in admin_list:
            existing = await self.admins.find_one({"email": admin["email"].lower()})
            if not existing:
                admin_doc = {
                    "full_name": admin["full_name"],
                    "email": admin["email"].lower(),
                    "password_hash": hash_password(admin["password"]),
                    "role": "admin",
                    "created_at": datetime.utcnow(),
                }
                await self.admins.insert_one(admin_doc)
                print(f"Admin created: {admin['email']}")
