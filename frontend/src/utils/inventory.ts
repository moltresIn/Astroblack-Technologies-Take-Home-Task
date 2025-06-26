import type { Item, ItemWithStatus, StockStatus } from '../types/inventory';

export const calculateStockStatus = (item: Item): StockStatus => {
  if (item.quantity === 0) return 'out-of-stock';
  if (item.quantity <= item.restock_threshold) return 'low-stock';
  return 'in-stock';
};

export const calculateDaysRemaining = (item: Item): number => {
  if (item.daily_consumption === 0) return Infinity;
  return Math.floor(item.quantity / item.daily_consumption);
};

export const enrichItemWithStatus = (item: Item): ItemWithStatus => ({
  ...item,
  status: calculateStockStatus(item),
  days_remaining: calculateDaysRemaining(item),
});

export const getStatusColor = (status: StockStatus): string => {
  switch (status) {
    case 'in-stock':
      return 'text-green-600 bg-green-50';
    case 'low-stock':
      return 'text-amber-600 bg-amber-50';
    case 'out-of-stock':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusText = (status: StockStatus): string => {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const unitOptions = [
  'pieces',
  'kg',
  'g',
  'lbs',
  'oz',
  'liters',
  'ml',
  'gallons',
  'cups',
  'boxes',
  'bottles',
  'cans',
  'packages',
];