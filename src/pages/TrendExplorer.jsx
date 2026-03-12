import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Filter, TrendingUp } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const crimeTypes = ['All Types', 'Theft', 'Assault', 'Burglary', 'Vandalism', 'Robbery'];
const areas = ['All Areas', 'Downtown', 'Midtown', 'Northside', 'Eastgate', 'Westbrook'];
const daysOfWeek = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const baselineMonthly = [
    { month: 'Jan', Theft: 42, Assault: 18, Burglary: 22, Vandalism: 15, Robbery: 10 },
    { month: 'Feb', Theft: 38, Assault: 20, Burglary: 19, Vandalism: 18, Robbery: 12 },
    { month: 'Mar', Theft: 51, Assault: 23, Burglary: 25, Vandalism: 20, Robbery: 15 },
    { month: 'Apr', Theft: 46, Assault: 19, Burglary: 21, Vandalism: 17, Robbery: 11 },
    { month: 'May', Theft: 55, Assault: 28, Burglary: 28, Vandalism: 22, Robbery: 18 },
    { month: 'Jun', Theft: 62, Assault: 35, Burglary: 30, Vandalism: 28, Robbery: 20 },
    { month: 'Jul', Theft: 70, Assault: 40, Burglary: 32, Vandalism: 31, Robbery: 25 },
    { month: 'Aug', Theft: 65, Assault: 38, Burglary: 29, Vandalism: 27, Robbery: 21 },
    { month: 'Sep', Theft: 48, Assault: 25, Burglary: 22, Vandalism: 19, Robbery: 14 },
    { month: 'Oct', Theft: 44, Assault: 21, Burglary: 20, Vandalism: 16, Robbery: 12 },
    { month: 'Nov', Theft: 39, Assault: 17, Burglary: 17, Vandalism: 13, Robbery: 9 },
    { month: 'Dec', Theft: 53, Assault: 22, Burglary: 24, Vandalism: 19, Robbery: 16 },
];

const dailyData = [
    { day: 'Mon', incidents: 28 }, { day: 'Tue', incidents: 22 },
    { day: 'Wed', incidents: 31 }, { day: 'Thu', incidents: 25 },
    { day: 'Fri', incidents: 48 }, { day: 'Sat', incidents: 62 },
    { day: 'Sun', incidents: 35 },
];

const COLORS = { Theft: '#14F1D9', Assault: '#FF4D4D', Burglary: '#F59E0B', Vandalism: '#6366F1', Robbery: '#EC4899' };

const SelectFilter = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
        <select
            value={value} onChange={e => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neon-teal/50 transition-all appearance-none cursor-pointer"
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default function TrendExplorer() {
    const [crimeType, setCrimeType] = useState('All Types');
    const [area, setArea] = useState('All Areas');
    const [day, setDay] = useState('All Days');
    const [month, setMonth] = useState('All Months');

    const lineData = useMemo(() => {
        const multiplier = area === 'Downtown' ? 1.4 : area === 'Northside' ? 0.6 : 1.0;
        return baselineMonthly
            .filter(d => month === 'All Months' || d.month === month)
            .map(d => {
                const row = { month: d.month };
                const types = crimeType === 'All Types' ? Object.keys(COLORS) : [crimeType];
                types.forEach(t => { row[t] = Math.round((d[t] || 0) * multiplier); });
                return row;
            });
    }, [crimeType, area, month]);

    const barDataFiltered = useMemo(() => {
        return day === 'All Days' ? dailyData : dailyData.filter(d => d.day === day.slice(0, 3));
    }, [day]);

    const activeTypes = crimeType === 'All Types' ? Object.keys(COLORS) : [crimeType];
    const totalSelected = lineData.reduce((sum, row) => sum + activeTypes.reduce((s, t) => s + (row[t] || 0), 0), 0);

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
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
                        Filter and explore historical crime trends across areas, types, and time periods.
                    </p>
                </div>

                {/* Filters */}
                <div className="glass-panel rounded-2xl border border-white/5 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Filter size={16} className="text-neon-teal" />
                        <h3 className="text-white font-semibold">Filter Data</h3>
                        <span className="ml-auto text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                            {totalSelected} total incidents shown
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SelectFilter label="Crime Type" value={crimeType} onChange={setCrimeType} options={crimeTypes} />
                        <SelectFilter label="Area" value={area} onChange={setArea} options={areas} />
                        <SelectFilter label="Day of Week" value={day} onChange={setDay} options={daysOfWeek} />
                        <SelectFilter label="Month" value={month} onChange={setMonth} options={months} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart (Monthly) */}
                    <motion.div
                        key={`${crimeType}-${area}-${month}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-6"
                    >
                        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                            <TrendingUp size={16} className="text-neon-teal" /> Monthly Trend
                        </h3>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="month" stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#6b7280" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '10px' }} />
                                    <Legend />
                                    {activeTypes.map(t => (
                                        <Line key={t} type="monotone" dataKey={t} stroke={COLORS[t]} strokeWidth={2.5}
                                            dot={{ r: 3, fill: COLORS[t] }} activeDot={{ r: 5 }} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Bar Chart (Day of Week) */}
                    <motion.div
                        key={`day-${day}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-2xl border border-white/5 p-6"
                    >
                        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                            <BarChart2 size={16} className="text-neon-teal" /> By Day of Week
                        </h3>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barDataFiltered} layout="vertical">
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
            </div>
        </div>
    );
}
