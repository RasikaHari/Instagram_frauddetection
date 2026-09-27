"use client";

import React from 'react';
import { BadgeCheck, ShieldAlert, Instagram, Link as LinkIcon, Users, MousePointer2, Heart } from 'lucide-react';

interface ProfileCardProps {
    data: {
        username: string;
        post_id: string;
        full_name: string;
        profile_pic?: string;
        biography?: string;
        likes: number;
        reach: number;
        engagement_rate: number;
        is_verified: boolean;
    };
}

export default function ProfileCard({ data }: ProfileCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col premium-shadow hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-5">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 premium-shadow-inner flex-shrink-0 transition-transform group-hover:scale-105">
                        {data.profile_pic ? (
                            <img src={data.profile_pic} alt={data.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-slate-300" />
                            </div>
                        )}
                    </div>
                    {data.is_verified ? (
                        <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-600 p-1.5 rounded-xl border border-emerald-200 premium-shadow">
                            <BadgeCheck className="w-4 h-4" />
                        </div>
                    ) : (
                        <div className="absolute -bottom-2 -right-2 bg-rose-100 text-rose-600 p-1.5 rounded-xl border border-rose-200 premium-shadow">
                            <ShieldAlert className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-slate-900 truncate tracking-tight">{data.full_name}</h2>
                        {data.is_verified && <BadgeCheck className="w-5 h-5 text-indigo-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 font-medium">
                        <Instagram className="w-4 h-4" />
                        <span>@{data.username}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 premium-shadow-inner">
                            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                            Post: {data.post_id}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                            {data.is_verified ? 'Dataset Verified' : 'Deep Scan Profile'}
                        </span>
                    </div>
                </div>
            </div>

            {data.biography && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 font-medium leading-relaxed premium-shadow-inner">
                    "{data.biography}"
                </div>
            )}

            <div className="mt-auto pt-6">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Reach
                        </div>
                        <div className="text-xl font-bold text-slate-900">{data.reach.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" /> Likes
                        </div>
                        <div className="text-xl font-bold text-slate-900">{data.likes.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                            <MousePointer2 className="w-3.5 h-3.5" /> Engagement
                        </div>
                        <div className="text-xl font-bold text-slate-900">{(data.engagement_rate * 100).toFixed(2)}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
