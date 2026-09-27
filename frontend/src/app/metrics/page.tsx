"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, RefreshCw, ArrowLeft, Trophy, Clock, Brain, BarChart3, Activity, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell
} from 'recharts';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const MODEL_COLORS: Record<string, string> = {
    "Random Forest": "#6366f1",
    "SVM": "#f43f5e",
    "Logistic Regression": "#10b981",
    "Decision Tree": "#f59e0b",
    "KNN": "#8b5cf6",
    "Gradient Boosting": "#06b6d4",
    "Naive Bayes": "#ec4899"
};

interface ModelResult {
    model_name: string;
    model_file: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    training_time_seconds: number;
    confusion_matrix: {
        true_negative: number;
        false_positive: number;
        false_negative: number;
        true_positive: number;
    };
    classification_report: {
        non_fraud: { precision: number; recall: number; f1_score: number; support: number };
        fraud: { precision: number; recall: number; f1_score: number; support: number };
    };
    dataset_info: {
        total_samples: number;
        train_samples: number;
        test_samples: number;
        fraud_count: number;
        non_fraud_count: number;
    };
}

interface TrainingResults {
    trained_at: string;
    best_model: string;
    best_accuracy: number;
    active_model: string;
    models: Record<string, ModelResult>;
}

export default function MetricsPage() {
    const [data, setData] = useState<TrainingResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [retraining, setRetraining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeModel, setActiveModel] = useState<string>("");
    const [settingModel, setSettingModel] = useState(false);
    const [selectedConfusion, setSelectedConfusion] = useState<string | null>(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch('http://localhost:8000/model-metrics');
            if (!resp.ok) {
                if (resp.status === 404) {
                    setError("No training results found. Click 'Retrain All Models' to train for the first time.");
                    setLoading(false);
                    return;
                }
                throw new Error("Failed to fetch metrics");
            }
            const result = await resp.json();
            setData(result);
            setActiveModel(result.active_model);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleRetrain = async () => {
        setRetraining(true);
        setError(null);
        try {
            const resp = await fetch('http://localhost:8000/retrain', { method: 'POST' });
            if (!resp.ok) throw new Error("Retrain failed");
            const result = await resp.json();
            setData(result);
            setActiveModel(result.active_model);
        } catch (err: any) {
            setError(err.message);
        }
        setRetraining(false);
    };

    const handleSetActiveModel = async (modelName: string) => {
        setSettingModel(true);
        try {
            const resp = await fetch('http://localhost:8000/set-active-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model_name: modelName })
            });
            if (!resp.ok) throw new Error("Failed to set model");
            setActiveModel(modelName);
        } catch (err: any) {
            setError(err.message);
        }
        setSettingModel(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Brain className="absolute inset-0 m-auto w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Loading model metrics...</p>
                </div>
            </div>
        );
    }

    const models = data ? Object.values(data.models) : [];
    const sortedByAccuracy = [...models].sort((a, b) => b.accuracy - a.accuracy);

    // Chart data
    const comparisonData = sortedByAccuracy.map(m => ({
        name: m.model_name.length > 12 ? m.model_name.substring(0, 12) + '…' : m.model_name,
        fullName: m.model_name,
        Accuracy: m.accuracy,
        Precision: m.precision,
        Recall: m.recall,
        "F1 Score": m.f1_score,
        "ROC-AUC": m.roc_auc
    }));

    const radarData = data ? [
        { metric: "Accuracy", ...Object.fromEntries(models.map(m => [m.model_name, m.accuracy])) },
        { metric: "Precision", ...Object.fromEntries(models.map(m => [m.model_name, m.precision])) },
        { metric: "Recall", ...Object.fromEntries(models.map(m => [m.model_name, m.recall])) },
        { metric: "F1 Score", ...Object.fromEntries(models.map(m => [m.model_name, m.f1_score])) },
        { metric: "ROC-AUC", ...Object.fromEntries(models.map(m => [m.model_name, m.roc_auc])) }
    ] : [];

    const confusionModel = selectedConfusion
        ? models.find(m => m.model_name === selectedConfusion)
        : sortedByAccuracy[0];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative">
            <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>

            {/* Nav */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 rounded-md transition-transform group-hover:scale-105 shadow-sm">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">Insta<span className="text-indigo-600">Trust</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wide">
                            Home
                        </Link>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <button
                            onClick={handleRetrain}
                            disabled={retraining}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors premium-shadow"
                        >
                            <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
                            {retraining ? 'Retraining...' : 'Retrain All Models'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-6 py-8 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">

                    {/* Header */}
                    <motion.div variants={itemVariants} className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Machine Learning Performance</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">Model Metrics Dashboard</h1>
                        {data && (
                            <p className="text-sm text-slate-500">
                                Last trained: {data.trained_at} • {models.length} algorithms • {models[0]?.dataset_info.total_samples.toLocaleString()} samples
                            </p>
                        )}
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div variants={itemVariants} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-amber-800">{error}</p>
                                <button onClick={handleRetrain} disabled={retraining} className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-800 underline">
                                    {retraining ? 'Training in progress...' : 'Click here to train now'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {data && (
                        <>
                            {/* KPI Cards */}
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Best Model</span>
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="text-lg font-bold tracking-tight text-slate-900">{data.best_model}</div>
                                    <div className="text-xs text-emerald-600 font-semibold mt-1">{data.best_accuracy}% accuracy</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Model</span>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="text-lg font-bold tracking-tight text-slate-900">{activeModel}</div>
                                    <div className="text-xs text-indigo-600 font-semibold mt-1">Used for predictions</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Models Trained</span>
                                        <Brain className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="text-3xl font-bold tracking-tight text-slate-900">{models.length}</div>
                                    <div className="text-xs text-slate-500 font-semibold mt-1">Algorithms</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dataset Size</span>
                                        <Activity className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="text-3xl font-bold tracking-tight text-slate-900">
                                        {models[0]?.dataset_info.total_samples.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500 font-semibold mt-1">
                                        {models[0]?.dataset_info.fraud_count} fraud • {models[0]?.dataset_info.non_fraud_count} legit
                                    </div>
                                </div>
                            </motion.div>

                            {/* Comparison Table */}
                            <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl premium-shadow overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h2 className="text-lg font-bold tracking-tight">Algorithm Comparison</h2>
                                    <p className="text-xs text-slate-500 mt-1">Click &quot;Use&quot; to select a model for fraud prediction</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Model</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Accuracy</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Precision</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Recall</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">F1 Score</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">ROC-AUC</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Time</th>
                                                <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedByAccuracy.map((m, i) => (
                                                <tr key={m.model_name} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${m.model_name === activeModel ? 'bg-indigo-50/50' : ''}`}>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: MODEL_COLORS[m.model_name] || '#6366f1' }}></div>
                                                            <div>
                                                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                                    {m.model_name}
                                                                    {i === 0 && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                                                                    {m.model_name === activeModel && (
                                                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold uppercase">Active</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center px-4 py-4 font-bold text-slate-900">{m.accuracy}%</td>
                                                    <td className="text-center px-4 py-4 text-slate-700">{m.precision}%</td>
                                                    <td className="text-center px-4 py-4 text-slate-700">{m.recall}%</td>
                                                    <td className="text-center px-4 py-4 text-slate-700">{m.f1_score}%</td>
                                                    <td className="text-center px-4 py-4 text-slate-700">{m.roc_auc}%</td>
                                                    <td className="text-center px-4 py-4 text-slate-500">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {m.training_time_seconds}s
                                                        </div>
                                                    </td>
                                                    <td className="text-center px-4 py-4">
                                                        {m.model_name === activeModel ? (
                                                            <span className="text-xs text-emerald-600 font-semibold">In Use</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSetActiveModel(m.model_name)}
                                                                disabled={settingModel}
                                                                className="text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Use
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Accuracy Comparison</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                                formatter={(value: number) => [`${value}%`]}
                                                labelFormatter={(label) => {
                                                    const item = comparisonData.find(d => d.name === label);
                                                    return item?.fullName || label;
                                                }}
                                            />
                                            <Bar dataKey="Accuracy" radius={[6, 6, 0, 0]}>
                                                {comparisonData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={MODEL_COLORS[entry.fullName] || '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </motion.div>

                                {/* Radar Chart */}
                                <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Multi-Metric Radar (Top 3)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RadarChart data={radarData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                                            {sortedByAccuracy.slice(0, 3).map((m) => (
                                                <Radar
                                                    key={m.model_name}
                                                    name={m.model_name}
                                                    dataKey={m.model_name}
                                                    stroke={MODEL_COLORS[m.model_name] || '#6366f1'}
                                                    fill={MODEL_COLORS[m.model_name] || '#6366f1'}
                                                    fillOpacity={0.1}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            </div>

                            {/* All Metrics Bar Chart */}
                            <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Full Metrics Comparison</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                            formatter={(value: number) => [`${value}%`]}
                                            labelFormatter={(label) => {
                                                const item = comparisonData.find(d => d.name === label);
                                                return item?.fullName || label;
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        <Bar dataKey="Accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="F1 Score" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="ROC-AUC" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Confusion Matrix */}
                            <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-5 premium-shadow">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Confusion Matrix</h3>
                                        <p className="text-xs text-slate-500 mt-1">Select a model to view its confusion matrix</p>
                                    </div>
                                    <select
                                        value={selectedConfusion || sortedByAccuracy[0]?.model_name || ""}
                                        onChange={e => setSelectedConfusion(e.target.value)}
                                        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {sortedByAccuracy.map(m => (
                                            <option key={m.model_name} value={m.model_name}>{m.model_name}</option>
                                        ))}
                                    </select>
                                </div>
                                {confusionModel && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                        {/* Matrix Grid */}
                                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
                                            <div className="text-center"></div>
                                            <div className="col-span-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Predicted</div>
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">True Negative</div>
                                                <div className="text-3xl font-bold text-emerald-700">{confusionModel.confusion_matrix.true_negative}</div>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mt-2" />
                                            </div>
                                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center">
                                                <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">False Positive</div>
                                                <div className="text-3xl font-bold text-rose-700">{confusionModel.confusion_matrix.false_positive}</div>
                                                <XCircle className="w-4 h-4 text-rose-500 mx-auto mt-2" />
                                            </div>
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                                                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">False Negative</div>
                                                <div className="text-3xl font-bold text-amber-700">{confusionModel.confusion_matrix.false_negative}</div>
                                                <XCircle className="w-4 h-4 text-amber-500 mx-auto mt-2" />
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">True Positive</div>
                                                <div className="text-3xl font-bold text-emerald-700">{confusionModel.confusion_matrix.true_positive}</div>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mt-2" />
                                            </div>
                                        </div>
                                        {/* Per-Class Metrics */}
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Non-Fraud (Class 0)</h4>
                                                <div className="grid grid-cols-3 gap-3 text-center">
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.non_fraud.precision}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Precision</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.non_fraud.recall}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Recall</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.non_fraud.f1_score}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">F1</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3">Fraud (Class 1)</h4>
                                                <div className="grid grid-cols-3 gap-3 text-center">
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.fraud.precision}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Precision</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.fraud.recall}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Recall</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-slate-900">{confusionModel.classification_report.fraud.f1_score}%</div>
                                                        <div className="text-[10px] text-slate-500 font-semibold uppercase">F1</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Per-Model Cards */}
                            <motion.div variants={itemVariants}>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Individual Model Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {sortedByAccuracy.map((m, i) => (
                                        <div
                                            key={m.model_name}
                                            className={`bg-white border rounded-2xl p-5 premium-shadow transition-all hover:scale-[1.02] ${m.model_name === activeModel ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'}`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MODEL_COLORS[m.model_name] || '#6366f1' }}></div>
                                                    <span className="font-bold text-sm text-slate-900">{m.model_name}</span>
                                                </div>
                                                {i === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                                            </div>
                                            <div className="text-3xl font-bold tracking-tight text-slate-900 mb-3">{m.accuracy}%</div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Precision</span>
                                                    <span className="font-semibold text-slate-700">{m.precision}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Recall</span>
                                                    <span className="font-semibold text-slate-700">{m.recall}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">F1 Score</span>
                                                    <span className="font-semibold text-slate-700">{m.f1_score}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">ROC-AUC</span>
                                                    <span className="font-semibold text-slate-700">{m.roc_auc}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Train Time</span>
                                                    <span className="font-semibold text-slate-700">{m.training_time_seconds}s</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSetActiveModel(m.model_name)}
                                                disabled={settingModel || m.model_name === activeModel}
                                                className={`w-full mt-4 text-xs font-semibold py-2 rounded-lg transition-colors ${m.model_name === activeModel
                                                    ? 'bg-indigo-100 text-indigo-700 cursor-default'
                                                    : 'bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600'
                                                    }`}
                                            >
                                                {m.model_name === activeModel ? '✓ Active Model' : 'Select This Model'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}

                    <motion.footer variants={itemVariants} className="pt-8 pb-6 text-center border-t border-slate-200 mt-8">
                        <p className="text-xs text-slate-500 font-semibold tracking-wide">© 2026 InstaTrust Enterprise • AI Security Verification</p>
                    </motion.footer>
                </motion.div>
            </main>
        </div>
    );
}
