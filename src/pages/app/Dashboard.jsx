import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Navigation, BarChart2, Activity, X, Shield, Bell, MapPin, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ToolCard from '../../components/ui/ToolCard';

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const recentAlerts = [
    { level: 'high', title: 'Elevated risk detected in Downtown', meta: 'Downtown · Crime spike +34%', timestamp: '2m ago' },
    { level: 'medium', title: 'Moderate activity in Eastgate', meta: 'Eastgate · 3 incidents logged', timestamp: '18m ago' },
    { level: 'low', title: 'Safe corridor confirmed — Riverside', meta: 'Riverside · All-clear', timestamp: '1h ago' },
    { level: 'medium', title: 'Route delay advisory — Northside', meta: 'Northside · Road closure', timestamp: '2h ago' },
];

const toolCards = [
    { icon: Zap, name: 'Crime Prediction', description: 'Get AI-powered risk scores for any district.', path: '/app/tools?tool=prediction', color: '#FF4C4C' },
    { icon: Navigation, name: 'Safe Route Finder', description: 'Find the safest path between two points.', path: '/app/tools?tool=route', color: '#00D4AA' },
    { icon: BarChart2, name: 'Compare Areas', description: 'Side-by-side risk comparison across districts.', path: '/app/tools?tool=compare', color: '#3B82F6' },
    { icon: Activity, name: 'Live Risk Map', description: 'Real-time animated risk map of the city.', path: '/app/live-map', color: '#F59E0B' },
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Dashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [showWelcome, setShowWelcome] = useState(true);
    const navigate = useNavigate();

    return (
        <motion.div 
            className="flex flex-col gap-8 max-w-[1200px] w-full"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            {/* Header Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-teal/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Welcome Banner */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        variants={fadeUp}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl group"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/90 to-transparent" />
                        
                        <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
                            <div className="max-w-2xl">
                                <motion.div 
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-xs font-bold uppercase tracking-wider mb-4"
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-neon-teal shadow-[0_0_8px_#00D4AA] animate-pulse" />
                                    Live Safety Monitoring Active
                                </motion.div>
                                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">
                                    {isAuthenticated && user?.name ? `${getGreeting()}, ${user.name}` : getGreeting()} 👋
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    You are protected by CrimeLense OS. Access AI-powered urban intelligence, predict real-time risks, and navigate your city with ultimate safety awareness.
                                </p>
                            </div>
                            
                            <div className="flex md:flex-col items-center gap-3 self-start md:self-stretch justify-center">
                                <button
                                    onClick={() => setShowWelcome(false)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10"
                                    title="Dismiss"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Core Stats Row */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="High-Risk Hotspots" value="12" trend="+3" color="red" sublabel="Across 5 active districts" icon={MapPin} />
                <StatCard label="Safe Routes Analyzed" value="847" trend="-2" color="teal" sublabel="Within the last 24 hours" icon={Navigation} />
                <StatCard label="City AI Confidence" value="94%" trend="+1.2%" color="blue" sublabel="Live predictive model accuracy" icon={Shield} />
            </motion.div>

            {/* Tools & Activity Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Tools Column */}
                <motion.div variants={staggerContainer} className="xl:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="text-neon-teal" size={20} /> Toolkit Hub
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {toolCards.map((card, i) => (
                            <ToolCard key={card.name} {...card} delay={i * 0.1} />
                        ))}
                    </div>
                </motion.div>

                {/* Live Alerts Column */}
                <motion.div variants={fadeUp} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Bell className="text-danger" size={20} /> Live Advisories
                        </h2>
                        <button className="text-xs font-semibold text-neon-teal hover:text-white transition-colors flex items-center gap-1">
                            View All <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[20px] bg-[#111928]/80 backdrop-blur-xl border border-white/5">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-danger/50 to-transparent" />
                        
                        <div className="flex flex-col divide-y divide-white/5">
                            {recentAlerts.map((alert, i) => {
                                const isHigh = alert.level === 'high';
                                const isMedium = alert.level === 'medium';
                                
                                return (
                                    <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                                                isHigh ? 'bg-danger/20 text-danger border border-danger/30' :
                                                isMedium ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30' :
                                                'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30'
                                            }`}>
                                                {alert.level} Risk
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">{alert.timestamp}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-neon-teal transition-colors">
                                            {alert.title}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {alert.meta}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
            
        </motion.div>
    );
};

export default Dashboard;
