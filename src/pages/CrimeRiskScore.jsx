import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Search, ShieldAlert, ShieldCheck, AlertTriangle,
    Clock, TrendingUp, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import Input from '../components/common/Input';

const mockResults = {
    'downtown': { score: 72, level: 'High', crimes: ['Street Theft', 'Assault', 'Vandalism'], peakHours: '10PM–2AM', trend: 'Increasing' },
    'midtown': { score: 48, level: 'Moderate', crimes: ['Burglary', 'Pickpocketing'], peakHours: '6PM–10PM', trend: 'Stable' },
    'northside': { score: 21, level: 'Low', crimes: ['Minor Vandalism'], peakHours: '11PM–1AM', trend: 'Decreasing' },
    'eastgate': { score: 61, level: 'Moderate', crimes: ['Vehicle Theft', 'Robbery'], peakHours: '8PM–12AM', trend: 'Stable' },
};

const hourlyData = [
    { hour: '6AM', risk: 12 }, { hour: '9AM', risk: 18 }, { hour: '12PM', risk: 25 },
    { hour: '3PM', risk: 32 }, { hour: '6PM', risk: 55 }, { hour: '9PM', risk: 78 },
    { hour: '12AM', risk: 91 }, { hour: '3AM', risk: 60 },
];

const levelConfig = {
    Low: { color: '#14F1D9', bg: 'bg-safe/10', border: 'border-safe/30', text: 'text-safe', Icon: ShieldCheck },
    Moderate: { color: '#F59E0B', bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', Icon: AlertTriangle },
    High: { color: '#FF4D4D', bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', Icon: ShieldAlert },
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
                const score = Math.floor(Math.random() * 80) + 10;
                setResult({
                    score,
                    level: score < 40 ? 'Low' : score < 65 ? 'Moderate' : 'High',
                    crimes: ['Street Theft', 'Vandalism'],
                    peakHours: '9PM–1AM',
                    trend: 'Stable',
                });
            }
            setLoading(false);
        }, 1400);
    };

    const cfg = result ? levelConfig[result.level] : null;

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <ShieldAlert size={14} /> Crime Risk Score
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Area <span className="text-neon-teal">Risk Score</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Search any location to get an AI-calculated crime risk score based on historical patterns.
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
                    {result && cfg && (
                        <motion.div
                            key={query}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Score Card */}
                            <div className={`glass-panel rounded-2xl border ${cfg.border} p-8`}>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                    {/* Circular Score */}
                                    <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
                                        <svg className="absolute" width="160" height="160" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                            <circle
                                                cx="80" cy="80" r="65" fill="none"
                                                stroke={cfg.color}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(result.score / 100) * 408} 408`}
                                                strokeDashoffset="102"
                                                style={{ filter: `drop-shadow(0 0 8px ${cfg.color})` }}
                                            />
                                        </svg>
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-white">{result.score}</div>
                                            <div className="text-xs text-gray-400">/ 100</div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <cfg.Icon className={cfg.text} size={22} />
                                            <h2 className="text-2xl font-bold text-white">{query || 'Area'}</h2>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                                {result.level} Risk
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                                    <ShieldAlert size={12} /> Common Crimes
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {result.crimes.map(c => (
                                                        <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                                    <Clock size={12} /> Peak Hours
                                                </div>
                                                <div className="text-white font-bold mt-2">{result.peakHours}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                                    <TrendingUp size={12} /> Trend
                                                </div>
                                                <div className={`font-bold mt-2 ${result.trend === 'Increasing' ? 'text-danger' : result.trend === 'Decreasing' ? 'text-safe' : 'text-warning'}`}>
                                                    {result.trend}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Peak Hours Chart */}
                            <div className="glass-panel rounded-2xl border border-white/5 p-6">
                                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                                    <Clock size={18} className="text-neon-teal" /> Hourly Risk Distribution
                                </h3>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={hourlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="hour" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                            <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '10px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="risk" name="Risk Level" fill={cfg.color} radius={[4, 4, 0, 0]}
                                                style={{ filter: `drop-shadow(0 0 4px ${cfg.color}40)` }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Ethics notice */}
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
                            <p>Search a location to view its crime risk score</p>
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
