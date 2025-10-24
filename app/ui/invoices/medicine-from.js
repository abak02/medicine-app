"use client";
import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { lusitana } from "../fonts";
import { fetchFilteredMedicineWithStockForSuggestion } from "@/app/lib/data";
import AddButton from "./addbutton";
import {
  CheckIcon,
  CircleStackIcon,
  ClockIcon,
  CurrencyBangladeshiIcon,
  HashtagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function MedicineForm({ onAddMedicine }) {
  const [medicines, setMedicines] = useState([]);
  const [showSuggestions, setSuggestions] = useState(false);
  const [price, setPrice] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [addedMedicines, setAddedMedicines] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id, setId] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [givenAmount, setGivenAmount] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);

  const handleSearch = useDebouncedCallback(async (term) => {
    console.log(`Searching ${term}`);
    if (term) {
      const filteredMedicines =
        await fetchFilteredMedicineWithStockForSuggestion(term);
      setMedicines(filteredMedicines);
      setSuggestions(true);
    } else {
      setSuggestions(false);
    }
  }, 300);

  const handleSuggestionClick = (medicine) => {
    setPrice(medicine.price);
    setMedicineName(medicine.brandname);
    setType(medicine.dosagedescription);
    setId(medicine.id);
    setSuggestions(false);
  };

  const handleAddMedicine = () => {
    const priceString = price.toString();
    const numericPrice = parseFloat(priceString.replace(/[^\d.-]/g, ""));
    const totalPrice = (quantity * numericPrice).toFixed(2);
    const newMedicine = { id, medicineName, quantity, price, totalPrice, type };
    const updatedMedicines = [...addedMedicines, newMedicine];
    setAddedMedicines(updatedMedicines);
    setMedicineName("");
    setQuantity("");
    setPrice("");
    onAddMedicine(updatedMedicines);
  };

  const handleDeleteMedicine = (index) => {
    const updatedMedicines = addedMedicines.filter((_, i) => i !== index);
    setAddedMedicines(updatedMedicines);
    onAddMedicine(updatedMedicines);
  };

  const handleEditMedicine = (index) => {
    const medicineToEdit = addedMedicines[index];

    // Remove from list
    const updatedMedicines = addedMedicines.filter((_, i) => i !== index);
    setAddedMedicines(updatedMedicines);
    onAddMedicine(updatedMedicines);

    // Pre-fill input fields
    setMedicineName(medicineToEdit.medicineName);
    setQuantity(medicineToEdit.quantity);
    setPrice(medicineToEdit.price);
    setType(medicineToEdit.type);
    setId(medicineToEdit.id);
  };

  useEffect(() => {
    const total = addedMedicines.reduce(
      (acc, medicine) => acc + parseFloat(medicine.totalPrice),
      0
    );
    setTotalPrice(total.toFixed(2));

    const discountAmount = discount ? (total * parseFloat(discount)) / 100 : 0;
    const discounted = Math.round(total - discountAmount);
    setDiscountedPrice(discounted.toFixed(2));

    // Calculate change amount whenever givenAmount or discountedPrice changes
    const given = parseFloat(givenAmount) || 0;
    setChangeAmount((given - discounted).toFixed(2));
  }, [addedMedicines, discount, givenAmount]);

  // Helper function to get stock status style
  const getStockStatusStyle = (stockQuantity) => {
    if (stockQuantity > 0) {
      return { color: "green", text: `In Stock: ${stockQuantity}` };
    } else {
      return { color: "red", text: "Out of Stock" };
    }
  };

  return (
    <>
      <p className={`${lusitana.className} text-xl mb-2 text-blue-500`}>
        Medicine List
      </p>

      <div className="gap-4 mb-4 md:flex">
        <div className="relative flex-1">
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
              placeholder="Enter Medicine Name"
              onChange={(e) => {
                setMedicineName(e.target.value);
                handleSearch(e.target.value);
              }}
              autoComplete="off"
              value={medicineName}
            />
          </div>

          {showSuggestions && medicines.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
              {medicines.map((medicine) => {
                const stockStatus = getStockStatusStyle(
                  medicine.stock_quantity
                );
                return (
                  <li
                    key={medicine.id}
                    onClick={() => handleSuggestionClick(medicine)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{medicine.brandname}</div>
                      <div className="text-xs text-gray-500">
                        {medicine.dosagedescription}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          medicine.stock_quantity > 0
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {stockStatus.text}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {medicine.price} Tk
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="relative flex-1">
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
        <div className="relative flex-1">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <CurrencyBangladeshiIcon className="h-[18px] w-[18px] text-gray-500" />
            </span>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <AddButton onClick={handleAddMedicine}></AddButton>

      {/* Rest of your component remains the same */}
      <div className="mt-4">
        <h2 className={`${lusitana.className} text-xl mb-2 text-blue-500`}>
          Added Medicines
        </h2>
        <ul>
          {addedMedicines.map((medicine, index) => (
            <li key={index} className="mb-2 flex justify-start items-center">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900 text-lg flex-shrink-0">
                    {medicine.medicineName}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    ({medicine.type})
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex-shrink-0">{medicine.quantity} pcs</span>
                  <span>×</span>
                  <span className="flex-shrink-0">{medicine.price} Tk</span>
                  <span>=</span>
                  <span className="font-medium text-blue-600 flex-shrink-0">
                    {medicine.totalPrice} Tk
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-5 gap-2">
                <PencilIcon
                  className="h-5 w-5 text-blue-500 cursor-pointer"
                  onClick={() => handleEditMedicine(index)}
                />
                <TrashIcon
                  className="h-5 w-5 text-red-500 cursor-pointer"
                  onClick={() => handleDeleteMedicine(index)}
                />
              </div>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <div className="flex justify-end">
          <span className="font-medium text-md">
            Total Price: <span className="text-blue-500">{totalPrice}</span> Tk
          </span>
        </div>
        <div className="mt-4 flex justify-end items-center gap-4">
          <label htmlFor="discount" className="text-sm font-medium">
            Discount (%):
          </label>
          <div className="relative rounded-md">
            <input
              type="number"
              id="discount"
              name="discount"
              placeholder="e.g., 10"
              step="0.01"
              value={discount}
              onChange={(e) => {
                let val = e.target.value;
                if (val === "") {
                  setDiscount("");
                  return;
                }
                const num = parseFloat(val);
                if (!isNaN(num)) {
                  const clamped = Math.min(Math.max(num, 0), 10);
                  setDiscount(clamped.toString());
                }
              }}
              className="w-24 rounded-md border border-gray-200 py-1.5 px-2 text-sm"
              min="0"
              max="10"
            />
          </div>
        </div>
        <div className="flex flex-col items-end text-right space-y-1 mt-4">
          {discount && (
            <span className="font-medium text-base">
              Discounted Price:{" "}
              <span className="text-green-600">{discountedPrice}</span> Tk
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-end items-center gap-4">
          <label
            htmlFor="givenAmount"
            className="mb-2 block text-sm font-medium"
          >
            Given Amount (Tk):
          </label>
          <input
            type="number"
            id="givenAmount"
            name="givenAmount"
            min="0"
            step="1"
            placeholder="Enter given amount"
            value={givenAmount}
            onChange={(e) => setGivenAmount(e.target.value)}
            className="peer block w-32 rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
        <div className="mt-4 flex justify-end font-medium text-md">
          <span className="mb-4">
            Change Amount:{" "}
            <span className="text-red-600">
              {changeAmount >= 0 ? changeAmount : "0.00"}
            </span>{" "}
            Tk
          </span>
        </div>
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}
