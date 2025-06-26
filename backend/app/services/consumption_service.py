from datetime import datetime
from fastapi import Request, HTTPException
from app.models import ConsumptionLog
from typing import Dict, Any


def get_db(request: Request):
    return request.app.state.db


def convert_objectid_to_str(document: Dict[str, Any]) -> Dict[str, Any]:
    if document and '_id' in document:
        document['_id'] = str(document['_id'])
    return document


async def log_consumption_service(log: ConsumptionLog, request: Request):
    db = get_db(request)
    items_collection = db.items
    consumption_logs_collection = db.consumption_logs

    item = items_collection.find_one({"name": log.item_name})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    if item['quantity'] < log.quantity_used:
        raise HTTPException(status_code=400, detail="Not enough stock.")

    items_collection.update_one(
        {"_id": item['_id']},
        {"$inc": {"quantity": -log.quantity_used}}
    )

    log_data = log.dict()
    log_data['item_id'] = item['_id']
    log_data['item_name'] = item['name']
    result = consumption_logs_collection.insert_one(log_data)

    return {
        "message": "Consumption logged",
        "log_id": str(result.inserted_id),
        "item_id": str(item['_id']),
        "item_name": item['name'],
        "quantity_used": log.quantity_used,
        "timestamp": log.timestamp if hasattr(log, 'timestamp') else datetime.now().isoformat()
    }
