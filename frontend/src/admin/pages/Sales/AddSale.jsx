import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddSale() {
  const [customer, setCustomer] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [landUnits, setLandUnits] = useState(0);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState({});
  const [items, setItems] = useState([{ product: "", inventory: "", qty: 1, price: 0, maxQty: 0 }]);
  
  // Custom message state for success/error (Alternative to alert/toaster)
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  // Load products for the first dropdown
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  // Fetch batches and ensure we store them by Product ID as a String key
  const fetchInventory = async (productId) => {
    if (!productId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/inventory?product=${productId}`);
      
      // Clean and filter batches to ensure we only have active stock
      const relevantBatches = res.data.filter(b => {
        const bProdId = b.product?._id || b.product?.id || b.product;
        return String(bProdId) === String(productId) && b.quantity > 0;
      });

      // Update state using the Product ID as the key
      setInventories(prev => ({ 
        ...prev, 
        [String(productId)]: relevantBatches 
      }));
    } catch (err) {
      console.error("Error loading inventory:", err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    if (field === "product") {
      updated[index] = { 
        ...updated[index], 
        product: value, 
        inventory: "", 
        maxQty: 0, 
        qty: 1 
      };
      fetchInventory(value);
    } 
    else if (field === "inventory") {
      const currentProdId = String(updated[index].product);
      const productBatches = inventories[currentProdId] || [];
      const selectedBatch = productBatches.find(b => String(b._id || b.id) === String(value));

      updated[index].inventory = value;
      
      if (selectedBatch) {
        const availableQty = Number(selectedBatch.quantity);
        updated[index].maxQty = availableQty;
        
        if (updated[index].qty > availableQty) {
          updated[index].qty = availableQty;
        }
      } else {
        updated[index].maxQty = 0;
      }
    } 
    else {
      updated[index][field] = value;
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { product: "", inventory: "", qty: 1, price: 0, maxQty: 0 }]);
  };

  const removeRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations with 2-decimal rounding
  const subtotal = Number(items.reduce((acc, item) => acc + (item.qty * item.price), 0).toFixed(2));
  const gst = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final Validation
    const stockError = items.find(item => item.qty > item.maxQty || item.maxQty === 0);
    if (stockError) {
      setStatusMsg({ text: "Invalid Stock: Please select a valid batch with available units.", type: "error" });
      return;
    }

    try {
      const saleData = { 
        customer, 
        customerLocation, 
        cropType, 
        landUnits: Number(landUnits), 
        saleDate, 
        items, 
        subtotal, 
        gst, 
        total 
      };
      const res = await axios.post("http://localhost:5000/api/sales", saleData);
      
      setStatusMsg({ text: res.data.message || "Sale saved successfully!", type: "success" });
      
      // Delay reload to allow user to see success message
      setTimeout(() => {
        window.location.reload(); 
      }, 2000);

    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || "Failed to save sale", type: "error" });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold text-teal-900 mb-6">New Sales Invoice</h1>

      {/* Built-in Status Notification Bar */}
      {statusMsg.text && (
        <div className={`mb-4 p-4 rounded-lg font-medium shadow-sm border ${
          statusMsg.type === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input
              className="w-full border-gray-300 border p-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Enter customer name"
              required
              value={customer}
              onChange={e => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Location</label>
            <input
              className="w-full border-gray-300 border p-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Enter location"
              value={customerLocation}
              onChange={e => setCustomerLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <input
              className="w-full border-gray-300 border p-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="e.g. Rice, Sugarcane"
              value={cropType}
              onChange={e => setCropType(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Units (Hectares)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border-gray-300 border p-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              value={landUnits}
              onChange={e => setLandUnits(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
            <input
              type="date"
              className="w-full border-gray-300 border p-3 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="bg-teal-50 text-teal-900">
                <th className="p-3 text-left border-b">Product</th>
                <th className="p-3 text-left border-b">Batch (Stock | Expiry)</th>
                <th className="p-3 text-left border-b w-32">Qty</th>
                <th className="p-3 text-left border-b w-40">Price (₹)</th>
                <th className="p-3 text-left border-b">Subtotal</th>
                <th className="p-3 text-center border-b"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`item-${index}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <select
                      className="w-full border p-2 rounded bg-white"
                      value={item.product}
                      onChange={e => handleItemChange(index, "product", e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p._id || p.id} value={p._id || p.id}>{p.productName}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      className="w-full border p-2 rounded bg-white"
                      value={item.inventory}
                      onChange={e => handleItemChange(index, "inventory", e.target.value)}
                      required
                      disabled={!item.product}
                    >
                      <option value="">Select Batch</option>
                      {(inventories[String(item.product)] || []).map((b, bIdx) => (
                        <option key={b._id || b.id || bIdx} value={b._id || b.id}>
                          {b.batchNumber} (Stock: {b.quantity}) | Exp: {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'N/A'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className={`w-full border p-2 rounded ${item.qty > item.maxQty ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      value={item.qty}
                      min="1"
                      onChange={e => handleItemChange(index, "qty", Number(e.target.value))}
                    />
                    <p className={`text-[10px] mt-1 font-bold ${item.qty > item.maxQty ? 'text-red-500' : 'text-gray-500'}`}>
                      Available: {item.maxQty}
                    </p>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-full border p-2 rounded border-gray-300"
                      value={item.price}
                      min="0"
                      onChange={e => handleItemChange(index, "price", Number(e.target.value))}
                    />
                  </td>
                  <td className="p-3 font-semibold">₹{(item.qty * item.price).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeRow(index)} className="text-red-500 font-bold">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={addRow} className="mt-4 text-teal-600 font-semibold hover:underline">
          + Add Line Item
        </button>

        <div className="mt-10 flex flex-col items-end border-t pt-6">
           <div className="w-64 space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-500"><span>GST (18%):</span><span>₹{gst.toLocaleString()}</span></div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 text-teal-900">
              <span>Grand Total:</span><span>₹{total.toLocaleString()}</span>
            </div>
           </div>
           <button type="submit" className="mt-6 w-full md:w-64 bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-colors shadow-lg">
             Complete Sale
           </button>
        </div>
      </form>
    </div>
  );
}