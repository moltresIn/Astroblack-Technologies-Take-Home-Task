from fastapi import APIRouter, Request, HTTPException
from app.models import ConsumptionLog
from app.services.consumption_service import log_consumption_service

router = APIRouter(prefix="/consumption", tags=["Consumption"])


@router.post("/")
async def log_consumption(log: ConsumptionLog, request: Request):
    return await log_consumption_service(log, request)
