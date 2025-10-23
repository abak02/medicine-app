import ShopInventoryForm from '@/app/ui/myshop/edit-form';
import { fetchShopMedicinesById, fetchMedicineById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/lib/utils';
import { editShopMedicine } from '@/app/lib/actions';

// This is a server component (async Page)
export default async function Page({ params }) {
  const id = params.id;

  // Fetch shop inventory medicine by medicine_id
  const shopMedicineList = await fetchShopMedicinesById(id);

  if (!shopMedicineList) {
    notFound();
  }

  // Fetch detailed medicine info
  const medicineDetails = await fetchMedicineById(id);

  // Define the handler that calls the server action
  async function handleEditMedicine({ id, quantity, price }) {
    'use server';
    await editShopMedicine({
      id,
      quantity: Number(quantity),
      price,
    });
  }

  return (
    <main className="p-6 space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shop Inventory', href: '/dashboard/myshop' },
          {
            label: 'Edit Inventory Medicine',
            href: `/dashboard/myshop/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ShopInventoryForm
        shopMedicineList={shopMedicineList}
        medicineDetails={medicineDetails}
        onEditMedicine={handleEditMedicine}
      />
    </main>
  );
}
