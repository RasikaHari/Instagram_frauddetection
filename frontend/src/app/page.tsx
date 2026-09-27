"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Instagram, BarChart3, Lock, Zap, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let id = url.trim();
    if (url.includes('instagram.com/')) {
      id = url.split('instagram.com/')[1].split('/')[0].split('?')[0];
    }

    router.push(`/dashboard?username=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 relative overflow-hidden">
      {/* Premium Background Textures */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 inset-x-0 h-[600px] bg-mesh-glow opacity-70 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Insta<span className="text-indigo-600">Trust</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Product</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Enterprise</a>
            <a href="/metrics" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />Model Metrics
            </a>
            <div className="h-4 w-px bg-slate-200"></div>
            <a href="#" className="hover:text-slate-900 transition-colors">Sign in</a>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors font-medium premium-shadow">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 premium-shadow"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold tracking-wide text-indigo-600 uppercase">InstaTrust Enterprise Engine 2.0</span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-slate-900"
          >
            Social media integrity, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-400">verified in seconds.</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium"
          >
            InstaTrust provides enterprise-grade AI analytics to verify Instagram account authenticity. Protect your brand from bot networks, engagement fraud, and social engineering.
          </motion.p>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleAnalyze}
            className="w-full max-w-2xl flex flex-col md:flex-row gap-3 p-2 bg-white border border-slate-200 rounded-2xl premium-shadow"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <Instagram className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter Instagram Handle or Post ID"
                className="bg-transparent border-none outline-none text-slate-900 w-full text-base placeholder:text-slate-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="btn-premium text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Analyze
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-12"
          >
            <div className="flex flex-col items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors">
              <Shield className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fraud Detection</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors">
              <BarChart3 className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Behavioral Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors">
              <Lock className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Risk Assessment</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pattern Mining</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
