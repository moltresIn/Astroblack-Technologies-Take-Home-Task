import { useState, useEffect, useCallback } from 'react';
import type { Item, ItemWithStatus, ConsumptionLog, RestockAlert } from '../types/inventory';
import { apiService } from '../services/api';
import { enrichItemWithStatus } from '../utils/inventory';

export const useInventory = () => {
  const [items, setItems] = useState<ItemWithStatus[]>([]);
  const [restockAlerts, setRestockAlerts] = useState<RestockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const rawItems = await apiService.getItems();
      const enrichedItems = rawItems.map(enrichItemWithStatus);
      setItems(enrichedItems);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRestockAlerts = useCallback(async () => {
    try {
      const alerts = await apiService.getRestockAlerts();
      setRestockAlerts(alerts);
    } catch (err) {
      console.error('Error fetching restock alerts:', err);
    }
  }, []);

  const addItem = useCallback(async (newItem: Omit<Item, '_id'>) => {
    try {
      const addedItem = await apiService.addItem(newItem);
      const enrichedItem = enrichItemWithStatus(addedItem);
      setItems(prev => [...prev, enrichedItem]);
      return enrichedItem;
    } catch (err) {
      console.error('Error adding item:', err);
      throw err;
    }
  }, []);

  const logConsumption = useCallback(async (consumption: Omit<ConsumptionLog, '_id'>) => {
    try {
      await apiService.logConsumption(consumption);
      // Refresh items to get updated quantities
      await fetchItems();
    } catch (err) {
      console.error('Error logging consumption:', err);
      throw err;
    }
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
    fetchRestockAlerts();
  }, [fetchItems, fetchRestockAlerts]);

  return {
    items,
    restockAlerts,
    loading,
    error,
    refetch: fetchItems,
    addItem,
    logConsumption,
  };
};