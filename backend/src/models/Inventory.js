const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
      index: true,
    },

    batchNumber: {
      type: String,
      required: [true, 'Batch number is required'],
      trim: true,
      index: true, // useful when searching by batch
    },

    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },

    purchasePrice: {
      type: Number,
      min: [0, 'Purchase price cannot be negative'],
    },

    sellingPrice: {
      type: Number,
      min: [0, 'Selling price cannot be negative'],
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    purchaseDate: {
      type: Date,
    },

    invoiceDate: {
      type: Date,
    },

    manufactureDate: {
      type: Date,
    },

  expiryDate: {
  type: Date,
  required: [true, 'Expiry date is required'],
  validate: {
    validator: function (value) {
      if (!this.manufactureDate) return true;
      return value > this.manufactureDate;
    },
    message: 'Expiry date ({VALUE}) must be after the manufacture date',
  },
},

    invoiceNumber: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['available', 'low_stock', 'expiring_soon', 'expired', 'out_of_stock'],
      default: 'available',
      index: true, // useful for filtering dashboards
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: false, // we handle updatedAt manually
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ────────────────────────────────────────────────
// Pre-save hook — synchronous + no next() needed
// ────────────────────────────────────────────────
inventorySchema.pre('save', function () {
  const today = new Date();

  // 1. Invoice date fallback
  if (!this.invoiceDate) {
    this.invoiceDate = this.purchaseDate || today;
  }

  // 2. Update timestamp
  this.updatedAt = today;

  // 3. Calculate status
  if (!this.expiryDate) {
    this.status = this.quantity <= 0 ? 'out_of_stock' : 'available';
    return;
  }

  const daysUntilExpiry = Math.floor(
    (this.expiryDate - today) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    this.status = 'expired';
  } else if (daysUntilExpiry <= 30) {
    this.status = 'expiring_soon';
  } else if (this.quantity <= 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity <= 5) {
    this.status = 'low_stock';
  } else {
    this.status = 'available';
  }
});

// ────────────────────────────────────────────────
// Virtuals (optional but very useful)
// ────────────────────────────────────────────────

inventorySchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  const today = new Date();
  return Math.floor((this.expiryDate - today) / (1000 * 60 * 60 * 24));
});

inventorySchema.virtual('isExpired').get(function () {
  return this.expiryDate && this.expiryDate < new Date();
});

inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity > 0 && this.quantity <= 5;
});

// Optional: cleaner output
inventorySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Inventory', inventorySchema);