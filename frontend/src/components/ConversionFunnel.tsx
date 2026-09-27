"use client";

import React from 'react';
import { ArrowRight, Eye, Users, MousePointer2 } from 'lucide-react';

interface ConversionFunnelProps {
    metrics: {
        impressions: number;
        reach: number;
        profile_visits: number;
    };
}

export default function ConversionFunnel({ metrics }: ConversionFunnelProps) {
    const data = [
        {
            label: 'Impressions',
            value: metrics.impressions,
            icon: <Eye className="w-4 h-4" />,
            color: 'bg-indigo-100 text-indigo-600',
            barColor: 'bg-indigo-500'
        },
        {
            label: 'Reach',
            value: metrics.reach,
            icon: <Users className="w-4 h-4" />,
            color: 'bg-purple-100 text-purple-600',
            barColor: 'bg-purple-500'
        },
        {
            label: 'Visits',
            value: metrics.profile_visits,
            icon: <MousePointer2 className="w-4 h-4" />,
            color: 'bg-emerald-100 text-emerald-600',
            barColor: 'bg-emerald-500'
        },
    ];

    const maxValue = metrics.impressions || 1;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col premium-shadow group hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">Conversion Funnel</div>

            <div className="flex-1 space-y-6">
                {data.map((item, i) => (
                    <div key={item.label} className="space-y-2 group/item">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${item.color} transition-transform group-hover/item:scale-110`}>
                                    {item.icon}
                                </div>
                                <span className="text-xs font-semibold text-slate-900">{item.label}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-900">{(item.value || 0).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden premium-shadow-inner">
                                <div
                                    className={`h-full ${item.barColor} transition-all duration-1000 ease-out`}
                                    style={{ width: `${((item.value || 0) / maxValue) * 100}%` }}
                                ></div>
                            </div>
                            {i > 0 && (
                                <div className="text-[10px] font-semibold text-slate-500 w-10 text-right">
                                    {item.value && data[i - 1].value ? ((item.value / data[i - 1].value) * 100).toFixed(1) : '0'}%
                                </div>
                            )}
                            {i === 0 && <div className="w-10"></div>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Total Conversion</div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
                    {((metrics.profile_visits / maxValue) * 100).toFixed(2)}%
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    );
}
