
'use server'
import {z} from 'zod';
import {sql} from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation'
const { v4: uuidv4 } = require('uuid');

const FormSchema = z.object({
    id : z.string(),
    customerName: z.string(),
    customerEmail : z.string(),
    status: z.string(),
});

const CreateCustomer = FormSchema.omit({id:true});

export async function createCustomer(formData){
    //console.log(formData);
    const { customerName, customerEmail } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail')
      });
    
    const customerId = uuidv4();
    
    try {await sql`
    INSERT INTO customers (id, name, email,image_url)
    VALUES (${customerId}, ${customerName}, ${customerEmail},'/janina')
  `;} catch(error){
    return {
        message : 'Database Error: Failed to Create Invoice.'
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
  const invoiceDate = new Date().toISOString();
  let customerId;

  try {
      // Check if the customer already exists
      const existingCustomer = await sql`
          SELECT id FROM customers WHERE email = ${customerEmail}
      `;
      //console.log(existingCustomer);
      if (existingCustomer) {
          // Use existing customer ID
          customerId = existingCustomer?.rows[0]?.id;
          //console.log(customerId);
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
          INSERT INTO invoices (id, customer_id, date, amount, status)
          VALUES (${invoiceId}, ${customerId}, ${invoiceDate}, ${total*100}, ${status})
      `;

      // Iterate through selected medicines and insert into invoice_medicines table
      for (const medicine of selectedMedicines) {
          const { id, quantity, price } = medicine;
          const pricePerUnit = parseFloat(price.replace(/[^\d.-]/g, ''));

          await sql`
              INSERT INTO invoice_medicines (invoice_id, medicine_id, quantity, price_per_unit)
              VALUES (${invoiceId}, ${id}, ${quantity}, ${pricePerUnit*100})
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

    try {
        await sql`
            UPDATE invoices
            SET status = ${status}
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

   
    console.log(id);
    try {await sql`DELETE FROM invoices WHERE id = ${id}`;}
    catch(error){
        return {
            message : 'Database Error: Failed to Create Invoice.'
        }
    }
    revalidatePath('/dashboard/invoices');
  }