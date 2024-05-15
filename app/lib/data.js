import { sql } from '@vercel/postgres';
import {unstable_noStore as noStore} from 'next/cache'

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
        LIMIT 60
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
const CUSTOMER_PER_PAGE = 40
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
    const data = await sql<CustomerField>`
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