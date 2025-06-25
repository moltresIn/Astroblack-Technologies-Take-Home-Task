from .consumption_router import router as consumption_router
from .items_router import router as items_router
from .restock_router import router as restock_router

__all__ = ["consumption_router", "items_router", "restock_router"]
