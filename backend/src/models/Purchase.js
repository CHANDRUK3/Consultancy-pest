const mongoose = require('mongoose');
const Inventory = require('./Inventory');

const itemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    batchNumber: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0
    },
    manufactureDate: Date,
    expiryDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    }
});

const purchaseSchema = new mongoose.Schema({
    purchaseNumber: {
        type: String,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    items: [itemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalAmount:    { type: Number, default: 0 },
    gstAmount:      { type: Number, default: 0 },
    grandTotal:     { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending'
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'card', 'upi', 'bank_transfer']
    },
    notes: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

purchaseSchema.pre('save', async function () {
    // Auto-generate purchase number
    if (!this.purchaseNumber) {
        const count = await this.constructor.countDocuments();
        this.purchaseNumber = `PUR${String(count + 1).padStart(4, '0')}`;
    }

    // Calculate totals (override whatever frontend sent)
    this.totalQuantity = 0;
    this.totalAmount = 0;

    for (const item of this.items) {
        item.totalAmount = item.quantity * item.purchasePrice;
        this.totalQuantity += item.quantity;
        this.totalAmount += item.totalAmount;
    }

    this.gstAmount = this.totalAmount * 0.18; // ← adjust rate if needed
    this.grandTotal = this.totalAmount + this.gstAmount;

    // Sync inventory
    for (const item of this.items) {
        let inventory = await Inventory.findOne({
            product: item.product,
            batchNumber: item.batchNumber
        });

        if (inventory) {
            inventory.quantity += item.quantity;
            inventory.purchasePrice = item.purchasePrice;
            inventory.expiryDate = item.expiryDate;
            inventory.manufactureDate = item.manufactureDate;
        } else {
            inventory = new Inventory({
                product: item.product,
                batchNumber: item.batchNumber,
                quantity: item.quantity,
                purchasePrice: item.purchasePrice,
                supplier: this.supplier,
                purchaseDate: this.purchaseDate,
                manufactureDate: item.manufactureDate,
                expiryDate: item.expiryDate,
                invoiceNumber: this.invoiceNumber
            });
        }

        await inventory.save();
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);