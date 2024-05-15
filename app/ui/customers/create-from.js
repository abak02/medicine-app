import Link from "next/link"
import '@/app/globals.css'
import { createCustomer } from "@/app/lib/actions"
export default async function Form() {
    return (
        <form action={createCustomer}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    {/* Customer Name */}
                    <label htmlFor="customerName" className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            placeholder="Enter customer name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    {/* Customer Email */}
                    <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">
                        Customer Email
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            type="text"
                            id="customerEmail"
                            name="customerEmail"
                            placeholder="Enter customer Email"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/dashboard/invoices"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                       Cancel 
                    </Link>
                    <button className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'" type="submit">Create Customer</button>
                </div>
            </div>

        </form>
    )
}