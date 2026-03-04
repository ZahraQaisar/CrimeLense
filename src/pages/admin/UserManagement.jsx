import React, { useState } from 'react';
import { Search, Filter, MoreVertical, UserCheck, UserX, Shield, User, Mail, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const users = [
    { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@example.com', role: 'Admin', status: 'Active', joined: '12 Jan 2024', lastSeen: '2 mins ago' },
    { id: 2, name: 'James Okonkwo', email: 'james.ok@example.com', role: 'Analyst', status: 'Active', joined: '28 Feb 2024', lastSeen: '1 hour ago' },
    { id: 3, name: 'Priya Sharma', email: 'priya.s@example.com', role: 'Viewer', status: 'Suspended', joined: '5 Mar 2024', lastSeen: '3 days ago' },
    { id: 4, name: 'Tom Becker', email: 'tom.b@example.com', role: 'Analyst', status: 'Active', joined: '19 Apr 2024', lastSeen: '30 mins ago' },
    { id: 5, name: 'Lena Fischer', email: 'lena.f@example.com', role: 'Viewer', status: 'Inactive', joined: '7 Jun 2024', lastSeen: '2 weeks ago' },
    { id: 6, name: 'Ahmed Karimi', email: 'ahmed.k@example.com', role: 'Analyst', status: 'Active', joined: '14 Jul 2024', lastSeen: '5 mins ago' },
    { id: 7, name: 'Chloe Dupont', email: 'chloe.d@example.com', role: 'Viewer', status: 'Active', joined: '3 Sep 2024', lastSeen: '1 day ago' },
];

const roleBadge = { Admin: 'text-danger bg-danger/10 border-danger/20', Analyst: 'text-blue-400 bg-blue-400/10 border-blue-400/20', Viewer: 'text-gray-400 bg-white/5 border-white/10' };
const statusBadge = { Active: 'text-safe bg-safe/10 border-safe/20', Suspended: 'text-danger bg-danger/10 border-danger/20', Inactive: 'text-gray-400 bg-white/5 border-white/10' };

const UserManagement = () => {
    const [search, setSearch] = useState('');
    const [openMenu, setOpenMenu] = useState(null);
    const [filter, setFilter] = useState('All');

    const filtered = users.filter(u =>
        (filter === 'All' || u.status === filter) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage accounts, roles and access permissions</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-teal text-deep-navy font-bold text-sm hover:bg-white transition-colors shadow-[0_0_20px_rgba(20,241,217,0.3)]">
                    <User size={16} /> Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: User, color: 'text-blue-400' },
                    { label: 'Active', value: users.filter(u => u.status === 'Active').length, icon: UserCheck, color: 'text-safe' },
                    { label: 'Suspended', value: users.filter(u => u.status === 'Suspended').length, icon: UserX, color: 'text-danger' },
                    { label: 'Admins', value: users.filter(u => u.role === 'Admin').length, icon: Shield, color: 'text-warning' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">{label}</div>
                            <div className="text-xl font-bold text-white">{value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Panel */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-white/5">
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-teal/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gray-500" />
                        {['All', 'Active', 'Suspended', 'Inactive'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-neon-teal/15 text-neon-teal border border-neon-teal/30' : 'text-gray-400 hover:text-white border border-transparent hover:bg-white/5'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['User', 'Role', 'Status', 'Joined', 'Last Seen', ''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-white/3 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-teal/30 to-blue-600/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadge[user.role]}`}>{user.role}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${statusBadge[user.status]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-safe animate-pulse' : user.status === 'Suspended' ? 'bg-danger' : 'bg-gray-500'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={12} />{user.joined}</div>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-400">{user.lastSeen}</td>
                                    <td className="px-5 py-4 relative">
                                        <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                        <AnimatePresence>
                                            {openMenu === user.id && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-6 top-10 z-20 w-40 glass-panel rounded-xl border border-white/10 shadow-xl py-1 overflow-hidden">
                                                    {['Edit User', 'Change Role', user.status === 'Suspended' ? 'Unsuspend' : 'Suspend', 'Delete'].map((act, i) => (
                                                        <button key={act} onClick={() => setOpenMenu(null)}
                                                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5 ${i === 3 ? 'text-danger hover:text-danger' : 'text-gray-300 hover:text-white'}`}>
                                                            {act}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-14 text-gray-500">
                            <User size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No users match your search</p>
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-500">
                    Showing {filtered.length} of {users.length} users
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
