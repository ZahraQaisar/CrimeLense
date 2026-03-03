import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminLayout = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'System Overview', path: '/admin' },
        { icon: Map, label: 'Manage Hotspots', path: '/admin/hotspots' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: ShieldAlert, label: 'Incident Logs', path: '/admin/logs' },
        { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-deep-navy flex">
            {/* Admin Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/10 flex flex-col fixed h-full z-40">
                <div className="h-20 flex items-center justify-center border-b border-white/10">
                    <h1 className="font-bold text-xl text-white">
                        CrimeLense <span className="text-danger">Admin</span>
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-danger/10 text-danger shadow-[0_0_15px_rgba(255,77,77,0.1)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
