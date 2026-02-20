require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const pesticides = [
  { category: 'herbicide' },
  { category: 'fungicide' },
  { category: 'insecticide' },
  { category: 'fertilizer' },
  { category: 'growth-promoter' },
  { category: 'micronutrient' }
  // add all your pesticides here if you want, but we only need unique categories
];

const uniqueCategories = [...new Set(pesticides.map(p => p.category))];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const catName of uniqueCategories) {
      const existing = await Category.findOne({ name: catName.toLowerCase() });
      if (!existing) {
        await Category.create({
          name: catName.toLowerCase(),
          description: `${catName.charAt(0).toUpperCase() + catName.slice(1)} products`
        });
        console.log(`Created category: ${catName}`);
      } else {
        console.log(`Category already exists: ${catName}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedCategories();