# main.py
from fastapi import FastAPI
from app.routers import items_router, consumption_router, restock_router
from app import __version__, __title__
from app.db import get_database

app = FastAPI(title=__title__, version=__version__)

db = get_database()

# Make db available to routers
app.state.db = db

# Include routers
app.include_router(restock_router)
app.include_router(items_router)
app.include_router(consumption_router)
