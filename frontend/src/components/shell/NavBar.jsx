import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, Map as MapIcon, ChevronDown, BarChart2, Lightbulb, MapPin, Radar, Clock, ShieldCheck, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/* ─── Nav Links ─────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'Dashboard', path: '/app/dashboard' },
  { name: 'Tools', path: '/app/safe-route' },
  { name: 'Live Map', path: '/app/live-map' },
];

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

/* ─── NavBar ─────────────────────────────────────────────────────────────── */
const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const dropdownRef = useRef(null);
  const exploreRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setShowExplore(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const isLinkActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 60,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* 3-column grid so centre is truly centred */}
      <div className="max-w-[1600px] mx-auto h-full grid grid-cols-3 items-center px-5">

        {/* ── Col 1: Logo (left) ────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group w-fit"
        >
          {/* Iris logo */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" />
              <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="white" strokeWidth="10" strokeLinecap="round" />
              <circle cx="50" cy="50" r="16" fill="#ef4444" />
              <circle cx="50" cy="50" r="6" fill="var(--surface)" />
            </svg>
          </div>

          {/* Wordmark */}
          <span className="text-xl font-bold tracking-tight transition-colors duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            Crime<span style={{ color: 'var(--accent)' }}>Lense</span>
          </span>
        </Link>

        {/* ── Col 2: Nav links (truly centered) ─────────────────── */}
        <div className="hidden md:flex items-center justify-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 group"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  fontWeight: active ? '600' : '500',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {link.name}
                <span
                  className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: 'var(--accent)', opacity: active ? 1 : 0 }}
                />
              </Link>
            );
          })}

          <div className="relative ml-1" ref={exploreRef}>
            <button
              onClick={() => setShowExplore(v => !v)}
              className="relative flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 group"
              style={{
                color: showExplore ? 'var(--text-primary)' : 'var(--text-muted)',
                background: showExplore ? 'var(--surface-elevated)' : 'transparent',
                fontWeight: showExplore ? '600' : '500',
              }}
              onMouseEnter={e => { if (!showExplore) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!showExplore) e.currentTarget.style.color = 'var(--text-muted)'; }}
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
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 top-[60px] cursor-default"
                    style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', zIndex: 40 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowExplore(false);
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[600px] rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background: 'var(--surface-elevated)',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <div className="p-6 relative">
                      {/* Background glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 pointer-events-none" style={{ background: 'var(--accent-dim)', opacity: 0.5 }} />

                      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Explore Platform</h3>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Discover AI-powered safety insights and tools.</p>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                          <Radar size={20} style={{ color: 'var(--accent)' }} />
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
                            <p className="text-xs font-bold uppercase tracking-wider mb-4 px-1" style={{ color: 'var(--accent)' }}>{group.group}</p>
                            <div className="space-y-2">
                              {group.items.map(item => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => setShowExplore(false)}
                                  className="flex items-start gap-3 p-2 rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                                  style={{ color: 'var(--text-muted)' }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.background = 'var(--surface)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5 border"
                                    style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                                  >
                                    <item.icon size={16} />
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
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Col 3: Controls (right) ───────────────────────────── */}
        <div className="flex items-center justify-end gap-2">


          {/* User area */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(o => !o)}
                className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 overflow-hidden"
                style={{
                  background: 'var(--accent-dim)',
                  border: '2px solid var(--accent-border)',
                  color: 'var(--accent)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
              >
                {user?.displayPicture ? (
                  <img src={user.displayPicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getUserInitials()
                )}
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border overflow-hidden z-50"
                    style={{
                      top: '100%',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-default)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>
                        {user?.email || 'Protected account'}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Link to="/my-routes" onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <MapIcon size={15} /> My Routes
                      </Link>

                      {/* Conditional Admin Panel Link */}
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Shield size={15} /> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <User size={15} /> Profile
                      </Link>
                      <div className="h-px my-1" style={{ background: 'var(--border-subtle)' }} />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(192,54,78,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-150"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)'; }}
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
