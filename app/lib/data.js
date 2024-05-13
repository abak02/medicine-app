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