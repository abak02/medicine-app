import React from 'react'
import { lusitana } from '@/app/ui/fonts'
import Form from '@/app/ui/customers/create-from'
export default function page() {
    return (
        <>
        <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Create Customers</h1>
        </div>
        <div>
            <Form></Form>
        </div>
        </>
    )
}
