'use client';

//import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
//import { Button } from '@/app/ui/button';
import { updateInvoice } from '@/app/lib/actions';
import { formatCurrency, formatDateTimeToLocal} from '@/app/lib/utils';
import { lusitana } from '../fonts';


export default function EditInvoiceForm({
  invoice,
  customer,
  medicineList
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  return (
    <form action={updateInvoiceWithId} >
      <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-4">
        {/* Customer Name */}
        <div className="mb-4">
          <h6><span className='font-bold'>Customer Name :</span>  {customer.name}</h6>
          <h6> <span className='font-bold'>Customer Phone No. :</span>  {customer.phone_no}</h6>
          <h6><span className="font-bold">Invoice Date : </span> {formatDateTimeToLocal(invoice.date)} </h6>
          <h6><span className="font-bold">Last Update : </span> {formatDateTimeToLocal(invoice.time)} </h6>
        </div>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-4">
        <h2 className={`${lusitana.className} text-lg mb-2 text-blue-500`}>Purchased Medicines</h2>
        <ul>
          {medicineList.map((medicine, index) => (
            <li key={index} className="mb-2">
              <span>{medicine.brandname} <span className='text-xs text-gray-500'>{medicine.dosagedescription}</span></span>
              <span className="mx-2">-</span>
              <span>{medicine.quantity} pcs</span>
              <span className="mx-2">-</span>
              <span>{formatCurrency(medicine.price_per_unit)}</span>
              <span className="mx-2">-</span>
              <span>{formatCurrency(medicine.quantity * medicine.price_per_unit)} Tk</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <div className="flex justify-end">
          <span className="font-medium text-md">
            Total Price:{' '}
            <span className="text-gray-700">
              {formatCurrency(
                medicineList.reduce(
                  (sum, medicine) => sum + medicine.quantity * medicine.price_per_unit,
                  0
                )
              )}{' '}
              Tk
            </span>
          </span>
        </div>
        <div className="flex justify-end">
          <span className="font-medium text-lg">Discounted Total Price: <span className='text-green-500'> {formatCurrency(invoice.amount)}</span> Tk</span>
        </div>
        <div className="flex justify-end">
          <span className="font-medium text-lg">Changed Amount: <span className='text-red-500'> {formatCurrency(invoice.given_amount-invoice.amount)}</span> Tk</span>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
                  defaultChecked={invoice.status === 'pending'}
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
                  defaultChecked={invoice.status === 'paid'}
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
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          <XMarkIcon className="h-5 w-5 mr-2 text-red-500" />
          Cancel
        </Link>
        <button className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50" type="submit">
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Edit Invoice
        </button>
      </div>
    </form>
  );
}









