const express = require('express');
const Purchase = require('../models/Purchase');

const router = express.Router();

/* ======================================================
   CREATE PURCHASE
====================================================== */
router.post('/', async (req, res) => {
    try {
        // ── Log incoming data (very useful for debugging) ────────
        console.log('📥 FULL REQUEST BODY:', JSON.stringify(req.body, null, 2));
        console.log('🔍 invoiceDate received:', req.body.invoiceDate);

        const {
            supplier,
            invoiceNumber,
            invoiceDate,          // may be missing right now
            purchaseDate,
            items,
            paymentStatus,
            paymentMode,
            notes
        } = req.body;

        // Required fields
        if (!supplier)           return res.status(400).json({ message: 'Supplier is required' });
        if (!invoiceNumber)      return res.status(400).json({ message: 'Invoice number is required' });
        if (!items || !Array.isArray(items) || items.length === 0)
                                 return res.status(400).json({ message: 'At least one item is required' });

        // ── Handle invoiceDate with fallback ─────────────────────
        let parsedInvoiceDate;

        if (invoiceDate) {
            parsedInvoiceDate = new Date(invoiceDate);
            if (isNaN(parsedInvoiceDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid invoiceDate format. Use YYYY-MM-DD or ISO format.'
                });
            }
        } else if (purchaseDate) {
            // ← Temporary fallback while frontend is fixed
            parsedInvoiceDate = new Date(purchaseDate);
            console.warn('⚠️ invoiceDate was missing → using purchaseDate as fallback');
        } else {
            // Last resort fallback
            parsedInvoiceDate = new Date();
            console.warn('⚠️ Both invoiceDate & purchaseDate missing → using current date');
        }

        // Parse purchaseDate (optional)
        const parsedPurchaseDate = purchaseDate ? new Date(purchaseDate) : new Date();
        if (purchaseDate && isNaN(parsedPurchaseDate.getTime())) {
            return res.status(400).json({ message: 'Invalid purchaseDate format' });
        }

        // Clean items
        const cleanedItems = items.map(i => {
            const mDate = i.manufactureDate ? new Date(i.manufactureDate) : null;
            const eDate = new Date(i.expiryDate);

            if (i.expiryDate && isNaN(eDate.getTime())) {
                throw new Error(`Invalid expiryDate for product ${i.product || 'unknown'}`);
            }

            return {
                product: i.product,
                batchNumber: (i.batchNumber || '').trim(),
                quantity: Number(i.quantity),
                purchasePrice: Number(i.purchasePrice),
                manufactureDate: mDate && !isNaN(mDate.getTime()) ? mDate : null,
                expiryDate: eDate,
            };
        });

        const purchase = new Purchase({
            supplier,
            invoiceNumber,
            invoiceDate: parsedInvoiceDate,
            purchaseDate: parsedPurchaseDate,
            items: cleanedItems,
            paymentStatus: paymentStatus || 'pending',
            paymentMode,
            notes: notes || ''
            // Note: totals will be recalculated in pre-save hook → safe to ignore frontend totals
        });

        await purchase.save();

        res.status(201).json({
            message: 'Purchase created successfully',
            purchase
        });

    } catch (err) {
        console.error('Purchase creation error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            message: 'Server error while creating purchase',
            error: err.message
        });
    }
});

module.exports = router;