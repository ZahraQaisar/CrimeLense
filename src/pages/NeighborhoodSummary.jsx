import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Search, FileText, ShieldCheck, ShieldAlert, AlertTriangle,
    Clock, TrendingUp, TrendingDown, Minus, ChevronRight
} from 'lucide-react';
import Input from '../components/common/Input';

const mockData = {
    downtown: { risk: 74, crimes: ['Street Theft', 'Assault', 'Vandalism'], peakHours: '10PM–2AM', trend: 'Increasing', crimeCount: 312 },
    midtown: { risk: 49, crimes: ['Pickpocketing', 'Burglary'], peakHours: '6PM–10PM', trend: 'Stable', crimeCount: 189 },
    northside: { risk: 18, crimes: ['Minor Vandalism'], peakHours: '11PM–1AM', trend: 'Decreasing', crimeCount: 42 },
    eastgate: { risk: 61, crimes: ['Vehicle Theft', 'Robbery'], peakHours: '8PM–12AM', trend: 'Stable', crimeCount: 228 },
    westbrook: { risk: 22, crimes: ['Vandalism'], peakHours: '10PM–12AM', trend: 'Decreasing', crimeCount: 55 },
    riverside: { risk: 35, crimes: ['Theft', 'Trespassing'], peakHours: '7PM–11PM', trend: 'Stable', crimeCount: 128 },
};

const suggestions = ['Downtown', 'Midtown', 'Northside', 'Eastgate', 'Westbrook', 'Riverside'];

const TrendDisplay = ({ trend }) => {
    if (trend === 'Increasing') return (
        <span className="flex items-center gap-1 text-danger font-semibold"><TrendingUp size={14} /> Increasing</span>
    );
    if (trend === 'Decreasing') return (
        <span className="flex items-center gap-1 text-safe font-semibold"><TrendingDown size={14} /> Decreasing</span>
    );
    return <span className="flex items-center gap-1 text-warning font-semibold"><Minus size={14} /> Stable</span>;
};

const riskLabel = (score) => score < 40 ? 'Low' : score < 65 ? 'Moderate' : 'High';
const riskColors = {
    Low: { text: 'text-safe', border: 'border-safe/30', bg: 'bg-safe/10' },
    Moderate: { text: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10' },
    High: { text: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/10' },
};

export default function NeighborhoodSummary() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [areaName, setAreaName] = useState('');

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
                const risk = Math.floor(Math.random() * 75) + 10;
                setResult({
                    risk,
                    crimes: ['Theft', 'Assault'],
                    peakHours: '9PM–1AM',
                    trend: ['Increasing', 'Stable', 'Decreasing'][Math.floor(Math.random() * 3)],
                    crimeCount: Math.floor(Math.random() * 300) + 50,
                });
            }
            setAreaName(q);
            setLoading(false);
        }, 1300);
    };

    const pick = (name) => { setQuery(name); };

    const cfg = result ? riskColors[riskLabel(result.risk)] : null;

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
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
                        Search any neighborhood to generate a comprehensive safety report based on historical data.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Enter neighborhood name…"
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
                        ) : <Search size={18} />}
                        Generate
                    </button>
                </form>

                {/* Quick picks */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => pick(s)}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-neon-teal hover:border-neon-teal/30 transition-all text-xs flex items-center gap-1"
                        >
                            <ChevronRight size={10} /> {s}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {result && cfg && (
                        <motion.div
                            key={areaName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`glass-panel rounded-2xl border ${cfg.border} overflow-hidden`}
                        >
                            {/* Color stripe */}
                            <div className={`h-1 w-full ${result.risk < 40 ? 'bg-safe' : result.risk < 65 ? 'bg-warning' : 'bg-danger'}`} />

                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{areaName}</h2>
                                        <p className="text-gray-500 text-sm mt-0.5">Neighborhood Safety Report</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                        {riskLabel(result.risk)} Risk
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {/* Risk Score */}
                                    <div className="bg-white/5 rounded-xl p-4 col-span-2 md:col-span-1">
                                        <div className="text-gray-400 text-xs mb-1">Risk Score</div>
                                        <div className={`text-3xl font-black ${cfg.text}`}>{result.risk}<span className="text-lg text-gray-500">/100</span></div>
                                    </div>
                                    {/* Crime Count */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-gray-400 text-xs mb-1">Incidents/Year</div>
                                        <div className="text-2xl font-bold text-white">{result.crimeCount}</div>
                                    </div>
                                    {/* Peak hours */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-gray-400 text-xs mb-1 flex items-center gap-1"><Clock size={11} /> Peak Hours</div>
                                        <div className="text-white font-semibold text-sm mt-1">{result.peakHours}</div>
                                    </div>
                                    {/* Trend */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-gray-400 text-xs mb-1 flex items-center gap-1"><TrendingUp size={11} /> Trend</div>
                                        <div className="mt-1 text-sm"><TrendDisplay trend={result.trend} /></div>
                                    </div>
                                </div>

                                {/* Common Crimes */}
                                <div className="bg-white/5 rounded-xl p-5">
                                    <h4 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-1">
                                        <ShieldAlert size={14} /> Most Common Crime Types
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.crimes.map((c, i) => (
                                            <span key={c}
                                                className={`px-3 py-1 rounded-full text-sm font-medium border ${i === 0 ? 'bg-danger/10 text-danger border-danger/20' :
                                                        i === 1 ? 'bg-warning/10 text-warning border-warning/20' :
                                                            'bg-white/5 text-gray-300 border-white/10'
                                                    }`}
                                            >{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!result && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
