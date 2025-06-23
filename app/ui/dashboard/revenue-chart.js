import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

import { fetchInvoices } from '@/app/lib/data';
import { processInvoices } from '@/app/lib/utils';
import RevenueLineChart from './revenue-line-chart';

export default async function RevenueChart() {
  const invoices = await fetchInvoices();
  const revenue = processInvoices(invoices);



  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  // Get the last 6 months of revenue data
  const lastSixMonthsRevenue = revenue.slice(-6);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <RevenueLineChart revenue={lastSixMonthsRevenue} />
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Last 6 months</h3>
        </div>
      </div>
    </div>
  );
}
