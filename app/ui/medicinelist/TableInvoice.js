// import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredMedicine } from '@/app/lib/data';

export default async function MedicineTableForInvoice({
    query,
    currentPage,
}) {
    const medicines = await fetchFilteredMedicine(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {medicines?.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <p>{medicine.brandname}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{medicine.dosagedescription}</p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {medicine.nameofthemanufacturer}
                                        </p>
                                        <p>{medicine.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Brand Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Dosage
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Generic Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Manufacturer
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                   Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {medicines?.map((medicine) => (
                                <tr
                                    key={medicine.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            
                                            <p>{medicine.brandname}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {medicine.dosagedescription}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {medicine.genericname}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {medicine.nameofthemanufacturer}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {medicine.price}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
