from fastapi import FastAPI
from database import get_database

app = FastAPI()

# Initialize database connection
db = get_database()


@app.get("/")
async def read_root():
    if db is not None:
        return {"status": f"Connected to database: {db.name}"}
    else:
        return {"status": "Failed to connect to the database"}
