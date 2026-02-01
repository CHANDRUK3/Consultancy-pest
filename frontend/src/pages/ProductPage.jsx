import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Search, Filter, Sprout, Calendar, Tag, ChevronRight } from "lucide-react";

const ALL_PRODUCTS = [
  { id: 1, name: 'ATRATAE', price: 450, unit: 'litre', category: 'herbicide', active: 'Atrazine 50% WP', target: 'Leaf Miner', cropGroup: 'Grains', season: 'Kharif' },
  { id: 2, name: 'COVER', price: 520, unit: 'kg', category: 'fungicide', active: 'Mancozeb + Metalaxyl', target: 'Blight', cropGroup: 'Fruits', season: 'Rabi' },
  { id: 3, name: 'BIOMYCIN', price: 380, unit: 'litre', category: 'fungicide', active: 'Validamycin 3% L', target: 'Sheath Blight', cropGroup: 'Grains', season: 'Kharif' },
  { id: 4, name: 'CELQUIN', price: 600, unit: 'kg', category: 'insecticide', active: 'Quinalphos 25% EC', target: 'Bollworm', cropGroup: 'Cotton', season: 'Kharif' },
  { id: 5, name: 'CyPEPGAURD', price: 480, unit: 'litre', category: 'insecticide', active: 'Cypermethrin 10% EC', target: 'Aphids', cropGroup: 'Vegetables', season: 'All' },
  { id: 6, name: 'SULPIX 807.wP', price: 320, unit: 'kg', category: 'fungicide', active: 'Sulphur 80% WP', target: 'Powdery Mildew', cropGroup: 'Fruits', season: 'Rabi' },
  { id: 7, name: 'ALL CLEAR', price: 550, unit: 'litre', category: 'herbicide', active: 'Paraquat Dichloride', target: 'Grassy Weeds', cropGroup: 'All', season: 'All' },
  { id: 8, name: 'CLINTON', price: 490, unit: 'kg', category: 'fungicide', active: 'Hexaconazole 5% SC', target: 'Blast', cropGroup: 'Grains', season: 'Kharif' },
  { id: 9, name: 'ROUND-UP', price: 420, unit: 'litre', category: 'herbicide', active: 'Glyphosate 41% SL', target: 'All Weeds', cropGroup: 'All', season: 'All' },
  { id: 10, name: 'BEVRATON', price: 510, unit: 'kg', category: 'insecticide', active: 'Beauveria Bassiana', target: 'Soil Pests', cropGroup: 'Vegetables', season: 'Rabi' },
  { id: 11, name: 'MONDKEM', price: 580, unit: 'litre', category: 'insecticide', active: 'Monocrotophos 36% SL', target: 'Sucking Pests', cropGroup: 'Cotton', season: 'Kharif' },
  { id: 12, name: 'SPLC-DAP', price: 340, unit: 'kg', category: 'fungicide', active: 'Copper Oxychloride', target: 'Downy Mildew', cropGroup: 'Fruits', season: 'Zaid' },
  { id: 13, name: 'KATHIR SUPER PHASPHTL', price: 650, unit: 'kg', category: 'fertilizer', active: 'Phosphate Rich', target: 'Yield Boost', cropGroup: 'Grains', season: 'All' },
  { id: 14, name: 'STANES 18 ND', price: 380, unit: 'kg', category: 'fertilizer', active: 'Nitrogen Mix', target: 'Growth', cropGroup: 'All', season: 'All' },
  { id: 15, name: 'STANES 10 ND', price: 320, unit: 'kg', category: 'fertilizer', active: 'Organic Carbon', target: 'Soil Health', cropGroup: 'All', season: 'All' },
  { id: 16, name: 'AGRIYA PLUS', price: 420, unit: 'litre', category: 'growth-promoter', active: 'Amino Acids', target: 'Flowering', cropGroup: 'Fruits', season: 'Zaid' },
  { id: 17, name: 'MICRONAL LOM RASLL', price: 540, unit: 'kg', category: 'micronutrient', active: 'Zinc + Iron + Boron', target: 'Deficiency', cropGroup: 'Vegetables', season: 'All' },
  { id: 18, name: 'ZING SULPHATE', price: 280, unit: 'kg', category: 'micronutrient', active: 'Zinc Sulphate 33%', target: 'Chlorosis', cropGroup: 'Grains', season: 'Rabi' },
  { id: 19, name: 'POWER TRON', price: 480, unit: 'litre', category: 'growth-promoter', active: 'Seaweed Extract', target: 'Stress Relief', cropGroup: 'All', season: 'All' },
  { id: 20, name: 'HHJACK 200 LITA', price: 390, unit: 'litre', category: 'insecticide', active: 'Imidacloprid 17.8%', target: 'Whitefly', cropGroup: 'Vegetables', season: 'Kharif' },
  { id: 21, name: 'JANBAA2', price: 460, unit: 'kg', category: 'fungicide', active: 'Tricyclazole 75% WP', target: 'Rice Blast', cropGroup: 'Grains', season: 'Kharif' },
  { id: 22, name: 'KEMTREK', price: 520, unit: 'litre', category: 'insecticide', active: 'Chlorpyriphos 20% EC', target: 'Termites', cropGroup: 'All', season: 'All' },
  { id: 23, name: 'INDOELL', price: 410, unit: 'kg', category: 'herbicide', active: 'Pretilachlor 50% EC', target: 'Paddy Weeds', cropGroup: 'Grains', season: 'Kharif' },
  { id: 24, name: 'AVTHAR', price: 580, unit: 'litre', category: 'insecticide', active: 'Fipronil 5% SC', target: 'Stem Borer', cropGroup: 'Grains', season: 'Kharif' },
  { id: 25, name: 'TAREEP', price: 350, unit: 'kg', category: 'fungicide', active: 'Propiconazole 25%', target: 'Rust', cropGroup: 'Grains', season: 'Rabi' },
  { id: 26, name: 'WOKOVIT', price: 490, unit: 'litre', category: 'micronutrient', active: 'Chelated Minerals', target: 'Nutrient Uptake', cropGroup: 'All', season: 'All' },
  { id: 27, name: 'HITACK', price: 510, unit: 'kg', category: 'insecticide', active: 'Acephate 75% SP', target: 'Jassids', cropGroup: 'Cotton', season: 'Kharif' },
  { id: 28, name: 'EXYGOLD', price: 620, unit: 'litre', category: 'growth-promoter', active: 'Gibberellic Acid', target: 'Fruit Size', cropGroup: 'Fruits', season: 'Zaid' },
  { id: 29, name: 'TATA-METRIC', price: 440, unit: 'kg', category: 'herbicide', active: 'Metribuzin 70% WP', target: 'Potato Weeds', cropGroup: 'Vegetables', season: 'Rabi' },
  { id: 30, name: 'D-CELL', price: 380, unit: 'litre', category: 'fungicide', active: 'Carbendazim 50%', target: 'Leaf Spot', cropGroup: 'Fruits', season: 'All' },
  { id: 31, name: 'WEEDLESS SOPER', price: 500, unit: 'kg', category: 'herbicide', active: '2,4-D Amine Salt', target: 'Broadleaf', cropGroup: 'Grains', season: 'Rabi' },
  { id: 32, name: 'MP DUST', price: 280, unit: 'kg', category: 'insecticide', active: 'Malathion 5% Dust', target: 'Grain Storage', cropGroup: 'Grains', season: 'All' },
  { id: 33, name: 'SUN POWER', price: 410, unit: 'litre', category: 'growth-promoter', active: 'Humic Acid', target: 'Root Growth', cropGroup: 'All', season: 'All' },
  { id: 34, name: 'SMITE', price: 470, unit: 'kg', category: 'fungicide', active: 'Captan 50% WP', target: 'Fruit Rot', cropGroup: 'Fruits', season: 'Rabi' }
];

