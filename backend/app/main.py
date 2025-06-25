from fastapi import FastAPI
from app.db.connection import get_database
from app import __version__, __title__

app = FastAPI(title=__title__, version=__version__)

# Initialize database connection
db = get_database()


@app.get("/")
async def read_root():
    if db is not None:
        return {"status": f"Connected to database: {db.name}"}
    else:
        return {"status": "Failed to connect to the database"}
