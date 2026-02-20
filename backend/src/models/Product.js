const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true
  },
  productName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
  'herbicide',
  'insecticide',
  'fungicide',
  'fertilizer',
  'growth-promoter',
  'micronutrient'
]
 // can expand later
  },
  manufacturer: {
    type: String,
    trim: true
  },
  unit: { 
    type: String, 
    required: true,
    enum: ['Liter', 'Kg', 'Gram', 'ml', 'Packet', 'Piece']
  },
  packSize: {
    type: Number,
    min: 0
  },
  hsnCode: { 
    type: String, 
    required: true,
    trim: true
  },
  reorderLevel: { 
    type: Number, 
    required: true,
    min: 0,
    default: 100
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);