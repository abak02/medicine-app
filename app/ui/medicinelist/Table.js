// import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredMedicine } from '@/app/lib/data';

export default async function MedicineTable({
    query,
    currentPage,
}) {
    const medicines = await fetchFilteredMedicine(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-2">
                    

                    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {medicines?.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="rounded-md bg-white p-4 shadow-lg"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 items-center">
                                            
                                             <p className='text-xl font-medium'>{medicine.brandname}</p>
                                           
                                            <p className='text-xs text-gray-500'>{medicine.dosagedescription}</p>
                                        </div>
                                        
                                        <p className="text-sm text-gray-700">{medicine.genericname}</p>
                                    </div>
                                    {/* <InvoiceStatus status={invoice.status} /> */}
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        <p className="text-green-500">
                                            {medicine.nameofthemanufacturer}
                                        </p>
                                        <p className='font-medium'>{medicine.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Brand Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Generic Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Manufacturer
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Price
                                </th> */}
                    {/* <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th> */}
                    {/* </tr>
                        </thead>
                        <tbody className="bg-white">
                            {medicines?.map((medicine) => (
                                <tr
                                    key={medicine.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3"> */}
                    {/* <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                    {/* <p className='font-semibold'>{medicine.brandname}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {medicine.genericname}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 text-green-500">
                                        {medicine.nameofthemanufacturer}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 font-semibold">
                                        {medicine.price}
                                    </td> */}
                    {/* <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td> */}
                    {/* </tr>
                            ))}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>
    );
}
