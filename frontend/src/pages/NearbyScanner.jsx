import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Radar, ShieldCheck, ChevronRight, Info, LogIn, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { AREA_NAMES } from '../constants/areas';

const riskLevels = {
    Low: { dot: 'bg-safe', text: 'text-safe', badge: 'bg-safe/10 border-safe/30', label: 'Low Risk' },
    Moderate: { dot: 'bg-warning', text: 'text-warning', badge: 'bg-warning/10 border-warning/30', label: 'Moderate' },
    High: { dot: 'bg-danger', text: 'text-danger', badge: 'bg-danger/10 border-danger/30', label: 'High Risk' },
};

// Zone-level only (no street names / block detail)
const mockNearby = {
    central: [
        { zone: 'Central Business Zone', risk: 'High', distance: '0.5km' },
        { zone: 'Market District', risk: 'Moderate', distance: '0.8km' },
        { zone: 'Arts Quarter Zone', risk: 'Moderate', distance: '1.2km' },
        { zone: 'Parkside Zone', risk: 'Low', distance: '1.6km' },
        { zone: 'University Zone', risk: 'Low', distance: '2.0km' },
    ],
    hollywood: [
        { zone: 'Sunset Strip Zone', risk: 'Moderate', distance: '0.6km' },
        { zone: 'Walk of Fame Zone', risk: 'High', distance: '0.9km' },
        { zone: 'Hollywood Hills Zone', risk: 'Low', distance: '1.3km' },
        { zone: 'Franklin Village Zone', risk: 'Low', distance: '1.7km' },
    ],
};

const defaultNearby = (base) => [
    { zone: `${base} North Zone`, risk: 'Low', distance: '0.5km' },
    { zone: `${base} East Zone`, risk: 'Moderate', distance: '0.9km' },
    { zone: `${base} South Zone`, risk: 'High', distance: '1.2km' },
    { zone: `${base} West Zone`, risk: 'Low', distance: '1.6km' },
    { zone: `${base} Central Zone`, risk: 'Moderate', distance: '2.0km' },
];

const MAX_DAILY_SCANS = 5;
const MAX_RADIUS_KM = 2;

// Data delay date (30 days ago)
const getDelayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function NearbyScanner() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState(null);
    const [centerName, setCenterName] = useState('');
    const scanCount = useRef(0);

    // Login gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass-panel rounded-2xl border border-white/10 p-10 text-center max-w-md">
                    <LogIn size={48} className="text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-gray-400 text-sm mb-6">The Nearby Risk Scanner requires authentication to access. Please log in to continue.</p>
                    <button onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                    >Log In</button>
                </div>
            </div>
        );
    }

    const isLimitReached = scanCount.current >= MAX_DAILY_SCANS;

    const handleScan = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q || isLimitReached) return;

        setLoading(true);
        scanCount.current += 1;

        setTimeout(() => {
            const key = q.toLowerCase().replace(/\s+/g, '');
            // Filter results to max 2km radius
            const raw = mockNearby[key] || defaultNearby(q);
            const filtered = raw.filter(a => parseFloat(a.distance) <= MAX_RADIUS_KM);
            setAreas(filtered);
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
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Radar size={12} /> Scanner
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Nearby <span className="text-neon-teal">Scanner</span>
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xl mx-auto">
                        Scan zones within {MAX_RADIUS_KM}km for risk levels.
                    </p>
                </div>

                {/* Info bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-gray-500">
                    <span className="bg-white/5 px-3 py-1.5 rounded-full">Max Radius: {MAX_RADIUS_KM}km</span>
                    <span className="bg-white/5 px-3 py-1.5 rounded-full">Data as of: {getDelayDate()}</span>
                    <span className="bg-white/5 px-3 py-1.5 rounded-full">Scans today: {scanCount.current} / {MAX_DAILY_SCANS}</span>
                </div>

                {/* Search */}
                <form onSubmit={handleScan} className="flex gap-2 mb-4">
                    <div className="flex-1">
                        <Input placeholder="Zone name..." icon={MapPin} value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading || isLimitReached}
                        className="px-6 py-2.5 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.2)] hover:shadow-[0_0_30px_rgba(20,241,217,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {loading
                            ? <span className="w-4 h-4 border-2 border-deep-navy/40 border-t-deep-navy rounded-full animate-spin" />
                            : <Search size={16} />
                        }
                        Scan
                    </button>
                </form>

                {isLimitReached && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm mb-6 justify-center">
                        <ShieldAlert size={16} /> Daily limit reached ({MAX_DAILY_SCANS} scans per day).
                    </div>
                )}

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {AREA_NAMES.slice(0, 4).map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                            className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-neon-teal hover:border-neon-teal/30 transition-all text-[10px] font-bold uppercase tracking-tight flex items-center gap-1"
                        >
                            <ChevronRight size={10} /> {s}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {areas && (
                        <motion.div key={centerName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Summary bar */}
                            <div className="glass-panel rounded-lg border border-white/5 p-3 mb-4 flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-neon-teal" />
                                    <span className="text-white text-sm font-semibold">Center: <span className="text-neon-teal">{centerName}</span></span>
                                </div>
                                <div className="flex gap-3 ml-auto">
                                    <span className="flex items-center gap-1.5 text-xs text-safe font-bold uppercase tracking-tighter"><span className="w-2 h-2 rounded-full bg-safe" /> {riskCounts.Low} Low</span>
                                    <span className="flex items-center gap-1.5 text-xs text-warning font-bold uppercase tracking-tighter"><span className="w-2 h-2 rounded-full bg-warning" /> {riskCounts.Moderate} Med</span>
                                    <span className="flex items-center gap-1.5 text-xs text-danger font-bold uppercase tracking-tighter"><span className="w-2 h-2 rounded-full bg-danger" /> {riskCounts.High} High</span>
                                </div>
                            </div>

                            {/* Zone cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {areas.map((area, i) => {
                                    const cfg = riskLevels[area.risk];
                                    return (
                                        <motion.div key={area.zone}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`glass-panel rounded-lg p-3 border ${cfg.badge} hover:translate-y-[-2px] transition-transform duration-200`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${cfg.badge} ${cfg.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {area.risk}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">{area.distance}</span>
                                            </div>
                                            <h4 className="text-white text-sm font-semibold leading-tight">{area.zone}</h4>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Disclaimers */}
                            <div className="p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2 mb-4">
                                <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose. Data shown has a minimum 30-day delay.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {!areas && !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                        >
                            <Radar size={52} className="mb-4 opacity-30 text-neon-teal" />
                            <p>Enter your zone to scan nearby risk levels</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Zone-level aggregated data only. No street-level or real-time tracking.
                </p>
            </div>
        </div>
    );
}
