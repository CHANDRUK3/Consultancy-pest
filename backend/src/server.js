// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const supplierRoutes = require('./routes/suppliers');
const purchaseRoutes = require('./routes/purchases');
const inventoryRoutes = require('./routes/inventory');
const salesRoutes = require('./routes/sales');

const app = express();

// Middleware (should come first)
app.use(cors({
  origin: 'http://localhost:5173'  // your vite frontend port
}));
app.use(express.json());

// Connect to MongoDB (should be before routes)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('Check: Is MongoDB running? Correct URI in .env?');
    process.exit(1); // optional: stop server if DB fails
  });

// Routes (after DB connection attempt)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales',salesRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Pesticide Admin Backend is running! 🚀');
});

// Error handling middleware (optional but good)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});