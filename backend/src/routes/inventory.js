const express = require('express');
const Inventory = require('../models/Inventory');

const router = express.Router();

// GET all inventory for stock overview
router.get('/', async (req, res) => {
  try {
    const { product } = req.query;
    // Basic query: Active items with stock
    let query = { isActive: true, quantity: { $gt: 0 } }; 
    
    // If a product ID is passed, add it to the filter
    if (product && product !== "undefined") {
      query.product = product;
    }

    const inventory = await Inventory.find(query)
      .sort({ batchNumber: 1 })
      .populate('product supplier'); // This makes b.product an object
      
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET expiring/expired for expiry alerts
router.get('/expiry', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysLater = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

    const expired = await Inventory.find({
      expiryDate: { $lt: today },
      isActive: true,
      quantity: { $gt: 0 }
    }).populate('product');

    const expiring = await Inventory.find({
      expiryDate: { $gte: today, $lte: ninetyDaysLater },
      isActive: true,
      quantity: { $gt: 0 }
    }).populate('product');

    res.json({ expired, expiring });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;