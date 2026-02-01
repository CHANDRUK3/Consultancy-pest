'use client';

import { useState, useMemo } from 'react';
import { ShoppingCart, Search, Filter, Trash2, ChevronRight, Bug, Tag, Sprout } from 'lucide-react';


const ALL_PRODUCTS = [
  { id: 1, name: 'ATRATAE', price: 450, unit: 'litre', category: 'herbicide', active: 'Atrazine 50% WP', target: 'Leaf Miner', cropGroup: 'Grains', season: 'Kharif' },
  { id: 2, name: 'COVER', price: 520, unit: 'kg', category: 'fungicide', active: 'Mancozeb + Metalaxyl', target: 'Blight', cropGroup: 'Fruits', season: 'Rabi' },
  { id: 3, name: 'BIOMYCIN', price: 380, unit: 'litre', category: 'fungicide', active: 'Validamycin 3% L', target: 'Sheath Blight', cropGroup: 'Grains', season: 'Kharif' },
  { id: 4, name: 'CELQUIN', price: 600, unit: 'kg', category: 'insecticide', active: 'Quinalphos 25% EC', target: 'Bollworm', cropGroup: 'Cotton', season: 'Kharif' },
  { id: 5, name: 'CyPEPGAURD', price: 480, unit: 'litre', category: 'insecticide', active: 'Cypermethrin 10% EC', target: 'Aphids', cropGroup: 'Vegetables', season: 'All' },
  { id: 6, name: 'SULPIX 807.wP', price: 320, unit: 'kg', category: 'fungicide', active: 'Sulphur 80% WP', target: 'Powdery Mildew', cropGroup: 'Fruits', season: 'Rabi' },
  { id: 7, name: 'ALL CLEAR', price: 550, unit: 'litre', category: 'herbicide', active: 'Paraquat Dichloride', target: 'Grassy Weeds', cropGroup: 'All', season: 'All' },
  { id: 13, name: 'KATHIR SUPER PHASPHTL', price: 650, unit: 'kg', category: 'fertilizer', active: 'Phosphate Rich', target: 'Yield Boost', cropGroup: 'Grains', season: 'All' },
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

const CATEGORY_STYLES = {
  herbicide: "bg-purple-100 text-purple-700 border-purple-200",
  fungicide: "bg-blue-100 text-blue-700 border-blue-200",
  insecticide: "bg-orange-100 text-orange-700 border-orange-200",
  fertilizer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  micronutrient: "bg-teal-100 text-teal-700 border-teal-200",
  "growth-promoter": "bg-lime-100 text-lime-700 border-lime-200"
};

const CATEGORIES = ['herbicide', 'fungicide', 'insecticide', 'fertilizer', 'growth-promoter', 'micronutrient'];

export default function PesticideCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  const filteredPesticides = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.active.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* HEADER SECTION - Matched with Product.jsx */}
      <div className="relative h-[350px] flex items-center justify-center text-center px-6 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 opacity-50 bg-[url('https://www.ugaoo.com/cdn/shop/articles/shutterstock_437800651.jpg?v=1661867183')] bg-cover bg-center" 
        />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-block bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Inventory Vault
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Solution <span className="text-emerald-400">Catalog</span>
          </h1>
          <p className="text-lg text-slate-200 font-normal">
            Precision Agricultural Formulas & Commercial Grade Solutions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        
        {/* Filter Bar - Styled to match Sidebar/Search aesthetics */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search brands or active ingredients..." 
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 appearance-none cursor-pointer outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <button className="h-12 px-6 bg-slate-800 text-emerald-400 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors">
               <ShoppingCart size={18} /> 
               <span>Cart ({cart.length})</span>
            </button>
          </div>
        </div>

        {/* Product Grid - Matched ProductCard Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPesticides.map(product => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-emerald-400 transition-all flex flex-col h-full shadow-sm hover:shadow-md">
              
              {/* Product Visual Area */}
              <div className="h-32 bg-slate-50 relative flex items-center justify-center border-b border-slate-100">
                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${CATEGORY_STYLES[product.category]}`}>
                  {product.category}
                </div>
                <Sprout className="w-10 h-10 text-slate-200" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight uppercase">
                  {product.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4 italic">
                  Active: {product.active}
                </p>

                <div className="bg-slate-50 rounded p-3 mb-4 mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Target Pest</span>
                    <span className="text-[11px] font-semibold text-slate-600">{product.target}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Crop Group</span>
                    <span className="text-[11px] font-semibold text-slate-600">{product.cropGroup}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-xl font-bold text-emerald-700">₹{product.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/{product.unit}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)} 
                    className="bg-slate-800 text-white px-4 py-2 rounded font-bold text-xs hover:bg-emerald-600 transition-colors active:scale-95 uppercase tracking-wider"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPesticides.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-lg bg-slate-50">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No professional solutions found for your search.</p>
          </div>
        )}

        {/* Floating Cart Drawer - Updated Colors */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-48px)] bg-white rounded-xl shadow-2xl border border-slate-200 z-[1000] overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <ShoppingCart size={16} className="text-emerald-400" />
                <span>Order Summary ({cart.length})</span>
              </div>
              <button className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded hover:bg-white/20" onClick={() => setCart([])}>
                Clear
              </button>
            </div>
            
            <div className="max-h-[250px] overflow-y-auto p-4 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-800 uppercase">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">Quantity: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700 text-sm">₹{item.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Grand Total</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">₹{cartTotal}</span>
              </div>
              <button 
                className="w-full h-12 bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                onClick={() => window.location.href='/billing'}
              >
                Proceed to Checkout <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}