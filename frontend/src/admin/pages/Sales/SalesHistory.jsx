import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DigitalSign from "../../../data/Digital_sign.jpg";

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
      doc.setFontSize(22);
      doc.setTextColor(13, 148, 136);
      doc.text("ANAND AGRO AGENCIES", 14, 20);

      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("SALES INVOICE", 14, 30);

      doc.setTextColor(0);
      doc.setFont(undefined, 'bold');
      doc.text("BILLED TO:", 14, 55);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);

      // Explicitly show all details as requested
      doc.text(`Customer: ${sale.customer}`, 14, 62);
      doc.text(`Location: ${sale.customerLocation || 'N/A'}`, 14, 67);
      doc.text(`Crop: ${sale.cropType || 'N/A'} | Area: ${sale.landUnits || 0} Hectares`, 14, 72);

      // Prepare Items
      const tableRows = sale.items.map(item => [
        item.productName || item.product?.productName || "Product",
        item.qty,
        `Rs. ${item.price.toLocaleString()}`,
        `Rs. ${(item.qty * item.price).toLocaleString()}`
      ]);

      // 2. Use the 'autoTable' function directly instead of 'doc.autoTable'
      autoTable(doc, {
        startY: 80,
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
      doc.setFont(undefined, 'bold');
      doc.text(`Grand Total: Rs. ${sale.total.toLocaleString()}`, 140, finalY + 15);

      // Signature Area
      const pageHeight = doc.internal.pageSize.height;
      const signY = pageHeight - 50;

      // Increased size to 60x25 for maximum visibility
      doc.addImage(DigitalSign, 'JPEG', 130, signY - 25, 60, 25);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text("Authorized Signatory", 140, signY + 5);
      doc.setFont(undefined, 'normal');
      doc.text("Anand Agro Agencies", 140, signY + 10);

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
              <div className="text-center mb-6">
                <h1 className="text-xl font-black text-teal-700 tracking-tighter">ANAND AGRO AGENCIES</h1>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Official Sales Invoice</p>
              </div>

              <div className="flex justify-between items-start mb-6 border-t border-b border-gray-100 py-4">
                <div>
                  <h2 className="text-lg font-black text-gray-800 uppercase leading-none italic">Bill Summary</h2>
                  <p className="text-[9px] font-mono text-gray-400 mt-2 uppercase tracking-widest">#{selectedSale._id.slice(-12)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total Payable</p>
                  <p className="text-2xl font-black text-teal-600 tracking-tighter italic font-mono">₹{selectedSale.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.2em] mb-4">Billed To:</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Customer</span>
                    <span className="text-sm font-black text-slate-900">{selectedSale.customer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Location</span>
                    <span className="text-sm font-bold text-slate-600">{selectedSale.customerLocation || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Agricultural</span>
                    <span className="text-sm font-bold text-slate-600">
                      {selectedSale.cropType || 'N/A'} | {selectedSale.landUnits || 0} Hectares
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Invoice Date</span>
                <span className="font-black text-slate-900">{new Date(selectedSale.saleDate).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b border-teal-50 pb-2 mb-4">Items Summary</p>
                <div className="space-y-3">
                  {selectedSale.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                      <span className="text-slate-700 font-black">{it.qty}x {it.productName || it.product?.productName || "Product"}</span>
                      <span className="font-black text-slate-900">₹{(it.qty * it.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-teal-50/50 border-t border-teal-100">
              <div className="flex justify-between items-end mb-6">
                <div className="text-left">
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-2">Seal & Sign</p>
                  <img src={DigitalSign} alt="Signature" className="h-20 w-auto object-contain mix-blend-multiply scale-110 -ml-2" />
                  <p className="text-[10px] font-black text-teal-800 uppercase mt-2">Authorized Signatory</p>
                </div>
              </div>

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