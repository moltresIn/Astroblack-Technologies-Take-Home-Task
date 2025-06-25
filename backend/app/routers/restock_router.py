from fastapi import APIRouter, Request
from app.models import Item
from app.services import predict_stock_run_out, recommend_reorder_quantity
from datetime import datetime, timedelta
from typing import Dict, Any

router = APIRouter(prefix="/restock", tags=["Restock"])


def get_db(request: Request):
    return request.app.state.db


def convert_objectid_to_str(document: Dict[str, Any]) -> Dict[str, Any]:
    if document and '_id' in document:
        document['_id'] = str(document['_id'])
    return document


@router.get("/alerts")
async def get_restock_alerts(request: Request):
    db = get_db(request)
    items_collection = db.items

    alerts = []
    for item in items_collection.find():
        item = convert_objectid_to_str(item)
        # Create dictionary without _id for model creation
        item_data = {k: v for k, v in item.items() if k != '_id'}
        item_obj = Item(**item_data)
        if predict_stock_run_out(item_obj) <= 3:
            alerts.append({
                "item_id": item['_id'],
                "item_name": item['name'],
                "current_stock": item['quantity'],
                "predicted_days_to_run_out": predict_stock_run_out(item_obj),
                "recommended_reorder_quantity": recommend_reorder_quantity(item_obj)
            })
    return alerts


@router.get("/calendar")
async def weekly_restock_calendar(request: Request):
    db = get_db(request)
    items_collection = db.items

    calendar = []
    for item in items_collection.find():
        item = convert_objectid_to_str(item)
        # Create dictionary without _id for model creation
        item_data = {k: v for k, v in item.items() if k != '_id'}
        item_obj = Item(**item_data)
        days_to_run_out = predict_stock_run_out(item_obj)
        if days_to_run_out <= 7:
            calendar.append({
                "item_id": item['_id'],
                "item_name": item['name'],
                "restock_date": (datetime.now() + timedelta(days=days_to_run_out)).strftime("%Y-%m-%d"),
                "recommended_quantity": recommend_reorder_quantity(item_obj)
            })
    return calendar
