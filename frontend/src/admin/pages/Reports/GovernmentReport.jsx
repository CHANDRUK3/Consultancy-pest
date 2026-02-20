import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function GovernmentReport() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchMonthlyData = async () => {
    if (!selectedMonth) {
      alert("Please select a month first");
      return null;
    }
    setIsGenerating(true);
    try {
      const res = await axios.get("http://localhost:5000/api/sales");
      const [year, month] = selectedMonth.split("-");
      
      // Filter sales for the selected month/year
      const filteredSales = res.data.filter(sale => {
        const d = new Date(sale.saleDate);
        return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
      });

      // Aggregate product-wise totals
      const reportMap = {};
      filteredSales.forEach(sale => {
        sale.items.forEach(item => {
          const key = item.productName;
          if (!reportMap[key]) {
            reportMap[key] = { name: key, qty: 0, totalValue: 0, entries: 0 };
          }
          reportMap[key].qty += item.qty;
          reportMap[key].totalValue += item.amount;
          reportMap[key].entries += 1;
        });
      });

      setIsGenerating(false);
      return Object.values(reportMap);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      return null;
    }
  };

  // --- Export Excel ---
  const downloadExcel = async () => {
    const data = await fetchMonthlyData();
    if (!data || data.length === 0) return alert("No data found for this period");

    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      "Product Name": row.name,
      "Total Quantity Sold": row.qty,
      "Total Sales Value (Rs)": row.totalValue,
      "Number of Transactions": row.entries
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");
    XLSX.writeFile(workbook, `Gov_Report_${selectedMonth}.xlsx`);
  };

  // --- Export PDF ---
  const downloadPDF = async () => {
    const data = await fetchMonthlyData();
    if (!data || data.length === 0) return alert("No data found for this period");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Government Monthly Sales Report - ${selectedMonth}`, 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [["Product Name", "Qty Sold", "Sales Value", "Trans. Count"]],
      body: data.map(row => [row.name, row.qty, `Rs. ${row.totalValue}`, row.entries]),
      theme: 'striped',
      headStyles: { fillColor: [2, 120, 113] }
    });

    doc.save(`Gov_Report_${selectedMonth}.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Government Monthly Report</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-teal-800 mb-2 uppercase tracking-wide">
              Select Reporting Period
            </label>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:border-teal-500 outline-none transition-all bg-gray-50" 
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-teal-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              Compliance Document Checklist:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-center gap-2"> Product-wise aggregated sales</li>
              <li className="flex items-center gap-2"> Monthly revenue totals</li>
              <li className="flex items-center gap-2"> Quantity breakdown by Unit</li>
              <li className="flex items-center gap-2"> Transaction count for audit</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-end gap-4 pt-8">
            <button 
              disabled={isGenerating}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? "Processing..." : "Preview Data"}
            </button>
            
            <button 
              onClick={downloadExcel}
              disabled={isGenerating}
              className="px-6 py-3 bg-white border-2 border-teal-600 text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Download Excel</span>
            </button>

            <button 
              onClick={downloadPDF}
              disabled={isGenerating}
              className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 max-w-3xl">
        <p className="text-xs text-amber-800 italic">
          <strong>Note:</strong> This report is generated based on recorded sales and inventory deductions. Ensure all stock transfers are updated before filing with the Agriculture Department.
        </p>
      </div>
    </div>
  );
}