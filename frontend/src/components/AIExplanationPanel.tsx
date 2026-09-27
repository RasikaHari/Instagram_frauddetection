"use client";

import React from 'react';
import { Sparkles, ArrowUpRight, Download, Share2 } from 'lucide-react';

interface AIExplanationPanelProps {
    explanation: string;
}

export default function AIExplanationPanel({ explanation }: AIExplanationPanelProps) {
    // Format explanation text - split by ** or bold sections
    const sections = explanation.split('**').filter(s => s.trim() !== "");

    const handleDownload = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: `AI Security Analysis Verdict`,
            text: `Check out this AI-generated verdict for the account analysis on InstaTrust.`,
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

    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 relative overflow-hidden h-full premium-shadow group transition-all hover:bg-indigo-50/80">
            <div className="absolute top-0 right-0 p-6">
                <Sparkles className="w-12 h-12 text-indigo-300 opacity-20 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-white p-2 rounded-xl premium-shadow border border-indigo-100">
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Analysis Verdict</h3>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="prose max-w-none">
                    <div className="text-slate-700 leading-relaxed text-sm space-y-4">
                        {explanation.split('\n\n').map((para, i) => (
                            <p key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-700 font-medium" style={{ animationDelay: `${i * 150}ms` }}>
                                {para.split('**').map((text, j) => (
                                    j % 2 === 1 ? <strong key={j} className="text-slate-900 font-bold bg-indigo-100/50 px-1 rounded">{text}</strong> : text
                                ))}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex flex-wrap gap-3">
                    <button
                        onClick={handleDownload}
                        className="btn-premium flex items-center gap-2 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all active:scale-95"
                    >
                        Download PDF Report
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-6 rounded-xl transition-all border border-slate-200 active:scale-95 premium-shadow"
                    >
                        Share Analysis
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
