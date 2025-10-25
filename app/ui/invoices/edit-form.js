"use client";

//import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  PencilSquareIcon,
  PrinterIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
//import { Button } from '@/app/ui/button';
import { updateInvoice } from "@/app/lib/actions";
import {
  formatCurrency,
  formatDateTimeToLocal,
  formatPrintCurrency,
} from "@/app/lib/utils";
import { lusitana } from "../fonts";

export default function EditInvoiceForm({ invoice, customer, medicineList }) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  return (
    <>
      <form action={updateInvoiceWithId}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-4">
          {/* Customer Name */}
          <div className="mb-4">
            <h6>
              <span className="font-bold">Customer Name :</span> {customer.name}
            </h6>
            <h6>
              {" "}
              <span className="font-bold">Customer Phone No. :</span>{" "}
              {customer.phone_no}
            </h6>
            <h6>
              <span className="font-bold">Invoice Date : </span>{" "}
              {formatDateTimeToLocal(invoice.date)}{" "}
            </h6>
            <h6>
              <span className="font-bold">Last Update : </span>{" "}
              {formatDateTimeToLocal(invoice.time)}{" "}
            </h6>
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-4 md:p-6 mb-4">
          <h2 className={`${lusitana.className} text-lg mb-2 text-blue-500`}>
            Purchased Medicines
          </h2>
          {medicineList.map((medicine, index) => (
            <li
              key={index}
              className="mb-4 p-3 bg-white rounded-lg border border-gray-200 list-none"
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="mb-2">
                  <span className="font-medium text-gray-900 text-m">
                    {medicine.brandname}
                  </span>
                  {medicine.dosagedescription && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({medicine.dosagedescription})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Quantity:</span>
                    <span className="ml-1">{medicine.quantity} pcs</span>
                  </div>
                  <div>
                    <span className="font-medium">Price:</span>
                    <span className="ml-1">
                      {formatCurrency(medicine.price_per_unit)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Total:</span>
                    <span className="ml-1 text-blue-600 font-medium">
                      {formatCurrency(
                        medicine.quantity * medicine.price_per_unit
                      )}{" "}
                      Tk
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm flex-1">
                  <span className="font-medium text-gray-900 min-w-0 flex-1">
                    {medicine.brandname}
                  </span>
                  {medicine.dosagedescription && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      ({medicine.dosagedescription})
                    </span>
                  )}
                  <span className="text-gray-300">|</span>
                  <span className="flex-shrink-0">{medicine.quantity} pcs</span>
                  <span>×</span>
                  <span className="flex-shrink-0">
                    {formatCurrency(medicine.price_per_unit)}
                  </span>
                  <span>=</span>
                  <span className="font-medium text-blue-600 flex-shrink-0">
                    {formatCurrency(
                      medicine.quantity * medicine.price_per_unit
                    )}{" "}
                    Tk
                  </span>
                </div>
              </div>
            </li>
          ))}
          <hr className="my-4" />
          <div className="flex justify-end">
            <span className="font-medium text-md">
              Total Price:{" "}
              <span className="text-gray-700">
                {formatCurrency(
                  medicineList.reduce(
                    (sum, medicine) =>
                      sum + medicine.quantity * medicine.price_per_unit,
                    0
                  )
                )}{" "}
                Tk
              </span>
            </span>
          </div>
          <div className="flex justify-end">
            <span className="font-medium text-lg">
              Discounted Total Price:{" "}
              <span className="text-green-500">
                {" "}
                {formatCurrency(invoice.amount)}
              </span>{" "}
              Tk
            </span>
          </div>
          <div className="flex justify-end">
            <span className="font-medium text-lg">
              Changed Amount:{" "}
              <span className="text-red-500">
                {" "}
                {formatCurrency(invoice.given_amount - invoice.amount)}
              </span>{" "}
              Tk
            </span>
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
                    defaultChecked={invoice.status === "pending"}
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
                    defaultChecked={invoice.status === "paid"}
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
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-400"
          >
            {" "}
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Receipt
          </button>
          <button
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            type="submit"
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Edit Invoice
          </button>
        </div>
      </form>
      {/* Printable POS Receipt */}

      {/* Printable POS Receipt - Optimized for Small Paper */}
      <div
        id="printable"
        className="hidden print:block p-2 max-w-[58mm] mx-auto font-mono text-xs bg-white"
      >
        {/* Header - Compact */}
        <div className="text-center mb-2 border-b border-black pb-1">
          <h2 className="text-sm font-bold leading-tight">
            SHAMSER DRUG HOUSE
          </h2>
          <p className="text-[10px] text-gray-600">Collegemore, Kushtia</p>
          <p className="text-[10px]">{formatDateTimeToLocal(invoice.date)}</p>
        </div>

        {/* Invoice & Customer Info - Single Line */}
        <div className="mb-2 space-y-[1px] text-[10px]">
          <div className="flex justify-between">
            <span>Invoice:</span>
            <span className="font-bold">#{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Phone:</span>
            <span>{customer.phone_no}</span>
          </div>
        </div>

        {/* Items Table - Ultra Compact */}
        <div className="mb-2">
          {/* Table Header */}
          <div className="grid grid-cols-10 gap-0 text-[10px] font-bold border-b border-black pb-[1px] mb-1">
            <div className="col-span-5">ITEM</div>
            <div className="col-span-1 text-right">QTY</div>
            <div className="col-span-2 text-right">PRICE</div>
            <div className="col-span-2 text-right">TOTAL</div>
          </div>

          {/* Items */}
          <div className="space-y-1 text-[10px]">
            {medicineList.map((medicine, idx) => (
              <div
                key={idx}
                className="grid grid-cols-10 gap-0 border-b border-dashed border-gray-300 pb-1"
              >
                <div className="col-span-5 truncate leading-tight">
                  {medicine.brandname}
                </div>
                <div className="col-span-1 text-right">{medicine.quantity}</div>
                <div className="col-span-2 text-right">
                  {formatPrintCurrency(medicine.price_per_unit)}
                </div>
                <div className="col-span-2 text-right font-bold">
                  {formatPrintCurrency(
                    medicine.quantity * medicine.price_per_unit
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section - Compact */}
        <div className="border-t border-black pt-1 space-y-[1px] text-[10px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>
              {formatCurrency(
                medicineList.reduce(
                  (sum, m) => sum + m.quantity * m.price_per_unit,
                  0
                )
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Discount:</span>
            <span>
              -{" "}
              {formatCurrency(
                medicineList.reduce(
                  (sum, m) => sum + m.quantity * m.price_per_unit,
                  0
                ) - invoice.amount
              )}
            </span>
          </div>

          <div className="flex justify-between font-bold border-t border-black pt-[1px]">
            <span>Total:</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Paid:</span>
            <span>{formatCurrency(invoice.given_amount)}</span>
          </div>

          <div className="flex justify-between font-bold border-t border-black pt-[1px]">
            <span>Change:</span>
            <span>{formatCurrency(invoice.given_amount - invoice.amount)}</span>
          </div>
        </div>

        {/* Footer - Minimal */}
        <div className="text-center mt-2 pt-1 border-t border-black">
          <p className="text-[9px] font-bold">Thank You!</p>
          <p className="text-[8px] text-gray-600">Visit Again</p>
        </div>
      </div>
    </>
  );
}
