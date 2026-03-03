import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';

const Analysis = () => {
    const [activeTab, setActiveTab] = useState('temporal');

    const tabs = [
        { id: 'temporal', label: 'Temporal Trends' },
        { id: 'spatial', label: 'Spatial Distribution' },
        { id: 'category', label: 'Crime Categories' },
        { id: 'victim', label: 'Victim Demographics' }
    ];

    const temporalData = [
        { time: '00:00', incidents: 12 },
        { time: '04:00', incidents: 5 },
        { time: '08:00', incidents: 15 },
        { time: '12:00', incidents: 25 },
        { time: '16:00', incidents: 30 },
        { time: '20:00', incidents: 45 },
    ];

    const categoryData = [
        { name: 'Theft', value: 400 },
        { name: 'Assault', value: 300 },
        { name: 'Vandalism', value: 300 },
        { name: 'Burglary', value: 200 },
    ];

    const COLORS = ['#14F1D9', '#3B82F6', '#F59E0B', '#FF4D4D'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Crime Analytics</h1>
                    <p className="text-gray-400">Deep dive into crime patterns and statistics</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all relative ${activeTab === tab.id ? 'text-neon-teal' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-teal"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'temporal' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white">Daily Crime Frequency</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"><Calendar size={16} /></button>
                                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"><Filter size={16} /></button>
                                    </div>
                                </div>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={temporalData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="time" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" />
                                            <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20' }} />
                                            <Line type="monotone" dataKey="incidents" stroke="#14F1D9" strokeWidth={3} dot={{ fill: '#14F1D9' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white/5 p-4 rounded-xl text-center">
                                        <div className="text-gray-400 text-sm">Peak Hour</div>
                                        <div className="text-xl font-bold text-white">20:00 - 21:00</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl text-center">
                                        <div className="text-gray-400 text-sm">Lowest Activity</div>
                                        <div className="text-xl font-bold text-white">04:00 - 05:00</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl text-center">
                                        <div className="text-gray-400 text-sm">Avg. Daily Incidents</div>
                                        <div className="text-xl font-bold text-neon-teal">42</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'category' && (
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-4">
                                <div className="h-[300px] w-full md:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full md:w-1/2 space-y-4">
                                    <h3 className="text-lg font-bold text-white mb-4">Distribution by Type</h3>
                                    {categoryData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                                <span className="text-gray-300">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-white">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(activeTab === 'spatial' || activeTab === 'victim') && (
                            <div className="flex items-center justify-center h-[300px] text-gray-500">
                                Data visualization for {tabs.find(t => t.id === activeTab).label} is currently populating...
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Analysis;
