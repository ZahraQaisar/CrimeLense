import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Users, Settings, LogOut, ShieldAlert, Menu, X, GripVertical, Monitor, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const MIN_WIDTH = 60;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 256;
const COLLAPSE_THRESHOLD = 130;

const menuItems = [
    { icon: LayoutDashboard, label: 'System Overview', path: '/admin' },
    { icon: Map, label: 'Manage Hotspots', path: '/admin/hotspots' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: ShieldAlert, label: 'Incident Logs', path: '/admin/logs' },
    { icon: Sparkles, label: 'AI Insights', path: '/admin/ai-insights' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
];

/* ── Navigation Progress Bar ───────────────────────────────────────────── */
const NavProgress = ({ locationKey }) => {
    const [width, setWidth] = useState(0);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        setWidth(0);
        setOpacity(1);
        const t1 = setTimeout(() => setWidth(75), 30);
        const t2 = setTimeout(() => setWidth(100), 280);
        const t3 = setTimeout(() => setOpacity(0), 480);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [locationKey]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
            zIndex: 9999, pointerEvents: 'none',
            background: 'rgba(0,212,170,0.08)',
            opacity, transition: 'opacity 0.2s ease',
        }}>
            <div style={{
                height: '100%',
                width: `${width}%`,
                background: 'linear-gradient(90deg, #00d4aa 0%, #0ea5e9 100%)',
                boxShadow: '0 0 10px rgba(0,212,170,0.8), 0 0 20px rgba(0,212,170,0.4)',
                borderRadius: '0 2px 2px 0',
                transition: width === 0
                    ? 'none'
                    : width === 75
                        ? 'width 0.28s cubic-bezier(0.4,0,0.2,1)'
                        : 'width 0.18s ease-out',
            }} />
        </div>
    );
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const dragStartX = useRef(0);
    const dragStartW = useRef(0);

    const handleLogout = () => { logout(); navigate('/login'); };
    const isCollapsed = sidebarWidth < COLLAPSE_THRESHOLD;

    // ── Drag-to-resize (mouse) ───────────────────────────────────────────────
    const onMouseDown = useCallback((e) => {
        e.preventDefault();
        dragStartX.current = e.clientX;
        dragStartW.current = sidebarWidth;
        setIsDragging(true);
    }, [sidebarWidth]);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => {
            const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartW.current + (e.clientX - dragStartX.current)));
            setSidebarWidth(newW);
        };
        const onUp = () => setIsDragging(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isDragging]);

    // ── Drag-to-resize (touch) ───────────────────────────────────────────────
    const onTouchStart = useCallback((e) => {
        dragStartX.current = e.touches[0].clientX;
        dragStartW.current = sidebarWidth;
        setIsDragging(true);
    }, [sidebarWidth]);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => {
            const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartW.current + (e.touches[0].clientX - dragStartX.current)));
            setSidebarWidth(newW);
        };
        const onEnd = () => setIsDragging(false);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
        return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    }, [isDragging]);

    // ── Prevent text selection while dragging ────────────────────────────────
    useEffect(() => {
        document.body.style.userSelect = isDragging ? 'none' : '';
        document.body.style.cursor = isDragging ? 'col-resize' : '';
        return () => { document.body.style.userSelect = ''; document.body.style.cursor = ''; };
    }, [isDragging]);

    // ── Close mobile drawer on route change ─────────────────────────────────
    useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

    // ── Sidebar nav content ──────────────────────────────────────────────────
    const NavContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo header */}
            <div className={cn(
                "flex items-center border-b border-white/10 shrink-0 h-16",
                isCollapsed && !mobile ? "justify-center px-2" : "px-4 justify-between"
            )}>
                <AnimatePresence mode="wait" initial={false}>
                    {(!isCollapsed || mobile) ? (
                        <motion.div
                            key="full-logo"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2.5 overflow-hidden"
                        >
                            {/* Exact User-side Logo Icon */}
                            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all duration-300"
                                style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.25)' }}>
                                <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
                                    <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="#00d4aa" strokeWidth="10" strokeLinecap="round" />
                                    <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" />
                                    <circle cx="50" cy="50" r="16" fill="#ef4444" />
                                    <circle cx="50" cy="50" r="6" fill="#0b0e14" />
                                </svg>
                            </div>

                            {/* Exact User-side Wordmark */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Crime<span style={{ color: '#00d4aa' }}>Lense</span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                                    Admin
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon-logo"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                            className="relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all duration-300"
                            style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.25)' }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
                                <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="#00d4aa" strokeWidth="10" strokeLinecap="round" />
                                <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="16" fill="#ef4444" />
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
                {mobile && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-none">
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        title={isCollapsed && !mobile ? item.label : undefined}
                        className={({ isActive }) => cn(
                            "flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden",
                            isCollapsed && !mobile
                                ? "justify-center p-3"
                                : "gap-3 px-3 py-2.5",
                            isActive
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                        )}
                        style={({ isActive }) => isActive ? {
                            background: 'rgba(0,212,170,0.10)',
                            boxShadow: 'inset 3px 0 0 #00d4aa, 0 0 16px rgba(0,212,170,0.06)',
                        } : {}}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Hover bg */}
                                <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-200 pointer-events-none" />

                                {/* Icon */}
                                <motion.span
                                    animate={{ color: isActive ? '#00d4aa' : undefined }}
                                    transition={{ duration: 0.2 }}
                                    className="relative z-10 shrink-0"
                                >
                                    <item.icon size={19} />
                                </motion.span>

                                {/* Label */}
                                <AnimatePresence initial={false}>
                                    {(!isCollapsed || mobile) && (
                                        <motion.span
                                            key="label"
                                            initial={{ opacity: 0, x: -8, width: 0 }}
                                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                                            exit={{ opacity: 0, x: -8, width: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="font-medium text-sm whitespace-nowrap overflow-hidden relative z-10"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>


                                {/* Collapsed tooltip */}
                                {isCollapsed && !mobile && (
                                    <span className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg bg-[#0f1923] border border-white/10 text-xs text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        {item.label}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* View User App Link */}
            <div className="px-2 pb-1 shrink-0">
                <NavLink
                    to="/app/dashboard"
                    title={isCollapsed && !mobile ? 'View User App' : undefined}
                    className={cn(
                        "flex items-center w-full rounded-xl text-gray-400 hover:text-[#00d4aa] hover:bg-[#00d4aa]/5 transition-all duration-200 group relative overflow-hidden",
                        isCollapsed && !mobile ? "justify-center p-3" : "gap-3 px-3 py-2.5"
                    )}
                >
                    <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-[#00d4aa]/5 transition-colors duration-200 pointer-events-none" />
                    <Monitor size={19} className="shrink-0 relative z-10" />
                    <AnimatePresence initial={false}>
                        {(!isCollapsed || mobile) && (
                            <motion.span
                                key="view-app-label"
                                initial={{ opacity: 0, x: -8, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: 'auto' }}
                                exit={{ opacity: 0, x: -8, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-medium text-sm relative z-10 whitespace-nowrap"
                            >
                                View User App
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {isCollapsed && !mobile && (
                        <span className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg bg-[#0f1923] border border-white/10 text-xs text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            View User App
                        </span>
                    )}
                </NavLink>
            </div>

            {/* Logout */}
            <div className="px-2 py-2 border-t border-white/10 shrink-0">
                <button
                    onClick={handleLogout}
                    title={isCollapsed && !mobile ? 'Logout' : undefined}
                    className={cn(
                        "flex items-center w-full rounded-xl text-gray-400 hover:text-red-400 transition-all duration-200 group relative overflow-hidden",
                        isCollapsed && !mobile ? "justify-center p-3" : "gap-3 px-3 py-2.5"
                    )}
                >
                    <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-red-500/5 transition-colors duration-200 pointer-events-none" />
                    <LogOut size={19} className="shrink-0 relative z-10" />
                    <AnimatePresence initial={false}>
                        {(!isCollapsed || mobile) && (
                            <motion.span
                                key="logout-label"
                                initial={{ opacity: 0, x: -8, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: 'auto' }}
                                exit={{ opacity: 0, x: -8, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-medium text-sm relative z-10"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {isCollapsed && !mobile && (
                        <span className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg bg-[#0f1923] border border-white/10 text-xs text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#0b0e14' }}>

            {/* ── Fixed atmospheric background ─────────────────────────── */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #0b0e14 0%, #0d1120 55%, #0b0e14 100%)',
                }} />
                <div style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: 700, height: 700, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(50,70,110,0.16) 0%, transparent 65%)',
                    filter: 'blur(40px)',
                }} />
                <div style={{
                    position: 'absolute', top: '20%', right: '-8%',
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(90,40,40,0.12) 0%, transparent 65%)',
                    filter: 'blur(50px)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }} />
            </div>

            {/* ── DESKTOP Sidebar ─────────────────────────────────────────── */}
            <aside
                className="hidden md:block border-r border-white/[0.08] fixed top-0 left-0 h-full z-40"
                style={{
                    background: 'rgba(13,17,32,0.80)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    width: sidebarWidth,
                    transition: isDragging ? 'none' : 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <NavContent />

                {/* Resize Handle */}
                <div
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    className="absolute top-0 right-0 h-full w-3 flex items-center justify-center cursor-col-resize z-50 select-none group"
                    title="Drag to resize"
                >
                    <div className="w-px h-full bg-white/[0.08] group-hover:bg-teal-400/40 group-active:bg-teal-400/70 transition-colors duration-200" />
                    <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <GripVertical size={14} className="text-white/30" />
                    </div>
                </div>
            </aside>

            {/* ── MOBILE: Backdrop ─────────────────────────────────────────── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── MOBILE: Drawer ────────────────────────────────────────────── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        key="drawer"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
                        className="fixed top-0 left-0 h-full w-64 border-r border-white/10 z-50 md:hidden flex flex-col"
                        style={{ background: 'rgba(13,17,32,0.97)', backdropFilter: 'blur(24px)' }}
                    >
                        <NavContent mobile />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Main content area ─────────────────────────────────────────── */}
            <style>{`
                @media (min-width: 768px) {
                    #admin-main-content {
                        margin-left: ${sidebarWidth}px;
                        transition: ${isDragging ? 'none' : 'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)'};
                    }
                }
            `}</style>

            <div id="admin-main-content" className="flex flex-col min-h-screen">
                {/* Mobile Top Bar */}
                <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-white/10 sticky top-0 z-30"
                    style={{ background: 'rgba(13,17,32,0.90)', backdropFilter: 'blur(16px)' }}>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-300"
                            style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.25)' }}>
                            <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none">
                                <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="#00d4aa" strokeWidth="10" strokeLinecap="round" />
                                <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="16" fill="#ef4444" />
                                <circle cx="50" cy="50" r="6" fill="#0b0e14" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold tracking-tight text-white"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Crime<span style={{ color: '#00d4aa' }}>Lense</span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest px-1 py-0.5 rounded-md bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                                Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Nav Progress Bar */}
                <NavProgress locationKey={location.key} />

                {/* ── Page Content ── */}
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
                    <div
                        key={location.key}
                        style={{ animation: 'adminPageIn 0.32s cubic-bezier(0.22,1,0.36,1) both' }}
                    >
                        <Outlet />
                    </div>
                    <style>{`
                        @keyframes adminPageIn {
                            from { opacity: 0; transform: translateX(18px); }
                            to   { opacity: 1; transform: translateX(0); }
                        }
                    `}</style>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
