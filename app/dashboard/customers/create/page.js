import React from 'react'
import { lusitana } from '@/app/ui/fonts'
import Form from '@/app/ui/customers/create-from'
import Breadcrumbs from '@/app/ui/customers/breadcrumbs'
export default function page() {
    return (
        <>
        <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
        <div>
            <Form></Form>
        </div>
        </>
    )
}
