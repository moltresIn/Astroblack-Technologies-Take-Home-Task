/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Calendar, Package, FileText, Plus } from "lucide-react";
import type { ItemWithStatus, ConsumptionLog } from "../types/inventory";
import { format } from "date-fns";

interface ConsumptionLoggerProps {
  items: ItemWithStatus[];
  onLogConsumption: (consumption: Omit<ConsumptionLog, "_id">) => Promise<void>;
}

interface FormData {
  item_name: string;
  quantity_used: string;
  date: string;
  notes: string;
}

interface FormErrors {
  item_name?: string;
  quantity_used?: string;
  date?: string;
}

export const ConsumptionLogger: React.FC<ConsumptionLoggerProps> = ({
  items,
  onLogConsumption,
}) => {
  const [formData, setFormData] = useState<FormData>({
    item_name: "",
    quantity_used: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedItem = items.find((item) => item.name === formData.item_name);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.item_name) {
      newErrors.item_name = "Please select an item";
    }

    const quantityUsed = parseInt(formData.quantity_used);
    if (isNaN(quantityUsed) || quantityUsed <= 0) {
      newErrors.quantity_used = "Quantity must be a positive number";
    } else if (selectedItem && quantityUsed > selectedItem.quantity) {
      newErrors.quantity_used = `Cannot use more than current stock (${selectedItem.quantity})`;
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const consumption: Omit<ConsumptionLog, "_id"> = {
        item_name: formData.item_name,
        quantity_used: parseInt(formData.quantity_used),
        date: new Date(formData.date).toISOString(),
        notes: formData.notes.trim() || undefined,
      };

      await onLogConsumption(consumption);

      setSubmitMessage({
        type: "success",
        text: "Consumption logged successfully!",
      });

      // Reset form
      setFormData({
        item_name: "",
        quantity_used: "",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });

      // Clear success message after delay
      setTimeout(() => {
        setSubmitMessage(null);
      }, 3000);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to log consumption. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Log Consumption
            </h2>
            <p className="text-sm text-gray-600">
              Record item usage to track inventory levels
            </p>
          </div>
        </div>

        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="item_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Item *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  id="item_name"
                  value={formData.item_name}
                  onChange={(e) =>
                    handleInputChange("item_name", e.target.value)
                  }
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.item_name ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose an item...</option>
                  {items.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name} (Stock: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              {errors.item_name && (
                <p className="mt-1 text-sm text-red-600">{errors.item_name}</p>
              )}
              {selectedItem && (
                <p className="mt-1 text-sm text-gray-600">
                  Current stock: {selectedItem.quantity}{" "}
                  {selectedItem.unit_of_measure}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  max={format(new Date(), "yyyy-MM-dd")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="quantity_used"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity Used *
            </label>
            <input
              type="number"
              id="quantity_used"
              min="1"
              max={selectedItem?.quantity || undefined}
              value={formData.quantity_used}
              onChange={(e) =>
                handleInputChange("quantity_used", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.quantity_used ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter quantity used"
            />
            {errors.quantity_used && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity_used}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add any additional notes about this usage..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  item_name: "",
                  quantity_used: "",
                  date: format(new Date(), "yyyy-MM-dd"),
                  notes: "",
                });
                setErrors({});
                setSubmitMessage(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Logging..." : "Log Consumption"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
