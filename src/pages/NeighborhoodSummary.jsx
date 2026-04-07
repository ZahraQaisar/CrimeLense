import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Search, FileText, ShieldCheck, AlertTriangle,
    TrendingUp, TrendingDown, Minus, ChevronRight, LogIn, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

// No raw incident counts — percentage-change language only
// No crime type breakdown tables — removed per security rules
const mockData = {
    downtown: { label: 'HIGH RISK', trend: 'Worsening', change: '+8% compared to last quarter' },
    midtown: { label: 'MODERATE RISK', trend: 'Stable', change: 'No significant change from last quarter' },
    northside: { label: 'SAFE', trend: 'Improving', change: 'Incidents decreased 22% compared to last quarter' },
    eastgate: { label: 'MODERATE RISK', trend: 'Stable', change: 'Incidents stable compared to last quarter' },
    westbrook: { label: 'LOW RISK', trend: 'Improving', change: 'Incidents decreased 12% compared to last quarter' },
    riverside: { label: 'LOW RISK', trend: 'Stable', change: 'No significant change from last quarter' },
};

const LABELS_CONFIG = {
    'SAFE': { color: '#14F1D9', Icon: ShieldCheck },
    'LOW RISK': { color: '#22D3EE', Icon: ShieldCheck },
    'MODERATE RISK': { color: '#F59E0B', Icon: AlertTriangle },
    'HIGH RISK': { color: '#FF4D4D', Icon: AlertTriangle },
};

const TREND_CONFIG = {
    Improving: { icon: TrendingDown, color: '#14F1D9' },
    Stable: { icon: Minus, color: '#F59E0B' },
    Worsening: { icon: TrendingUp, color: '#FF4D4D' },
};

const suggestions = ['Downtown', 'Midtown', 'Northside', 'Eastgate', 'Westbrook', 'Riverside'];

export default function NeighborhoodSummary() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [areaName, setAreaName] = useState('');

    // Login gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass-panel rounded-2xl border border-white/10 p-10 text-center max-w-md">
                    <LogIn size={48} className="text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-gray-400 text-sm mb-6">The Neighborhood Safety Report requires authentication. Please log in to continue.</p>
                    <button onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                    >Log In</button>
                </div>
            </div>
        );
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        setLoading(true);
        setTimeout(() => {
            const key = q.toLowerCase().replace(/\s+/g, '');
            const found = mockData[key];
            if (found) {
                setResult(found);
            } else {
                const trends = ['Improving', 'Stable', 'Worsening'];
                const labels = ['SAFE', 'LOW RISK', 'MODERATE RISK', 'HIGH RISK'];
                const seed = key.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
                setResult({
                    label: labels[seed % 4],
                    trend: trends[seed % 3],
                    change: seed % 2 === 0 ? 'Incidents decreased 9% compared to last quarter' : 'Incidents increased 5% compared to last quarter',
                });
            }
            setAreaName(q);
            setLoading(false);
        }, 1300);
    };

    const cfg = result ? LABELS_CONFIG[result.label] : null;
    const trendCfg = result ? TREND_CONFIG[result.trend] : null;

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <FileText size={14} /> Neighborhood Summary
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Neighborhood <span className="text-neon-teal">Safety Report</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Search any neighborhood to generate a safety summary based on historical data.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <div className="flex-1">
                        <Input placeholder="Enter neighborhood name…" icon={MapPin} value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <span className="w-5 h-5 border-2 border-deep-navy/40 border-t-deep-navy rounded-full animate-spin" /> : <Search size={18} />}
                        Generate
                    </button>
                </form>

                {/* Quick picks */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-neon-teal hover:border-neon-teal/30 transition-all text-xs flex items-center gap-1"
                        >
                            <ChevronRight size={10} /> {s}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {result && cfg && trendCfg && (
                        <motion.div key={areaName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Top Disclaimer */}
                            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-2 mb-6">
                                <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    This report is based on historical aggregated data. It does not reflect the full character of any community and must not be used for discriminatory purposes.
                                </p>
                            </div>

                            <div className="glass-panel rounded-2xl overflow-hidden" style={{ borderColor: `${cfg.color}40`, borderWidth: 1 }}>
                                {/* Color stripe */}
                                <div className="h-1 w-full" style={{ backgroundColor: cfg.color }} />

                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white capitalize">{areaName}</h2>
                                            <p className="text-gray-500 text-sm mt-0.5">Neighborhood Safety Report</p>
                                        </div>
                                        <span className="px-4 py-1.5 rounded-full font-bold text-sm"
                                            style={{ backgroundColor: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                                        >
                                            {result.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Risk Category */}
                                        <div className="bg-white/5 rounded-xl p-5">
                                            <div className="text-gray-400 text-xs mb-2">Safety Level</div>
                                            <div className="flex items-center gap-2">
                                                <cfg.Icon size={22} style={{ color: cfg.color }} />
                                                <span className="text-xl font-black" style={{ color: cfg.color }}>{result.label}</span>
                                            </div>
                                        </div>

                                        {/* Trend */}
                                        <div className="bg-white/5 rounded-xl p-5">
                                            <div className="text-gray-400 text-xs mb-2">3-Month Trend</div>
                                            <div className="flex items-center gap-2 font-bold" style={{ color: trendCfg.color }}>
                                                <trendCfg.icon size={18} />
                                                {result.trend}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Change summary — percentage-change language, no raw counts */}
                                    <div className="bg-white/5 rounded-xl p-5">
                                        <div className="text-gray-400 text-xs mb-2">Quarter-over-Quarter Change</div>
                                        <p className="text-white text-sm font-medium">{result.change}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom disclaimer */}
                            <div className="mt-6 p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2">
                                <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {!result && !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                        >
                            <FileText size={52} className="mb-4 opacity-30" />
                            <p>Search a neighborhood to generate its safety report</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Only aggregated historical statistics. No personal data included.
                </p>
            </div>
        </div>
    );
}
