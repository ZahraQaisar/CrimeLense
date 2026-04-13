import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, LogOut, Shield, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/* ─── Nav Links ─────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'Dashboard', path: '/app/dashboard' },
  { name: 'Tools', path: '/app/tools' },
  { name: 'Live Map', path: '/app/live-map' },
];

/* ─── NavBar ─────────────────────────────────────────────────────────────── */
const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
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
              <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="var(--info)" strokeWidth="10" strokeLinecap="round" />
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
        </div>

        {/* ── Col 3: Controls (right) ───────────────────────────── */}
        <div className="flex items-center justify-end gap-2">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

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
