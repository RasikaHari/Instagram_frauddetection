"use client";

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskMeterProps {
    score: number; // 0 to 1
    level: string;
}

export default function RiskMeter({ score, level }: RiskMeterProps) {
    const percentage = Math.round(score);

    let colorClass = 'text-emerald-500';
    let bgClass = 'bg-emerald-50';
    let strokeColor = '#10b981';
    let Icon = ShieldCheck;

    if (percentage < 40) {
        colorClass = 'text-rose-500';
        bgClass = 'bg-rose-50';
        strokeColor = '#f43f5e';
        Icon = ShieldAlert;
    } else if (percentage < 70) {
        colorClass = 'text-amber-500';
        bgClass = 'bg-amber-50';
        strokeColor = '#f59e0b';
        Icon = AlertTriangle;
    }

    const radius = 60;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - ((percentage / 100) * circumference);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center premium-shadow group">
            <div className="w-full flex justify-between items-center mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Trust Index</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${colorClass} ${bgClass} border-${colorClass.split('-')[1]}-200 premium-shadow-inner`}>
                    {level}
                </span>
            </div>

            <div className="relative flex items-center justify-center mt-4 transition-transform group-hover:scale-105 duration-300">
                <svg className="w-40 h-24" viewBox="0 0 140 70">
                    <path
                        d="M 10,70 A 60,60 0 0,1 130,70"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 10,70 A 60,60 0 0,1 130,70"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                    <Icon className={`w-6 h-6 ${colorClass} mb-1`} />
                    <span className="text-4xl font-bold tracking-tighter text-slate-900">{percentage}%</span>
                </div>
            </div>
        </div>
    );
}
