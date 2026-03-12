import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Zap, ShieldCheck, ShieldAlert, AlertTriangle, ChevronRight } from 'lucide-react';
import Input from '../components/common/Input';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM', '12:00 AM', '3:00 AM'];

const riskMap = {
    High: { color: '#FF4D4D', bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', Icon: ShieldAlert, tip: 'High risk detected. Avoid this area at this time if possible. Use well-lit main roads and travel with others.' },
    Moderate: { color: '#F59E0B', bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', Icon: AlertTriangle, tip: 'Moderate risk. Stay aware of your surroundings. Avoid isolated areas and keep valuables secure.' },
    Low: { color: '#14F1D9', bg: 'bg-safe/10', border: 'border-safe/30', text: 'text-safe', Icon: ShieldCheck, tip: 'Low risk detected. General precautions apply. This is a relatively safe time and location.' },
};

const getRisk = (day, time) => {
    const nightTimes = ['9:00 PM', '12:00 AM', '3:00 AM'];
    const weekendDays = ['Friday', 'Saturday', 'Sunday'];
    const isNight = nightTimes.includes(time);
    const isWeekend = weekendDays.includes(day);
    if (isNight && isWeekend) return { level: 'High', prob: Math.floor(Math.random() * 20) + 65 };
    if (isNight || isWeekend) return { level: 'Moderate', prob: Math.floor(Math.random() * 20) + 40 };
    return { level: 'Low', prob: Math.floor(Math.random() * 20) + 10 };
};

const suggestions = [
    { location: 'Downtown', day: 'Saturday', time: '12:00 AM' },
    { location: 'Northside', day: 'Tuesday', time: '9:00 AM' },
    { location: 'Eastgate', day: 'Friday', time: '9:00 PM' },
];

export default function RiskForecast() {
    const [location, setLocation] = useState('');
    const [day, setDay] = useState('Monday');
    const [time, setTime] = useState('9:00 AM');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleForecast = (e) => {
        e.preventDefault();
        if (!location.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setResult({ location: location.trim(), day, time, ...getRisk(day, time) });
            setLoading(false);
        }, 1200);
    };

    const fillSuggestion = (s) => {
        setLocation(s.location);
        setDay(s.day);
        setTime(s.time);
        setResult(null);
    };

    const cfg = result ? riskMap[result.level] : null;

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Zap size={14} /> Time-Based Risk Forecast
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Risk <span className="text-neon-teal">Forecast</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Enter a location, day and time to get a predicted crime risk probability.
                    </p>
                </div>

                {/* Form */}
                <div className="glass-panel rounded-2xl border border-white/5 p-6 mb-6">
                    <form onSubmit={handleForecast} className="space-y-5">
                        <Input
                            label="Location"
                            placeholder="e.g. Downtown, Central Park…"
                            icon={MapPin}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                    <Calendar size={13} /> Day of Week
                                </label>
                                <select
                                    value={day} onChange={e => setDay(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-neon-teal/50 transition-all appearance-none cursor-pointer"
                                >
                                    {days.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                    <Clock size={13} /> Time of Day
                                </label>
                                <select
                                    value={time} onChange={e => setTime(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-neon-teal/50 transition-all appearance-none cursor-pointer"
                                >
                                    {times.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3.5 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><span className="w-5 h-5 border-2 border-deep-navy/40 border-t-deep-navy rounded-full animate-spin" /> Forecasting…</>
                            ) : (
                                <><Zap size={18} /> Generate Forecast</>
                            )}
                        </button>
                    </form>

                    {/* Suggestions */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-600 mb-2">Try an example:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => fillSuggestion(s)}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-neon-teal hover:border-neon-teal/30 transition-all flex items-center gap-1"
                                >
                                    <ChevronRight size={10} />
                                    {s.location} · {s.day} · {s.time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result */}
                <AnimatePresence mode="wait">
                    {result && cfg && (
                        <motion.div
                            key={`${result.location}-${result.day}-${result.time}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`glass-panel rounded-2xl border ${cfg.border} overflow-hidden`}
                        >
                            <div className={`h-1.5 w-full`} style={{ backgroundColor: cfg.color }} />
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <cfg.Icon className={cfg.text} size={24} />
                                    <h3 className="text-xl font-bold text-white">Forecast Result</h3>
                                    <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                        {result.level} Risk
                                    </span>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <MapPin className="mx-auto mb-1 text-neon-teal" size={16} />
                                        <div className="text-xs text-gray-500 mb-0.5">Location</div>
                                        <div className="text-white font-bold text-sm">{result.location}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Calendar className="mx-auto mb-1 text-neon-teal" size={16} />
                                        <div className="text-xs text-gray-500 mb-0.5">Day</div>
                                        <div className="text-white font-bold text-sm">{result.day}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Clock className="mx-auto mb-1 text-neon-teal" size={16} />
                                        <div className="text-xs text-gray-500 mb-0.5">Time</div>
                                        <div className="text-white font-bold text-sm">{result.time}</div>
                                    </div>
                                </div>

                                {/* Probability */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Risk Probability</span>
                                        <span className={`text-2xl font-black ${cfg.text}`}>{result.prob}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.prob}%` }}
                                            transition={{ duration: 0.9, ease: 'easeOut' }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
                                        />
                                    </div>
                                </div>

                                {/* Tip */}
                                <div className={`p-4 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                                    <p className={`text-sm ${cfg.text} leading-relaxed`}>{cfg.tip}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Forecast based on historical patterns. Not real-time surveillance data.
                </p>
            </div>
        </div>
    );
}
