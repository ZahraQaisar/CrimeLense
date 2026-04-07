import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, ShieldCheck, LogIn, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Monthly data only — no weekly/daily/hourly granularity
// Current month removed (30-day minimum delay)
const yearlyData = {
    2019: [
        { month: 'Jan', Theft: 38, Assault: 15, Burglary: 20, Vandalism: 14 },
        { month: 'Apr', Theft: 42, Assault: 18, Burglary: 22, Vandalism: 16 },
        { month: 'Jul', Theft: 58, Assault: 28, Burglary: 26, Vandalism: 23 },
        { month: 'Oct', Theft: 44, Assault: 19, Burglary: 21, Vandalism: 15 },
    ],
    2020: [
        { month: 'Jan', Theft: 29, Assault: 11, Burglary: 18, Vandalism: 10 },
        { month: 'Apr', Theft: 18, Assault: 8, Burglary: 12, Vandalism: 7 },
        { month: 'Jul', Theft: 35, Assault: 16, Burglary: 19, Vandalism: 14 },
        { month: 'Oct', Theft: 40, Assault: 17, Burglary: 20, Vandalism: 13 },
    ],
    2021: [
        { month: 'Jan', Theft: 35, Assault: 14, Burglary: 19, Vandalism: 12 },
        { month: 'Apr', Theft: 44, Assault: 19, Burglary: 23, Vandalism: 16 },
        { month: 'Jul', Theft: 62, Assault: 33, Burglary: 30, Vandalism: 25 },
        { month: 'Oct', Theft: 48, Assault: 22, Burglary: 24, Vandalism: 17 },
    ],
    2022: [
        { month: 'Jan', Theft: 40, Assault: 17, Burglary: 21, Vandalism: 14 },
        { month: 'Apr', Theft: 50, Assault: 23, Burglary: 26, Vandalism: 19 },
        { month: 'Jul', Theft: 68, Assault: 38, Burglary: 32, Vandalism: 28 },
        { month: 'Oct', Theft: 52, Assault: 24, Burglary: 26, Vandalism: 18 },
    ],
    2023: [
        { month: 'Jan', Theft: 44, Assault: 19, Burglary: 23, Vandalism: 16 },
        { month: 'Apr', Theft: 55, Assault: 26, Burglary: 29, Vandalism: 22 },
        { month: 'Jul', Theft: 73, Assault: 42, Burglary: 34, Vandalism: 30 },
        { month: 'Oct', Theft: 56, Assault: 27, Burglary: 28, Vandalism: 20 },
    ],
    2024: [
        { month: 'Jan', Theft: 41, Assault: 17, Burglary: 21, Vandalism: 14 },
        { month: 'Apr', Theft: 50, Assault: 22, Burglary: 26, Vandalism: 19 },
        { month: 'Jul', Theft: 69, Assault: 39, Burglary: 33, Vandalism: 27 },
        { month: 'Oct', Theft: 53, Assault: 25, Burglary: 27, Vandalism: 19 },
    ],
    2025: [
        { month: 'Jan', Theft: 38, Assault: 15, Burglary: 19, Vandalism: 12 },
        { month: 'Apr', Theft: 48, Assault: 20, Burglary: 23, Vandalism: 16 },
        { month: 'Jul', Theft: 65, Assault: 36, Burglary: 31, Vandalism: 25 },
        { month: 'Oct', Theft: 50, Assault: 23, Burglary: 25, Vandalism: 18 },
    ],
    2026: [
        { month: 'Jan', Theft: 36, Assault: 14, Burglary: 17, Vandalism: 11 },
        { month: 'Apr', Theft: 46, Assault: 19, Burglary: 21, Vandalism: 15 },
        { month: 'Jul', Theft: 61, Assault: 34, Burglary: 28, Vandalism: 23 },
        { month: 'Oct', Theft: 48, Assault: 22, Burglary: 24, Vandalism: 16 },
    ],
};

const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const COLORS = { Theft: '#14F1D9', Assault: '#FF4D4D', Burglary: '#F59E0B', Vandalism: '#6366F1' };

