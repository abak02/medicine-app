'use server'
import { sql } from '@vercel/postgres';
import {unstable_noStore as noStore} from 'next/cache'
import { formatCurrency } from './utils';

export async function fetchMedicine() {
    noStore();
    try {
      const data = await sql`
        SELECT
          id,
          brandname,
          genericname,
          nameofthemanufacturer,
          price
        FROM medicinelist
        ORDER BY brandname ASC
        
      `;
  
      const medicine = data.rows;
      return medicine;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch all medicine.');
    }
  }

  export async function fetchMedicinePages(query) {
    noStore();
    try {
      const count = await sql`SELECT COUNT(*)
      FROM medicinelist
      
      WHERE
        brandname ILIKE ${`%${query}%`} OR
        genericname ILIKE ${`%${query}%`} 
    `;
  
      const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of invoices.');
    }
  }

  const ITEMS_PER_PAGE = 40;
export async function fetchFilteredMedicine(
 
  query,
  currentPage,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql`
      SELECT
        id,
        brandname,
        genericname,
        nameofthemanufacturer,
        dosagedescription,
        price
      FROM medicinelist
      WHERE
        brandname ILIKE ${`%${query}%`} OR
        genericname ILIKE ${`%${query}%`} 
      ORDER BY  brandname
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch medicine list.');
  }
}
const CUSTOMER_PER_PAGE = 10
export async function fetchCustomerPages(query){
  noStore();
  ;
  try{
    const count = await sql `
      SELECT COUNT(*) FROM customers
      WHERE
      name ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`} 
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count)/ CUSTOMER_PER_PAGE);
    return totalPages;
  }catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCustomers() {

  try {
    const data = await sql`
      SELECT
        id,
        name
      FROM customers
      
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomer(query) {
  noStore();
  try {
    const data = await sql`
      SELECT
        id,
        name,
       email
      FROM customers
      WHERE
        name ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`}
      ORDER BY name ASC
    `;

    const customers = data.rows;
    //console.log(customers);
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query,currentPage) {
  noStore();
  const offset = (currentPage - 1) * CUSTOMER_PER_PAGE;

  try {
    const data = await sql`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${CUSTOMER_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending:customer.total_pending/100,
      total_paid: customer.total_paid/100,
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchFilteredMedicineForSuggestion(
 
  query
) {
  noStore();
 

  try {
    const invoices = await sql`
      SELECT
        id,
        brandname,
        dosagedescription,
        price
      FROM medicinelist
      WHERE
        brandname ILIKE ${`${query}%`}
        
      ORDER BY  brandname
      LIMIT 40
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch medicine list.');
  }
}

export async function fetchInvoicesPages(query) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

const INVOICES_PER_PAGE = 6;
export async function fetchFilteredInvoices(
 
  query,
  currentPage
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${INVOICES_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}