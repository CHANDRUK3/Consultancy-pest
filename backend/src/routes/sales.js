const express = require('express');
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');

const router = express.Router();

router.post('/', async (req, res) => {
  // REMOVED: session.startTransaction() - No longer needed for standalone MongoDB

  try {
    const { customer, saleDate, items, subtotal, gst, total } = req.body;

    // Server-side validation
    if (!customer?.trim() || !items?.length) {
      return res.status(400).json({ success: false, message: "Missing required customer or items data" });
    }

    const processedItems = [];
    let serverSubtotal = 0;

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.inventory)) {
        return res.status(400).json({ success: false, message: `Invalid Inventory ID: ${item.inventory}` });
      }

      // 1. Find the batch (REMOVED: .session(session))
      const batch = await Inventory.findById(item.inventory).populate('product');
      
      if (!batch) {
        return res.status(404).json({ success: false, message: `Batch not found for ID: ${item.inventory}` });
      }

      // 2. Check Stock
      if (batch.quantity < item.qty) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${batch.product?.productName}. Available: ${batch.quantity}` 
        });
      }

      // 3. Deduct Stock
      batch.quantity -= item.qty;
      
      // Update status if zero
      if (batch.quantity <= 0) {
        batch.quantity = 0;
        batch.status = "out of stock";
      }

      // 4. Save Batch (REMOVED: { session } inside save)
      await batch.save();

      // 5. Calculate Item Amount
      const amount = Number((item.qty * item.price).toFixed(2));
      serverSubtotal += amount;

      processedItems.push({
        inventory: batch._id,
        productName: batch.product?.productName || 'Unknown',
        batchNumber: batch.batchNumber,
        qty: item.qty,
        price: item.price,
        amount: amount
      });
    }

    // 6. Total Validation (Rounding Fix)
    const serverGst = Number((serverSubtotal * 0.18).toFixed(2));
    const serverTotal = Number((serverSubtotal + serverGst).toFixed(2));

    // Allow 1 rupee difference for rounding variation
    if (Math.abs(serverTotal - total) > 1.0) {
      return res.status(400).json({ success: false, message: `Calculation mismatch. Please refresh.` });
    }

    // 7. Save Sale (REMOVED: { session } inside save)
    const newSale = new Sale({
      customer: customer.trim(),
      saleDate: saleDate ? new Date(saleDate) : new Date(),
      items: processedItems,
      subtotal: serverSubtotal,
      gst: serverGst,
      total: serverTotal
    });

    await newSale.save();

    // SUCCESS
    res.status(201).json({ 
      success: true, 
      message: "Sale completed and stock updated!", 
      sale: newSale 
    });

  } catch (err) {
    console.error("Backend Sale Error:", err.message);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
  // REMOVED: finally { session.endSession() }
});

// GET all sales for history page
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 }); // Newest first
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;