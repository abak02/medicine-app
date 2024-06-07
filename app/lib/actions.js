
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
    INSERT INTO customers (id, name, email,image_url)
    VALUES (${customerId}, ${customerName}, ${customerEmail},'/janina')
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
    const { customerName, customerEmail, status } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        status: formData.get('status'),
    });

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
    const formattedDateTime = date.toLocaleString(locale, options);
    let customerId;

    try {
        // Check if the customer already exists
        const existingCustomer = await sql`
          SELECT id FROM customers WHERE email = ${customerEmail}
      `;
     
        if (existingCustomer?.rows[0]?.id) {
            // Use existing customer ID
            customerId = existingCustomer?.rows[0]?.id;
            
        }
        else {
            // Insert new customer and get the new customer ID
            
            customerId = uuidv4();
            await sql`
              INSERT INTO customers (id, name, email, image_url)
              VALUES (${customerId}, ${customerName}, ${customerEmail}, '/janina')
          `;
        }

        // Calculate total amount of the invoice
        const total = selectedMedicines.reduce((acc, medicine) => acc + parseFloat(medicine.totalPrice), 0);

        // Insert invoice details
        await sql`
          INSERT INTO invoices (id, customer_id, date, amount, status, time)
          VALUES (${invoiceId}, ${customerId}, ${formattedDateTime}, ${total * 100}, ${status}, ${formattedDateTime})
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
    const formattedDateTime = date.toLocaleString(locale, options);


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