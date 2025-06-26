/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import type { ItemWithStatus } from "../types/inventory";
import { getStatusColor, getStatusText } from "../utils/inventory";

interface DashboardProps {
  items: ItemWithStatus[];
  loading: boolean;
  onRefresh: () => void;
  onAddItem: () => void;
}

type SortField = "name" | "quantity" | "days_remaining" | "status";
type SortOrder = "asc" | "desc";

export const Dashboard: React.FC<DashboardProps> = ({
  items,
  loading,
  onRefresh,
  onAddItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || item.status === statusFilter)
    );

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "name") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [items, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const lowStock = items.filter((item) => item.status === "low-stock").length;
    const outOfStock = items.filter(
      (item) => item.status === "out-of-stock"
    ).length;
    const criticalItems = items.filter(
      (item) => item.days_remaining <= 3
    ).length;

    return { total, lowStock, outOfStock, criticalItems };
  }, [items]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.lowStock}
              </h3>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.outOfStock}
              </h3>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.criticalItems}
              </h3>
              <p className="text-sm text-gray-600">Critical (≤3 days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                  >
                    Item Name
                    {sortField === "name" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("quantity")}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                  >
                    Current Stock
                    {sortField === "quantity" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">Reorder Threshold</th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                  >
                    Status
                    {sortField === "status" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">Daily Usage</th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("days_remaining")}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                  >
                    Days Remaining
                    {sortField === "days_remaining" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.unit_of_measure && (
                      <div className="text-sm text-gray-500">
                        Unit: {item.unit_of_measure}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {item.restock_threshold}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {item.daily_consumption}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`font-medium ${
                        item.days_remaining <= 3
                          ? "text-red-600"
                          : item.days_remaining <= 7
                          ? "text-amber-600"
                          : "text-gray-900"
                      }`}
                    >
                      {item.days_remaining === Infinity
                        ? "∞"
                        : item.days_remaining}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No items found matching your criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
