'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d6659] text-white pt-20 pb-10 mt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Identity */}
        <div className="space-y-6">
          <div className="text-2xl font-extrabold tracking-tight">
            Anand Agro <span className="text-[#2aa904]">Agencies</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Pioneering sustainable agricultural solutions through intelligence and innovation. 
            Supporting the backbone of India since 1995.
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#2aa904] transition-all hover:-translate-y-1" aria-label="LinkedIn">
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-[#2aa904] transition-all hover:-translate-y-1" aria-label="Twitter">
              <Twitter size={20} strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-[#2aa904] transition-all hover:-translate-y-1" aria-label="Facebook">
              <Facebook size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 className="text-[#2aa904] text-xs font-black uppercase tracking-widest mb-6">Platform</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Home</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Product Catalog</Link></li>
            <li><Link to="/billing" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Billing Portal</Link></li>
            <li><Link to="/recommendation" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Market Analytics</Link></li>
          </ul>
        </div>

        {/* Intelligence Tools */}
        <div>
          <h4 className="text-[#2aa904] text-xs font-black uppercase tracking-widest mb-6">Resources</h4>
          <ul className="space-y-3">
            <li><Link to="#" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Pest Forecasting</Link></li>
            <li><Link to="/recommendation" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Smart Advice</Link></li>
            <li><Link to="#" className="text-white/70 hover:text-[#2aa904] hover:translate-x-1 transition-all inline-block text-sm font-medium">Knowledge Base</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#2aa904] text-xs font-black uppercase tracking-widest mb-6">Get in Touch</h4>
          <div className="space-y-4">
            <a href="tel:+911234567890" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
              <Phone size={16} className="text-[#2aa904]" />
              <span className="text-sm">+91 1234-567-890</span>
            </a>
            <a href="mailto:info@anandagro.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
              <Mail size={16} className="text-[#2aa904]" />
              <span className="text-sm">info@anandagro.com</span>
            </a>
            <div className="flex items-start gap-3 text-white/90">
              <MapPin size={16} className="text-[#2aa904] mt-0.5" />
              <span className="text-sm">Indore, MP, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-white/40 text-xs">
          &copy; {currentYear} Anand Agro Agencies. All Rights Reserved.
        </p>
        <p className="text-white/40 text-xs italic tracking-wide">
          Intelligence in every drop.
        </p>
      </div>
    </footer>
  );
}

export default Footer;