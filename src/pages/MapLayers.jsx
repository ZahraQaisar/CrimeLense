import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Flame, MapPin, AlertOctagon, ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const layerDefs = [
    {
        key: 'heatmap',
        label: 'Heatmap',
        description: 'Crime intensity across the city',
        color: '#FF4D4D',
        Icon: Flame,
        zones: [
            { x: 30, y: 20, size: 120, opacity: 0.6 },
            { x: 55, y: 45, size: 90, opacity: 0.5 },
            { x: 15, y: 55, size: 70, opacity: 0.4 },
            { x: 70, y: 65, size: 80, opacity: 0.5 },
            { x: 42, y: 75, size: 60, opacity: 0.35 },
        ],
    },
    {
        key: 'hotspots',
        label: 'Hotspots',
        description: 'Identified crime concentration points',
        color: '#F59E0B',
        Icon: AlertOctagon,
        markers: [
            { x: 28, y: 22, label: 'Downtown' },
            { x: 60, y: 40, label: 'East Hub' },
            { x: 18, y: 60, label: 'Market St' },
            { x: 72, y: 68, label: 'Port Zone' },
        ],
    },
    {
        key: 'density',
        label: 'Crime Density',
        description: 'Relative crime density per zone',
        color: '#6366F1',
        Icon: Layers,
        grid: [
            { x: 0, y: 0, w: 33, h: 33, density: 'high' },
            { x: 33, y: 0, w: 34, h: 33, density: 'medium' },
            { x: 67, y: 0, w: 33, h: 33, density: 'low' },
            { x: 0, y: 33, w: 33, h: 34, density: 'medium' },
            { x: 33, y: 33, w: 34, h: 34, density: 'high' },
            { x: 67, y: 33, w: 33, h: 34, density: 'low' },
            { x: 0, y: 67, w: 33, h: 33, density: 'low' },
            { x: 33, y: 67, w: 34, h: 33, density: 'medium' },
            { x: 67, y: 67, w: 33, h: 33, density: 'low' },
        ],
    },
    {
        key: 'risk',
        label: 'Risk Areas',
        description: 'Colour-coded risk zones',
        color: '#14F1D9',
        Icon: ShieldAlert,
        areas: [
            { x: 3, y: 3, w: 40, h: 45, risk: 'High', label: 'Zone A' },
            { x: 47, y: 3, w: 50, h: 45, risk: 'Moderate', label: 'Zone B' },
            { x: 3, y: 52, w: 94, h: 45, risk: 'Low', label: 'Zone C' },
        ],
    },
];

const riskColor = { High: '#FF4D4D', Moderate: '#F59E0B', Low: '#14F1D9' };
const densityOpacity = { high: 0.6, medium: 0.35, low: 0.15 };

const ToggleRow = ({ layer, active, onToggle }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${layer.color}15`, border: `1px solid ${layer.color}30` }}>
                <layer.Icon size={18} style={{ color: layer.color }} />
            </div>
            <div>
                <p className="text-white text-sm font-semibold">{layer.label}</p>
                <p className="text-gray-500 text-xs">{layer.description}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${active
                    ? 'text-deep-navy border-transparent'
                    : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'
                }`}
            style={active ? { backgroundColor: layer.color, borderColor: layer.color } : {}}
        >
            {active ? <Eye size={12} /> : <EyeOff size={12} />}
            {active ? 'On' : 'Off'}
        </button>
    </div>
);

