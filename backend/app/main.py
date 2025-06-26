# main.py
from fastapi import FastAPI
from app.routers import items_router, consumption_router, restock_router
from app import __version__, __title__
from app.db import get_database
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=__title__, version=__version__)

db = get_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make db available to routers
app.state.db = db

# Include routers
app.include_router(restock_router)
app.include_router(items_router)
app.include_router(consumption_router)
