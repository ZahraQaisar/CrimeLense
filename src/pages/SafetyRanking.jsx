import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, TrendingUp, TrendingDown, Minus, Trophy, AlertOctagon } from 'lucide-react';

const safestAreas = [
    { name: 'Greenfield Heights', score: 92, crime: 8, trend: 'stable' },
    { name: 'Northside Park', score: 88, crime: 12, trend: 'down' },
    { name: 'Riverside District', score: 85, crime: 15, trend: 'down' },
    { name: 'Westbrook Village', score: 81, crime: 19, trend: 'stable' },
    { name: 'Lakeview Terrace', score: 79, crime: 21, trend: 'up' },
];

const riskAreas = [
    { name: 'Old Market Quarter', score: 28, crime: 72, trend: 'up' },
    { name: 'Downtown Central', score: 31, crime: 69, trend: 'up' },
    { name: 'Eastgate Junction', score: 38, crime: 62, trend: 'stable' },
    { name: 'Central Station', score: 42, crime: 58, trend: 'stable' },
    { name: 'Port Authority Zone', score: 47, crime: 53, trend: 'down' },
];

const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={15} className="text-danger" />;
    if (trend === 'down') return <TrendingDown size={15} className="text-safe" />;
    return <Minus size={15} className="text-warning" />;
};

const AreaCard = ({ area, index, isSafe, delay }) => {
    const barColor = isSafe ? '#14F1D9' : '#FF4D4D';
    const scoreColor = isSafe ? 'text-safe' : 'text-danger';
    const borderColor = isSafe ? 'border-safe/20' : 'border-danger/20';

    return (
        <motion.div
            initial={{ opacity: 0, x: isSafe ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className={`glass-panel rounded-xl p-4 border ${borderColor} hover:border-opacity-60 transition-all duration-300 group`}
        >
            <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                    ${isSafe ? 'bg-safe/10 text-safe' : 'bg-danger/10 text-danger'}`}>
                    #{index + 1}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold text-sm truncate">{area.name}</h4>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <TrendIcon trend={area.trend} />
                            <span className={`text-sm font-bold ${scoreColor}`}>
                                {isSafe ? area.score : area.crime}%
                            </span>
                        </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${isSafe ? area.score : area.crime}%` }}
                            transition={{ duration: 0.8, delay: delay + 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor, boxShadow: `0 0 6px ${barColor}60` }}
                        />
                    </div>

                    <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                        <span>{isSafe ? `Safety Score: ${area.score}/100` : `Crime Rate: ${area.crime}%`}</span>
                        <span className={area.trend === 'up' ? 'text-danger' : area.trend === 'down' ? 'text-safe' : 'text-warning'}>
                            {area.trend === 'up' ? 'Increasing' : area.trend === 'down' ? 'Decreasing' : 'Stable'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function SafetyRanking() {
    const [activeTab, setActiveTab] = useState('all');

    const showSafe = activeTab !== 'risk';
    const showRisk = activeTab !== 'safe';

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Trophy size={14} /> Area Safety Ranking
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Safety <span className="text-neon-teal">Rankings</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Areas ranked by historical safety scores. Use this to compare neighborhoods and plan safer routes.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                        {[
                            { key: 'all', label: 'All Areas' },
                            { key: 'safe', label: '✅ Safest' },
                            { key: 'risk', label: '🔴 High Risk' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                                        ? 'bg-neon-teal text-deep-navy font-bold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Safest Areas */}
                    {showSafe && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-safe" size={20} />
                                <h2 className="text-lg font-bold text-safe">Safest Areas</h2>
                            </div>
                            <div className="space-y-3">
                                {safestAreas.map((area, i) => (
                                    <AreaCard key={area.name} area={area} index={i} isSafe={true} delay={i * 0.08} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* High Risk Areas */}
                    {showRisk && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertOctagon className="text-danger" size={20} />
                                <h2 className="text-lg font-bold text-danger">High Risk Areas</h2>
                            </div>
                            <div className="space-y-3">
                                {riskAreas.map((area, i) => (
                                    <AreaCard key={area.name} area={area} index={i} isSafe={false} delay={i * 0.08} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-gray-600 mt-10 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Rankings based on aggregated historical crime data. Updated periodically.
                </p>
            </div>
        </div>
    );
}
