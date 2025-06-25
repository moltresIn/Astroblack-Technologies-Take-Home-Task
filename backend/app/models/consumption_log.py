from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Annotated
from bson import ObjectId
from datetime import datetime
from pydantic.functional_validators import AfterValidator


def validate_object_id(v: str) -> ObjectId:
    if not ObjectId.is_valid(v):
        raise ValueError("Invalid ObjectId")
    return ObjectId(v)


PyObjectId = Annotated[str, AfterValidator(validate_object_id)]


class ConsumptionLog(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    item_name: str
    quantity_used: int = Field(..., gt=0)
    date: datetime
    notes: Optional[str] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "_id": "685c0232c4e420f5b8184cdf",
                "item_name": "Laptop",
                "quantity_used": 5,
                "date": "2025-06-25T00:00:00.000Z"
            }
        }
    )
