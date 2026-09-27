"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InteractionMixProps {
    metrics: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
    };
}

export default function InteractionMix({ metrics }: InteractionMixProps) {
    const data = [
        { name: 'Likes', value: metrics.likes || 0, color: '#6366f1' }, // indigo-500
        { name: 'Comments', value: metrics.comments || 0, color: '#38bdf8' }, // sky-400
        { name: 'Shares', value: metrics.shares || 0, color: '#a855f7' }, // purple-500
        { name: 'Saves', value: metrics.saves || 0, color: '#f472b6' }, // pink-400
    ].filter(item => item.value > 0);

    // If no data, provide a placeholder
    const renderData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#cbd5e1' }];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[300px] flex flex-col premium-shadow group">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Interaction Mix</div>

            <div className="flex-1 w-full relative transition-transform duration-300 group-hover:scale-105">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={renderData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {renderData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                                color: '#0f172a',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}
                            itemStyle={{ fontWeight: 700 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-[10px] font-semibold text-slate-600 uppercase ml-1 tracking-wide">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
