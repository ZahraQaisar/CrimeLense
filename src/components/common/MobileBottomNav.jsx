import React from 'react';
import { Shield, Map, Activity, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Home', path: '/', icon: Activity },
    { label: 'Map', path: '/safe-route', icon: Map },
    { label: 'Features', path: '/#features', icon: Shield },
    { label: 'Profile', path: '/profile', icon: User }
];

const MobileBottomNav = () => {
    const location = useLocation();

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-deep-navy/95 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                                isActive ? 'text-neon-teal' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
