import { fetchShopMedicines } from '@/app/lib/data';
import { DeleteShopMedicine, UpdateShopMedicine } from './buttons';
import { formatQuantity, formatCurrency } from '@/app/lib/utils';

// Helper function to determine stock status and color
function getStockStatus(quantity) {
  if (quantity === 0) {
    return { status: 'out-of-stock', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  } else if (quantity <= 10) {
    return { status: 'low-stock', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
  } else {
    return { status: 'in-stock', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  }
}

// Stock indicator component
// Stock indicator component
function StockIndicator({ quantity }) {
  const { status, color, bgColor } = getStockStatus(quantity);
  
  const getStockText = (qty) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 10) return 'Low Stock';
    return 'In Stock';
  };

  // Get dot color based on status
  const getDotColor = () => {
    if (quantity === 0) return 'bg-red-600';
    if (quantity <= 10) return 'bg-orange-600';
    return 'bg-green-600';
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
      <span className={`w-2 h-2 rounded-full mr-1 ${getDotColor()}`}></span>
      {getStockText(quantity)}
    </div>
  );
}

export default async function Table({ query, currentPage }) {
  const medicines = await fetchShopMedicines(query, currentPage);

  if (!medicines || medicines.length === 0) {
    return <div className="mt-6 text-center text-gray-500">No medicines found.</div>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {medicines.map((med) => {
              const { color, borderColor } = getStockStatus(med.quantity);
              return (
                <div 
                  key={med.medicine_id} 
                  className={`mb-2 w-full rounded-md bg-white p-4 border-l-4 ${borderColor}`}
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium text-lg">{med.brandname}</p>
                      {med.dosagedescription && (
                        <p className="text-xs text-gray-500">{med.dosagedescription}</p>
                      )}
                      <p className="text-sm text-gray-500 break-words">{med.genericname}</p>
                      <p className="text-md text-gray-500">{med.nameofthemanufacturer || '-'}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-3">
                    <div>
                      <p className="text-md font-semibold text-green-500">{formatCurrency(med.price)} TK</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-md font-semibold ${color}`}>
                          Qty: {formatQuantity(med.quantity)}
                        </p>
                        <StockIndicator quantity={med.quantity} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateShopMedicine id={med.medicine_id} />
                      <DeleteShopMedicine id={med.medicine_id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Brand Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Generic Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Manufacturer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity & Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {medicines.map((med) => {
                const { color } = getStockStatus(med.quantity);
                return (
                  <tr
                    key={med.medicine_id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none
                      [&:first-child>td:first-child]:rounded-tl-lg
                      [&:first-child>td:last-child]:rounded-tr-lg
                      [&:last-child>td:first-child]:rounded-bl-lg
                      [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      {med.brandname}
                      <span className="text-xs text-gray-500 ml-2">{med.dosagedescription || '-'}</span>
                    </td>
                    <td className="max-w-[200px] px-3 py-3 break-words">{med.genericname}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {med.nameofthemanufacturer || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${color}`}>
                          {formatQuantity(med.quantity)}
                        </span>
                        <StockIndicator quantity={med.quantity} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{formatCurrency(med.price)} TK</td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateShopMedicine id={med.medicine_id} />
                        <DeleteShopMedicine id={med.medicine_id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}