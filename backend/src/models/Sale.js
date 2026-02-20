const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
    trim: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  items: [
    {
      inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      batchNumber: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  gst: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  }
}, { 
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Sale', SaleSchema);