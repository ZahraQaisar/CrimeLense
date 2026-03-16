import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Settings, LogOut, ShieldAlert, Menu, X, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const MIN_WIDTH = 60;      // fully collapsed (icons only)
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 256;
const COLLAPSE_THRESHOLD = 130; // below this → icon-only mode

const menuItems = [
    { icon: LayoutDashboard, label: 'System Overview', path: '/admin' },
    { icon: Map,             label: 'Manage Hotspots', path: '/admin/hotspots' },
    { icon: Users,           label: 'User Management', path: '/admin/users' },
    { icon: ShieldAlert,     label: 'Incident Logs',   path: '/admin/logs' },
    { icon: Settings,        label: 'System Settings', path: '/admin/settings' },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDragging, setIsDragging]     = useState(false);

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
        window.addEventListener('mouseup',   onUp);
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
        const onEnd  = () => setIsDragging(false);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend',  onEnd);
        return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    }, [isDragging]);

    // ── Prevent text selection while dragging ────────────────────────────────
    useEffect(() => {
        document.body.style.userSelect = isDragging ? 'none' : '';
        document.body.style.cursor = isDragging ? 'col-resize' : '';
        return () => { document.body.style.userSelect = ''; document.body.style.cursor = ''; };
    }, [isDragging]);

    // ── Sidebar nav content (shared between desktop & mobile drawer) ─────────
    const NavContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo header */}
            <div className={cn(
                "flex items-center border-b border-white/10 shrink-0 h-16",
                isCollapsed && !mobile ? "justify-center px-2" : "px-4 justify-between"
            )}>
                {(!isCollapsed || mobile) && (
                    <h1 className="font-bold text-base text-white whitespace-nowrap truncate">
                        CrimeLense <span className="text-danger">Admin</span>
                    </h1>
                )}
                {isCollapsed && !mobile && (
                    <span className="font-extrabold text-danger text-xl">C</span>
                )}
                {mobile && (
                    <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-none">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={mobile ? () => setIsMobileOpen(false) : undefined}
                        title={isCollapsed && !mobile ? item.label : undefined}
                        className={({ isActive }) => cn(
                            "flex items-center rounded-xl transition-all duration-200 group relative",
                            isCollapsed && !mobile
                                ? "justify-center p-3"
                                : "gap-3 px-3 py-3",
                            isActive
                                ? "bg-danger/10 text-danger shadow-[0_0_15px_rgba(255,77,77,0.1)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {(!isCollapsed || mobile) && (
                            <span className="font-medium text-sm whitespace-nowrap overflow-hidden">{item.label}</span>
                        )}
                        {/* Hover tooltip in collapsed mode */}
                        {isCollapsed && !mobile && (
                            <span className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg bg-[#0f1923] border border-white/10 text-xs text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.label}
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Logout */}
            <div className="px-2 py-2 border-t border-white/10 shrink-0">
                <button
                    onClick={handleLogout}
                    title={isCollapsed && !mobile ? 'Logout' : undefined}
                    className={cn(
                        "flex items-center w-full rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group relative",
                        isCollapsed && !mobile ? "justify-center p-3" : "gap-3 px-3 py-3"
                    )}
                >
                    <LogOut size={20} className="shrink-0" />
                    {(!isCollapsed || mobile) && <span className="font-medium text-sm">Logout</span>}
                    {isCollapsed && !mobile && (
                        <span className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg bg-[#0f1923] border border-white/10 text-xs text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-deep-navy">

            {/* ── DESKTOP Sidebar (fixed, resizable) ─────────────────────── */}
            <aside
                className="hidden md:block glass-panel border-r border-white/10 fixed top-0 left-0 h-full z-40"
                style={{
                    width: sidebarWidth,
                    transition: isDragging ? 'none' : 'width 0.12s ease',
                }}
            >
                <NavContent />

                {/* ── Resize Handle ── */}
                <div
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    className="absolute top-0 right-0 h-full w-3 flex items-center justify-center cursor-col-resize z-50 select-none group"
                    title="Drag to resize"
                >
                    {/* The visible vertical line */}
                    <div className="w-px h-full bg-white/10 group-hover:bg-neon-teal/50 group-active:bg-neon-teal transition-colors duration-150" />
                    {/* Grip dots in center */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <GripVertical size={14} className="text-neon-teal" />
                    </div>
                </div>
            </aside>

            {/* ── MOBILE: Drawer + Backdrop ───────────────────────────────── */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-64 border-r border-white/10 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
                style={{ background: '#0d1117' }}
            >
                <NavContent mobile />
            </aside>

            {/* ── Main content area ───────────────────────────────────────── */}
            {/* Desktop: shifts right by sidebarWidth | Mobile: full width */}
            <div
                className="md:transition-none flex flex-col min-h-screen"
                style={{
                    // Only apply on md+ (768px+) — on mobile, ignore sidebar offset
                }}
            >
                {/* Wrapper that gets the desktop margin */}
                <div
                    className="flex flex-col min-h-screen"
                    style={{
                        marginLeft: 0,
                    }}
                >
                    {/* Inline responsive style: apply marginLeft ≥md */}
                    <style>{`
                        @media (min-width: 768px) {
                            #admin-main-content {
                                margin-left: ${sidebarWidth}px !important;
                                transition: ${isDragging ? 'none' : 'margin-left 0.12s ease'};
                            }
                        }
                    `}</style>

                    <div id="admin-main-content" className="flex flex-col min-h-screen">
                        {/* Mobile Top Bar */}
                        <div className="md:hidden flex items-center gap-3 px-4 h-14 glass-panel border-b border-white/10 sticky top-0 z-30">
                            <button
                                onClick={() => setIsMobileOpen(true)}
                                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <h1 className="font-bold text-white text-base">
                                CrimeLense <span className="text-danger">Admin</span>
                            </h1>
                        </div>

                        {/* Page Content */}
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
