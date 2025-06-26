/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Package, BarChart3, Plus, Activity } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { AddItemModal } from "./components/AddItemModal";
import { ConsumptionLogger } from "./components/ConsumptionLogger";
import { Analytics } from "./components/Analytics";
import { useInventory } from "./hooks/useInventory";

type Tab = "dashboard" | "consumption" | "analytics";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    items,
    restockAlerts,
    loading,
    error,
    refetch,
    addItem,
    logConsumption,
  } = useInventory();

  const tabs = [
    { id: "dashboard" as Tab, name: "Dashboard", icon: Package },
    { id: "consumption" as Tab, name: "Log Usage", icon: Activity },
    { id: "analytics" as Tab, name: "Analytics", icon: BarChart3 },
  ];

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleAddItemSubmit = async (newItem: any) => {
    await addItem(newItem);
    setIsAddModalOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Make sure your backend server is running on localhost:8000
            </p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Inventory Manager
                </h1>
                <p className="text-sm text-gray-600">
                  Restaurant Inventory Tracking System
                </p>
              </div>
            </div>

            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            items={items}
            loading={loading}
            onRefresh={refetch}
            onAddItem={handleAddItem}
          />
        )}

        {activeTab === "consumption" && (
          <ConsumptionLogger items={items} onLogConsumption={logConsumption} />
        )}

        {activeTab === "analytics" && (
          <Analytics items={items} restockAlerts={restockAlerts} />
        )}
      </main>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItemSubmit}
      />
    </div>
  );
}

export default App;
