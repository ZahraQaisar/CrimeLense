import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Lightbulb, Car, Moon, Building2, Bike, Users,
    ShoppingBag, Clock, AlertTriangle, Star, ChevronDown, Info, ShieldCheck
} from 'lucide-react';

const allInsights = [
    {
        id: 1, icon: Moon, color: '#6366F1',
        category: 'Robbery',
        confidence: 91,
        insight: 'Robbery incidents tend to increase during late-night hours citywide, particularly in commercial zones across the city.',
        tags: ['Citywide', 'Late Night'],
    },
    {
        id: 2, icon: Car, color: '#F59E0B',
        category: 'Vehicle Theft',
        confidence: 87,
        insight: 'Vehicle theft risk is significantly higher in areas lacking CCTV coverage compared to monitored parking zones.',
        tags: ['Infrastructure', 'Prevention'],
    },
    {
        id: 3, icon: ShoppingBag, color: '#14F1D9',
        category: 'Pickpocketing',
        confidence: 85,
        insight: 'Pickpocketing incidents are concentrated around high-footfall areas across the city, especially during peak crowd hours.',
        tags: ['Crowds', 'Awareness'],
    },
    {
        id: 4, icon: Building2, color: '#FF4D4D',
        category: 'Burglary',
        confidence: 82,
        insight: 'Residential burglaries tend to peak during daytime hours on weekdays, when properties are typically unoccupied.',
        tags: ['Residential', 'Daytime'],
    },
    {
        id: 5, icon: Bike, color: '#EC4899',
        category: 'Bike Theft',
        confidence: 79,
        insight: 'Bicycle theft follows seasonal patterns — incidents increase significantly during warmer months citywide.',
        tags: ['Seasonal', 'Outdoor'],
    },
    {
        id: 6, icon: Users, color: '#22D3EE',
        category: 'Assault',
        confidence: 88,
        insight: 'Assault incidents show a strong weekend pattern, with cases rising significantly on Friday and Saturday evenings.',
        tags: ['Weekends', 'Evening'],
    },
    {
        id: 7, icon: Clock, color: '#A78BFA',
        category: 'Street Theft',
        confidence: 76,
        insight: 'Street theft incidents tend to cluster around commuting hours — with peaks during morning and evening rush periods.',
        tags: ['Rush Hour', 'Commuting'],
    },
    {
        id: 8, icon: AlertTriangle, color: '#F97316',
        category: 'Vandalism',
        confidence: 72,
        insight: 'Areas with active surveillance infrastructure report significantly fewer vandalism incidents compared to unmonitored zones.',
        tags: ['Infrastructure', 'Prevention'],
    },
];

const categories = ['All', 'Robbery', 'Vehicle Theft', 'Pickpocketing', 'Burglary', 'Bike Theft', 'Assault', 'Street Theft', 'Vandalism'];

export default function AIInsights() {
    const [filter, setFilter] = useState('All');
    const [expanded, setExpanded] = useState(null);

    const filtered = filter === 'All' ? allInsights : allInsights.filter(i => i.category === filter);

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Lightbulb size={14} /> AI-Generated Insights
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Crime Pattern <span className="text-neon-teal">AI Insights</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Our AI automatically detects patterns in historical crime data and surfaces actionable insights.
                    </p>
                </div>

                {/* Category filter pills */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${filter === cat
                                ? 'bg-neon-teal text-deep-navy border-neon-teal font-bold'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item, idx) => {
                        const isExpanded = expanded === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                className="glass-panel rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden cursor-pointer"
                                onClick={() => setExpanded(isExpanded ? null : item.id)}
                            >
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                                        >
                                            <item.icon size={20} style={{ color: item.color }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>
                                                    {item.category}
                                                </span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Star size={11} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs text-gray-500">{item.confidence}% confidence</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{item.insight}</p>

                                            {/* Tags */}
                                            <motion.div
                                                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                                                    {item.tags.map(tag => (
                                                        <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/10">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <ChevronDown
                                            size={16} className="text-gray-500 shrink-0 transition-transform duration-200 mt-0.5"
                                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-600">
                        <Lightbulb size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No insights found for this category.</p>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="p-4 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-2 mt-8">
                    <Info size={14} className="text-neon-teal shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-xs leading-relaxed">
                        This estimate is based on historical data and is for general awareness only. Do not use this for any unlawful purpose.
                    </p>
                </div>

                <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Insights generated from anonymized historical crime pattern analysis. No specific locations identified.
                </p>
            </div>
        </div>
    );
}
