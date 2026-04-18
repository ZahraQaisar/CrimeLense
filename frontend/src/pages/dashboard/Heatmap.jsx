import React, { useState } from 'react';
import { Filter, Calendar, Clock } from 'lucide-react';
import CrimeMap from '../../components/map/CrimeMap';

// Dummy heatmap data (London example)
const generatePoints = (center, count) => {
    return Array.from({ length: count }).map(() => [
        center[0] + (Math.random() - 0.5) * 0.05,
        center[1] + (Math.random() - 0.5) * 0.05,
        Math.random() // Intensity
    ]);
};

const HeatmapPage = () => {
    const [timeRange, setTimeRange] = useState(12);
    const heatPoints = generatePoints([51.505, -0.09], 500);

    const hotspots = [
        { position: [51.505, -0.09], title: "Central Station", desc: "Frequent pickpocketing reported", risk: "High" },
        { position: [51.51, -0.1], title: "North Market", desc: "Late night disturbances", risk: "Medium" },
        { position: [51.49, -0.08], title: "South Park", desc: "Safe zone monitored by police", risk: "Low" }
    ];

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
            {/* Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">Live Crime Heatmap</h1>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-danger" /> High Risk</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning" /> Medium</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-neon-teal" /> Safe</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-deep-navy/50 px-4 py-2 rounded-lg border border-white/10">
                        <Clock size={16} className="text-neon-teal" />
                        <span className="text-sm text-gray-300">Time: {timeRange}:00</span>
                        <input
                            type="range"
                            min="0"
                            max="23"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-32 accent-neon-teal"
                        />
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative rounded-xl overflow-hidden glass-panel border border-white/5">
                <CrimeMap
                    heatmapData={heatPoints}
                    markers={hotspots}
                    height="100%"
                />

                {/* Floating Info Panel */}
                <div className="absolute top-4 right-4 z-[400] w-64 glass-panel p-4 rounded-xl border border-white/10">
                    <h3 className="font-bold text-white mb-2">Zone Analysis</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Current Risk Level</span>
                            <span className="text-danger font-bold">High</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Active Incidents</span>
                            <span className="text-white font-bold">14</span>
                        </div>
                        <div className="w-full bg-deep-navy rounded-full h-2 mt-2">
                            <div className="bg-gradient-to-r from-safe via-warning to-danger w-[70%] h-full rounded-full relative">
                                <div className="absolute right-0 -top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">based on real-time reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeatmapPage;
