"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarProfileProps {
    signals: any;
}

export default function RadarProfile({ signals }: RadarProfileProps) {
    const data = [
        {
            subject: 'Reach Quality',
            A: Math.min(100, signals.reach_like_ratio * 100),
            fullMark: 100,
        },
        {
            subject: 'Engagement',
            A: Math.min(100, signals.engagement_rate * 1000),
            fullMark: 100,
        },
        {
            subject: 'Interaction',
            A: Math.min(100, signals.er_quality * 50),
            fullMark: 100,
        },
        {
            subject: 'Velocity',
            A: Math.min(100, signals.saves / (signals.likes || 1) * 1000),
            fullMark: 100,
        },
        {
            subject: 'Authenticity',
            A: signals.likes > 0 ? 85 : 30, // Simplified metric
            fullMark: 100,
        },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[300px] flex flex-col premium-shadow group">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Behavioral Profile</div>
            <div className="flex-1 w-full h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                color: '#0f172a',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 700 }}
                        />
                        <Radar
                            name="Profile Match"
                            dataKey="A"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fill="#4f46e5"
                            fillOpacity={0.15}
                            className="transition-opacity group-hover:fill-opacity-30"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
