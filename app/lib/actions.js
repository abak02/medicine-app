
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
});

const CreateCustomer = FormSchema.omit({id:true});

export async function createCustomer(formData){
    //console.log(formData);
    const { customerName, customerEmail } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail')
      });
    
    const customerId = uuidv4();
    console.log(customerId);
    console.log(customerName);
    console.log(customerEmail);
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