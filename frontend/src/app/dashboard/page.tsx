"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, ArrowLeft, RefreshCw, Share2, AlertTriangle, AlertCircle, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Components
import ProfileCard from '@/components/ProfileCard';
import RiskMeter from '@/components/RiskMeter';
import RadarProfile from '@/components/RadarProfile';
import SignalTimeline from '@/components/SignalTimeline';
import AIExplanationPanel from '@/components/AIExplanationPanel';
import ScanningLog from '@/components/ScanningLog';
import InteractionMix from '@/components/InteractionMix';
import ConversionFunnel from '@/components/ConversionFunnel';
import CategoryBenchmark from '@/components/CategoryBenchmark';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function DashboardContent() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username') || '';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: `https://instagram.com/${username}` })
            });

            if (!resp.ok) throw new Error("Failed to analyze account");

            const result = await resp.json();
            setData(result);
            setTimeout(() => setLoading(false), 2000);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>
                <div className="w-full max-w-2xl space-y-8 relative z-10">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <Shield className="absolute inset-0 m-auto w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Analyzing @{username}</h2>
                        <p className="text-slate-500 text-xs animate-pulse uppercase tracking-widest font-medium">InstaTrust Engine Running</p>
                    </div>
                    <ScanningLog targetId={username} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>
                <div className="bg-white border border-rose-200 p-8 rounded-2xl max-w-md premium-shadow relative z-10">
                    <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Analysis Failed</h2>
                    <p className="text-slate-600 text-sm mb-6">{error}</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-200">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </Link>
                </div>
            </div>
        );
    }

    const handleShare = async () => {
        const shareData = {
            title: `InstaTrust Analysis: @${username}`,
            text: `Check out this AI-powered security analysis for @${username} on InstaTrust.`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Analysis link copied to clipboard!");
            } catch (err) {
                console.error("Clipboard failed:", err);
            }
        }
    };

    const trustScore = data.trust_score * 100;
    const isSafe = trustScore >= 70;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 relative">
            <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>
            
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 rounded-md transition-transform group-hover:scale-105 shadow-sm">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">Insta<span className="text-indigo-600">Trust</span></span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Refresh Analysis">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <Link href="/metrics" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" /> Metrics
                        </Link>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wide">
                            New Search
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden premium-shadow-inner">
                            <span className="text-[10px] font-bold text-slate-500">ME</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-6 py-8 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                    
                    {/* Header Section */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
                                <span>Ecosystem Trust Overview</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">Trust Analysis Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors border border-slate-200 premium-shadow"
                            >
                                <Share2 className="w-4 h-4" />
                                Share Report
                            </button>
                        </div>
                    </motion.div>

                    {/* KPI Row */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trust Score</span>
                                <Shield className={`w-4 h-4 ${isSafe ? 'text-emerald-500' : 'text-rose-500'}`} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">{trustScore.toFixed(0)}%</span>
                                <span className={`text-xs font-bold ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>{isSafe ? 'Safe' : 'High Risk'}</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fraud Risk</span>
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">{(data.fraud_probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Engagement Rate</span>
                                <BarChart3 className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">{(data.signals.engagement_rate * 100).toFixed(2)}%</span>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Confidence</span>
                                <Lock className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">
                                    {(Math.max(data.fraud_probability, 1 - data.fraud_probability) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bento Grid Main */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <motion.div variants={itemVariants}>
                                <ProfileCard data={{
                                    username: data.username,
                                    post_id: data.post_id,
                                    full_name: data.full_name || data.username,
                                    profile_pic: data.profile_pic,
                                    biography: data.signals.reach_like_ratio > 0.6
                                        ? `Warning: Abnormal interaction density detected for this ${data.benchmarks?.category || 'account'}. Reach patterns suggest inorganic engagement.`
                                        : `Verified ${data.benchmarks?.category || 'Creator'} profile with ${data.is_from_dataset ? 'organic' : 'simulated'} growth and ${data.signals.er_quality > 1 ? 'above-average' : 'standard'} engagement resonance.`,
                                    likes: data.signals.likes,
                                    reach: data.signals.reach,
                                    engagement_rate: data.signals.engagement_rate,
                                    is_verified: data.is_from_dataset
                                }} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                <InteractionMix metrics={data.signals} />
                                <RadarProfile signals={data.signals} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ConversionFunnel metrics={data.signals} />
                                <CategoryBenchmark data={{
                                    category: data.benchmarks?.category || "Unknown",
                                    current_likes: data.signals.likes,
                                    avg_likes: data.benchmarks?.avg_likes || 0,
                                    current_er: data.signals.engagement_rate,
                                    avg_er: data.benchmarks?.avg_engagement || 0
                                }} />
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <motion.div variants={itemVariants}>
                                <RiskMeter score={data.trust_score} level={data.risk_level} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex-1">
                                <SignalTimeline signals={data.signals} />
                            </motion.div>
                        </div>

                        {/* Bottom Full Row */}
                        <motion.div variants={itemVariants} className="lg:col-span-12">
                            <AIExplanationPanel explanation={data.ai_explanation} />
                        </motion.div>
                    </div>

                    <motion.footer variants={itemVariants} className="pt-8 pb-6 text-center border-t border-slate-200 mt-8">
                        <p className="text-xs text-slate-500 font-semibold tracking-wide">© 2026 InstaTrust Enterprise • AI Security Verification</p>
                    </motion.footer>
                </motion.div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]"></div>}>
            <DashboardContent />
        </Suspense>
    )
}
