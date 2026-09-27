"use client";

import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

interface CategoryBenchmarkProps {
    data: {
        category: string;
        current_likes: number;
        avg_likes: number;
        current_er: number;
        avg_er: number;
    };
}

export default function CategoryBenchmark({ data }: CategoryBenchmarkProps) {
    const performance = ((data.current_er / (data.avg_er || 1)) * 100) - 100;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col premium-shadow group hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Benchmarking</div>
                <div className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border border-indigo-100 premium-shadow-inner">
                    {data.category}
                </div>
            </div>

            <div className="flex-1 min-h-[160px] flex flex-col justify-center">
                <div className="space-y-4">
                    <div className="group/item transition-transform hover:translate-x-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Likes vs Category Avg</div>
                        <div className="flex items-end gap-2 text-slate-900">
                            <span className="text-xl font-bold">{data.current_likes.toLocaleString()}</span>
                            <span className="text-[10px] font-medium text-slate-500 mb-1">/ {data.avg_likes.toLocaleString()} avg</span>
                        </div>
                    </div>

                    <div className="group/item transition-transform hover:translate-x-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Engagement vs Category Avg</div>
                        <div className="flex items-end gap-2 text-slate-900">
                            <span className="text-xl font-bold">{data.current_er.toFixed(1)}%</span>
                            <span className="text-[10px] font-medium text-slate-500 mb-1">/ {data.avg_er.toFixed(1)}% avg</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 premium-shadow-inner">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shadow-sm transition-transform group-hover:scale-110 ${performance >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {performance >= 0 ? <Award className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                    </div>
                    <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Performance Index</div>
                        <div className={`text-xs font-bold ${performance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {performance >= 0 ? '+' : ''}{performance.toFixed(1)}% {performance >= 0 ? 'Above' : 'Below'} Average
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
