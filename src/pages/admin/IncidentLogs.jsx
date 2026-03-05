import React, { useState } from 'react';
import { Search, AlertTriangle, AlertCircle, Info, CheckCircle, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const levels = {
    ERROR: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    WARNING: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
    INFO: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    SUCCESS: { icon: CheckCircle, color: 'text-safe', bg: 'bg-safe/10 border-safe/20' },
};

const allLogs = [
    { id: 1, ts: '2024-09-04 21:04:12', level: 'ERROR', category: 'Auth', message: 'Failed login attempt — IP: 192.168.1.45', user: 'Unknown' },
    { id: 2, ts: '2024-09-04 21:01:38', level: 'SUCCESS', category: 'System', message: 'Database backup completed successfully', user: 'System' },
    { id: 3, ts: '2024-09-04 20:58:09', level: 'WARNING', category: 'Model', message: 'XGBoost prediction confidence dropped below 80%', user: 'System' },
    { id: 4, ts: '2024-09-04 20:45:23', level: 'INFO', category: 'Auth', message: 'Admin user sarah.m@example.com logged in', user: 'sarah.m' },
    { id: 5, ts: '2024-09-04 20:30:00', level: 'ERROR', category: 'Data', message: 'Crime data feed timeout — retrying in 30s', user: 'System' },
    { id: 6, ts: '2024-09-04 20:12:44', level: 'INFO', category: 'System', message: 'Model retrain scheduled for 02:00 UTC', user: 'System' },
    { id: 7, ts: '2024-09-04 20:05:11', level: 'SUCCESS', category: 'Auth', message: 'Password updated for tom.b@example.com', user: 'tom.b' },
    { id: 8, ts: '2024-09-04 19:58:02', level: 'WARNING', category: 'Data', message: 'Incomplete crime record detected — ID #4729', user: 'System' },
    { id: 9, ts: '2024-09-04 19:45:00', level: 'INFO', category: 'System', message: 'Cache cleared — 412 MB freed', user: 'System' },
    { id: 10, ts: '2024-09-04 19:20:33', level: 'SUCCESS', category: 'Model', message: 'Model v2.4 deployed successfully', user: 'System' },
    { id: 11, ts: '2024-09-04 18:55:17', level: 'ERROR', category: 'Auth', message: 'Brute-force detected — account lena.f locked', user: 'lena.f' },
    { id: 12, ts: '2024-09-04 18:30:00', level: 'INFO', category: 'Data', message: 'Real-time feed reconnected after 2m downtime', user: 'System' },
];

const summary = [
    { label: 'Errors', count: allLogs.filter(l => l.level === 'ERROR').length, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Warnings', count: allLogs.filter(l => l.level === 'WARNING').length, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Info', count: allLogs.filter(l => l.level === 'INFO').length, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Success', count: allLogs.filter(l => l.level === 'SUCCESS').length, color: 'text-safe', bg: 'bg-safe/10' },
];

const IncidentLogs = () => {
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const categories = ['All', ...new Set(allLogs.map(l => l.category))];

    const filtered = allLogs.filter(l =>
        (levelFilter === 'All' || l.level === levelFilter) &&
        (catFilter === 'All' || l.category === catFilter) &&
        (l.message.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Incident Logs</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time system events, errors and audit trail</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 text-sm font-semibold transition-all">
                    <Download size={15} /> Export CSV
                </button>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summary.map(({ label, count, color, bg }) => (
                    <div key={label} className={`glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4`}>
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} text-lg font-bold`}>
                            {count}
                        </div>
                        <div className={`text-sm font-semibold ${color}`}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Log panel */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-white/5">
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            placeholder="Search logs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-teal/50"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'ERROR', 'WARNING', 'INFO', 'SUCCESS'].map(l => (
                            <button key={l} onClick={() => setLevelFilter(l)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${levelFilter === l ? 'bg-neon-teal/15 text-neon-teal border-neon-teal/30' : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <select
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-neon-teal/50"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Log list */}
                <div className="divide-y divide-white/5 max-h-[560px] overflow-y-auto">
                    {filtered.map((log, i) => {
                        const { icon: Icon, color, bg } = levels[log.level];
                        return (
                            <motion.div key={log.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className="flex items-start gap-4 px-5 py-4 hover:bg-white/3 transition-colors"
                            >
                                {/* Level indicator */}
                                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${bg}`}>
                                    <Icon size={15} className={color} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className={`text-xs font-bold ${color}`}>{log.level}</span>
                                        <span className="text-xs text-gray-600">·</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-400">{log.category}</span>
                                        <span className="text-xs text-gray-600">·</span>
                                        <span className="text-xs text-gray-500">{log.user}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-snug">{log.message}</p>
                                </div>

                                <div className="text-xs text-gray-600 shrink-0 text-right">
                                    {log.ts.split(' ')[1]}<br />
                                    <span className="text-gray-700">{log.ts.split(' ')[0]}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-14 text-gray-500">
                            <Filter size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No logs match your filters</p>
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-500">
                    Showing {filtered.length} of {allLogs.length} entries · Auto-refreshes every 60s
                </div>
            </div>
        </div>
    );
};

export default IncidentLogs;
