import { CreateInvoice } from '@/app/ui/invoices/button'
import Search from '@/app/ui/search'
import React, { Suspense } from 'react'
import { lusitana } from '@/app/ui/fonts'

export default function page() {
    return (

        <>
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
            </div>
            {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Suspense>
                    <Search placeholder="Search invoices..." />
                </Suspense>
                <CreateInvoice />
            </div> */}

            <div className="mt-5 flex w-full justify-center">
                {/* <Pagination totalPages={totalPages} /> */}
            </div>

        </>
    )
}
