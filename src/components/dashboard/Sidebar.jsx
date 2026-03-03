import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Map as MapIcon,
    Navigation,
    AlertTriangle,
    BarChart2,
    Files,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: MapIcon, label: 'Crime Heatmap', path: '/dashboard/heatmap' },
        { icon: Navigation, label: 'Safe Route', path: '/dashboard/safe-route' },
        { icon: AlertTriangle, label: 'Risk Analysis', path: '/dashboard/analysis' },
        { icon: BarChart2, label: 'Prediction', path: '/dashboard/prediction' },
        { icon: Files, label: 'Comparisons', path: '/dashboard/compare' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            className="fixed left-0 top-0 h-screen glass-panel z-40 border-r border-white/10 flex flex-col transition-all duration-300"
        >
            <div className="h-20 flex items-center justify-center border-b border-white/10 relative">
                <h1 className={cn(
                    "font-bold text-xl text-white transition-all duration-300",
                    collapsed ? "opacity-0 scale-0 hidden" : "opacity-100 scale-100"
                )}>
                    Crime<span className="text-neon-teal">Lense</span>
                </h1>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neon-teal text-deep-navy flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                            isActive
                                ? "bg-neon-teal/10 text-neon-teal shadow-[0_0_15px_rgba(20,241,217,0.1)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon size={20} className="min-w-[20px]" />
                        <span className={cn(
                            "font-medium whitespace-nowrap transition-all duration-300",
                            collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                        )}>
                            {item.label}
                        </span>
                        {!collapsed && (
                            <div className="absolute left-0 w-1 h-8 bg-neon-teal rounded-r-full opacity-0 transition-opacity duration-300" />
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-white/10">
                <button className={cn(
                    "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all duration-300",
                    collapsed ? "justify-center" : ""
                )}>
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
