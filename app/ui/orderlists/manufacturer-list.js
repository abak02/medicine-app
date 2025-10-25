// app/ui/orderlist/manufacturer-list.js
"use client";

import { useState, useEffect } from "react";
import {
  fetchManufacturersWithLowStock,
  fetchLowStockMedicinesByManufacturer,
} from "@/app/lib/data";
import OrderTable from "./order-table";
import { lusitana } from "../fonts";

export default function ManufacturerList() {
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load manufacturers on component mount
  useEffect(() => {
    async function loadManufacturers() {
      try {
        const data = await fetchManufacturersWithLowStock();
        setManufacturers(data);
        setFilteredManufacturers(data);
      } catch (error) {
        console.error("Failed to load manufacturers:", error);
      }
    }
    loadManufacturers();
  }, []);

  // Filter manufacturers based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredManufacturers(manufacturers);
    } else {
      const filtered = manufacturers.filter((manufacturer) =>
        manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredManufacturers(filtered);
    }
  }, [searchQuery, manufacturers]);

  const handleManufacturerClick = async (manufacturer) => {
    setLoading(true);
    setSelectedManufacturer(manufacturer);

    try {
      const data = await fetchLowStockMedicinesByManufacturer(manufacturer);
      setMedicines(data);
    } catch (error) {
      console.error("Failed to load medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedManufacturer(null);
    setMedicines([]);
    setSearchQuery(""); // Clear search when going back
  };

  if (selectedManufacturer) {
    return (
      <div className="mt-6">
        <button
          onClick={handleBackClick}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Manufacturers
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Low Stock Items - {selectedManufacturer}
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading medicines...</p>
            </div>
          ) : (
            <OrderTable
              medicines={medicines}
              manufacturer={selectedManufacturer}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className={ `${lusitana.className} text-xl font-bold text-gray-800`}>
                Manufacturers with Low Stock
              </h2> 
              <p className="text-sm text-gray-600 mt-1">
                {filteredManufacturers.length} of {manufacturers.length}{" "}
                manufacturers have low stock items
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                Showing {filteredManufacturers.length} manufacturer
                {filteredManufacturers.length !== 1 ? "s" : ""} matching `
                <span className="font-semibold">{searchQuery}</span>`
                {filteredManufacturers.length === 0 &&
                  manufacturers.length > 0 && (
                    <span className="block mt-1">
                      No manufacturers found. Try a different search term.
                    </span>
                  )}
              </p>
            </div>
          )}

          {manufacturers.length === 0 ? (
            <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 text-lg font-semibold">
                🎉 All items are well stocked!
              </div>
              <p className="text-green-500 mt-2">
                No manufacturers have low stock items.
              </p>
            </div>
          ) : filteredManufacturers.length === 0 ? (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-yellow-600 text-lg font-semibold">
                No manufacturers found
              </div>
              <p className="text-yellow-500 mt-2">
                No manufacturers match your search `{searchQuery}`. Try a
                different name.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            // app/ui/orderlist/manufacturer-list.js (only the card section)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredManufacturers.map((manufacturer) => (
                <div
                  key={manufacturer.name}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-white"
                  onClick={() => handleManufacturerClick(manufacturer.name)}
                >
                  {/* Manufacturer Name and Count */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
                      {manufacturer.name || "Unknown"}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      {manufacturer.low_stock_count} items
                    </span>
                  </div>

                  {/* Stock Breakdown - Compact */}
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      <span>Out of Stock: {manufacturer.out_of_stock_count}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                      <span>
                        Low Stock: {manufacturer.low_stock_count -
                          manufacturer.out_of_stock_count}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button className="w-full bg-blue-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                    View Items →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
