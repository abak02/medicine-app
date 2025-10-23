// app/dashboard/myshop/addmedicine/page.js
import React, { Suspense } from 'react';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateInventoryForm from '@/app/ui/myshop/add-medicine';
import { fetchFilteredMedicineForSuggestion } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

export default async function Page({ searchParams }) {
  const query = searchParams?.query || '';
  const filteredMedicines = await fetchFilteredMedicineForSuggestion(query);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shop Inventory', href: '/dashboard/myshop' },
          {
            label: 'Add Medicine',
            href: '/dashboard/myshop/addmedicine',
            active: true,
          },
        ]}
      />

      <div className="w-full mt-6">
        <Suspense fallback={<InvoicesTableSkeleton />}>
          <CreateInventoryForm filteredMedicines={filteredMedicines} />
        </Suspense>
      </div>
    </>
  );
}
