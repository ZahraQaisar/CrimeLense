import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Search, ShieldAlert, ShieldCheck, AlertTriangle,
    TrendingUp, TrendingDown, Minus, ChevronRight, Info
} from 'lucide-react';
import Input from '../components/common/Input';

const LABELS = ['SAFE', 'LOW RISK', 'MODERATE RISK', 'HIGH RISK'];
const LABEL_CONFIG = {
    'SAFE': { color: '#14F1D9', Icon: ShieldCheck, explanation: 'This area shows consistently low crime activity over the past quarter.' },
    'LOW RISK': { color: '#22D3EE', Icon: ShieldCheck, explanation: 'Crime levels are below the city average. Standard safety precautions apply.' },
    'MODERATE RISK': { color: '#F59E0B', Icon: AlertTriangle, explanation: 'Some crime activity has been noted. Stay aware of your surroundings, especially at night.' },
    'HIGH RISK': { color: '#FF4D4D', Icon: ShieldAlert, explanation: 'Above-average crime activity recorded. Avoid poorly lit areas and travel in groups.' },
};

const TREND_CONFIG = {
    Improving: { icon: TrendingDown, color: '#14F1D9', text: 'Improving' },
    Stable: { icon: Minus, color: '#F59E0B', text: 'Stable' },
    Worsening: { icon: TrendingUp, color: '#FF4D4D', text: 'Worsening' },
};

const mockResults = {
    'downtown': { label: 'HIGH RISK', trend: 'Stable' },
    'midtown': { label: 'MODERATE RISK', trend: 'Improving' },
    'northside': { label: 'SAFE', trend: 'Improving' },
    'eastgate': { label: 'MODERATE RISK', trend: 'Worsening' },
    'westbrook': { label: 'LOW RISK', trend: 'Stable' },
    'riverside': { label: 'SAFE', trend: 'Improving' },
};

export default function CrimeRiskScore() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setTimeout(() => {
            const key = query.toLowerCase().replace(/\s+/g, '');
            const found = mockResults[key];
            if (found) {
                setResult(found);
            } else {
                const seed = key.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
                const idx = seed % LABELS.length;
                const trends = ['Improving', 'Stable', 'Worsening'];
                setResult({ label: LABELS[idx], trend: trends[seed % 3] });
            }
            setLoading(false);
        }, 1400);
    };

    const cfg = result ? LABEL_CONFIG[result.label] : null;
    const trendCfg = result ? TREND_CONFIG[result.trend] : null;

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <ShieldAlert size={14} /> Crime Risk Score
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Area <span className="text-neon-teal">Risk Level</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Search any zone to get a safety category based on historical crime data.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="e.g. Downtown, Midtown, Northside…"
                            icon={MapPin}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-deep-navy/40 border-t-deep-navy rounded-full animate-spin" />
                        ) : (
                            <Search size={18} />
                        )}
                        Analyze
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {result && cfg && trendCfg && (
                        <motion.div
                            key={query}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Risk Card — category label + trend (no numbers) */}
                            <div className="glass-panel rounded-2xl p-8" style={{ borderColor: `${cfg.color}40`, borderWidth: 1 }}>
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Category Ring */}
                                    <div className="relative flex items-center justify-center w-44 h-44 shrink-0 rounded-full border-4"
                                        style={{ borderColor: cfg.color, backgroundColor: `${cfg.color}08` }}
                                    >
                                        <div className="text-center px-3">
                                            <cfg.Icon size={26} style={{ color: cfg.color }} className="mx-auto mb-1" />
                                            <div className="text-sm font-black tracking-wide leading-tight break-words text-center" style={{ color: cfg.color, maxWidth: '7.5rem' }}>
                                                {result.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                                            <h2 className="text-2xl font-bold text-white capitalize">{query || 'Area'}</h2>
                                            <span className="px-3 py-1 rounded-full text-sm font-bold"
                                                style={{ backgroundColor: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                                            >
                                                {result.label}
                                            </span>
                                        </div>

                                        {/* One-line explanation */}
                                        <p className="text-gray-400 text-sm mb-5 leading-relaxed">{cfg.explanation}</p>

                                        {/* Trend indicator */}
                                        <div className="bg-white/5 rounded-xl p-4 inline-flex items-center gap-3">
                                            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">3-Month Trend</div>
                                            <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: trendCfg.color }}>
                                                <trendCfg.icon size={16} />
                                                {trendCfg.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mandatory Disclaimer */}
                            <div className="p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2">
                                <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose.
                                </p>
                            </div>

                            <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1">
                                <ShieldCheck size={12} /> Aggregated historical data only. No exact locations or personal data exposed.
                            </p>
                        </motion.div>
                    )}

                    {!result && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-gray-600"
                        >
                            <Search size={52} className="mb-4 opacity-30" />
                            <p>Search a location to view its crime risk level</p>
                            <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                {['Downtown', 'Midtown', 'Northside', 'Eastgate'].map(s => (
                                    <button key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-neon-teal hover:border-neon-teal/30 transition-all text-sm flex items-center gap-1"
                                    >
                                        <ChevronRight size={12} /> {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
