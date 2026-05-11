from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, MONGO_DB_NAME

client = None
db = None

async def connect_to_mongo():
    global client, db

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[MONGO_DB_NAME]

    await db.command("ping")
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client

    if client:
        client.close()
        print("Closed MongoDB connection")

def get_database():
    return db