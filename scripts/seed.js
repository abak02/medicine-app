const { db } = require('@vercel/postgres');
const {
    medicineList
  } = require('../app/lib/medicine-data.js');
  const { v4: uuidv4 } = require('uuid');

//  console.log(medicineList);
  async function seedMedicineList(client) {
    try {
      await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      // Create the "users" table if it doesn't exist
      const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS medicinelist (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          brandname VARCHAR(255),
          genericname TEXT,
          nameofthemanufacturer VARCHAR(255),
          strength TEXT,
          dosagedescription VARCHAR(255),
          price VARCHAR(255),  
          dar VARCHAR(255) NOT NULL,
          usefor VARCHAR(255)
        );
      `;
  
      console.log(`Created "medicinelist" table`);
  
      // Insert data into the "users" table
      const insertedMedicine = await Promise.all(
        medicineList.map(async (medicine) => {
        const medicineId = uuidv4();
          return client.sql`
          INSERT INTO medicinelist (id, brandname, genericname, nameofthemanufacturer,strength,dosagedescription, price,dar,usefor)
          VALUES (${medicineId}, ${medicine.brandName}, ${medicine.genericName}, ${medicine.nameOfTheManufacturer},${medicine.strength},${medicine.dosageDescription}, ${medicine.price},${medicine.DAR},${medicine.useFor})
          ON CONFLICT (id) DO NOTHING;
        `;
        }),
      );
  
      console.log(`Seeded ${insertedMedicine.length} users`);
  
      return {
        createTable,
        medicinelist: insertedMedicine,
      };
    } catch (error) {
      console.error('Error seeding medicinelist:', error);
      throw error;
    }
  }
  

  async function main() {
    const client = await db.connect();
  
    await seedMedicineList(client);
  
  
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });
  