import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut, ChevronDown, BarChart2, MapPin, Lightbulb, Zap, Radar, Clock, Layers, ShieldCheck, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const exploreLinks = [
    {
        group: 'Analysis',
        items: [
            { name: 'Risk Score', path: '/risk-score', icon: ShieldCheck },
            { name: 'Risk Forecast', path: '/risk-forecast', icon: Zap },
            { name: 'Trend Explorer', path: '/trend-explorer', icon: BarChart2 },
            { name: 'AI Insights', path: '/ai-insights', icon: Lightbulb },
        ],
    },
    {
        group: 'Safety',
        items: [
            { name: 'Safety Ranking', path: '/safety-ranking', icon: Trophy },
            { name: 'Neighborhood Report', path: '/neighborhood-summary', icon: MapPin },
            { name: 'Nearby Scanner', path: '/nearby-scanner', icon: Radar },
            { name: 'Safety Tips', path: '/safety-tips', icon: ShieldCheck },
        ],
    },
    {
        group: 'Map Tools',
        items: [
            { name: 'Crime Timeline', path: '/crime-timeline', icon: Clock },
            { name: 'Map Layers', path: '/map-layers', icon: Layers },
        ],
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showExplore, setShowExplore] = useState(false);
    const [showMobileExplore, setShowMobileExplore] = useState(false);
    const exploreRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close explore dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (exploreRef.current && !exploreRef.current.contains(e.target)) {
                setShowExplore(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { name: 'Features', path: '/#features' },
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'About', path: '/about' },
    ];

    const handleLogout = () => {
        logout();
        setShowUserDropdown(false);
        navigate('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b bg-deep-navy/90 backdrop-blur-lg border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center h-20">
                    {/* Logo — left */}
                    <Link to="/" className="flex items-center gap-2 group w-fit">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-teal to-blue-600 shadow-[0_0_20px_rgba(20,241,217,0.3)] group-hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all duration-300">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-neon-teal transition-colors">
                            Crime<span className="text-neon-teal">Lense</span>
                        </span>
                    </Link>

                    {/* Desktop Nav — truly centered */}
                    <div className="hidden md:flex items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-neon-teal transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-teal transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}

                        {/* Explore Dropdown */}
                        <div className="relative" ref={exploreRef}>
                            <button
                                onClick={() => setShowExplore(v => !v)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-neon-teal transition-colors"
                            >
                                Explore
                                <ChevronDown
                                    size={14}
                                    className="transition-transform duration-200"
                                    style={{ transform: showExplore ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                            </button>

                            <AnimatePresence>
                                {showExplore && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-3 w-[480px] glass-panel rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                                    >
                                        <div className="p-5">
                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-4 px-1">New Features</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                {exploreLinks.map(group => (
                                                    <div key={group.group}>
                                                        <p className="text-xs text-neon-teal font-bold uppercase tracking-wider mb-2 px-1">{group.group}</p>
                                                        <div className="space-y-1">
                                                            {group.items.map(item => (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    onClick={() => setShowExplore(false)}
                                                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all text-sm group"
                                                                >
                                                                    <item.icon size={14} className="text-gray-600 group-hover:text-neon-teal transition-colors shrink-0" />
                                                                    {item.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop CTA — right */}
                    <div className="hidden md:flex items-center justify-end gap-4">
                        {isAuthenticated ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setShowUserDropdown(true)}
                                onMouseLeave={() => setShowUserDropdown(false)}
                            >
                                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-neon-teal/20 border-2 border-neon-teal/50 text-neon-teal font-bold hover:bg-neon-teal/30 transition-all duration-300 shadow-[0_0_15px_rgba(20,241,217,0.2)] hover:shadow-[0_0_25px_rgba(20,241,217,0.4)]">
                                    {user?.displayPicture ? (
                                        <img src={user.displayPicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-sm">{getUserInitials()}</span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 glass-panel rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden"
                                        >
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-neon-teal transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    <User size={18} />
                                                    <span className="text-sm font-medium">Profile</span>
                                                </Link>
                                                <div className="h-px bg-white/10 my-1" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-danger transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="text-sm font-medium">Log Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-deep-navy/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}

                            {/* Mobile Explore */}
                            <div>
                                <button
                                    onClick={() => setShowMobileExplore(v => !v)}
                                    className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors w-full"
                                >
                                    Explore Features
                                    <ChevronDown size={16} className="ml-1 transition-transform duration-200" style={{ transform: showMobileExplore ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </button>
                                <AnimatePresence>
                                    {showMobileExplore && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 space-y-4 pl-4 border-l border-white/10">
                                                {exploreLinks.map(group => (
                                                    <div key={group.group}>
                                                        <p className="text-xs font-bold text-neon-teal uppercase tracking-wider mb-2">{group.group}</p>
                                                        {group.items.map(item => (
                                                            <Link
                                                                key={item.path}
                                                                to={item.path}
                                                                onClick={() => { setIsOpen(false); setShowMobileExplore(false); }}
                                                                className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-neon-teal transition-colors"
                                                            >
                                                                <item.icon size={13} />
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-px bg-white/10 my-1" />
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors"
                                    >
                                        <User size={20} /> Profile
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-danger transition-colors text-left"
                                    >
                                        <LogOut size={20} /> Log Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
