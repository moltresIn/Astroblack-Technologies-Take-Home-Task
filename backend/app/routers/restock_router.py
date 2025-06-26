from fastapi import APIRouter, Request
from app.models import Item
from app.services.restock_service import (
    get_restock_alerts_service,
    get_weekly_restock_calendar_service
)

router = APIRouter(prefix="/restock", tags=["Restock"])


@router.get("/alerts")
async def get_restock_alerts(request: Request):
    return await get_restock_alerts_service(request)


@router.get("/calendar")
async def weekly_restock_calendar(request: Request):
    return await get_weekly_restock_calendar_service(request)