export default function MapLayers() {
    const [activeLayers, setActiveLayers] = useState({ heatmap: true, hotspots: true, density: false, risk: false });

    const toggle = (key) => setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
    const activeCount = Object.values(activeLayers).filter(Boolean).length;

    const heatmap = layerDefs[0];
    const hotspots = layerDefs[1];
    const density = layerDefs[2];
    const risk = layerDefs[3];

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Layers size={14} /> Map Layer Controls
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Map <span className="text-neon-teal">Layer Controls</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Toggle different crime data visualisation layers on or off to explore the map.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Layers size={16} className="text-neon-teal" /> Layers
                            </h3>
                            <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-0.5 rounded-full">{activeCount} active</span>
                        </div>
                        {layerDefs.map(layer => (
                            <ToggleRow key={layer.key} layer={layer} active={activeLayers[layer.key]} onToggle={() => toggle(layer.key)} />
                        ))}

                        {/* Legend */}
                        {activeLayers.risk && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl border border-white/5 p-4 mt-2">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Risk Zone Legend</p>
                                {['High', 'Moderate', 'Low'].map(r => (
                                    <div key={r} className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-3 rounded" style={{ backgroundColor: `${riskColor[r]}50`, border: `1px solid ${riskColor[r]}` }} />
                                        <span className="text-xs text-gray-300">{r} Risk</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                        {activeLayers.density && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl border border-white/5 p-4">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Density Legend</p>
                                {['high', 'medium', 'low'].map(d => (
                                    <div key={d} className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-3 rounded" style={{ backgroundColor: `rgba(99,102,241,${densityOpacity[d]})`, border: '1px solid #6366F150' }} />
                                        <span className="text-xs text-gray-300 capitalize">{d}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Map Canvas */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                                <MapPin size={14} className="text-neon-teal" /> City Overview Map
                            </h3>
                            <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">Simulated Visualisation</span>
                        </div>

                        {/* Map area */}
                        <div className="relative w-full overflow-hidden rounded-xl bg-[#0d1a2d] border border-white/5" style={{ paddingBottom: '72%' }}>
                            {/* Grid lines */}
                            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(v => (
                                    <g key={v}>
                                        <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="#14F1D9" strokeWidth="0.5" />
                                        <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#14F1D9" strokeWidth="0.5" />
                                    </g>
                                ))}
                            </svg>

                            {/* Street lines */}
                            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#fff" strokeWidth="1" />
                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" strokeWidth="1" />
                                <line x1="25%" y1="0" x2="75%" y2="100%" stroke="#fff" strokeWidth="0.5" />
                                <line x1="75%" y1="0" x2="25%" y2="100%" stroke="#fff" strokeWidth="0.5" />
                            </svg>

                            {/* Heatmap Layer */}
                            <AnimatePresence>
                                {activeLayers.heatmap && heatmap.zones.map((z, i) => (
                                    <motion.div key={`heat-${i}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: z.opacity, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        className="absolute rounded-full pointer-events-none"
                                        style={{
                                            left: `${z.x}%`, top: `${z.y}%`,
                                            width: z.size, height: z.size,
                                            transform: 'translate(-50%,-50%)',
                                            background: `radial-gradient(circle, rgba(255,77,77,0.8) 0%, transparent 70%)`,
                                            filter: 'blur(16px)',
                                        }}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Density Layer */}
                            <AnimatePresence>
                                {activeLayers.density && density.grid.map((g, i) => (
                                    <motion.div key={`den-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute pointer-events-none"
                                        style={{
                                            left: `${g.x}%`, top: `${g.y}%`,
                                            width: `${g.w}%`, height: `${g.h}%`,
                                            backgroundColor: `rgba(99,102,241,${densityOpacity[g.density]})`,
                                            border: '1px solid rgba(99,102,241,0.2)',
                                        }}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Risk Areas Layer */}
                            <AnimatePresence>
                                {activeLayers.risk && risk.areas.map((a, i) => (
                                    <motion.div key={`risk-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute pointer-events-none flex items-center justify-center"
                                        style={{
                                            left: `${a.x}%`, top: `${a.y}%`,
                                            width: `${a.w}%`, height: `${a.h}%`,
                                            backgroundColor: `${riskColor[a.risk]}18`,
                                            border: `1px solid ${riskColor[a.risk]}40`,
                                        }}
                                    >
                                        <span className="text-xs font-bold opacity-70" style={{ color: riskColor[a.risk] }}>
                                            {a.label} · {a.risk}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Hotspot Markers Layer */}
                            <AnimatePresence>
                                {activeLayers.hotspots && hotspots.markers.map((m, i) => (
                                    <motion.div key={`spot-${i}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="absolute"
                                        style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)' }}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <span className="absolute w-6 h-6 rounded-full bg-warning opacity-30 animate-ping" />
                                            <div className="w-4 h-4 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)] z-10" />
                                        </div>
                                        <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-deep-navy/90 text-warning text-[10px] px-2 py-0.5 rounded border border-warning/20">
                                            {m.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Center dot */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="w-3 h-3 rounded-full bg-neon-teal shadow-[0_0_10px_rgba(20,241,217,0.8)]" />
                            </div>

                            {/* No layers message */}
                            {activeCount === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                                    Enable layers from the panel to visualise data
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-600 mt-8 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Visualisation uses aggregated zone-level data. No individual coordinates tracked.
                </p>
            </div>
        </div>
    );
}
