import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield, TrendingUp, TrendingDown, Minus, Lightbulb,
    Navigation, ShieldCheck, Map, ChevronRight, Zap, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OnboardingModal from '../../components/common/OnboardingModal';

/* --- Mock data (replace with API later) --- */
const savedAreas = [
    { name: 'Downtown', risk: 'HIGH', trend: 'Stable' },
    { name: 'Northside', risk: 'LOW', trend: 'Improving' },
    { name: 'Midtown', risk: 'MODERATE', trend: 'Worsening' },
];

const RISK_COLORS = { LOW: '#14F1D9', MODERATE: '#F59E0B', HIGH: '#FF4D4D' };
const TREND_CFG = {
    Improving: { icon: TrendingDown, color: '#14F1D9', arrow: '↑' },
    Stable: { icon: Minus, color: '#F59E0B', arrow: '→' },
    Worsening: { icon: TrendingUp, color: '#FF4D4D', arrow: '↓' },
};

const weeklyInsight = "Reported incidents in commercial areas tend to rise during festive seasons. Stay alert in crowded markets and shopping centers.";

const dailyTips = [
    "Keep your phone in your front pocket in busy areas.",
    "Share your live location with a trusted contact when going out at night.",
    "Always park in well-lit, monitored areas.",
    "Avoid wearing headphones in both ears on isolated streets.",
    "Memorize at least one emergency number by heart.",
    "Look up and around you every 30 seconds in crowded transit hubs.",
    "Keep a digital copy of important documents in a secure cloud folder.",
];

const getDailyTip = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return dailyTips[dayOfYear % dailyTips.length];
};

const Overview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <OnboardingModal />
            {/* Header */}
            <div className="flex items-center justify-end mb-2">
                <div className="flex gap-3">
                    <span className="px-3 py-1 rounded-full bg-neon-teal/10 text-neon-teal border border-neon-teal/20 text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
                        Live
                    </span>
                </div>
            </div>

            {/* City Safety Pulse */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/5"
            >
                <span className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                <span className="text-gray-300 text-sm font-medium">
                    City safety trend this month: <span className="text-warning font-bold">Stable</span>
                </span>
                <Info size={14} className="text-gray-600 ml-auto cursor-pointer" title="Based on aggregated citywide data with a 30-day delay." />
            </motion.div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Find Safe Route', icon: Navigation, route: '/safe-route', color: '#14F1D9', desc: 'Plan the safest path' },
                    { label: 'Check Area Risk', icon: ShieldCheck, route: '/risk-score', color: '#F59E0B', desc: 'Look up any zone' },
                    { label: 'Explore Heatmap', icon: Map, route: '/dashboard/heatmap', color: '#0ea5e9', desc: 'View crime patterns' },
                ].map((action, i) => (
                    <motion.button key={action.label}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                        onClick={() => navigate(action.route)}
                        className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] text-left"
                        style={{ backgroundColor: `${action.color}08`, borderColor: `${action.color}25` }}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${action.color}15` }}
                        >
                            <action.icon size={22} style={{ color: action.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm">{action.label}</div>
                            <div className="text-gray-500 text-xs">{action.desc}</div>
                        </div>
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors shrink-0" />
                    </motion.button>
                ))}
            </div>

            {/* Main Grid: Safety Cards + Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Safety Score Card */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-6"
                >
                    <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                        <Shield size={18} className="text-neon-teal" /> Your Safety Score Cards
                    </h3>

                    {savedAreas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {savedAreas.map((area, i) => {
                                const riskColor = RISK_COLORS[area.risk];
                                const trend = TREND_CFG[area.trend];
                                return (
                                    <motion.div key={area.name}
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.08 }}
                                        className="rounded-xl p-4 border transition-all hover:scale-[1.03]"
                                        style={{ backgroundColor: `${riskColor}08`, borderColor: `${riskColor}30` }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-white font-semibold text-sm">{area.name}</span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
                                            >{area.risk}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm" style={{ color: trend.color }}>
                                            <trend.icon size={14} />
                                            <span className="font-semibold">{trend.arrow} {area.trend}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                            <Shield size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">Save an area to track its safety</p>
                            <button onClick={() => navigate('/risk-score')}
                                className="mt-3 px-4 py-2 bg-neon-teal/10 text-neon-teal rounded-lg text-sm font-semibold border border-neon-teal/30 hover:bg-neon-teal/20 transition-all"
                            >Add Area</button>
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Insight + Daily Tip */}
                <div className="space-y-4">
                    {/* Insight of the Week */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="glass-panel rounded-2xl border border-white/5 p-5"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb size={16} className="text-warning" />
                            <span className="text-xs font-bold uppercase tracking-wider text-warning">Insight of the Week</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{weeklyInsight}</p>
                    </motion.div>

                    {/* Daily Safety Tip */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass-panel rounded-2xl border border-neon-teal/15 p-5"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Zap size={16} className="text-neon-teal" />
                            <span className="text-xs font-bold uppercase tracking-wider text-neon-teal">Daily Tip</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{getDailyTip()}</p>
                    </motion.div>

                    {/* Quick link to Safety Tips */}
                    <button onClick={() => navigate('/safety-tips')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:text-neon-teal hover:border-neon-teal/30 transition-all"
                    >
                        <ShieldCheck size={14} /> View All Safety Tips <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
