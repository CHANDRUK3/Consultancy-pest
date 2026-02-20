import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  PlusCircle, ShoppingCart, Calendar, FileText,
  AlertTriangle, TrendingUp, Package, Clock
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    expiredValue: 0,
    chartData: [],
    categoryData: [],
    stockStatus: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0d9488', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");

      // Use Promise.allSettled so if one fails, others still show up
      const results = await Promise.allSettled([
        axios.get("http://localhost:5000/api/sales"),
        axios.get("http://localhost:5000/api/inventory"),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/inventory/expiry")
      ]);

      // Extract data safely
      const salesRes = results[0].status === 'fulfilled' ? results[0].value.data : [];
      const inventoryRes = results[1].status === 'fulfilled' ? results[1].value.data : [];
      const productsRes = results[2].status === 'fulfilled' ? results[2].value.data : [];
      const expiryRes = results[3].status === 'fulfilled' ? results[3].value.data : { expiring: [], expired: [] };

      // Log errors if any
      results.forEach((res, index) => {
        if (res.status === 'rejected') {
          console.error(`API Call ${index} failed:`, res.reason);
        }
      });

      const safeSales = Array.isArray(salesRes) ? salesRes : [];
      const safeInventory = Array.isArray(inventoryRes) ? inventoryRes : [];
      const safeProducts = Array.isArray(productsRes) ? productsRes : [];

      const today = new Date().toISOString().split('T')[0];

      // 1. Sales Analytics
      const todaySales = safeSales
        .filter(sale => sale.saleDate && sale.saleDate.toString().split('T')[0] === today)
        .reduce((sum, sale) => sum + (sale.total || 0), 0);

      // 2. Inventory Analytics (Low Stock & Category Distribution)
      const productStockMap = {};
      const categoryMap = {};

      safeInventory.forEach(item => {
        const pId = item.product?._id || item.product?.id || item.product;
        // Ensure pId is a string for map key
        if (pId) {
          const key = typeof pId === 'object' ? pId.toString() : pId;
          productStockMap[key] = (productStockMap[key] || 0) + (item.quantity || 0);
        }

        const cat = item.product?.category || "Uncategorized";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const lowStockItems = safeProducts.filter(p => {
        const pId = p._id || p.id;
        const key = typeof pId === 'object' ? pId.toString() : pId;
        return (productStockMap[key] || 0) <= (p.reorderLevel || 0);
      });

      // 3. Category Data for Pie Chart
      const categoryData = Object.keys(categoryMap).map(key => ({
        name: key.toUpperCase(),
        value: categoryMap[key]
      }));

      // 4. Stock Status for Bar Chart
      const stockStatus = [
        { name: 'Healthy', count: safeProducts.length - lowStockItems.length },
        { name: 'Low Stock', count: lowStockItems.length },
        { name: 'Expiring', count: (expiryRes.expiring || []).length }
      ];

      // 5. Last 7 Days Sales Trend
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTotal = safeSales
          .filter(s => s.saleDate && s.saleDate.toString().split('T')[0] === dateStr)
          .reduce((sum, s) => sum + (s.total || 0), 0);
        return { name: dateStr.split('-').slice(1).reverse().join('/'), amount: dayTotal };
      }).reverse();

      setStats({
        todaySales: todaySales.toFixed(2), // Ensure clean number
        lowStockCount: lowStockItems.length,
        expiringSoonCount: (expiryRes.expiring || []).length,
        expiredValue: (expiryRes.expired || []).reduce((sum, i) => sum + ((i.quantity || 0) * (i.purchasePrice || 0)), 0),
        chartData: last7Days,
        categoryData,
        stockStatus
      });
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Critical Error:", err);
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-teal-600 font-bold">Loading Engine...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics Command Center</h1>
          <p className="text-slate-500 font-medium">Monitoring your pesticide business ecosystem</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-xs font-bold text-slate-400">
          SYSTEM LIVE: {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Revenue (Today)" value={`₹${stats.todaySales}`} icon={<TrendingUp size={20} />} color="text-emerald-600" trend="+12% vs yesterday" />
        <StatCard title="Low Stock Alert" value={stats.lowStockCount} icon={<AlertTriangle size={20} />} color="text-orange-600" trend="Action required" isAlert />
        <StatCard title="Expiring Batches" value={stats.expiringSoonCount} icon={<Clock size={20} />} color="text-amber-600" trend="Next 90 days" />
        <StatCard title="Total Inventory" value={stats.categoryData.length} icon={<Package size={20} />} color="text-blue-600" trend="Categories active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Feature Analytics */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-800">Sales Velocity Trend</h2>
            <select className="text-xs bg-slate-50 border-none rounded-md font-bold text-slate-500">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={4} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions with Professional Icons */}
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionBtn icon={<PlusCircle size={20} />} label="New Sale" color="bg-teal-500" />
            <QuickActionBtn icon={<ShoppingCart size={20} />} label="Record Purchase" color="bg-orange-500" />
            <QuickActionBtn icon={<Calendar size={20} />} label="Schedule Audit" color="bg-blue-500" />
            <QuickActionBtn icon={<FileText size={20} />} label="Gov. Reports" color="bg-slate-700" />
          </div>
          <div className="mt-6 p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Storage Status</p>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-2">
              <div className="bg-teal-500 h-full rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Inventory Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Stock by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Check Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Inventory Health Check</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.stockStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {stats.stockStatus.map((entry, index) => (
                    <Cell key={index} fill={index === 1 ? '#f59e0b' : index === 2 ? '#ef4444' : '#0d9488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend, isAlert }) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border ${isAlert ? 'border-orange-100 bg-orange-50/20' : 'border-slate-100'} transition-all hover:shadow-md`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${isAlert ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-2xl font-black ${color}`}>{value}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{trend}</p>
    </div>
  );
}

function QuickActionBtn({ icon, label, color }) {
  return (
    <button className="w-full flex items-center gap-4 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-white transition-all active:scale-95 group">
      <div className={`p-2 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-bold tracking-wide">{label}</span>
    </button>
  );
}