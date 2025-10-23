
'use server'
import { z } from 'zod';
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { formatTimeToLocal } from './utils';
const { v4: uuidv4 } = require('uuid');
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    status: z.string(),
    discountPercentage: z.string().optional(),
    givenAmount: z.string().optional(),
});

const CreateCustomer = FormSchema.omit({ id: true });

export async function createCustomer(formData) {
    //console.log(formData);
    const { customerName, customerEmail } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail')
    });

    const customerId = uuidv4();

    try {
        await sql`
    INSERT INTO customers (id, name, phone_no)
    VALUES (${customerId}, ${customerName}, ${customerEmail})
  `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        }
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function createInvoice(formData, selectedMedicines) {
    const { customerName, customerEmail, status, discountPercentage, givenAmount } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        status: formData.get('status'),
        discountPercentage: formData.get('discount'),
        givenAmount: formData.get('givenAmount')
    });
    console.log(discountPercentage, givenAmount);
    const discountPercentNum = parseFloat(discountPercentage) || 0;
    const givenAmountNum = parseFloat(givenAmount) || 0;


    const invoiceId = uuidv4();
    const locale = 'en-US';
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Use 12-hour format
    };
    const date = new Date();

    // Format both date and time together
    const formattedDateTime = date.toISOString();
    let customerId;

    try {
        // Check if the customer already exists
        const existingCustomer = await sql`
          SELECT id FROM customers WHERE phone_no = ${customerEmail}
      `;

        if (existingCustomer?.rows[0]?.id) {
            // Use existing customer ID
            customerId = existingCustomer?.rows[0]?.id;

        }
        else {
            // Insert new customer and get the new customer ID

            customerId = uuidv4();
            await sql`
              INSERT INTO customers (id, name, phone_no)
              VALUES (${customerId}, ${customerName}, ${customerEmail})
          `;
        }

        // Calculate total amount of the invoice
        const total = selectedMedicines.reduce((acc, medicine) => acc + parseFloat(medicine.totalPrice), 0);
        const discountedAmount = Math.round(total * (discountPercentNum / 100));

        // Calculate final amount after discount
        const finalAmount = Math.round(total - discountedAmount);
        // Insert invoice details
        await sql`
      INSERT INTO invoices (id, customer_id, date, amount, status, time, discounted_amount, given_amount)
      VALUES (${invoiceId}, ${customerId}, ${formattedDateTime}, ${finalAmount * 100}, ${status}, ${formattedDateTime}, ${discountedAmount * 100}, ${givenAmountNum * 100})
    `;

        // Iterate through selected medicines and insert into invoice_medicines table
        for (const medicine of selectedMedicines) {
            const { id, quantity, price } = medicine;
            const pricePerUnit = parseFloat(price.replace(/[^\d.-]/g, ''));

            await sql`
              INSERT INTO invoice_medicines (invoice_id, medicine_id, quantity, price_per_unit)
              VALUES (${invoiceId}, ${id}, ${quantity}, ${pricePerUnit * 100})
          `;
        }


    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }
    // Revalidate and redirect
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// export async function createInvoice(formData, selectedMedicines) {
//     console.log(formData);
//     const {
//         customerName,
//         customerEmail,
//         status,
//         discountPercentage,
//         givenAmount,
//     } = CreateCustomer.parse({
//         customerName: formData.get('customerName'),
//         customerEmail: formData.get('customerEmail'),
//         status: formData.get('status'),
//         discountPercentage: formData.get('discount'),
//         givenAmount: formData.get('givenAmount'),
//     });

//     // Convert discount and given amount to numbers (handle NaN as needed)
//     const discountPercentNum = parseFloat(discountPercentage) || 0;
//     const givenAmountNum = parseFloat(givenAmount) || 0;

//     const invoiceId = uuidv4();
//     const date = new Date();
//     const formattedDateTime = date.toISOString();
//     let customerId;

//     try {
//         // Your existing customer check and insert here...

//         // Calculate total amount of the invoice (sum of medicines)
//         const total = selectedMedicines.reduce(
//             (acc, medicine) => acc + parseFloat(medicine.totalPrice),
//             0
//         );

//         // Calculate discounted amount
//         const discountedAmount = total * (discountPercentNum / 100);

//         // Calculate final amount after discount
//         const finalAmount = total - discountedAmount;

//         // Insert invoice with discount and given amount columns (multiply by 100 if using cents)
//         await sql`
//       INSERT INTO invoices (id, customer_id, date, amount, status, time, discounted_amount, given_amount)
//       VALUES (${invoiceId}, ${customerId}, ${formattedDateTime}, ${Math.round(finalAmount * 100)}, ${status}, ${formattedDateTime}, ${Math.round(discountedAmount * 100)}, ${Math.round(givenAmountNum * 100)})
//     `;

