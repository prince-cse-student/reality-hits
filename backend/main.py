from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database.mongo import connect_to_mongo, close_mongo_connection, get_database
from routes import complaints, dashboard, auth, admin
from services.auth_service import AuthService
from config import ADMIN_ACCOUNTS


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    # Seed admin accounts
    db = get_database()
    auth_svc = AuthService(db)
    await auth_svc.seed_admins(ADMIN_ACCOUNTS)
    yield
    await close_mongo_connection()


app = FastAPI(
    title="CitizenVoice API",
    description="AI-powered citizen grievance resolution platform",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(complaints.router, prefix="/api", tags=["Complaints"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "CitizenVoice API", "version": "3.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
