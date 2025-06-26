from fastapi import APIRouter, Request
from app.models import Item
from app.services.items_service import (
    get_db,
    add_item_service,
    list_items_service
)

router = APIRouter(prefix="/items", tags=["Items"])


@router.post("/")
async def add_item(item: Item, request: Request):
    return await add_item_service(item, request)


@router.get("/")
async def list_items(request: Request):
    return await list_items_service(request)
