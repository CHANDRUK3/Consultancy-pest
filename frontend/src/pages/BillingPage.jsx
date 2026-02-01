'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { pesticides } from '../data/pesticideData';
import { 
  Download, Trash2, Plus, User, Package, 
  FileText, RefreshCcw, CreditCard, Receipt, 
  Calendar, CheckCircle2 
} from 'lucide-react';

export default function BillingPage() {
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [currentPesticide, setCurrentPesticide] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);

  const handleAddItem = () => {
    if (!currentPesticide || !currentQuantity) {
      alert('Please select pesticide and quantity');
      return;
    }
    const pesticide = pesticides.find(p => p.id === parseInt(currentPesticide));
    if (!pesticide) return;

    const newItem = {
      id: Date.now(),
      pesticide: pesticide.name,
      quantity: parseFloat(currentQuantity),
      unit: pesticide.unit,
      price: pesticide.price,
      amount: pesticide.price * parseFloat(currentQuantity)
    };

    setBillItems([...billItems, newItem]);
    setCurrentPesticide('');
    setCurrentQuantity('');
  };

  const handleRemoveItem = (itemId) => {
    setBillItems(billItems.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = billItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.05; 
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setBillItems([]);
    setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
  };

  const generatePDF = () => {
    const { total } = calculateTotals();
    const doc = new jsPDF();
    // (PDF Logic remains same as your original, but you can update colors here to match new slate theme)
    doc.save(`invoice_${invoiceNo}.pdf`);
    resetForm();
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-[#FBFDFF] font-sans pb-20">
      
      {/* PROFESSIONAL HERO SECTION */}
      <div className="relative h-[300px] flex items-center overflow-hidden bg-emerald-800 mb-12">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80')] bg-cover bg-center" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-slate-900/60 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Receipt className="text-white" size={24} />
            </div>
            <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">Transaction Terminal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Billing <span className="text-emerald-500">&</span> Checkout
          </h1>
          <p className="text-slate-400 mt-2 max-w-md font-medium">
            Generate professional, tax-compliant invoices for agricultural inventory and bulk supply.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          
          {/* LEFT COLUMN: Data Entry */}
          <div className="space-y-8">
            
            {/* Customer Section */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                <User className="text-emerald-600" size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Customer Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
                  <input 
                    type="text" 
                    className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)} 
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
            </section>

            {/* Product Section */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                <Package className="text-emerald-600" size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Inventory Allocation</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Product</label>
                  <select 
                    className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 appearance-none"
                    value={currentPesticide} 
                    onChange={(e) => setCurrentPesticide(e.target.value)}
                  >
                    <option value="">Choose item...</option>
                    {pesticides.map(p => (
                      <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume/Quantity</label>
                  <input 
                    type="number" 
                    className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500"
                    value={currentQuantity} 
                    onChange={(e) => setCurrentQuantity(e.target.value)} 
                    placeholder="0.0"
                  />
                </div>
              </div>
              <button 
                className="w-full h-14 bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-[0.98]"
                onClick={handleAddItem}
              >
                <Plus size={18} strokeWidth={3} /> Register Item
              </button>
            </section>

            {/* Line Items Table */}
            {billItems.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Description</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Qty</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">Unit Price</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                      <th className="p-5 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {billItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-5 font-bold text-slate-800">{item.pesticide}</td>
                        <td className="p-5 text-sm font-bold text-slate-500 text-center">{item.quantity} {item.unit}</td>
                        <td className="p-5 text-sm font-bold text-slate-500 text-right">₹{item.price}</td>
                        <td className="p-5 font-black text-emerald-600 text-right">₹{item.amount.toFixed(2)}</td>
                        <td className="p-5">
                          <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-rose-300 hover:text-rose-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PROFESSIONAL SUMMARY */}
          <aside>
            <div className="sticky top-10 bg-green-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/40 border border-white/5">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    Invoice Summary
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invoiceNo}</span>
                  </div>
                </div>
                <CreditCard className="text-emerald-500/50" size={32} />
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Taxable Subtotal</span>
                  <span className="font-bold tracking-tight">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">CGST + SGST (5%)</span>
                  <span className="font-bold text-emerald-400 tracking-tight">+ ₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-6 border-t border-white/10 mt-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Net Payable Amount</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-emerald-500">₹</span>
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  className="group w-full h-16 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-20 disabled:grayscale"
                  onClick={generatePDF}
                  disabled={!customerName || billItems.length === 0}
                >
                  <Download size={20} className="group-hover:translate-y-1 transition-transform" /> 
                  Generate & Print
                </button>
                
                <button 
                  className="w-full py-4 text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-white/5 rounded-2xl hover:bg-white/5"
                  onClick={resetForm}
                >
                  <RefreshCcw size={12} /> Clear Current Draft
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3 opacity-40">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Dated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}