import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut, ChevronDown, BarChart2, MapPin, Lightbulb, Radar, Clock, ShieldCheck, Award, Users, Map, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const exploreLinks = [
    {
        group: 'Analysis',
        items: [
            { name: 'Risk Score', path: '/risk-score', icon: ShieldCheck },
            { name: 'Trend Explorer', path: '/trend-explorer', icon: BarChart2 },
            { name: 'AI Insights', path: '/ai-insights', icon: Lightbulb },
        ],
    },
    {
        group: 'Safety',
        items: [
            { name: 'Neighborhood Report', path: '/neighborhood-summary', icon: MapPin },
            { name: 'Nearby Scanner', path: '/nearby-scanner', icon: Radar },
            { name: 'Awareness Hub', path: '/awareness', icon: ShieldCheck },
            { name: 'Safety Quiz', path: '/safety-quiz', icon: Award },
        ],
    },
    {
        group: 'Map Tools',
        items: [
            { name: 'Crime Timeline', path: '/crime-timeline', icon: Clock },
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
    const { isDark, toggleTheme } = useTheme();

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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled
            ? 'bg-deep-navy/85 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent backdrop-blur-none border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between md:grid md:grid-cols-3 items-center h-20">
                    {/* Logo — left */}
                    <Link to="/" className="flex items-center gap-2 group w-fit">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-teal/10 to-blue-600/10 shadow-[0_0_10px_rgba(20,241,217,0.1)] group-hover:shadow-[0_0_15px_rgba(20,241,217,0.2)] transition-all duration-300 border border-neon-teal/20">
                            <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer dynamic iris segments */}
                                <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-neon-teal" />
                                <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-blue-500" />
                                {/* Inner aperture core */}
                                <circle cx="50" cy="50" r="16" fill="currentColor" className="text-red-500" />
                                <circle cx="50" cy="50" r="6" fill="currentColor" className="text-deep-navy" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-neon-teal transition-colors">
                            Crime<span className="text-neon-teal">Lense</span>
                        </span>
                    </Link>

                    {/* Desktop Nav — truly centered */}
                    <div className="hidden md:flex items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-neon-teal transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-teal transition-all duration-300 group-hover:w-full" />
                            </Link>
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
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full right-0 mt-4 w-[650px] bg-surface-elevated/95 backdrop-blur-3xl rounded-3xl border border-subtle shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-6 relative">
                                            {/* Glow effect inside */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-teal/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-subtle">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-1">Explore Platform</h3>
                                                    <p className="text-sm text-gray-400">Discover AI-powered safety insights and tools.</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-neon-teal/10 flex items-center justify-center border border-neon-teal/20 shadow-[0_0_15px_rgba(20,241,217,0.2)]">
                                                    <Radar className="text-neon-teal" size={20} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-6">
                                                {exploreLinks.map((group, groupIdx) => (
                                                    <motion.div
                                                        key={group.group}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 * groupIdx, duration: 0.3 }}
                                                    >
                                                        <p className="text-xs text-neon-teal font-bold uppercase tracking-wider mb-4 px-1">{group.group}</p>
                                                        <div className="space-y-2">
                                                            {group.items.map(item => (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    onClick={() => setShowExplore(false)}
                                                                    className="flex items-start gap-3 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group hover:translate-x-1 hover:shadow-lg hover:shadow-black/20"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-teal/20 group-hover:shadow-[0_0_15px_rgba(20,241,217,0.4)] transition-all shrink-0 mt-0.5 border border-transparent group-hover:border-neon-teal/40">
                                                                        <item.icon size={16} className="text-gray-500 group-hover:text-neon-teal transition-colors" />
                                                                    </div>
                                                                    <span className="font-medium text-sm mt-1.5">{item.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
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
                        <button
                            onClick={toggleTheme}
                            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-neon-teal/10 border border-neon-teal/30 text-neon-teal hover:bg-neon-teal/20 transition-all duration-300 shadow-[0_0_15px_rgba(20,241,217,0.1)]"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

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
                                                    to="/my-routes"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-neon-teal transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    <Map size={18} />
                                                    <span className="text-sm font-medium">My Routes</span>
                                                </Link>
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
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors"
                                >
                                    {link.name}
                                </Link>
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
                            <button
                                onClick={() => { toggleTheme(); setIsOpen(false); }}
                                className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors text-left"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />} {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            </button>
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
