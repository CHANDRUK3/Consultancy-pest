import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ExpiryAlerts() {
  const [expired, setExpired] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {  // ← FIXED: added () before =>
    const fetchExpiry = async () => {
      setLoading(true);
      try {
        const res = await api.get('/inventory/expiry');
        setExpired(res.data.expired || []);
        setExpiring(res.data.expiring || []);
      } catch (err) {
        console.error('Expiry fetch error:', err);
        setError('Failed to load expiry alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchExpiry();
  }, []);  // ← empty dependency array = run once on mount

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Expiry Alerts</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
          <p className="ml-4 text-gray-600">Loading expiry data...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Expiring Soon */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-amber-700">
                Expiring Soon (Next 30–90 Days)
              </h2>
              <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium">
                {expiring.length} items
              </span>
            </div>

            {expiring.length === 0 ? (
              <p className="text-gray-500 py-6 text-center">No items expiring soon.</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-amber-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-left">Batch</th>
                      <th className="px-6 py-4 text-left">Qty</th>
                      <th className="px-6 py-4 text-left">Expiry Date</th>
                      <th className="px-6 py-4 text-left">Days Left</th>
                      <th className="px-6 py-4 text-left">Value at Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expiring.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{item.product?.productName || 'Unknown'}</td>
                        <td className="px-6 py-4">{item.batchNumber}</td>
                        <td className="px-6 py-4">{item.quantity} {item.product?.unit || ''}</td>
                        <td className="px-6 py-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-amber-700">
                          {Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}
                        </td>
                        <td className="px-6 py-4 font-medium text-red-600">
                          ₹ {(item.quantity * (item.purchasePrice || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Expired */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-red-700">Already Expired</h2>
              <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-medium">
                {expired.length} items
              </span>
            </div>

            {expired.length === 0 ? (
              <p className="text-gray-500 py-6 text-center">No expired items.</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-left">Batch</th>
                      <th className="px-6 py-4 text-left">Qty</th>
                      <th className="px-6 py-4 text-left">Expiry Date</th>
                      <th className="px-6 py-4 text-left">Value Lost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expired.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{item.product?.productName || 'Unknown'}</td>
                        <td className="px-6 py-4">{item.batchNumber}</td>
                        <td className="px-6 py-4">{item.quantity} {item.product?.unit || ''}</td>
                        <td className="px-6 py-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-red-600">
                          ₹ {(item.quantity * (item.purchasePrice || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}