from typing import Dict, Any
from fastapi import Request
from app.models import Item


def get_db(request: Request):
    return request.app.state.db


def convert_objectid_to_str(document: Dict[str, Any]) -> Dict[str, Any]:
    if document and '_id' in document:
        document['_id'] = str(document['_id'])
    return document


async def add_item_service(item: Item, request: Request):
    db = get_db(request)
    items_collection = db.items

    existing_item = items_collection.find_one({"name": item.name})

    if existing_item:
        updated_item = items_collection.find_one_and_update(
            {"name": item.name},
            {"$inc": {"quantity": item.quantity}},
            return_document=True
        )
        return {
            "message": "Item quantity updated successfully",
            "item": convert_objectid_to_str(updated_item),
            "action": "quantity_updated"
        }
    else:
        result = items_collection.insert_one(item.dict())
        new_item = items_collection.find_one({"_id": result.inserted_id})
        return {
            "message": "Item added successfully",
            "item": convert_objectid_to_str(new_item),
            "action": "item_created"
        }


async def list_items_service(request: Request):
    db = get_db(request)
    items_collection = db.items

    items = []
    for item in items_collection.find():
        item = convert_objectid_to_str(item)
        if item['quantity'] <= 0:
            status = "out-of-stock"
        elif item['quantity'] <= item['restock_threshold']:
            status = "low-stock"
        else:
            status = "in-stock"

        items.append({
            "_id": item['_id'],
            "name": item['name'],
            "quantity": item['quantity'],
            "status": status,
            "restock_threshold": item['restock_threshold'],
            "daily_consumption": item['daily_consumption']
        })
    return items
