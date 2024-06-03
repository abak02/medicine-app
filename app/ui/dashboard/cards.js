import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

const colorMap = {
  green: 'bg-green-50',
  red: 'bg-red-50',
  blue: 'bg-blue-50',
  orange: 'bg-orange-50',
};

export default async function CardWrapper() {
  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfCustomers,
    numberOfInvoices,
  } = await fetchCardData();
  return (
    <>

      <Card title="Collected" value={totalPaidInvoices} type="collected" color="green" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" color="red"/>
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" color="blue" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
        color = "orange"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
  color
}) {
  const Icon = iconMap[type];
  const Color = colorMap[color] || 'bg-gray-50';
  return (
    <div className={`rounded-xl ${Color} p-2 shadow-sm`}>
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
