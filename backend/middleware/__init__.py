"""Authentication middleware — JWT token verification"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import JWT_SECRET, JWT_ALGORITHM
from database.mongo import get_database

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT and return current user dict"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role", "user")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "role": role, "email": payload.get("email", "")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Ensure current user is admin"""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