//         // Insert medicines (your existing loop)
//         for (const medicine of selectedMedicines) {
//             const { id, quantity, price } = medicine;
//             const pricePerUnit = parseFloat(price.replace(/[^\d.-]/g, ''));

//             await sql`
//         INSERT INTO invoice_medicines (invoice_id, medicine_id, quantity, price_per_unit)
//         VALUES (${invoiceId}, ${id}, ${quantity}, ${pricePerUnit * 100})
//       `;
//         }
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice.',
//         };
//     }
//     revalidatePath('/dashboard/invoices');
//     redirect('/dashboard/invoices');
// }


const UpdateStatusSchema = z.object({
    status: z.string().nonempty("Status is required"),
});


export async function updateInvoice(id, formData) {

    const { status } = UpdateStatusSchema.parse({
        status: formData.get('status'),
    });
    const locale = 'en-US';
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Use 12-hour format
    };
    const date = new Date();

    // Format both date and time together
    const formattedDateTime = date.toISOString();


    try {
        await sql`
            UPDATE invoices
            SET status = ${status}, time=${formattedDateTime}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
export async function deleteInvoice(id) {


    //console.log(id);
    try { await sql`DELETE FROM invoices WHERE id = ${id}`; }
    catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        }
    }
    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
    prevState,
    formData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function deleteShopMedicine(id) {
    console.log('Deleting medicine with id:', id);
    try { await sql`DELETE FROM shopinventory WHERE medicine_id = ${id}::uuid`; }
    catch (error) {
        return {
            message: 'Database Error: Failed to delete medicine.'
        }
    }
    revalidatePath('/dashboard/myshop');
    
}


const AddMedicineSchema = z.object({
  id: z.string(),         // medicine ID (UUID)
  quantity: z.number(),   // quantity to add
  price: z.string(),      // price per unit
});

// Add medicine to shop inventory and update price
export async function addMedicineToShop({ id, quantity, price }) {
  const { id: medicineId, quantity: qty, price: priceStr } = AddMedicineSchema.parse({
    id,
    quantity,
    price
  });

  try {
    const numericPrice = parseFloat(priceStr.replace(/[^\d.-]/g, ''));

    // Check if medicine exists in shop inventory
    const existing = await sql`
      SELECT quantity
      FROM shopinventory
      WHERE medicine_id = ${medicineId}::uuid;
    `;

    if (existing.rows.length > 0) {
      // Medicine exists → update quantity
      const newQuantity = existing.rows[0].quantity + qty;
      await sql`
        UPDATE shopinventory
        SET quantity = ${newQuantity}
        WHERE medicine_id = ${medicineId}::uuid;
      `;
    } else {
      // Insert new medicine in shop inventory
      await sql`
        INSERT INTO shopinventory (medicine_id, quantity)
        VALUES (${medicineId}::uuid, ${qty});
      `;
    }

    // Update price in medicinelist
    await sql`
      UPDATE medicinelist
      SET price = ${numericPrice * 100}
      WHERE id = ${medicineId}::uuid;
    `;

  } catch (error) {
    console.error('Database Error (addMedicineToShop):', error);
    throw new Error('Failed to add medicine to shop inventory.');
  }

  // Revalidate the shop page
  revalidatePath('/dashboard/myshop');
}

const EditMedicineSchema = z.object({
  id: z.string(),          // medicine ID (UUID)
  quantity: z.number(),    // quantity to add
  price: z.string(),       // new price per unit
});

// Edit existing medicine info in shop inventory
export async function editShopMedicine({ id, quantity, price }) {
  try {
    const numericPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ''));
    const qty = Number(quantity);

    // Get current quantity
    const existing = await sql`
      SELECT quantity
      FROM shopinventory
      WHERE medicine_id = ${id}::uuid;
    `;

    if (existing.rows.length === 0) {
      throw new Error('Medicine not found in inventory.');
    }

    const currentQuantity = existing.rows[0].quantity;

    // --- 🧠 Smart Logic ---
    if (qty > 0) {
      // Case 2: Add to existing quantity
      const newQuantity = currentQuantity + qty;
      await sql`
        UPDATE shopinventory
        SET quantity = ${newQuantity}
        WHERE medicine_id = ${id}::uuid;
      `;
    }
    // If qty = 0 → skip quantity update

    // Always update price (case 1 or 2)
    await sql`
      UPDATE medicinelist
      SET price = ${numericPrice * 100}
      WHERE id = ${id}::uuid;
    `;

    revalidatePath('/dashboard/myshop');
    
  } catch (error) {
    console.error('Database Error (editShopMedicine):', error);
    throw new Error('Failed to update medicine information.');
  }
  redirect('/dashboard/myshop');
}
