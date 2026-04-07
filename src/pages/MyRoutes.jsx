import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Play, MapPin, Clock, Edit2, Trash2, ShieldCheck, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const initialRoutes = [
    { id: 1, nickname: 'Home to Office', start: 'Downtown District', end: 'Northside Commercial', risk: 'LOW', eta: '18 mins' },
    { id: 2, nickname: 'Gym Route', start: 'Midtown Station', end: 'Westside Gym', risk: 'MODERATE', eta: '12 mins' },
    { id: 3, nickname: 'Evening Run', start: 'Park Entrance', end: 'Park Lake Trail', risk: 'LOW', eta: '35 mins' }
];

const MyRoutes = () => {
    const [routes, setRoutes] = useState(initialRoutes);
    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (window.confirm('Delete this saved route?')) {
            setRoutes(routes.filter(r => r.id !== id));
        }
    };

    const handleRunRoute = (route) => {
        navigate(`/app/tools?tool=route&start=${encodeURIComponent(route.start)}&end=${encodeURIComponent(route.end)}&run=true`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            My <span className="text-neon-teal">Saved Routes</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Quickly access your most frequent safe paths.
                        </p>
                    </div>
                    <Link to="/app/tools?tool=route" className="px-5 py-2.5 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_15px_rgba(20,241,217,0.3)] hover:bg-neon-teal/90 transition-all flex items-center gap-2">
                        <Map size={18} /> New Route
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {routes.map((route, i) => (
                            <motion.div 
                                key={route.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-colors"
                            >
                                <div className="flex-1 flex items-start gap-4">
                                    <div className="p-3 bg-neon-teal/10 rounded-xl text-neon-teal shrink-0">
                                        <Navigation size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{route.nickname}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-400 mb-3">
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-500" /> From: <span className="text-gray-300">{route.start}</span></span>
                                            <span className="hidden sm:inline text-gray-600">→</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-500" /> To: <span className="text-gray-300">{route.end}</span></span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                                route.risk === 'LOW' ? 'bg-safe/10 text-safe border border-safe/20' : 
                                                'bg-warning/10 text-warning border border-warning/20'
                                            }`}>
                                                {route.risk} RISK
                                            </span>
                                            <span className="text-gray-400 text-sm flex items-center gap-1"><Clock size={14} /> est. {route.eta}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 self-end md:self-center w-full md:w-auto">
                                    <button 
                                        onClick={() => handleDelete(route.id)}
                                        className="p-3 bg-white/5 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleRunRoute(route)}
                                        className="flex-1 md:flex-none px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-neon-teal hover:border-neon-teal hover:text-deep-navy transition-all flex items-center justify-center gap-2"
                                    >
                                        <Play size={18} fill="currentColor" /> Run Route
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {routes.length === 0 && (
                        <div className="text-center py-20 px-6 glass-panel rounded-3xl border border-white/5">
                            <ShieldCheck size={60} className="mx-auto text-gray-600 mb-6 opacity-50" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Saved Routes</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                You haven't saved any routes yet. Use the Safe Route Finder to generate and save your daily paths for quick access.
                            </p>
                            <Link to="/app/tools?tool=route" className="inline-flex items-center gap-2 px-6 py-3 bg-neon-teal text-deep-navy font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all">
                                <Navigation size={20} /> Find a Safe Route
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRoutes;
