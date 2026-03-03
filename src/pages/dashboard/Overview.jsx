import React from 'react';
import { Shield, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/dashboard/StatCard';

const data = [
    { name: 'Mon', crime: 4, safety: 90 },
    { name: 'Tue', crime: 3, safety: 92 },
    { name: 'Wed', crime: 7, safety: 85 },
    { name: 'Thu', crime: 2, safety: 95 },
    { name: 'Fri', crime: 6, safety: 88 },
    { name: 'Sat', crime: 9, safety: 80 },
    { name: 'Sun', crime: 5, safety: 89 },
];

const Overview = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Overview</h1>
                    <p className="text-gray-400">Welcome back, Admin</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-3 py-1 rounded-full bg-neon-teal/10 text-neon-teal border border-neon-teal/20 text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
                        System Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Safety Score"
                    value="87%"
                    trend="down"
                    trendValue="2.4%"
                    icon={Shield}
                    color="neon-teal"
                    delay={0.1}
                />
                <StatCard
                    title="Active Hotspots"
                    value="12"
                    trend="up"
                    trendValue="+3"
                    icon={MapPin}
                    color="danger"
                    delay={0.2}
                />
                <StatCard
                    title="Incidents Reported"
                    value="24"
                    trend="up"
                    trendValue="+12%"
                    icon={AlertTriangle}
                    color="warning"
                    delay={0.3}
                />
                <StatCard
                    title="Risk Analysis"
                    value="Low"
                    trend="down"
                    trendValue="Stable"
                    icon={Activity}
                    color="blue"
                    delay={0.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-semibold mb-6">Crime vs Safety Trends</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCrime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14F1D9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#14F1D9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" axisLine={false} tickLine={false} />
                                <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="crime" stroke="#FF4D4D" strokeWidth={3} fillOpacity={1} fill="url(#colorCrime)" />
                                <Area type="monotone" dataKey="safety" stroke="#14F1D9" strokeWidth={3} fillOpacity={1} fill="url(#colorSafety)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
                    <h3 className="text-white font-semibold mb-6">Recent Alerts</h3>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-danger/10 flex-shrink-0 flex items-center justify-center text-danger group-hover:bg-danger group-hover:text-white transition-all">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium">Suspicious Activity</h4>
                                    <p className="text-gray-400 text-xs">Sector 4 • 2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-auto w-full py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        View All Alerts
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
