'use client'
import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { lusitana } from '../fonts';
import { fetchFilteredMedicineForSuggestion } from '@/app/lib/data';
import AddButton from './addbutton';
import { CheckIcon, CircleStackIcon, ClockIcon, CurrencyBangladeshiIcon, HashtagIcon } from '@heroicons/react/24/outline';

export default function MedicineForm({ onAddMedicine }) {
    const [medicines, setMedicines] = useState([]);
    const [showSuggestions, setSuggestions] = useState(false);
    const [price, setPrice] = useState('');
    const [medicineName, setMedicineName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [id, setId] = useState('');

    const handleSearch = useDebouncedCallback(async (term) => {
        console.log(`Searching ${term}`);
        if (term) {
            const filteredMedicines = await fetchFilteredMedicineForSuggestion(term);
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
        const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
        const totalPrice = (quantity * numericPrice).toFixed(2);
        const newMedicine = { id, medicineName, quantity, price, totalPrice, type };
        const updatedMedicines = [...addedMedicines, newMedicine];
        setAddedMedicines(updatedMedicines);
        setMedicineName('');
        setQuantity('');
        setPrice('');
        onAddMedicine(updatedMedicines);
    };

    useEffect(() => {
        const total = addedMedicines.reduce((acc, medicine) => acc + parseFloat(medicine.totalPrice), 0);
        setTotalPrice(total.toFixed(2));
    }, [addedMedicines]);

    return (
        <>
            <p className={`${lusitana.className} text-lg mb-2`}>Medicine List</p>

            <div className=" gap-4 mb-4 md:flex">
                <div className="relative flex-1">
                    <label htmlFor="medicineName" className="mb-2 block text-sm font-medium">
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
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                            {medicines.map((medicine) => (
                                <li
                                    key={medicine.id}
                                    onClick={() => handleSuggestionClick(medicine)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {medicine.brandname} <span className="text-xs text-gray-500">{medicine.dosagedescription}</span>
                                </li>
                            ))}
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
            <div className="mt-4">
                <h2 className={`${lusitana.className} text-lg mb-2`}>Added Medicines</h2>
                <ul>
                    {addedMedicines.map((medicine, index) => (
                        <li key={index} className="mb-2">
                            <span>{medicine.medicineName} <span className='text-xs text-gray-500'>{medicine.type}</span></span>
                            <span className="mx-2">-</span>
                            <span>{medicine.quantity} pcs</span>
                            <span className="mx-2">-</span>
                            <span>{medicine.price}</span>
                            <span className="mx-2">-</span>
                            <span>{medicine.totalPrice} Tk</span>
                        </li>
                    ))}
                </ul>
                <hr className="my-4" />
                <div className="flex justify-end">
                    <span className="font-medium text-lg">Total Price: <span className='text-green-500'> {totalPrice} </span> Tk</span>
                </div>
                {/* Invoice Status */}
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
