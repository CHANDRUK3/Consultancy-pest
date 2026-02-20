import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StockOverview() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);

      try {
        const res = await api.get('/inventory');

        // sort by nearest expiry first (better UX)
        const sorted = res.data.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );

        setStock(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '-';

  const getStatusStyle = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      low_stock: 'bg-orange-100 text-orange-800',
      expiring_soon: 'bg-amber-100 text-amber-800',
      expired: 'bg-red-100 text-red-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };

    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status = '') =>
    status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  /* ---------------- UI ---------------- */

  const exportCSV = () => {
  if (!stock.length) return;

  const headers = [
    'Product',
    'Batch',
    'Quantity',
    'Unit',
    'Expiry',
    'Status'
  ];

  const rows = stock.map((item) => [
    item.product?.productName || '-',
    item.batchNumber,
    item.quantity,
    item.product?.unit || '-',
    formatDate(item.expiryDate),
    getStatusLabel(item.status)
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'stock-overview.csv';
  link.click();
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-900">Stock Overview</h1>

        <button
  onClick={exportCSV}
  className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
>

          Export CSV
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">Loading stock...</div>
      ) : stock.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No stock items found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full min-w-max">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Batch</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Unit</th>
                <th className="px-6 py-4 text-left">Expiry</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {stock.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* safer optional chaining */}
                  <td className="px-6 py-4 font-medium">
                    {item.product?.productName || '-'}
                  </td>

                  <td className="px-6 py-4">{item.batchNumber}</td>

                  <td className="px-6 py-4">{item.quantity}</td>

                  <td className="px-6 py-4">
                    {item.product?.unit || '-'}
                  </td>

                  {/* ✅ FIXED DATE */}
                  <td className="px-6 py-4">
                    {formatDate(item.expiryDate)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