const yearFacts = {
    2019: 'Pre-pandemic baseline. Stable crime distribution with summer peaks.',
    2020: 'Significant drop during lockdowns. Lowest crime rates recorded in 5 years.',
    2021: 'Gradual recovery. Crime activity resumed as restrictions eased.',
    2022: 'Notable rise in street theft as urban activity normalized.',
    2023: 'Highest overall numbers in 5 years. Summer months most critical.',
    2024: 'Data stabilized. Trends suggest slight reduction from 2023 peak.',
    2025: 'Continued crime reduction. Enhanced neighborhood watch programs showing impact.',
    2026: 'Current year trends. Safest period recorded since the pre-pandemic baseline.',
};

export default function CrimeTimeline() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [yearIndex, setYearIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

    // Login gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass-panel rounded-2xl border border-white/10 p-10 text-center max-w-md">
                    <LogIn size={48} className="text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-gray-400 text-sm mb-6">The Crime Timeline requires authentication. Please log in to access historical trend data.</p>
                    <button onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                    >Log In</button>
                </div>
            </div>
        );
    }

    const selectedYear = years[yearIndex];
    const data = yearlyData[selectedYear];

    const totalIncidents = useMemo(() =>
        data.reduce((sum, row) => sum + row.Theft + row.Assault + row.Burglary + row.Vandalism, 0),
        [data]);

    React.useEffect(() => {
        if (!playing) return;
        const interval = setInterval(() => {
            setYearIndex(prev => {
                if (prev >= years.length - 1) {
                    setPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, [playing]);

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Clock size={14} /> Interactive Crime Timeline
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Crime <span className="text-neon-teal">Timeline</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Slide through years to see how district-level crime patterns evolved (monthly data, 30-day delay applied).
                    </p>
                </div>

                {/* Year Slider + Controls */}
                <div className="glass-panel rounded-2xl border border-white/5 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-neon-teal" />
                            <span className="text-white font-semibold">Year: <span className="text-neon-teal text-2xl font-black ml-1">{selectedYear}</span></span>
                        </div>
                        <button
                            onClick={() => {
                                if (yearIndex >= years.length - 1) setYearIndex(0);
                                setPlaying(p => !p);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-teal/10 border border-neon-teal/30 text-neon-teal hover:bg-neon-teal hover:text-deep-navy transition-all text-sm font-semibold"
                        >
                            {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Auto Play</>}
                        </button>
                    </div>

                    {/* Monthly-step slider */}
                    <input
                        type="range"
                        min={0} max={years.length - 1}
                        value={yearIndex}
                        step={1}
                        onChange={e => { setYearIndex(Number(e.target.value)); setPlaying(false); }}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: '#14F1D9' }}
                    />
                    <div className="flex justify-between mt-2">
                        {years.map(y => (
                            <button key={y}
                                onClick={() => { setYearIndex(years.indexOf(y)); setPlaying(false); }}
                                className={`text-xs font-bold transition-colors ${selectedYear === y ? 'text-neon-teal' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>

                    <motion.p
                        key={selectedYear}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-400 text-sm text-center mt-4 bg-white/5 rounded-lg px-4 py-2"
                    >
                        📊 {yearFacts[selectedYear]}
                    </motion.p>
                </div>

                {/* Chart */}
                <motion.div
                    key={selectedYear}
                    initial={{ opacity: 0.6, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel rounded-2xl border border-white/5 p-6"
                >
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <h3 className="text-white font-semibold">Crime Distribution — {selectedYear}</h3>
                        <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                            ~{totalIncidents} total incidents tracked
                        </span>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    {Object.entries(COLORS).map(([k, col]) => (
                                        <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={col} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={col} stopOpacity={0} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="month" stroke="#6b7280" axisLine={false} tickLine={false} />
                                <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                {Object.entries(COLORS).map(([k, col]) => (
                                    <Area key={k} type="monotone" dataKey={k} stroke={col} strokeWidth={2.5}
                                        fill={`url(#grad-${k})`} dot={{ r: 4, fill: col }} activeDot={{ r: 6 }}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2">
                    <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-xs leading-relaxed">
                        This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose. Data shown at district level only with a 30-day minimum delay.
                    </p>
                </div>

                <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Aggregated historical data. No individual or location-specific records shown.
                </p>
            </div>
        </div>
    );
}
