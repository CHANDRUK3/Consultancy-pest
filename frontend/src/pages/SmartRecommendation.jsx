'use client';

import { useState } from 'react';
import { 
  Brain, CheckCircle2, Sprout, MapPin, 
  CloudSun, Beaker, ShieldAlert, Search, 
  Info, Zap, Leaf, AlertTriangle
} from 'lucide-react';
import { analyzePest } from '../data/pestanalyze';

// --- DATA DEFINITIONS (Matched to your Training Script) ---
const CROPS = ["Rice", "Wheat", "Cotton", "Tomato", "Chili", "Sugarcane", "Maize", "Potato"];
const GROWTH_STAGES = ["Vegetative", "Flowering", "Fruiting", "Seedling", "Maturity"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];
const DISTRICTS = ["Bangalore", "Mysore", "Belgaum", "Hubballi", "Kolar", "Mandya"];

const SYMPTOM_CATEGORIES = {
  "Leaf Symptoms": ["Yellowing", "Holes", "Curling", "Spots", "Wilting"],
  "Stem Symptoms": ["Boring holes", "Lesions", "Rotting", "Discoloration"],
  "Fruit/Pod Symptoms": ["Spots", "Rotting", "Deformation", "Premature drop"],
  "General": ["Stunted growth", "Wilting", "Weak growth"],
};

export default function SmartRecommendation() {
  const [crop, setCrop] = useState("Rice");
  const [growthStage, setGrowthStage] = useState("Vegetative");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState("Bangalore");
  const [season, setSeason] = useState("Kharif");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) => 
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // --- ML-POWERED PREDICTION ENGINE ---
  const handleGetRecommendation = () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to analyze.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call delay for better UX
    setTimeout(() => {
      try {
        // Prepare input data for ML analysis
        const userInput = {
          crop: crop,
          growthStage: growthStage,
          symptoms: selectedSymptoms,
          location: location,
          season: season
        };

        // Call the ML analysis function
        const prediction = analyzePest(userInput);
        console.log('ML Analysis Input:', userInput);
        console.log('ML Analysis Result:', prediction);

        if (prediction.error) {
          setError(prediction.error);
          if (prediction.suggestions) {
            setError(prev => prev + '\n\nSuggestions:\n' + prediction.suggestions.map(s => `• ${s}`).join('\n'));
          }
        } else {
          // Set the ML prediction result
          setResult({
            pest: prediction.pest,
            scientific: prediction.scientific,
            recommendation: prediction.recommendation,
            alternativeProduct: prediction.alternativeProduct,
            dosage: prediction.dosage,
            detailedDosage: prediction.detailedDosage,
            applicationMethod: prediction.applicationMethod,
            safetyInterval: prediction.safetyInterval,
            confidence: prediction.confidence,
            description: prediction.description,
            matchDetails: prediction.matchDetails,
            additionalInfo: prediction.additionalInfo
          });
        }
      } catch (err) {
        setError('Analysis failed. Please try again or contact support.');
        console.error('Pest analysis error:', err);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 900, behavior: 'smooth' });
      }
    }, 1200); // Realistic ML processing time
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen font-sans text-slate-900 antialiased">
      
      {/* HERO SECTION */}
      <section className="relative bg-[#064e3b] pt-32 pb-32 px-6 border-b border-emerald-900/50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-40 brightness-[0.4]" 
            alt="Field"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Leaf className="text-emerald-400" size={14} />
            <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Anand Agro Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Smart <span className="text-emerald-400">Diagnosis</span> <br /> & Precision Crop Care
          </h1>
          <p className="text-emerald-100/80 mt-8 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Instantly identify crop threats using our advanced computer vision and climate-linked diagnostic engine.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: PARAMETERS */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-100 p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 rounded-lg"><Zap className="text-emerald-600" size={18} /></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Configuration</h2>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Select Crop", val: crop, set: setCrop, opt: CROPS },
                  { label: "Growth Stage", val: growthStage, set: setGrowthStage, opt: GROWTH_STAGES },
                  { label: "Region", val: location, set: setLocation, opt: DISTRICTS },
                  { label: "Season", val: season, set: setSeason, opt: SEASONS }
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-[10px] font-bold text-emerald-800/50 uppercase tracking-[0.2em] mb-2 block">{field.label}</label>
                    <select 
                      className="w-full h-12 rounded-xl border border-slate-100 bg-slate-50/50 px-4 font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                    >
                      {field.opt.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <button
                  onClick={handleGetRecommendation}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="w-full h-14 mt-4 bg-[#064e3b] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-30"
                >
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Brain size={18} />}
                  <span>{loading ? "Analysing..." : "Run Diagnosis"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT: SYMPTOMS & RESULTS */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase mb-10 pb-6 border-b border-slate-50">Visual Indicators</h2>
              {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4 opacity-70">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`h-12 rounded-xl flex items-center justify-between px-4 text-sm font-bold transition-all border ${
                          selectedSymptoms.includes(symptom) ? "bg-emerald-600 border-emerald-600 text-white shadow-md" : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200"
                        }`}
                      >
                        {symptom}
                        <div className={`h-1.5 w-1.5 rounded-full ${selectedSymptoms.includes(symptom) ? "bg-white" : "bg-slate-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* AI DIAGNOSIS OUTPUT */}
            {error ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-red-50 rounded-2xl p-8 border border-red-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="text-red-500" size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Analysis Error</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-4 text-red-800">Unable to Provide Recommendation</h3>
                    <p className="text-red-700 text-lg leading-relaxed whitespace-pre-line">{error}</p>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#022c22] rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle2 className="text-emerald-400" size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        ML Analysis Complete: {result.confidence}% Confidence
                      </span>
                    </div>
                    <h3 className="text-5xl font-black tracking-tight mb-2 uppercase">{result.pest}</h3>
                    <p className="text-emerald-400/80 font-bold italic text-base mb-8">{result.scientific}</p>
                    <p className="text-emerald-50/70 text-lg leading-relaxed max-w-3xl font-medium">{result.description}</p>
                    
                    {/* ML Analysis Details */}
                    {result.matchDetails && (
                      <div className="mt-6 flex flex-wrap gap-4 text-xs">
                        <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300">
                          Symptom Match: {result.matchDetails.symptomMatch}%
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300">
                          Location Factor: {result.matchDetails.locationFactor}x
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300">
                          Seasonal Factor: {result.matchDetails.seasonalFactor}x
                        </span>
                      </div>
                    )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="bg-emerald-50 h-10 w-10 rounded-xl flex items-center justify-center mb-6 text-emerald-600"><Beaker size={20} /></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Treatment</span>
                    <p className="text-2xl font-bold text-slate-800 mt-1 mb-2 uppercase">{result.recommendation}</p>
                    {result.alternativeProduct && (
                      <p className="text-sm text-slate-600 mb-3">Alternative: {result.alternativeProduct}</p>
                    )}
                    <div className="text-emerald-700 font-bold text-xs uppercase mb-2">Dosage: {result.dosage}</div>
                    {result.detailedDosage && (
                      <div className="text-slate-600 text-xs">Application: {result.detailedDosage}</div>
                    )}
                    {result.applicationMethod && (
                      <div className="text-slate-600 text-xs capitalize">Method: {result.applicationMethod}</div>
                    )}
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="bg-rose-50 h-10 w-10 rounded-xl flex items-center justify-center mb-6 text-rose-600"><ShieldAlert size={20} /></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safety Interval</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-4xl font-black text-slate-800">{result.safetyInterval || 14}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Days PHI</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Pre-Harvest Interval</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-[0.3em]">Waiting for Field Observations</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}