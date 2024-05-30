'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder, filteredMedicines }) {
    const [input, setInputValue] = useState('');
    const [showSuggestions, setSuggestions] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching ... ${term}`);
        setSuggestions(true);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);
    const handleSuggestionMedicineClick = (medicine) => {
        setInputValue(medicine.brandname);
        setSuggestions(false);
        const params = new URLSearchParams(searchParams);
        params.delete('query');
    }
    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                id="search"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                value={input}
                defaultValue={searchParams.get('query')?.toString()}
            />
            {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            
            {showSuggestions && filteredMedicines.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {filteredMedicines.map((medicine) => (
                        <li
                            key={medicine.id}
                            onClick={() => handleSuggestionMedicineClick(medicine)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {medicine.brandname} <span className='ml-2 text-sm text-gray-500'>{medicine.dosagedescription}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
