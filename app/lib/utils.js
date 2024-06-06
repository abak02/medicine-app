import dayjs from 'dayjs';

export const formatCurrency = (amount) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'BDT', // Change currency to BDT for Bangladeshi Taka
  });
};

export const formatDateToLocal = (
  dateStr,
  locale = 'en-US',
) => {
  const date = new Date(dateStr);
  const options = Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatTimeToLocal = (
  dateStr,
  locale = 'en-US',
) => {
  const date = new Date(dateStr);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Change to false for 24-hour format if needed
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};


export const generatePagination = (currentPage, totalPages) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 2) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
    
    if(currentPage===3){
        return [1, '...', 3,4,5, '...', totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }
  
    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };
  



import { parse } from 'date-fns';

export function processInvoices(invoices) {
  const monthlyRevenue = {};

  invoices.forEach(invoice => {
    const date = parse(invoice.date, "MMMM d, yyyy 'at' hh:mm:ss a", new Date());
    if (!isNaN(date)) {
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;

      if (invoice.status === 'paid') {
        if (!monthlyRevenue[monthYear]) {
          monthlyRevenue[monthYear] = 0;
        }
        monthlyRevenue[monthYear] += invoice.amount;
      }
    }
  });

  return Object.entries(monthlyRevenue)
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });
}

export function generateYAxis(revenue) {
  const maxRevenue = Math.max(...revenue.map(r => r.revenue));
  const steps = 5; // Number of steps on Y-axis
  const increment = Math.ceil(maxRevenue / steps);
  const yAxisLabels = Array.from({ length: steps + 1 }, (_, i) => (increment * i).toFixed(0)).reverse();

  return { yAxisLabels, topLabel: increment * steps };
}
