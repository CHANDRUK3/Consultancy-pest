import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AddPurchase() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    totalQuantity: 0,
    totalAmount: 0,
    gstAmount: 0,
    grandTotal: 0,
    paymentStatus: 'pending',
    paymentMode: 'cash',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supRes, prodRes] = await Promise.all([
          api.get('/suppliers'),
          api.get('/products')
        ]);
        setSuppliers(supRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Load error:', err.response?.data || err.message);
        setError('Failed to load suppliers or products');
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems(prev => [...prev, {
      product: '',
      batchNumber: '',
      quantity: 0,
      unit: 'kg', // Default unit
      purchasePrice: 0,
      manufactureDate: '',
      expiryDate: '',
      totalAmount: 0
    }]);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setItems(prev => {
      const newItems = prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [name]: value };

        if (name === 'quantity' || name === 'purchasePrice') {
          updated.totalAmount = Number(updated.quantity) * Number(updated.purchasePrice);
        }

        return updated;
      });

      const totalQty = newItems.reduce((sum, item) => sum + Number(item.quantity), 0);
      const totalAmt = newItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const gstAmt = totalAmt * 0.18;
      const grandTot = totalAmt + gstAmt;

      setFormData(prev => ({
        ...prev,
        totalQuantity: totalQty,
        totalAmount: totalAmt,
        gstAmount: gstAmt,
        grandTotal: grandTot
      }));

      return newItems;
    });
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.supplier || !formData.invoiceNumber || !formData.purchaseDate || items.length === 0) {
      setError('All required fields must be filled, and at least one item');
      return;
    }

    const invalidItem = items.find(item => !item.product || !item.batchNumber || !item.quantity || !item.expiryDate);
    if (invalidItem) {
      setError('All item fields (product, batch, qty, expiry) are required');
      return;
    }

    try {
      await api.post('/purchases', { ...formData, items });
      setSuccess('Purchase added successfully!');
      setItems([]);
      setFormData({
        supplier: '',
        invoiceNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        totalQuantity: 0,
        totalAmount: 0,
        gstAmount: 0,
        grandTotal: 0,
        paymentStatus: 'pending',
        paymentMode: 'cash',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add purchase');
    }
  };

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Add New Purchase</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Supplier Name *</label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map(sup => (
                  <option key={sup._id} value={sup._id}>{sup.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Invoice Number *</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="INV-2026-00123"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Purchase Items</h3>
              <button 
                type="button" 
                onClick={addItem} 
                className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >
                + Add Item
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Product *</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Batch No *</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 w-24">Quantity *</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 w-28">Unit</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Purchase Price *</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Mfg Date</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Expiry Date *</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Total</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3">
                        <select
                          name="product"
                          value={item.product}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none"
                          required
                        >
                          <option value="">Select product</option>
                          {products.map(prod => (
                            <option key={prod._id} value={prod._id}>{prod.productName}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="batchNumber"
                          value={item.batchNumber}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none uppercase"
                          placeholder="BATCH-00"
                          required
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none"
                          min="0"
                          required
                        />
                      </td>
                      <td className="p-3">
                        <select
                          name="unit"
                          value={item.unit}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none bg-white cursor-pointer"
                        >
                          <option value="kg">kg</option>
                          <option value="L">L</option>
                          <option value="ml">ml</option>
                          <option value="g">g</option>
                          <option value="Pcs">Pcs</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name="purchasePrice"
                          value={item.purchasePrice}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none"
                          min="0"
                          required
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          name="manufactureDate"
                          value={item.manufactureDate}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          name="expiryDate"
                          value={item.expiryDate}
                          onChange={(e) => handleItemChange(i, e)}
                          className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                          required
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-teal-800">₹{item.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          type="button" 
                          onClick={() => removeItem(i)} 
                          className="text-red-500 hover:text-red-700 font-medium p-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="text-gray-400 text-center py-10">No items added yet. Click "+ Add Item" to start.</div>
              )}
            </div>
          </div>

          {/* Footer Totals */}
          <div className="pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Quantity</p>
                <p className="text-3xl font-bold text-teal-700">{formData.totalQuantity}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-teal-700">₹ {formData.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">GST (18%)</p>
                <p className="text-3xl font-bold text-teal-700">₹ {formData.gstAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-600 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-10 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold shadow-lg shadow-teal-100 transition-all"
              >
                Save Purchase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}