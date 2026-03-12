import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Radar, ShieldCheck, ChevronRight } from 'lucide-react';
import Input from '../components/common/Input';

const riskLevels = {
    Low: { dot: 'bg-safe', ring: 'ring-safe/30', text: 'text-safe', badge: 'bg-safe/10 border-safe/30', label: 'Low Risk' },
    Moderate: { dot: 'bg-warning', ring: 'ring-warning/30', text: 'text-warning', badge: 'bg-warning/10 border-warning/30', label: 'Moderate' },
    High: { dot: 'bg-danger', ring: 'ring-danger/30', text: 'text-danger', badge: 'bg-danger/10 border-danger/30', label: 'High Risk' },
};

const mockNearby = {
    downtown: [
        { name: 'Financial District', risk: 'High', density: 82, distance: '0.3km' },
        { name: 'Old Market', risk: 'High', density: 75, distance: '0.6km' },
        { name: 'Civic Center', risk: 'Moderate', density: 55, distance: '0.9km' },
        { name: 'Arts Quarter', risk: 'Moderate', density: 48, distance: '1.1km' },
        { name: 'Station Row', risk: 'Moderate', density: 51, distance: '1.4km' },
        { name: 'Parkside', risk: 'Low', density: 19, distance: '1.7km' },
    ],
    northside: [
        { name: 'Greenfield', risk: 'Low', density: 11, distance: '0.4km' },
        { name: 'Lakewood', risk: 'Low', density: 15, distance: '0.7km' },
        { name: 'Garden View', risk: 'Low', density: 20, distance: '1.0km' },
        { name: 'Bell Avenue', risk: 'Moderate', density: 38, distance: '1.3km' },
        { name: 'North Hub', risk: 'Moderate', density: 46, distance: '1.6km' },
        { name: 'Crossroads', risk: 'High', density: 63, distance: '2.1km' },
    ],
};

const defaultNearby = (base) => [
    { name: `${base} North`, risk: 'Low', density: Math.floor(Math.random() * 20) + 5, distance: '0.3km' },
    { name: `${base} East`, risk: 'Moderate', density: Math.floor(Math.random() * 25) + 35, distance: '0.7km' },
    { name: `${base} South`, risk: 'High', density: Math.floor(Math.random() * 20) + 60, distance: '1.0km' },
    { name: `${base} West`, risk: 'Low', density: Math.floor(Math.random() * 15) + 8, distance: '1.2km' },
    { name: `${base} Central`, risk: 'Moderate', density: Math.floor(Math.random() * 20) + 40, distance: '1.5km' },
    { name: `${base} Outer`, risk: 'Low', density: Math.floor(Math.random() * 10) + 5, distance: '2.0km' },
];

const suggestions = ['Downtown', 'Northside', 'Midtown'];

export default function NearbyScanner() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState(null);
    const [centerName, setCenterName] = useState('');

    const handleScan = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        setLoading(true);
        setTimeout(() => {
            const key = q.toLowerCase().replace(/\s+/g, '');
            const data = mockNearby[key] || defaultNearby(q);
            setAreas(data);
            setCenterName(q);
            setLoading(false);
        }, 1300);
    };

    const riskCounts = areas ? {
        Low: areas.filter(a => a.risk === 'Low').length,
        Moderate: areas.filter(a => a.risk === 'Moderate').length,
        High: areas.filter(a => a.risk === 'High').length,
    } : null;

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Radar size={14} /> Nearby Risk Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Nearby <span className="text-neon-teal">Risk Scanner</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Enter your location to scan nearby areas and see their individual risk levels.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleScan} className="flex gap-3 mb-8">
                    <div className="flex-1">
                        <Input placeholder="Enter your area…" icon={MapPin} value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading
                            ? <span className="w-5 h-5 border-2 border-deep-navy/40 border-t-deep-navy rounded-full animate-spin" />
                            : <Search size={18} />
                        }
                        Scan
                    </button>
                </form>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-neon-teal hover:border-neon-teal/30 transition-all text-xs flex items-center gap-1"
                        >
                            <ChevronRight size={10} /> {s}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {areas && (
                        <motion.div key={centerName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Summary bar */}
                            <div className="glass-panel rounded-xl border border-white/5 p-4 mb-6 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-neon-teal" />
                                    <span className="text-white font-semibold">Scanning from: <span className="text-neon-teal">{centerName}</span></span>
                                </div>
                                <div className="flex gap-4 ml-auto">
                                    <span className="flex items-center gap-1.5 text-sm text-safe"><span className="w-3 h-3 rounded-full bg-safe" /> {riskCounts.Low} Low</span>
                                    <span className="flex items-center gap-1.5 text-sm text-warning"><span className="w-3 h-3 rounded-full bg-warning" /> {riskCounts.Moderate} Moderate</span>
                                    <span className="flex items-center gap-1.5 text-sm text-danger"><span className="w-3 h-3 rounded-full bg-danger" /> {riskCounts.High} High</span>
                                </div>
                            </div>

                            {/* Visual radar grid */}
                            <div className="relative mb-8">
                                {/* Fake radar rings */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 hidden md:flex">
                                    <div className="w-96 h-96 rounded-full border border-neon-teal absolute" />
                                    <div className="w-64 h-64 rounded-full border border-neon-teal absolute" />
                                    <div className="w-32 h-32 rounded-full border border-neon-teal absolute" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {areas.map((area, i) => {
                                        const cfg = riskLevels[area.risk];
                                        return (
                                            <motion.div key={area.name}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.07 }}
                                                className={`glass-panel rounded-xl p-4 border ${cfg.badge} hover:scale-105 transition-transform duration-200`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.badge} ${cfg.text}`}>
                                                        <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                                                        {cfg.label}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{area.distance}</span>
                                                </div>
                                                <h4 className="text-white font-semibold mb-2">{area.name}</h4>
                                                <div>
                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                        <span>Crime Density</span>
                                                        <span className={cfg.text}>{area.density}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${area.density}%` }}
                                                            transition={{ duration: 0.7, delay: i * 0.07 + 0.3 }}
                                                            className={`h-full rounded-full ${cfg.dot}`}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-6 text-sm">
                                <span className="flex items-center gap-2 text-safe"><span className="w-3 h-3 rounded-full bg-safe" /> Low Risk</span>
                                <span className="flex items-center gap-2 text-warning"><span className="w-3 h-3 rounded-full bg-warning" /> Moderate Risk</span>
                                <span className="flex items-center gap-2 text-danger"><span className="w-3 h-3 rounded-full bg-danger" /> High Risk</span>
                            </div>
                        </motion.div>
                    )}

                    {!areas && !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                        >
                            <Radar size={52} className="mb-4 opacity-30 text-neon-teal" />
                            <p>Enter your location to scan nearby risk levels</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Risk zones based on aggregated historical crime density. No real-time tracking.
                </p>
            </div>
        </div>
    );
}
