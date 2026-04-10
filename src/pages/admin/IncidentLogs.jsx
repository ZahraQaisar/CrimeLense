import React, { useState } from 'react';
import { Search, AlertTriangle, AlertCircle, Info, CheckCircle, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const BRAND_TEAL = '#00d4aa';
const BRAND_BLUE = '#0ea5e9';
const BRAND_RED = '#ef4444';

const levels = {
    ERROR:   { icon: AlertCircle,   colorHex: BRAND_RED },
    WARNING: { icon: AlertTriangle, colorHex: BRAND_RED },
    INFO:    { icon: Info,          colorHex: '#80a0ff' }, // Lighter blue for info
    SUCCESS: { icon: CheckCircle,   colorHex: '#ffffff' }, // White for success
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

    const summary = [
        { label: 'Errors', count: allLogs.filter(l => l.level === 'ERROR').length, hex: BRAND_RED },
        { label: 'Warnings', count: allLogs.filter(l => l.level === 'WARNING').length, hex: BRAND_RED },
        { label: 'Info', count: allLogs.filter(l => l.level === 'INFO').length, hex: '#80a0ff' },
        { label: 'Success', count: allLogs.filter(l => l.level === 'SUCCESS').length, hex: '#ffffff' },
    ];

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
                {summary.map(({ label, count, hex }) => (
                    <div key={label} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                             style={{ background: 'rgba(255,255,255,0.05)', color: hex }}>
                            {count}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: hex }}>{label}</div>
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
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none"
                            onFocus={e => { e.target.style.borderColor = BRAND_TEAL; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'ERROR', 'WARNING', 'INFO', 'SUCCESS'].map(l => (
                            <button key={l} onClick={() => setLevelFilter(l)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                                style={levelFilter === l
                                  ? { background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.28)', color: BRAND_TEAL }
                                  : { color: '#9ca3af', borderColor: 'transparent' }}
                                onMouseEnter={e => { if (levelFilter !== l) e.currentTarget.style.color = '#fff' }}
                                onMouseLeave={e => { if (levelFilter !== l) e.currentTarget.style.color = '#9ca3af' }}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <select
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none transition-colors"
                        onFocus={e => { e.target.style.borderColor = BRAND_TEAL; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        style={{
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px'
                        }}
                    >
                        {categories.map(c => <option key={c} value={c} style={{ background: '#0f1923' }}>{c}</option>)}
                    </select>
                </div>

                {/* Log list */}
                <div className="divide-y divide-white/5 max-h-[560px] overflow-y-auto">
                    {filtered.map((log, i) => {
                        const { icon: Icon, colorHex } = levels[log.level];
                        return (
                            <motion.div key={log.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className="flex items-start gap-4 px-5 py-4 transition-colors"
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Level indicator */}
                                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                     style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)', color: colorHex }}>
                                    <Icon size={15} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-xs font-bold" style={{ color: colorHex }}>{log.level}</span>
                                        <span className="text-xs text-gray-600">·</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>{log.category}</span>
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
