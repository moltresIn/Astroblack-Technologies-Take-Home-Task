export interface Item {
  _id?: string;
  name: string;
  quantity: number;
  restock_threshold: number;
  daily_consumption: number;
  unit_of_measure?: string;
  last_updated?: string;
}

export interface ConsumptionLog {
  _id?: string;
  item_name: string;
  quantity_used: number;
  date: string;
  notes?: string;
}

export interface RestockAlert {
  item_name: string;
  current_quantity: number;
  restock_threshold: number;
  days_until_depletion: number;
  recommended_order_quantity: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ItemWithStatus extends Item {
  status: StockStatus;
  days_remaining: number;
}