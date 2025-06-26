/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, type JSX } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import type { Item } from "../types/inventory";
import { unitOptions } from "../utils/inventory";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<Item, "_id">) => Promise<void>;
  existingItems?: Item[];
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

interface Suggestion {
  name: string;
  unit_of_measure?: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingItems = [],
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

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on input
  const generateSuggestions = (input: string): Suggestion[] => {
    if (!input.trim()) return [];

    const inputLower = input.toLowerCase();
    const filtered = existingItems
      .filter((item) => item.name.toLowerCase().includes(inputLower))
      .map((item) => ({
        name: item.name,
        unit_of_measure: item.unit_of_measure,
      }))
      .slice(0, 5); // Limit to 5 suggestions

    return filtered;
  };

  // Highlight matching characters
  const highlightMatch = (text: string, query: string): JSX.Element => {
    if (!query) return <span>{text}</span>;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="bg-blue-100 text-blue-700 font-medium">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Must be a non-negative number";
    }

    const restockThreshold = parseInt(formData.restock_threshold);
    if (isNaN(restockThreshold) || restockThreshold <= 0) {
      newErrors.restock_threshold = "Must be a positive number";
    }

    const dailyConsumption = parseFloat(formData.daily_consumption);
    if (isNaN(dailyConsumption) || dailyConsumption <= 0) {
      newErrors.daily_consumption = "Must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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

    if (field === "name") {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0 && inputFocused);
      setActiveSuggestionIndex(-1);
    }

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setFormData((prev) => ({
      ...prev,
      name: suggestion.name,
      unit_of_measure: suggestion.unit_of_measure || prev.unit_of_measure,
    }));
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (activeSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-slate-800">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success/Error Message */}
          {submitMessage && (
            <div
              className={`p-4 rounded-lg border transition-all duration-300 ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {submitMessage.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {submitMessage.text}
              </div>
            </div>
          )}

          {/* Item Name with Autocomplete */}
          <div className="relative" ref={suggestionsRef}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Item Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={() => {
                setInputFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setInputFocused(false);
                // Delay hiding suggestions to allow for clicks
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.name
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="Enter item name"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                      index === activeSuggestionIndex
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    } ${index === 0 ? "rounded-t-lg" : ""} ${
                      index === suggestions.length - 1
                        ? "rounded-b-lg"
                        : "border-b border-gray-100"
                    }`}
                  >
                    <div className="font-medium">
                      {highlightMatch(suggestion.name, formData.name)}
                    </div>
                    {suggestion.unit_of_measure && (
                      <div className="text-sm text-gray-500 mt-1">
                        Unit: {suggestion.unit_of_measure}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Unit of Measure */}
          <div>
            <label
              htmlFor="unit_of_measure"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Unit of Measure
            </label>
            <select
              id="unit_of_measure"
              value={formData.unit_of_measure}
              onChange={(e) =>
                handleInputChange("unit_of_measure", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Current Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.quantity
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.quantity}
                </p>
              )}
            </div>

            {/* Reorder Threshold */}
            <div>
              <label
                htmlFor="restock_threshold"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Reorder Threshold
              </label>
              <input
                type="number"
                id="restock_threshold"
                min="1"
                value={formData.restock_threshold}
                onChange={(e) =>
                  handleInputChange("restock_threshold", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.restock_threshold
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="10"
              />
              {errors.restock_threshold && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.restock_threshold}
                </p>
              )}
            </div>
          </div>

          {/* Daily Consumption */}
          <div>
            <label
              htmlFor="daily_consumption"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Daily Consumption Rate
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.daily_consumption
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="2.5"
            />
            {errors.daily_consumption && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.daily_consumption}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Average daily usage for predictions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-slate-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
