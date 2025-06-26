/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Item, ConsumptionLog, RestockAlert } from '../types/inventory';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Items endpoints
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/items/');
  }

  async addItem(item: Omit<Item, '_id'>): Promise<Item> {
    return this.request<Item>('/items/', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  // Consumption endpoints
  async logConsumption(consumption: Omit<ConsumptionLog, '_id'>): Promise<ConsumptionLog> {
    return this.request<ConsumptionLog>('/consumption/', {
      method: 'POST',
      body: JSON.stringify(consumption),
    });
  }

  // Restock endpoints
  async getRestockAlerts(): Promise<RestockAlert[]> {
    return this.request<RestockAlert[]>('/restock/alerts');
  }

  async getRestockCalendar(): Promise<any> {
    return this.request<any>('/restock/calendar');
  }
}

export const apiService = new ApiService();