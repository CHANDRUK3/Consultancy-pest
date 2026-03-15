import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import {
  TrendingUp, Users, Package,
  AlertCircle, DollarSign, ArrowUpRight,
  Trophy, UserPlus, ArrowDownRight, Activity,
  Lightbulb, Sparkles, Target, Zap
} from "lucide-react";

export default function SalesAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('finance');
  const [agriData, setAgriData] = useState(null);

  const API_URL = "http://localhost:5005";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesRes, agriRes] = await Promise.all([
          axios.get(`${API_URL}/api/ml/sales-analysis`, { timeout: 15000 }),
          axios.get(`${API_URL}/api/ml/agri-research`, { timeout: 15000 })
        ]);

        console.log("ML Data Received:", salesRes.data);
        console.log("Agri Data Received:", agriRes.data);

        setData(salesRes.data);
        setAgriData(agriRes.data);
        setError(null);
      } catch (err) {
        console.error("AI Fetch Error:", err);
        setError("Failed to connect to Analysis Engine. Please run run_analysis.bat.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50">
      <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight animate-pulse">Running ML Diagnostic Models...</h2>
    </div>
  );

  if (error) return (
    <div className="p-10 max-w-xl mx-auto mt-20">
      <div className="bg-white border border-rose-100 p-10 rounded-[3rem] shadow-2xl text-center">
        <AlertCircle className="mx-auto text-rose-500 mb-6" size={48} />
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">AI Server Offline</h3>
        <p className="text-slate-500 font-bold mb-8 leading-relaxed">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-xl">Reconnect Engine</button>
      </div>
    </div>
  );

  // Fallback for empty data
  if (!data?.customerPurchaseData?.length && !loading) {
    return (
      <div className="p-20 text-center">
        <Package size={80} className="mx-auto text-slate-200 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-4">No Analytics Available</h2>
        <p className="text-slate-500 max-w-md mx-auto">Please record some sales in the system first so the ML model can analyze trends and customer behavior.</p>
      </div>
    );
  }

  // --- CHART CONFIGURATIONS ---
  const revenueOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 4, colors: ['#0d9488'] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [50, 100] } },
    xaxis: {
      categories: data?.seasonal?.map(s => s.month) || [],
      labels: { style: { colors: '#94a3b8', fontWeight: 700 } }
    },
    yaxis: { show: true, labels: { style: { colors: '#94a3b8', fontWeight: 700 } } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    colors: ['#0d9488']
  };

  const productOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 10, columnWidth: '60%', distributed: true } },
    dataLabels: { enabled: true, style: { fontWeight: 900 } },
    xaxis: {
      categories: data?.topProducts?.map(p => p.name) || [],
      labels: { style: { fontWeight: 700 } }
    },
    legend: { show: false },
    colors: ['#0d9488', '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4']
  };

  const agriYieldOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 10 } },
    dataLabels: { enabled: true, style: { fontWeight: 900 } },
    xaxis: {
      categories: agriData?.cropYieldData?.map(c => c.Crop) || [],
      labels: { style: { fontWeight: 700 } }
    },
    colors: ['#0d9488']
  };

  const agriTrendOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { curve: 'monotoneCubic', width: 4 },
    xaxis: {
      categories: agriData?.yearlyTrends?.map(t => t.Crop_Year) || [],
      labels: { style: { fontWeight: 700 } }
    },
    colors: ['#0f766e']
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans border-l border-slate-200 antialiased">
      <div className="max-w-7xl mx-auto">

        {/* Flagship Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 bg-teal-50 w-fit px-3 py-1 rounded-full border border-teal-100">
              <Sparkles className="text-teal-600" size={14} />
              <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Advanced Sales Intelligence</span>
            </div>
            <h1 className="text-5xl font-black">
              Sales Analysis
            </h1>
          </div>
          <div className="bg-white px-8 py-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-white flex items-center gap-6">
            <div className="h-12 w-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200"><Users size={24} /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Customers</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{data?.customerPurchaseData?.length || 0}</p>
            </div>
          </div>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard icon={<TrendingUp size={22} />} label="Top Revenue" val={`₹${(data?.customerPurchaseData?.[0]?.totalSpent || 0).toLocaleString()}`} color="teal" />
          <StatCard icon={<Zap size={22} />} label="Fastest Item" val={data?.topProducts?.[0]?.name || "N/A"} color="amber" />
          <StatCard icon={<Trophy size={22} />} label="Best Performer" val={data?.customerPurchaseData?.[0]?.customer || "N/A"} color="emerald" />
          <StatCard icon={<Activity size={22} />} label="Avg Volume" val={`₹${Math.round((data?.customerPurchaseData?.reduce((p, c) => p + c.totalSpent, 0) || 0) / (data?.customerPurchaseData?.length || 1)).toLocaleString()}`} color="blue" />
        </div>

        {/* ML Suggestions & Analysis Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-900 text-white rounded-lg"><Lightbulb size={20} /></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Sales Analysis & Strategic Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.insights?.map((insight, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 hover:border-teal-200 transition-all group flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    {insight.type === "VIP" && <Target size={20} />}
                    {insight.type === "STOCK" && <Package size={20} />}
                    {insight.type === "PROD" && <Zap size={20} />}
                    {insight.type === "PRICE" && <DollarSign size={20} />}
                  </div>
                  <h4 className="font-black text-slate-900 tracking-tight">{insight.title}</h4>
                </div>
                <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6 flex-grow">{insight.content}</p>
                <div className="h-1 w-12 bg-teal-100 rounded-full group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed Charts Section */}
        <div className="mb-12">
          <div className="flex bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 w-fit">
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-3 ${activeTab === 'finance'
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              <TrendingUp size={18} />
              Financial Performance
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-3 ${activeTab === 'inventory'
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Package size={18} />
              Pesticide Movement
            </button>
            <button
              onClick={() => setActiveTab('agri')}
              className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-3 ${activeTab === 'agri'
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Activity size={18} />
              Agricultural Research
            </button>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white min-h-[500px] transition-all duration-500">
            {activeTab === 'finance' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Monthly Financial Performance</h3>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                    <Activity size={14} /> Peak Season Analysis
                  </div>
                </div>
                <div className="h-[500px] w-full">
                  <Chart options={revenueOptions} series={[{ name: 'Revenue', data: data?.seasonal?.map(s => s.total) || [] }]} type="area" height="100%" />
                </div>
              </div>
            ) : activeTab === 'inventory' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Pesticide Movement (Qty)</h3>
                  <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                    <Package size={14} /> Inventory Velocity
                  </div>
                </div>
                <div className="h-[500px] w-full">
                  <Chart options={productOptions} series={[{ name: 'Units', data: data?.topProducts?.map(p => p.qty) || [] }]} type="bar" height="100%" />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <TrendingUp className="text-teal-600" /> Top Yielding Crops (Metric Tons/Ha)
                    </h3>
                    <Chart options={agriYieldOptions} series={[{ name: 'Yield', data: agriData?.cropYieldData?.map(c => c.Yield.toFixed(2)) || [] }]} type="bar" height={400} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <Target className="text-teal-600" /> Historical Yield Trends
                    </h3>
                    <Chart options={agriTrendOptions} series={[{ name: 'Avg Yield', data: agriData?.yearlyTrends?.map(t => t.Yield.toFixed(2)) || [] }]} type="line" height={400} />
                  </div>
                </div>

                <div className="mt-12 bg-teal-50 p-8 rounded-[2rem] border border-teal-100">
                  <h4 className="text-xl font-black text-teal-800 mb-4 flex items-center gap-2 underline decoration-teal-300 underline-offset-4">
                    <Sparkles /> AI Summary of Agricultural Research
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-teal-900 font-bold">
                    <div className="flex gap-4 p-4 bg-white/50 rounded-2xl">
                      <div className="text-3xl">🌾</div>
                      <div>
                        <p className="text-xs uppercase text-teal-600 font-black">Most Efficient Crop</p>
                        <p className="text-lg">{agriData?.summary?.top_crop || "Loading..."}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white/50 rounded-2xl">
                      <div className="text-3xl">📍</div>
                      <div>
                        <p className="text-xs uppercase text-teal-600 font-black">High Yield State</p>
                        <p className="text-lg">{agriData?.summary?.high_yield_state || "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed High/Low Ranking */}
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-xl shadow-teal-100"><Users size={24} /></div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Customer Loyalty Audit</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Spend Threshold &gt; 8,000 Highlighted</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h4 className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs border-b border-emerald-50 pb-4"><ArrowUpRight size={18} /> Top Contributors (Buying More)</h4>
              <div className="space-y-6">
                {data?.customerPurchaseData?.slice(0, 5).map((cust, i) => (
                  <CustomerRankingItem key={i} name={cust.customer} amount={cust.totalSpent} trips={cust.purchaseCount} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function CustomerRankingItem({ name, amount, trips, rank }) {
  const isHighValue = amount > 8000;
  return (
    <div className="flex items-center justify-between p-7 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-center gap-6">
        <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
          {rank}
        </div>
        <div>
          <h5 className={`text-xl font-black tracking-tight leading-none mb-1 ${isHighValue ? "text-red-600" : "text-slate-800"}`}>
            {name}
          </h5>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{trips} Purchases Recorded</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900 tracking-tighter mb-1">₹{amount.toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full ${isHighValue ? 'bg-red-500' : 'bg-teal-500'} transition-all duration-1000`} style={{ width: `${Math.min((amount / 15000) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, val, color }) {
  const colors = {
    teal: "bg-teal-50 text-teal-600 border-teal-100 text-teal-800",
    amber: "bg-amber-50 text-amber-600 border-amber-100 text-amber-800",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 text-emerald-800",
    blue: "bg-blue-50 text-blue-600 border-blue-100 text-blue-800"
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-white hover:-translate-y-2 transition-all">
      <div className={`p-4 rounded-3xl w-fit mb-6 shadow-sm ${colors[color].split(' ').slice(0, 2).join(' ')}`}>{icon}</div>
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter truncate">{val}</p>
    </div>
  );
}
