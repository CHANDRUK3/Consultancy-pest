import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales");
      setSales(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setLoading(false);
    }
  };

  const exportCSV = () => {
    try {
      const headers = "Bill ID,Date,Customer,Total\n";
      const rows = sales.map(s => 
        `${s._id},${new Date(s.saleDate).toLocaleDateString()},${s.customer},${s.total}`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales_report_${new Date().getTime()}.csv`;
      a.click();
    } catch (err) {
      console.error("CSV Export failed:", err);
    }
  };

  const downloadInvoice = (sale) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136); 
    doc.text("SALES INVOICE", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: #${sale._id.toUpperCase()}`, 14, 30);
    doc.text(`Customer: ${sale.customer}`, 14, 35);
    doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString('en-IN')}`, 14, 40);

    // Prepare Items
    const tableRows = sale.items.map(item => [
      item.product?.productName || "Product", 
      item.qty, 
      `Rs. ${item.price.toLocaleString()}`, 
      `Rs. ${(item.qty * item.price).toLocaleString()}`
    ]);

    // 2. Use the 'autoTable' function directly instead of 'doc.autoTable'
    autoTable(doc, {
      startY: 50,
      head: [["Product", "Qty", "Price", "Total"]],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136] },
      styles: { fontSize: 9 },
    });

    // 3. Get positioning safely using a standard variable
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Subtotal: Rs. ${sale.subtotal.toLocaleString()}`, 140, finalY);
    doc.text(`GST (18%): Rs. ${sale.gst.toLocaleString()}`, 140, finalY + 7);
    
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs. ${sale.total.toLocaleString()}`, 140, finalY + 15);

    doc.save(`Invoice_${sale._id.slice(-6)}.pdf`);
  } catch (error) {
    console.error("PDF Error details:", error);
    alert("Check console! Likely 'item.product' is undefined or 'autoTable' failed.");
  }
};

  if (loading) return <div className="p-10 text-center font-bold text-teal-800">Loading History...</div>;

  return (
    <div className="p-4 relative min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-900">Sales History</h1>
        <button 
          onClick={exportCSV}
          className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-md transition-all active:scale-95"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-teal-700 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Bill ID</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale._id} className="hover:bg-teal-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500 uppercase">#{sale._id.slice(-8)}</td>
                <td className="px-6 py-4 text-sm">{new Date(sale.saleDate).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{sale.customer}</td>
                <td className="px-6 py-4 font-bold text-teal-700">₹{sale.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setSelectedSale(sale)}
                    className="px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold hover:bg-teal-600 hover:text-white transition-all"
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- INVOICE MODAL --- */}
      {selectedSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md aspect-square rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-8 border-teal-600">
            
            <button 
              onClick={() => setSelectedSale(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-10"
            >
              ✕
            </button>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-teal-800 uppercase leading-none">Invoice</h2>
                  <p className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-widest">#{selectedSale._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Amount</p>
                  <p className="text-xl font-black text-teal-600">₹{selectedSale.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold text-gray-800">{selectedSale.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{new Date(selectedSale.saleDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest border-b border-teal-100 pb-1">Items Summary</p>
                <div className="space-y-2 pt-2">
                  {selectedSale.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs items-center">
                      <span className="text-gray-600 font-medium">{it.qty}x {it.product?.productName || "Product"}</span>
                      <span className="font-bold text-gray-800">₹{(it.qty * it.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-teal-50/50 border-t border-teal-100">
              <button 
                onClick={() => downloadInvoice(selectedSale)}
                className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl hover:bg-teal-700 shadow-lg shadow-teal-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>DOWNLOAD INVOICE</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}