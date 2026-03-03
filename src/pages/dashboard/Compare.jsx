import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Input from '../../components/common/Input';

const Compare = () => {
    const [areaA, setAreaA] = useState('');
    const [areaB, setAreaB] = useState('');
    const [comparing, setComparing] = useState(false);

    const data = [
        { name: 'Theft', AreaA: 40, AreaB: 24 },
        { name: 'Assault', AreaA: 30, AreaB: 13 },
        { name: 'Burglary', AreaA: 20, AreaB: 58 },
        { name: 'Vandalism', AreaA: 27, AreaB: 39 },
    ];

    const handleCompare = () => {
        setComparing(true);
        // Mock simulation
        setTimeout(() => setComparing(false), 1000);
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">Area Comparison</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <Input
                            label="Area A"
                            placeholder="e.g. Manchester"
                            icon={MapPin}
                            value={areaA}
                            onChange={(e) => setAreaA(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-center pb-3">
                        <div className="p-2 rounded-full bg-white/5 text-gray-400">vs</div>
                    </div>
                    <div className="flex-1 w-full">
                        <Input
                            label="Area B"
                            placeholder="e.g. Leeds"
                            icon={MapPin}
                            value={areaB}
                            onChange={(e) => setAreaB(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCompare}
                        className="w-full md:w-auto px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mb-0.5"
                    >
                        <RefreshCw size={18} className={comparing ? "animate-spin" : ""} />
                        Compare
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Score Comparison */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-6">Overall Risk Score</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>{areaA || 'Area A'}</span>
                                <span className="text-danger font-bold">78/100</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '78%' }}
                                    className="h-full bg-danger"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>{areaB || 'Area B'}</span>
                                <span className="text-warning font-bold">52/100</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '52%' }}
                                    className="h-full bg-warning"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crime Breakdown Chart */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-6">Crime Type Comparison</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20' }} cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="AreaA" name={areaA || 'Area A'} fill="#FF4D4D" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="AreaB" name={areaB || 'Area B'} fill="#14F1D9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compare;
