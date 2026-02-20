const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');

const router = express.Router();

// GET all categories + real product count
router.get('/', async (req, res) => {
  try {
    const categories = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'name',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          count: {
            $size: {
              $filter: {
                input: '$products',
                as: 'p',
                cond: { $eq: ['$$p.isActive', true] }
              }
            }
          }
        }
      },
      {
        $project: {
          products: 0
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.json(categories);
  } catch (err) {
    console.error('Categories aggregation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST create category (unchanged)
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: 'Name required' });

    const normalized = name.trim().toLowerCase();
    if (await Category.findOne({ name: normalized })) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name: normalized,
      description: description?.trim() || ''
    });

    await category.save();

    res.status(201).json({
      message: 'Category created',
      category: { ...category.toObject(), count: 0 }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create', error: err.message });
  }
});


// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const normalized = name.trim().toLowerCase();

    // Check if new name causes duplicate (exclude current category)
    const duplicate = await Category.findOne({ 
      name: normalized, 
      _id: { $ne: id } 
    });
    if (duplicate) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { 
        name: normalized,
        description: description?.trim() || ''
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ 
      message: 'Category updated successfully',
      category: updated 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Optional: set products with this category to null or default
    // await Product.updateMany({ category: deleted.name }, { $set: { category: '' } });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
});
module.exports = router;