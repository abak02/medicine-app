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
  
  export const processData = (data) => {
    const filteredData = data.filter(transaction => transaction.status === 'paid');
    const monthlyData = {};
  
    filteredData.forEach(transaction => {
      const date = dayjs(transaction.time, 'MMMM D, YYYY at h:mm:ss A');
      const month = date.format('YYYY-MM');
  
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
  
      monthlyData[month] += transaction.amount;
    });
  
    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);
  
    return { labels, values };
  };