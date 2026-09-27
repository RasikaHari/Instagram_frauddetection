"use client";

import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface ScanningLogProps {
    targetId?: string;
}

export default function ScanningLog({ targetId = "@target" }: ScanningLogProps) {
    const [logs, setLogs] = useState<{ msg: string, time: string }[]>([]);
    const [index, setIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    const fullLogs = [
        "[SYSTEM] Initializing InstaTrust Engine v2.1.0...",
        "[DATASET] Connecting to Kaggle Instagram Analytics DB...",
        `[QUERY] Searching for Post ID: ${targetId}...`,
        "[DATA] Success: record found in 'instagram_analytics_26.csv'",
        "[AI-ML] Loading Random Forest Classifier (v2) - CSV Features...",
        "[ANALYSIS] Extracting engagement metrics: Likes, Reach, Shares...",
        "[MODEL] Processing reach-to-like quality ratios...",
        "[NLP] Analyzing caption density and hashtag distribution...",
        "[TRUST] Calculating trust score from 5 engagement dimensions...",
        "[GROQ] Sending vectorized profile data to Llama3...",
        "[SYSTEM] Finalizing intelligence report..."
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && index < fullLogs.length) {
            const timer = setTimeout(() => {
                const now = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setLogs(prev => [...prev, { msg: fullLogs[index], time: now }]);
                setIndex(prev => prev + 1);
            }, 100 + Math.random() * 200); // sped up slightly
            return () => clearTimeout(timer);
        }
    }, [index, mounted]);

    if (!mounted) return (
        <div className="bg-slate-50 rounded-xl p-4 font-mono text-[11px] space-y-1 h-[140px] overflow-hidden border border-slate-200 premium-shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-200 pb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest font-semibold text-[10px]">Live Scanning Log</span>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 rounded-xl p-4 font-mono text-[11px] space-y-1 h-[140px] overflow-hidden border border-slate-200 premium-shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-200 pb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest font-semibold text-[10px]">Live Scanning Log</span>
                <div className="ml-auto flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                </div>
            </div>
            <div className="space-y-1 text-slate-600">
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-2 ${log.msg.includes('Success') || log.msg.includes('Finalizing') ? 'text-emerald-600 font-medium' : log.msg.includes('identified') ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                        <span className="opacity-50 tracking-tighter">[{log.time}]</span>
                        <span className="truncate">{log.msg}</span>
                    </div>
                ))}
                {index < fullLogs.length && (
                    <div className="flex gap-2 text-indigo-600">
                        <span className="opacity-50 tracking-tighter">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                        <span className="animate-pulse">_</span>
                    </div>
                )}
            </div>
        </div>
    );
}
