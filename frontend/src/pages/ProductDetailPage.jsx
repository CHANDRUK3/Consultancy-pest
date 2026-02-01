'use client';

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, AlertCircle, CheckCircle, Droplets, 
  Gauge, IndianRupee, ShieldCheck 
} from 'lucide-react';

const ALL_PRODUCTS = [
  { id: 1, name: 'ATRATAE', price: 450, unit: 'litre', category: 'herbicide', active: 'Atrazine 50% WP', target: 'Leaf Miner', cropGroup: 'Grains', description: 'Selective herbicide for broad-leaf and grass weed control.' },
  { id: 2, name: 'COVER', price: 520, unit: 'kg', category: 'fungicide', active: 'Mancozeb + Metalaxyl', target: 'Blight', cropGroup: 'Fruits', description: 'Broad-spectrum fungicide for fruit and vegetable protection.' },
  { id: 3, name: 'BIOMYCIN', price: 380, unit: 'litre', category: 'fungicide', active: 'Validamycin 3% L', target: 'Sheath Blight', cropGroup: 'Grains', description: 'Antibiotic fungicide effective against soil-borne diseases.' },
  { id: 4, name: 'CELQUIN', price: 600, unit: 'kg', category: 'insecticide', active: 'Quinalphos 25% EC', target: 'Bollworm', cropGroup: 'Cotton', description: 'Fast-acting insecticide for chewing and sucking pests.' },
  { id: 5, name: 'CyPEPGAURD', price: 480, unit: 'litre', category: 'insecticide', active: 'Cypermethrin 10% EC', target: 'Aphids', cropGroup: 'Vegetables', description: 'Synthetic pyrethroid for effective pest management.' },
  { id: 6, name: 'SULPIX 807.wP', price: 320, unit: 'kg', category: 'fungicide', active: 'Sulphur 80% WP', target: 'Powdery Mildew', cropGroup: 'Fruits', description: 'Sulfur-based fungicide and acaricide.' },
  { id: 7, name: 'ALL CLEAR', price: 550, unit: 'litre', category: 'herbicide', active: 'Paraquat Dichloride', target: 'Grassy Weeds', cropGroup: 'All', description: 'Non-selective contact herbicide.' },
  { id: 8, name: 'CLINTON', price: 490, unit: 'kg', category: 'fungicide', active: 'Hexaconazole 5% SC', target: 'Blast', cropGroup: 'Grains', description: 'Systemic fungicide with protective and curative action.' },
  { id: 9, name: 'ROUND-UP', price: 420, unit: 'litre', category: 'herbicide', active: 'Glyphosate 41% SL', target: 'All Weeds', cropGroup: 'All', description: 'Post-emergence systemic herbicide.' },
  { id: 10, name: 'BEVRATON', price: 510, unit: 'kg', category: 'insecticide', active: 'Beauveria Bassiana', target: 'Soil Pests', cropGroup: 'Vegetables', description: 'Biological insecticide based on beneficial fungi.' },
  { id: 11, name: 'MONDKEM', price: 580, unit: 'litre', category: 'insecticide', active: 'Monocrotophos 36% SL', target: 'Sucking Pests', cropGroup: 'Cotton', description: 'Organophosphate insecticide with systemic action.' },
  { id: 12, name: 'SPLC-DAP', price: 340, unit: 'kg', category: 'fungicide', active: 'Copper Oxychloride', target: 'Downy Mildew', cropGroup: 'Fruits', description: 'Contact fungicide for various fungal diseases.' },
  { id: 13, name: 'KATHIR SUPER PHASPHTL', price: 650, unit: 'kg', category: 'fertilizer', active: 'Phosphate Rich', target: 'Yield Boost', cropGroup: 'Grains', description: 'Organic phosphate fertilizer for plant vigor.' },
  { id: 14, name: 'STANES 18 ND', price: 380, unit: 'kg', category: 'fertilizer', active: 'Nitrogen Mix', target: 'Growth', cropGroup: 'All', description: 'Nitrogen-rich supplement for vegetative growth.' },
  { id: 15, name: 'STANES 10 ND', price: 320, unit: 'kg', category: 'fertilizer', active: 'Organic Carbon', target: 'Soil Health', cropGroup: 'All', description: 'Improves soil structure and microbial activity.' },
  { id: 16, name: 'AGRIYA PLUS', price: 420, unit: 'litre', category: 'growth-promoter', active: 'Amino Acids', target: 'Flowering', cropGroup: 'Fruits', description: 'Amino acid based bio-stimulant.' },
  { id: 17, name: 'MICRONAL LOM RASLL', price: 540, unit: 'kg', category: 'micronutrient', active: 'Zinc + Iron + Boron', target: 'Deficiency', cropGroup: 'Vegetables', description: 'Balanced micronutrient mix for crop health.' },
  { id: 18, name: 'ZING SULPHATE', price: 280, unit: 'kg', category: 'micronutrient', active: 'Zinc Sulphate 33%', target: 'Chlorosis', cropGroup: 'Grains', description: 'Correction of Zinc deficiency.' },
  { id: 19, name: 'POWER TRON', price: 480, unit: 'litre', category: 'growth-promoter', active: 'Seaweed Extract', target: 'Stress Relief', cropGroup: 'All', description: 'Natural growth enhancer from seaweed.' },
  { id: 20, name: 'HHJACK 200 LITA', price: 390, unit: 'litre', category: 'insecticide', active: 'Imidacloprid 17.8%', target: 'Whitefly', cropGroup: 'Vegetables', description: 'Systemic insecticide for sucking pest control.' },
  { id: 21, name: 'JANBAA2', price: 460, unit: 'kg', category: 'fungicide', active: 'Tricyclazole 75% WP', target: 'Rice Blast', cropGroup: 'Grains', description: 'Highly effective systemic fungicide for Rice Blast.' },
  { id: 22, name: 'KEMTREK', price: 520, unit: 'litre', category: 'insecticide', active: 'Chlorpyriphos 20% EC', target: 'Termites', cropGroup: 'All', description: 'Broad-spectrum organophosphate insecticide.' },
  { id: 23, name: 'INDOELL', price: 410, unit: 'kg', category: 'herbicide', active: 'Pretilachlor 50% EC', target: 'Paddy Weeds', cropGroup: 'Grains', description: 'Pre-emergence herbicide for rice.' },
  { id: 24, name: 'AVTHAR', price: 580, unit: 'litre', category: 'insecticide', active: 'Fipronil 5% SC', target: 'Stem Borer', cropGroup: 'Grains', description: 'Modern insecticide for soil and foliar pests.' },
  { id: 25, name: 'TAREEP', price: 350, unit: 'kg', category: 'fungicide', active: 'Propiconazole 25%', target: 'Rust', cropGroup: 'Grains', description: 'Systemic foliar fungicide.' },
  { id: 26, name: 'WOKOVIT', price: 490, unit: 'litre', category: 'micronutrient', active: 'Chelated Minerals', target: 'Nutrient Uptake', cropGroup: 'All', description: 'Chelated mineral complex for fast absorption.' },
  { id: 27, name: 'HITACK', price: 510, unit: 'kg', category: 'insecticide', active: 'Acephate 75% SP', target: 'Jassids', cropGroup: 'Cotton', description: 'Versatile insecticide for multiple pests.' },
  { id: 28, name: 'EXYGOLD', price: 620, unit: 'litre', category: 'growth-promoter', active: 'Gibberellic Acid', target: 'Fruit Size', cropGroup: 'Fruits', description: 'Hormonal growth promoter for fruit development.' },
  { id: 29, name: 'TATA-METRIC', price: 440, unit: 'kg', category: 'herbicide', active: 'Metribuzin 70% WP', target: 'Potato Weeds', cropGroup: 'Vegetables', description: 'Herbicide for weed control in Potato and Sugarcane.' },
  { id: 30, name: 'D-CELL', price: 380, unit: 'litre', category: 'fungicide', active: 'Carbendazim 50%', target: 'Leaf Spot', cropGroup: 'Fruits', description: 'Systemic fungicide with protective action.' },
  { id: 31, name: 'WEEDLESS SOPER', price: 500, unit: 'kg', category: 'herbicide', active: '2,4-D Amine Salt', target: 'Broadleaf', cropGroup: 'Grains', description: 'Selective herbicide for broadleaf weed control.' },
  { id: 32, name: 'MP DUST', price: 280, unit: 'kg', category: 'insecticide', active: 'Malathion 5% Dust', target: 'Grain Storage', cropGroup: 'Grains', description: 'Safe insecticide dust for stored grains.' },
  { id: 33, name: 'SUN POWER', price: 410, unit: 'litre', category: 'growth-promoter', active: 'Humic Acid', target: 'Root Growth', cropGroup: 'All', description: 'Improves root system and nutrient efficiency.' },
  { id: 34, name: 'SMITE', price: 470, unit: 'kg', category: 'fungicide', active: 'Captan 50% WP', target: 'Fruit Rot', cropGroup: 'Fruits', description: 'Protective fungicide for fruit crops.' }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [dosageForm, setDosageForm] = useState({ fieldArea: "", severity: "Medium" });

  const product = useMemo(() => {
    return ALL_PRODUCTS.find(p => p.id === parseInt(id));
  }, [id]);

  const dosageResult = useMemo(() => {
    if (!product || !dosageForm.fieldArea || dosageForm.fieldArea <= 0) return null;

    const baseQuantity = 1.0; 
    const severityMultiplier = { Low: 0.8, Medium: 1.0, High: 1.2 };
    const areaFactor = parseFloat(dosageForm.fieldArea) / 1000;

    const quantity = baseQuantity * severityMultiplier[dosageForm.severity] * areaFactor;
    return {
      quantity: quantity.toFixed(2),
      water: (quantity * 500).toFixed(0),
      rounds: dosageForm.severity === "High" ? 3 : 2,
      cost: (quantity * product.price).toFixed(0)
    };
  }, [dosageForm, product]);

  if (!product) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">Product not found.</div>;
  }

  const categoryColors = {
    herbicide: 'bg-orange-100 text-orange-700',
    fungicide: 'bg-blue-100 text-blue-700',
    insecticide: 'bg-red-100 text-red-700',
    fertilizer: 'bg-green-100 text-green-700',
    'growth-promoter': 'bg-emerald-100 text-emerald-700',
    micronutrient: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 font-sans antialiased text-slate-900">
      <Link to="/products" className="flex items-center gap-2 text-slate-500 font-semibold mb-6 hover:text-emerald-600 transition-colors">
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <main className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="lg:col-span-7 p-8 md:p-12 border-r border-slate-50">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${categoryColors[product.category] || 'bg-slate-100'}`}>
              {product.category}
            </span>
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
              {product.active}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{product.name}</h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Target Crop</label>
              <p className="font-bold text-slate-800 text-lg">{product.cropGroup}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Target Pests</label>
              <p className="font-bold text-slate-800 text-lg">{product.target}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-50/50 p-8 md:p-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">
              <Gauge size={22} className="text-emerald-500" /> AI Dosage Engine
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Field Area (sq.m)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 2000" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-emerald-500 outline-none"
                  value={dosageForm.fieldArea}
                  onChange={(e) => setDosageForm({...dosageForm, fieldArea: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Severity</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                  value={dosageForm.severity}
                  onChange={(e) => setDosageForm({...dosageForm, severity: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {dosageResult ? (
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center">
                  <Droplets size={20} className="text-blue-500 mb-2"/>
                  <span className="text-[9px] uppercase font-black text-blue-400">Chemical</span>
                  <strong className="text-blue-900 font-black">{dosageResult.quantity} {product.unit}</strong>
                </div>
                <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 flex flex-col items-center">
                  <div className="font-black text-cyan-600 mb-2 text-sm">H₂O</div>
                  <span className="text-[9px] uppercase font-black text-cyan-400">Water</span>
                  <strong className="text-cyan-900 font-black">{dosageResult.water} L</strong>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 italic">Enter area to calculate.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-6 flex flex-col md:flex-row gap-6 bg-slate-900 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-4 flex-1">
          <CheckCircle size={22} className="text-emerald-400" />
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500">Re-Entry Interval</p>
            <p className="font-bold text-sm">24 Hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1">
          <AlertCircle size={22} className="text-amber-400" />
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500">Safety Protocol</p>
            <p className="font-bold text-sm">Gloves & Mask Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
}