const CATEGORIES = ['herbicide', 'fungicide', 'insecticide', 'fertilizer', 'growth-promoter', 'micronutrient'];
const CROPS = ['Grains', 'Fruits', 'Vegetables', 'Cotton', 'Sugarcane', 'All'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'All'];

const CATEGORY_STYLES = {
  herbicide: "bg-purple-100 text-purple-700 border-purple-200",
  fungicide: "bg-blue-100 text-blue-700 border-blue-200",
  insecticide: "bg-orange-100 text-orange-700 border-orange-200",
  fertilizer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  micronutrient: "bg-teal-100 text-teal-700 border-teal-200",
  "growth-promoter": "bg-lime-100 text-lime-700 border-lime-200"
};

function ProductsPage() {
  const [filters, setFilters] = useState({ category: "", search: "", cropGroup: "", season: "" });

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const matchCat = !filters.category || p.category === filters.category;
      const matchCrop = !filters.cropGroup || p.cropGroup === filters.cropGroup;
      const matchSeason = !filters.season || p.season === filters.season;
      const matchSearch = !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchCat && matchCrop && matchSeason && matchSearch;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* HEADER SECTION - Kept the BG image as requested */}
      <div className="relative h-[350px] flex items-center justify-center text-center px-6 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Smart Agro Catalog
          </h1>
          <p className="text-lg text-slate-200 font-normal">
            Precision Agricultural Inventory & Dosage Analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - Professional "Control Panel" */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Filter size={18} />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Filters</h3>
              </div>

              <div className="space-y-5">
                <FilterSelect 
                  label="Category" 
                  value={filters.category} 
                  options={CATEGORIES} 
                  onChange={(v) => setFilters({...filters, category: v})} 
                />
                <FilterSelect 
                  label="Crop Group" 
                  value={filters.cropGroup} 
                  options={CROPS} 
                  onChange={(v) => setFilters({...filters, cropGroup: v})} 
                />
                <FilterSelect 
                  label="Season" 
                  value={filters.season} 
                  options={SEASONS} 
                  onChange={(v) => setFilters({...filters, season: v})} 
                />

                <button 
                  onClick={() => setFilters({category:"", search:"", cropGroup:"", season:""})}
                  className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 border border-slate-300 rounded hover:border-emerald-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT FEED */}
          <main className="flex-1">
            {/* SEARCH BAR - Sharp corners, subtle shadow */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search products by name or active ingredient..." 
                className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            {/* RESULTS COUNTER */}
            <div className="mb-6 border-b border-slate-100 pb-4">
              <p className="text-sm text-slate-500 italic">
                Showing {filteredProducts.length} professional-grade products
              </p>
            </div>

            {/* GRID - Professional Grid layout */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                <p className="text-slate-400 font-medium">No matching products found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* REFINED SUB-COMPONENTS */

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-sm text-slate-700 focus:border-emerald-500 outline-none cursor-pointer"
      >
        <option value="">All {label}s</option>
        {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
      </select>
    </div>
  );
}

function ProductCard({ product }) {
  const demand = (product.id * 7) % 80 + 20; 

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-emerald-400 transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${CATEGORY_STYLES[product.category] || 'bg-slate-100 text-slate-600'}`}>
            {product.category}
          </span>
          {demand > 70 && (
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase">
              High Demand
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-emerald-700 uppercase">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-4 italic">Active: {product.active}</p>
        
        <div className="bg-slate-50 rounded p-3 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Forecast</span>
            <span className="text-sm font-bold text-slate-700">{demand} Units/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Target</span>
            <span className="text-[11px] font-semibold text-slate-600">{product.target}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Price</span>
          <span className="text-xl font-bold text-emerald-700 tracking-tight">₹{product.price}</span>
          <span className="text-xs text-slate-400 font-medium lowercase">/{product.unit}</span>
        </div>
        <Link to={`/products/${product.id}`} className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-emerald-600 transition-colors uppercase tracking-wider">
          Details <ChevronRight size={14} strokeWidth={3}/>
        </Link>
      </div>
    </div>
  );
}

export default ProductsPage;
