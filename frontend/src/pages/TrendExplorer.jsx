import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Filter, TrendingUp, LogIn, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AREA_NAMES } from '../constants/areas';
import { useAuth } from '../context/AuthContext';

// Crime type filter REMOVED from user-facing panel per security rules
// Only Area OR Time Period — not both at once (one-filter rule)
const areas = ['All Areas', ...AREA_NAMES];
const timePeriods = ['All Months', 'Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];

const baselineMonthly = [
    { month: 'Jan', Total: 105 }, { month: 'Feb', Total: 107 },
    { month: 'Mar', Total: 134 }, { month: 'Apr', Total: 114 },
    { month: 'May', Total: 151 }, { month: 'Jun', Total: 175 },
    { month: 'Jul', Total: 198 }, { month: 'Aug', Total: 180 },
    { month: 'Sep', Total: 128 }, { month: 'Oct', Total: 113 },
    { month: 'Nov', Total: 95 }, { month: 'Dec', Total: 134 },
];

const dailyData = [
    { day: 'Mon', incidents: 28 }, { day: 'Tue', incidents: 22 },
    { day: 'Wed', incidents: 31 }, { day: 'Thu', incidents: 25 },
    { day: 'Fri', incidents: 48 }, { day: 'Sat', incidents: 62 },
    { day: 'Sun', incidents: 35 },
];

const MIN_INCIDENTS = 30;

const quarterMonths = {
    'All Months': null,
    'Q1 (Jan-Mar)': ['Jan', 'Feb', 'Mar'],
    'Q2 (Apr-Jun)': ['Apr', 'May', 'Jun'],
    'Q3 (Jul-Sep)': ['Jul', 'Aug', 'Sep'],
    'Q4 (Oct-Dec)': ['Oct', 'Nov', 'Dec'],
};

const SelectFilter = ({ label, value, onChange, options, disabled }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
        <select
            value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
            className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neon-teal/50 transition-all appearance-none cursor-pointer ${disabled ? 'text-gray-600 opacity-50 cursor-not-allowed' : 'text-white'}`}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {disabled && <p className="text-xs text-gray-600 italic">Disabled — only one filter at a time.</p>}
    </div>
);

export default function TrendExplorer() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [area, setArea] = useState('All Areas');
    const [timePeriod, setTimePeriod] = useState('All Months');

    // Login gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="glass-panel rounded-2xl border border-white/10 p-10 text-center max-w-md">
                    <LogIn size={48} className="text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-gray-400 text-sm mb-6">The Crime Trend Explorer requires authentication. Please log in to access trend analysis.</p>
                    <button onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                    >Log In</button>
                </div>
            </div>
        );
    }

    // One-filter rule: if area is set, disable time. If time is set, disable area.
    const areaActive = area !== 'All Areas';
    const timeActive = timePeriod !== 'All Months';

    const handleAreaChange = (v) => {
        setArea(v);
        if (v !== 'All Areas') setTimePeriod('All Months');
    };
    const handleTimeChange = (v) => {
        setTimePeriod(v);
        if (v !== 'All Months') setArea('All Areas');
    };

    const lineData = useMemo(() => {
        // Vary data slightly per area using a hash of the area name
        const hash = area.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
        const multiplier = area === 'All Areas' ? 1.0 : 0.6 + (hash % 10) / 10;
        const qMonths = quarterMonths[timePeriod];
        return baselineMonthly
            .filter(d => !qMonths || qMonths.includes(d.month))
            .map(d => ({ month: d.month, Total: Math.round(d.Total * multiplier) }));
    }, [area, timePeriod]);

    const totalSelected = lineData.reduce((sum, row) => sum + row.Total, 0);
    const insufficientData = totalSelected < MIN_INCIDENTS;

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <BarChart2 size={14} /> Crime Trend Explorer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Crime <span className="text-neon-teal">Trend Explorer</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Explore historical crime trends by area or time period. Choose one filter at a time.
                    </p>
                </div>

                {/* Filters — Crime Type removed, one-filter rule enforced */}
                <div className="glass-panel rounded-2xl border border-white/5 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Filter size={16} className="text-neon-teal" />
                        <h3 className="text-white font-semibold">Filter Data</h3>
                        <span className="ml-auto text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                            {totalSelected} total incidents shown
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectFilter label="Area" value={area} onChange={handleAreaChange} options={areas} disabled={timeActive} />
                        <SelectFilter label="Time Period" value={timePeriod} onChange={handleTimeChange} options={timePeriods} disabled={areaActive} />
                    </div>
                    <p className="text-xs text-gray-600 mt-3 text-center">You may filter by Area or Time Period — not both simultaneously.</p>
                </div>

                {insufficientData ? (
                    <div className="glass-panel rounded-2xl border border-warning/30 p-10 text-center">
                        <AlertTriangle size={40} className="text-warning mx-auto mb-3" />
                        <p className="text-warning font-semibold mb-1">Insufficient data for this selection</p>
                        <p className="text-gray-500 text-sm">The selected filters return fewer than {MIN_INCIDENTS} incidents. Please widen your filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Line Chart */}
                        <motion.div
                            key={`${area}-${timePeriod}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-6"
                        >
                            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                                <TrendingUp size={16} className="text-neon-teal" /> Monthly Trend (All Crime Types Combined)
                            </h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="month" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '10px' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="Total" stroke="#14F1D9" strokeWidth={2.5}
                                            dot={{ r: 3, fill: '#14F1D9' }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Bar Chart (Day of Week) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel rounded-2xl border border-white/5 p-6"
                        >
                            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                                <BarChart2 size={16} className="text-neon-teal" /> By Day of Week
                            </h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis type="number" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <YAxis type="category" dataKey="day" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={30} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '10px' }} />
                                        <Bar dataKey="incidents" fill="#14F1D9" radius={[0, 4, 4, 0]}
                                            style={{ filter: 'drop-shadow(0 0 4px rgba(20,241,217,0.3))' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-6 p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2">
                    <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-xs leading-relaxed">
                        This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose.
                    </p>
                </div>

                <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Aggregated historical data. No individual or location-specific records shown.
                </p>
            </div>
        </div>
    );
}
