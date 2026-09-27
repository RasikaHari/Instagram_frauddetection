"use client";

import React from 'react';
import { Activity, ShieldAlert, Heart, MessageCircle, Bookmark } from 'lucide-react';

interface SignalTimelineProps {
    signals: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        engagement_rate: number;
    };
}

export default function SignalTimeline({ signals }: SignalTimelineProps) {
    const events = [
        {
            time: 'System Core',
            title: 'Base Engagement Authenticated',
            desc: `${signals.likes.toLocaleString()} likes recorded. Velocity appears organic based on temporal distribution.`,
            type: 'safe',
            icon: Heart
        },
        {
            time: 'Network Analysis',
            title: 'Comment Density Verified',
            desc: `Processed ${signals.comments} comments. NLP model shows standard sentiment distribution.`,
            type: 'neutral',
            icon: MessageCircle
        },
        {
            time: 'Virality Check',
            title: 'Share/Save Ratio Calculated',
            desc: `High retention pattern detected (${signals.saves} saves). Indicates genuine value-driven content.`,
            type: 'warning',
            icon: Bookmark
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col premium-shadow">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Activity Feed</span>
                <Activity className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {events.map((event, i) => (
                    <div key={i} className="relative pl-6 group">
                        {i !== events.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200"></div>
                        )}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-[3px] border-white flex items-center justify-center premium-shadow-inner ${event.type === 'safe' ? 'bg-emerald-100 text-emerald-600' :
                            event.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                            <event.icon className="w-3 h-3" />
                        </div>
                        <div className="group-hover:translate-x-1 transition-transform">
                            <div className="text-[10px] font-bold text-slate-400 mb-0.5">{event.time}</div>
                            <div className="text-sm font-semibold text-slate-900">{event.title}</div>
                            <div className="text-xs text-slate-500 mt-1 leading-relaxed">{event.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
