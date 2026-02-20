const express = require('express');
const Product = require('../models/Product');

const router = express.Router();  // ← THIS LINE WAS MISSING

// GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ productName: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    let {
      productCode,
      productName,
      category,
      manufacturer,
      unit,
      packSize,
      hsnCode,
      reorderLevel,
      description
    } = req.body;

    // Required fields validation
    if (!productCode?.trim() || !productName?.trim() || !category?.trim() || 
        !unit?.trim() || !hsnCode?.trim() || !reorderLevel) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Normalize category to lowercase (fixes count mismatch)
    category = category.trim().toLowerCase();

    // Check duplicate code
    const existing = await Product.findOne({ productCode: productCode.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Product code already exists' });
    }

    const product = new Product({
      productCode: productCode.trim(),
      productName: productName.trim(),
      category,
      manufacturer: manufacturer?.trim() || '',
      unit: unit.trim(),
      packSize: Number(packSize) || 0,
      hsnCode: hsnCode.trim(),
      reorderLevel: Number(reorderLevel),
      description: description?.trim() || ''
    });

    await product.save();

    res.status(201).json({ 
      message: 'Product created successfully',
      product 
    });
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ 
      message: 'Failed to create product', 
      error: err.message 
    });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Normalize category if changed
    if (updateData.category) {
      updateData.category = updateData.category.trim().toLowerCase();
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ 
      message: 'Product updated successfully',
      product: updated 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;