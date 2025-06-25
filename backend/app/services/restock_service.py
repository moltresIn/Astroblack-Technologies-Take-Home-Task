from app.models import Item


def predict_stock_run_out(item: Item) -> int:
    """Calculate days until item runs out of stock.

    Args:
        item: Item object with quantity and consumption data

    Returns:
        int: Days until stock runs out (infinity if no consumption)
    """
    avg_consumption = item.daily_consumption
    if avg_consumption == 0:
        return float('inf')
    return max(0, int(item.quantity / avg_consumption))


def recommend_reorder_quantity(item: Item) -> int:
    """Calculate recommended reorder quantity.

    Args:
        item: Item object with stock data

    Returns:
        int: Recommended quantity to reorder
    """
    avg_consumption = item.daily_consumption
    return max(item.restock_threshold - item.quantity, int(avg_consumption * 7))
