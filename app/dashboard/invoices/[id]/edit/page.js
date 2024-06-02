import Form from '@/app/ui/invoices/edit-form';

import { fetchInvoiceById,fetchCustomers, fetchCustomerById, fetchMedicineByInvoiceID } from '@/app/lib/data';
 import { notFound } from 'next/navigation';
export default async function Page({params}) {
    const id = params.id;
    const invoice = await fetchInvoiceById(id);
    const customer = await fetchCustomerById(invoice?.customer_id);
    const medicineList = await fetchMedicineByInvoiceID(id);
    if(!invoice){
        notFound();
    }
  return (
    <main>
      
      <Form invoice={invoice}  customer={customer} medicineList={medicineList} />
    </main>
  );
}