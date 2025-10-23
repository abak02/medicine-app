"use client";

import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { lusitana } from "../fonts";
import { fetchFilteredMedicineForSuggestion } from "@/app/lib/data";
import AddButton from "../invoices/addbutton";
import { addMedicineToShop } from "@/app/lib/actions";

import {
  CheckIcon,
  CircleStackIcon,
  CurrencyBangladeshiIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

// Make onAddMedicine optional with default value
export default function CreateInventoryForm({ onAddMedicine = () => {} }) {
  const [medicines, setMedicines] = useState([]);
  const [showSuggestions, setSuggestions] = useState(false);
  const [price, setPrice] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [addedMedicines, setAddedMedicines] = useState([]);
  const [id, setId] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  // 🔍 Search medicine with debounce
  const handleSearch = useDebouncedCallback(async (term) => {
    if (term) {
      const filteredMedicines = await fetchFilteredMedicineForSuggestion(term);
      setMedicines(filteredMedicines);
      setSuggestions(true);
    } else {
      setSuggestions(false);
    }
  }, 300);

  // 🩺 When user selects a medicine, auto-fill info
  const handleSuggestionClick = (medicine) => {
    setPrice(medicine.price);
    setMedicineName(medicine.brandname);
    setType(medicine.dosagedescription);
    setId(medicine.id);
    setQuantity("");
    setSuggestions(false);
  };

  const showTooltip = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 6000);
  };

  const handleAddMedicine = async () => {
    if (!medicineName || !quantity || !price || !id) {
      showTooltip("Please fill all fields");
      return;
    }

    try {
      await addMedicineToShop({
        id,
        quantity: parseInt(quantity),
        price,
      });

      const updatedMedicines = [
        ...addedMedicines,
        { id, medicineName, quantity, price, type },
      ];
      setAddedMedicines(updatedMedicines);

      // Reset inputs
      setMedicineName("");
      setQuantity("");
      setPrice("");
      setType("");
      setId("");
      
      // Safely call the callback function
      if (typeof onAddMedicine === 'function') {
        onAddMedicine(updatedMedicines);
      }

      showTooltip(`${medicineName} added to your shop inventory`);
      
    } catch (err) {
      console.error("Error adding medicine:", err);
      showTooltip("Failed to add medicine. Please try again.");
    }
  };

  return (
    <>
      <p className={`${lusitana.className} text-lg mb-2`}>
        Add Medicine to Inventory
      </p>

      {/* 💊 Medicine input fields vertically aligned */}
      <div className="flex flex-col gap-5 mb-4">
        {/* Medicine Name */}
        <div className="relative">
          <label
            htmlFor="medicineName"
            className="mb-2 block text-sm font-medium"
          >
            Medicine Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <CircleStackIcon className="h-[18px] w-[18px] text-gray-500" />
            </span>
            <input
              id="search"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter medicine name"
              onChange={(e) => {
                setMedicineName(e.target.value);
                handleSearch(e.target.value);
              }}
              autoComplete="off"
              value={medicineName}
            />
          </div>

          {showSuggestions && medicines.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
              {medicines.map((medicine) => (
                <li
                  key={medicine.id}
                  onClick={() => handleSuggestionClick(medicine)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {medicine.brandname}{" "}
                  <span className="text-xs text-gray-500">
                    {medicine.dosagedescription}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quantity */}
        <div className="relative">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Quantity
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <HashtagIcon className="h-[18px] w-[18px] text-gray-500" />
            </span>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div className="relative">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price (per unit)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <CurrencyBangladeshiIcon className="h-[18px] w-[18px] text-gray-500" />
            </span>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Auto-filled or enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <AddButton onClick={handleAddMedicine}>Add to Inventory</AddButton>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}