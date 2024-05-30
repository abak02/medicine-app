import CreateInvoice from '@/app/ui/invoices/create-form'
import React from 'react'
import { fetchFilteredMedicineForSuggestion, fetchMedicinePages } from '@/app/lib/data'
import Pagination from '@/app/ui/medicinelist/pagination';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/medicinelist/TableInvoice';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';


export default async function page({searchParams}) {
  const query = searchParams?.query;
  console.log(query);
  const filteredMedicines = await fetchFilteredMedicineForSuggestion(query);
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Create Invoice</h1>
      </div>
      <div className=" w-full">
        
          <CreateInvoice filteredMedicines={filteredMedicines} />
        
      </div>


    </>
  )
}
