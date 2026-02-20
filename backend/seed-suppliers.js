require('dotenv').config();
const mongoose = require('mongoose');
const Supplier = require('./src/models/Supplier');

const suppliers = [
  { name: 'AgroChem Distributors', phoneNumber: '9876543210', contactPerson: 'Raja' },
  { name: 'GreenFields India', phoneNumber: '8765432109', contactPerson: 'Selvam' },
  { name: 'Pesticide Hub TN', phoneNumber: '7654321098', contactPerson: 'Kumar' }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  for (const sup of suppliers) {
    const existing = await Supplier.findOne({ name: sup.name });
    if (!existing) {
      await Supplier.create(sup);
      console.log(`Added: ${sup.name}`);
    } else {
      console.log(`Exists: ${sup.name}`);
    }
  }

  console.log('Seeding done!');
  process.exit(0);
}

seed().catch(err => console.error(err));