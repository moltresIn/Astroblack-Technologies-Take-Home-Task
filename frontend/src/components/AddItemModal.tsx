/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { X } from "lucide-react";
import type { Item } from "../types/inventory";
import { unitOptions } from "../utils/inventory";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<Item, "_id">) => Promise<void>;
}

interface FormData {
  name: string;
  quantity: string;
  restock_threshold: string;
  daily_consumption: string;
  unit_of_measure: string;
}

interface FormErrors {
  name?: string;
  quantity?: string;
  restock_threshold?: string;
  daily_consumption?: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    quantity: "",
    restock_threshold: "",
    daily_consumption: "",
    unit_of_measure: "pieces",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be a non-negative number";
    }

    const restockThreshold = parseInt(formData.restock_threshold);
    if (isNaN(restockThreshold) || restockThreshold <= 0) {
      newErrors.restock_threshold =
        "Restock threshold must be a positive number";
    }

    const dailyConsumption = parseFloat(formData.daily_consumption);
    if (isNaN(dailyConsumption) || dailyConsumption <= 0) {
      newErrors.daily_consumption =
        "Daily consumption must be a positive number";
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
      const newItem: Omit<Item, "_id"> = {
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity),
        restock_threshold: parseInt(formData.restock_threshold),
        daily_consumption: parseFloat(formData.daily_consumption),
        unit_of_measure: formData.unit_of_measure,
      };

      await onAdd(newItem);

      setSubmitMessage({ type: "success", text: "Item added successfully!" });

      // Reset form
      setFormData({
        name: "",
        quantity: "",
        restock_threshold: "",
        daily_consumption: "",
        unit_of_measure: "pieces",
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSubmitMessage(null);
      }, 1500);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to add item. Please try again.",
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div
              className={`p-4 rounded-lg ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="unit_of_measure"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit of Measure
            </label>
            <select
              id="unit_of_measure"
              value={formData.unit_of_measure}
              onChange={(e) =>
                handleInputChange("unit_of_measure", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.quantity ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="restock_threshold"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reorder Threshold *
            </label>
            <input
              type="number"
              id="restock_threshold"
              min="1"
              value={formData.restock_threshold}
              onChange={(e) =>
                handleInputChange("restock_threshold", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.restock_threshold ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="10"
            />
            {errors.restock_threshold && (
              <p className="mt-1 text-sm text-red-600">
                {errors.restock_threshold}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Alert when stock falls below this level
            </p>
          </div>

          <div>
            <label
              htmlFor="daily_consumption"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Daily Consumption Rate *
            </label>
            <input
              type="number"
              id="daily_consumption"
              step="0.1"
              min="0.1"
              value={formData.daily_consumption}
              onChange={(e) =>
                handleInputChange("daily_consumption", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.daily_consumption ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="2.5"
            />
            {errors.daily_consumption && (
              <p className="mt-1 text-sm text-red-600">
                {errors.daily_consumption}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Average daily usage for predictions
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
