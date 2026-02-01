import React from "react";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from "react-router-dom";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

function HomePage() {
  const carouselImages = [
    { url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000", title: "Smart Crop Protection", sub: "Data-driven solutions for healthier yields." },
    { url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000", title: "Advanced Formulations", sub: "Scientifically proven pesticides for maximum impact." },
    { url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000", title: "Sustainable Future", sub: "Eco-conscious farming with intelligent pest control." },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000", title: "Expert Support", sub: "24/7 AI-powered agricultural assistance." },
    { url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000", title: "Trusted Quality", sub: "Anand Agro Agencies: Your partner in growth." }
  ];

  const categories = [
    { title: "Herbicides", image: "https://eu-images.contentstack.com/v3/assets/bltdd43779342bd9107/blt7190e338d3ec90cf/685306dc3dba2319ce3d32dc/0623M-3738A-1800x1012.jpg?width=1280&auto=webp&quality=80&disable=upscale", count: "45+ Products", description: "Selective weed control to protect crop nutrients." },
    { title: "Fungicides", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800", count: "30+ Products", description: "Advanced protection against blight and fungal diseases." },
    { title: "Insecticides", image: "https://static.vecteezy.com/system/resources/thumbnails/042/234/557/small/ai-generated-person-using-plant-based-insecticide-spray-for-eco-friendly-gardening-and-pest-control-in-agriculture-photo.jpeg", count: "50+ Products", description: "Highly effective solutions for pest-free harvests." },
    { title: "Growth Promoters", image: "https://img.4imz.com/media/A5A57I3L/upload/plant-growth-promoter-gujarat-1713346281.jpeg", count: "20+ Products", description: "Bio-stimulants to maximize your yield potential." },
    { title: "Research & R&D", image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800", count: "Innovation Hub", description: "Our scientists work to develop safer agro-chemicals." },
    { title: "Our Network", image: "https://www.panna.org/wp-content/uploads/2025/08/overhead-pesticide-spray-768x482.jpg", count: "Pan India", description: "Supplying high-quality products to 10,000+ dealers." }
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      {/* 1. HERO SLIDER - Increased height to 95vh */}
      <section className="h-[95vh] relative group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          navigation={true}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#2aa904",
          }}
          className="h-full w-full"
        >
          {carouselImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div 
                className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
                style={{ backgroundImage: `url(${img.url})` }}
              >
                <div className="absolute inset-0 bg-black/45 z-0" />
                
                <div className="container mx-auto px-6 relative z-10">
                  <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <span className="bg-[#2aa904] text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-8 inline-block shadow-lg">
                      Anand Agro Intelligence
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                      {img.title}
                    </h1>
                    <p className="text-2xl text-slate-100 mb-12 max-w-2xl font-medium drop-shadow-md">
                      {img.sub}
                    </p>
                    <div className="flex flex-wrap justify-center gap-5">
                      <button className="bg-[#2aa904] hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black transition-all transform hover:-translate-y-1 flex items-center gap-3 shadow-xl shadow-emerald-900/40">
                        Find Solution <ArrowRight size={24} />
                      </button>
                      <Link to="/products" className="bg-white/10 backdrop-blur-md border-2 border-white/40 hover:bg-white hover:text-emerald-900 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-lg">
                        Our Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. CATEGORY QUICK-GRID - Reduced card height to 320px for better visibility */}
      <section className="py-24 max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#2aa904] font-black tracking-[4px] text-xs uppercase">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#406661] mt-3">
            Specialized <span className="text-[#2aa904]">Solutions</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">Explore our research-backed chemical categories for every crop stage</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div className="group relative h-[420px] w-[400px] rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 bg-white" key={i}>
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm p-5 flex justify-between items-center z-10 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-5">
                <h4 className="text-xl font-black text-[#406661]">{cat.title}</h4>
                <span className="bg-emerald-50 text-[#2aa904] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{cat.count}</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#406661] to-[#2aa904]/90 flex flex-col justify-center items-center text-center p-6 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 z-20">
                <h4 className="text-2xl font-black text-white mb-2 italic tracking-tighter">{cat.title}</h4>
                <p className="text-emerald-50 text-sm mb-6 font-medium leading-relaxed">{cat.description}</p>
                <button className="bg-white text-[#406661] px-6 py-2 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-lime-300 transition-colors shadow-lg">
                  View Range <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT & VISION */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800" alt="Laboratory" className="rounded-[2.5rem] shadow-2xl z-10 relative" />
            <div className="absolute -bottom-6 -right-6 bg-[#2aa904] text-white p-8 rounded-2xl shadow-2xl z-20 text-center">
              <h3 className="text-4xl font-black mb-1">25+</h3>
              <p className="font-bold text-[10px] uppercase tracking-[2px]">Years of Trust</p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[#2aa904] font-black tracking-widest text-xs uppercase mb-4">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#406661] mb-8 leading-tight">Empowering Farmers Through <span className="text-[#2aa904]">Innovation</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">Anand Agro Agencies provides a shield for your livelihood. Our integration of AI pest detection ensures your crops get exactly what they need.</p>
            <button className="bg-[#406661] hover:bg-[#2aa904] text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg text-lg">Learn Our History</button>
          </div>
        </div>
      </section>

      {/* 4. SEASONAL CALENDAR */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#406661] to-[#1e312f] rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp size={48} className="text-[#2aa904]" />
                <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Seasonal Advisory</h2>
              </div>
              <p className="text-emerald-50 text-xl max-w-2xl font-medium">High risk of Bollworm in South Karnataka detected. Check recommended sprays now.</p>
            </div>
            <button className="bg-white text-[#406661] px-10 py-5 rounded-2xl font-black text-lg hover:bg-lime-400 transition-all shadow-xl relative z-10">View Risk Map</button>
          </div>
        </div>
      </section>

      {/* 5. TRUSTED BY */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Bayer_logo.svg" className="h-14" alt="Bayer" />
          <img src="https://upload.wikimedia.org/wikipedia/en/d/d3/Syngenta_Logo.svg" className="h-12" alt="Syngenta" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/BASF-Logo_bw.svg" className="h-10" alt="BASF" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/UPL_logo.png" className="h-14" alt="UPL" />
        </div>
      </section>
    </div>
  );
}

export default HomePage;