const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  contactPerson: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },

  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


/* =====================================================
   AUTO SUPPLIER CODE GENERATION
   Example: SUP001, SUP002, SUP003...
   ===================================================== */

supplierSchema.pre('save', async function () {

  // only generate if not exists
  if (!this.supplierCode) {

    const lastSupplier = await this.constructor
      .findOne()
      .sort({ createdAt: -1 })
      .select('supplierCode');

    let nextNumber = 1;

    if (lastSupplier && lastSupplier.supplierCode) {
      const num = parseInt(lastSupplier.supplierCode.replace('SUP', ''));
      nextNumber = num + 1;
    }

    this.supplierCode = `SUP${String(nextNumber).padStart(3, '0')}`;
  }
});


module.exports = mongoose.model('Supplier', supplierSchema);
