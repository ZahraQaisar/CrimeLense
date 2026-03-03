import React from 'react';
import { Activity, Server, Users, AlertOctagon } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const AdminOverview = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Administration</h1>
                    <p className="text-gray-400">Monitor system health and data integrity</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-safe/10 text-safe rounded-full border border-safe/20 text-sm font-bold flex items-center gap-2">
                        <div className="w-2 h-2 bg-safe rounded-full animate-pulse" />
                        All Systems Operational
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="1,248" trend="up" trendValue="+12" icon={Users} color="blue" />
                <StatCard title="Active Incidents" value="45" trend="down" trendValue="-3" icon={AlertOctagon} color="danger" />
                <StatCard title="System Load" value="32%" trend="up" trendValue="+2%" icon={Server} color="warning" />
                <StatCard title="Model Accuracy" value="94.2%" trend="up" trendValue="+0.4%" icon={Activity} color="neon-teal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Recent System Logs</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-safe" />
                                    <span className="text-sm text-gray-300">Data sync completed successfully</span>
                                </div>
                                <span className="text-xs text-gray-500">10:4{i} AM</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Pending dataset reviews</h3>
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <Server size={48} className="mb-2 opacity-50" />
                        <p>No new datasets pending review</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
