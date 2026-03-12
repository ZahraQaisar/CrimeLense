import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
};

const years = [2019, 2020, 2021, 2022, 2023, 2024];
const COLORS = { Theft: '#14F1D9', Assault: '#FF4D4D', Burglary: '#F59E0B', Vandalism: '#6366F1' };

const yearFacts = {
    2019: 'Pre-pandemic baseline. Stable crime distribution with summer peaks.',
    2020: 'Significant drop during lockdowns. Lowest crime rates recorded in 5 years.',
    2021: 'Gradual recovery. Crime activity resumed as restrictions eased.',
    2022: 'Notable rise in street theft as urban activity normalized.',
    2023: 'Highest overall numbers in 5 years. Summer months most critical.',
    2024: 'Data through Q4. Trends suggest slight reduction from 2023 peak.',
};

export default function CrimeTimeline() {
    const [yearIndex, setYearIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

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
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
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
                        Slide through years to see how crime patterns evolved from 2019 to 2024.
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

                    {/* Slider */}
                    <input
                        type="range"
                        min={0} max={years.length - 1}
                        value={yearIndex}
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

                    {/* Year fact */}
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

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Aggregated historical data. No individual or location-specific records shown.
                </p>
            </div>
        </div>
    );
}
