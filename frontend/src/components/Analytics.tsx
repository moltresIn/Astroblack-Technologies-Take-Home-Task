import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, AlertTriangle, Calendar, Download } from "lucide-react";
import type { ItemWithStatus, RestockAlert } from "../types/inventory";

interface AnalyticsProps {
  items: ItemWithStatus[];
  restockAlerts: RestockAlert[];
}

export const Analytics: React.FC<AnalyticsProps> = ({
  items,
  restockAlerts,
}) => {
  const analyticsData = useMemo(() => {
    // Stock status distribution
    const statusDistribution = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = [
      {
        name: "In Stock",
        value: statusDistribution["in-stock"] || 0,
        color: "#10B981",
      },
      {
        name: "Low Stock",
        value: statusDistribution["low-stock"] || 0,
        color: "#F59E0B",
      },
      {
        name: "Out of Stock",
        value: statusDistribution["out-of-stock"] || 0,
        color: "#EF4444",
      },
    ];

    // Top items by consumption rate
    const consumptionData = items
      .sort((a, b) => b.daily_consumption - a.daily_consumption)
      .slice(0, 10)
      .map((item) => ({
        name:
          item.name.length > 15
            ? item.name.substring(0, 15) + "..."
            : item.name,
        consumption: item.daily_consumption,
        daysRemaining:
          item.days_remaining === Infinity ? 999 : item.days_remaining,
      }));

    // Critical items (low stock or depleting soon)
    const criticalItems = items
      .filter(
        (item) =>
          item.status === "low-stock" ||
          item.status === "out-of-stock" ||
          item.days_remaining <= 7
      )
      .sort((a, b) => {
        if (a.status === "out-of-stock" && b.status !== "out-of-stock")
          return -1;
        if (b.status === "out-of-stock" && a.status !== "out-of-stock")
          return 1;
        return a.days_remaining - b.days_remaining;
      });

    // Predicted depletions for next 7 days
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        itemsDepleting: items.filter(
          (item) =>
            item.days_remaining === i + 1 && item.status !== "out-of-stock"
        ).length,
      };
    });

    return {
      statusChartData,
      consumptionData,
      criticalItems,
      next7Days,
    };
  }, [items]);

  const totalValue = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity * 1, 0); // Assuming unit cost of 1 for demo
  }, [items]);

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Item Name,Current Stock,Restock Threshold,Daily Consumption,Days Remaining,Status\n" +
      items
        .map(
          (item) =>
            `${item.name},${item.quantity},${item.restock_threshold},${
              item.daily_consumption
            },${
              item.days_remaining === Infinity
                ? "Infinite"
                : item.days_remaining
            },${item.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `inventory-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics & Predictions
          </h2>
          <p className="text-gray-600">
            Insights into your inventory performance and trends
          </p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalValue}</h3>
              <p className="text-sm text-gray-600">Total Inventory Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {analyticsData.criticalItems.length}
              </h3>
              <p className="text-sm text-gray-600">Critical Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {analyticsData.next7Days.reduce(
                  (sum, day) => sum + day.itemsDepleting,
                  0
                )}
              </h3>
              <p className="text-sm text-gray-600">Items Depleting (7 days)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {items
                  .reduce((sum, item) => sum + item.daily_consumption, 0)
                  .toFixed(1)}
              </h3>
              <p className="text-sm text-gray-600">Total Daily Consumption</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Stock Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {analyticsData.statusChartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Consumption Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Items by Daily Consumption
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumption" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Predicted Depletions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Predicted Depletions (Next 7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.next7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="itemsDepleting"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Items Alert */}
      {analyticsData.criticalItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Critical Items Requiring Attention
            </h3>
          </div>
          <div className="space-y-3">
            {analyticsData.criticalItems.slice(0, 10).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Current: {item.quantity} | Threshold:{" "}
                    {item.restock_threshold}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === "out-of-stock"
                        ? "bg-red-100 text-red-800"
                        : item.status === "low-stock"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.status === "out-of-stock"
                      ? "Out of Stock"
                      : item.status === "low-stock"
                      ? "Low Stock"
                      : `${item.days_remaining} days left`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restock Recommendations */}
      {restockAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Restock Recommendations
          </h3>
          <div className="space-y-3">
            {restockAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {alert.item_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {alert.days_until_depletion} days until depletion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
