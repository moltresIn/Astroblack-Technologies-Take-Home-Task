from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Annotated
from bson import ObjectId
from pydantic.functional_validators import AfterValidator
from typing_extensions import Annotated


def validate_object_id(v: str) -> ObjectId:
    if not ObjectId.is_valid(v):
        raise ValueError("Invalid ObjectId")
    return ObjectId(v)


PyObjectId = Annotated[str, AfterValidator(validate_object_id)]


class Item(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    name: str
    quantity: int = Field(..., ge=0)
    restock_threshold: int = Field(..., gt=0)
    daily_consumption: float = Field(..., gt=0)

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "_id": "685c1042d7df7340474a3437",
                "name": "PC",
                "quantity": 5,
                "restock_threshold": 10,
                "daily_consumption": 2
            }
        }
    )
