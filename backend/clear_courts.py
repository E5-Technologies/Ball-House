import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def clear_courts():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'basketball_app')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    result = await db.courts.delete_many({})
    print(f"Deleted {result.deleted_count} courts from database")
    client.close()

asyncio.run(clear_courts())
