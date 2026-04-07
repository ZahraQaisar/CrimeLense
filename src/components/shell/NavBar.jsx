import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { name: 'Dashboard', path: '/app/dashboard' },
  { name: 'Tools', path: '/app/tools' },
  { name: 'Live Map', path: '/app/live-map' },
  { name: 'About', path: '/about' },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: '60px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group shrink-0">
        <div
          className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-neon-teal/10 to-blue-600/10 shadow-[0_0_20px_rgba(20,241,217,0.2)] group-hover:shadow-[0_0_30px_rgba(20,241,217,0.4)] transition-all duration-300 border border-neon-teal/20"
          style={{
            width: 34,
            height: 34,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-neon-teal" />
            <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-blue-500" />
            <circle cx="50" cy="50" r="16" fill="currentColor" className="text-white" />
            <circle cx="50" cy="50" r="6" fill="currentColor" className="text-deep-navy" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-neon-teal transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Crime<span className="text-neon-teal transition-colors duration-300">Lense</span>
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
          return (
            <Link
              key={link.name}
              to={link.path}
              className="relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                background: isActive ? 'var(--border-subtle)' : 'transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {link.name}
              {isActive && (
                <span
                  className="absolute rounded-full left-1/2 -translate-x-1/2"
                  style={{ width: 16, height: 2, background: 'var(--accent)', bottom: 2 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right — theme toggle + user avatar */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="flex items-center justify-center rounded-lg transition-all duration-150"
          style={{
            width: 34,
            height: 34,
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-border)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--accent-dim)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isDark
            ? <Sun size={16} strokeWidth={2} />
            : <Moon size={16} strokeWidth={2} />
          }
        </button>

        {/* User area */}
        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <button
              className="flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200"
              style={{
                width: 36,
                height: 36,
                background: 'var(--accent-dim)',
                border: '1.5px solid var(--accent-border)',
                color: 'var(--accent)',
              }}
            >
              {user?.displayPicture
                ? <img src={user.displayPicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                : <span>{getUserInitials()}</span>
              }
            </button>

            {showUserDropdown && (
              <div
                className="absolute right-0 mt-1 rounded-xl overflow-hidden z-50"
                style={{
                  top: '100%',
                  width: 180,
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                }}
              >
                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--border-subtle)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <User size={15} /> Profile
                </Link>
                <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--border-subtle)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-150"
            style={{
              color: 'var(--text-primary)',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
