"""Authentication routes — admin login only"""
from fastapi import APIRouter, Depends, HTTPException
from database.mongo import get_database
from models.schemas import AdminLogin
from services.auth_service import AuthService, create_token

router = APIRouter()


def get_auth_service(db=Depends(get_database)) -> AuthService:
    return AuthService(db)


@router.post("/auth/admin/login")
async def admin_login(data: AdminLogin, service: AuthService = Depends(get_auth_service)):
    """Admin login"""
    try:
        admin = await service.login_admin(data.email, data.password)
        token = create_token(str(admin["_id"]), admin["email"], "admin")
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(admin["_id"]),
                "full_name": admin["full_name"],
                "email": admin["email"],
                "role": "admin",
                "created_at": admin["created_at"].isoformat(),
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
