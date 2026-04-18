import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, BarChart2, Lightbulb, MapPin, Radar, Clock, ShieldCheck, Award } from 'lucide-react';

const exploreLinks = [
  { group: 'Analysis', items: [{ name: 'Risk Score', path: '/risk-score', icon: ShieldCheck }, { name: 'Trend Explorer', path: '/trend-explorer', icon: BarChart2 }, { name: 'AI Insights', path: '/ai-insights', icon: Lightbulb }] },
  { group: 'Safety', items: [{ name: 'Neighborhood Report', path: '/neighborhood-summary', icon: MapPin }, { name: 'Nearby Scanner', path: '/nearby-scanner', icon: Radar }, { name: 'Awareness Hub', path: '/awareness', icon: ShieldCheck }, { name: 'Safety Quiz', path: '/safety-quiz', icon: Award }] },
  { group: 'Map Tools', items: [{ name: 'Crime Timeline', path: '/crime-timeline', icon: Clock }] },
];

/* ─── Custom SVG Icons ─────────────────────────────────────────────────── */
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IconRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="5" r="2" />
    <path d="M6 17V9a2 2 0 0 1 2-2h4" />
    <polyline points="14 4 18 5 17 9" />
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
const IconPredict = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconCompare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="2" y="3" width="9" height="18" rx="2" />
    <rect x="13" y="3" width="9" height="18" rx="2" />
  </svg>
);
const IconCommunity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ─── Nav structure ─────────────────────────────────────────────────────── */
const MAIN_NAV = [
  { name: 'Dashboard', path: '/app/dashboard', Icon: IconDashboard, exact: true },
  { name: 'Live Map', path: '/app/live-map', Icon: IconMap },
  { name: 'Community', path: '/app/community-feed', Icon: IconCommunity },
];

const TOOLS_NAV = [
  { name: 'Safe Route', path: '/app/safe-route', Icon: IconRoute },
  { name: 'Risk Predict', path: '/app/predict', Icon: IconPredict },
  { name: 'Compare Areas', path: '/app/compare', Icon: IconCompare },
  { name: 'My Routes', path: '/app/my-routes', Icon: () => <MapPin size={16} /> },
];

const PREFS_NAV = [
  { name: 'Settings', path: '/app/settings', Icon: IconSettings },
  { name: 'Help & Support', path: '/app/help', Icon: IconHelp },
];

/* ─── Item component ─────────────────────────────────────────────────────── */
const NavItem = ({ item, isActive }) => {
  const Icon = item.Icon;
  return (
    <Link
      to={item.path}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 group relative"
      style={{
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--text-muted)',
        fontWeight: isActive ? '600' : '500',
        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-muted)';
        }
      }}
    >
      <span style={{ color: isActive ? 'var(--accent)' : 'inherit', flexShrink: 0 }}>
        <Icon />
      </span>
      <span>{item.name}</span>
    </Link>
  );
};

const GroupLabel = ({ children }) => (
  <p
    className="text-[10px] font-bold uppercase tracking-[0.1em] px-3 mb-1"
    style={{ color: 'var(--text-faint)' }}
  >
    {children}
  </p>
);

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const isActive = (item) => {
    if (item.path.includes('?')) {
      const [base, qs] = item.path.split('?');
      return location.pathname === base && location.search.includes(qs.split('=')[1]);
    }
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside
      className="hidden md:flex fixed left-0 flex-col z-40"
      style={{
        top: 0,
        bottom: 0,
        width: 240,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-subtle)',
        overflowY: 'hidden',
      }}
    >
      <Link
        to="/"
        className="group flex items-center gap-2 px-5 py-4 transition-all duration-200"
        style={{ height: 60, borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none' }}
      >
        <div
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(0,212,170,0.4)]"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none">
            <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="white" strokeWidth="10" strokeLinecap="round" />
            <circle cx="50" cy="50" r="16" fill="#ef4444" />
            <circle cx="50" cy="50" r="6" fill="var(--surface)" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="transition-colors duration-200 text-white group-hover:text-neon-teal">Crime</span><span className="transition-colors duration-200 text-neon-teal">Lense</span>
        </span>
      </Link>

      {/* Inner scroll container */}
      <div className="scrollbar-hide flex-col flex-1 px-3 py-4 gap-3 flex" style={{ overflowY: 'auto' }}>

        {/* Main */}
        <div>
          <GroupLabel>Main</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {MAIN_NAV.map(item => (
              <NavItem key={item.path} item={item} isActive={isActive(item)} />
            ))}

            <button
              onClick={() => setIsExploreOpen(!isExploreOpen)}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 group"
              style={{ color: isExploreOpen ? 'var(--accent)' : 'var(--text-muted)', background: isExploreOpen ? 'var(--accent-dim)' : 'transparent' }}
              onMouseEnter={e => { if (!isExploreOpen) { e.currentTarget.style.background = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={e => { if (!isExploreOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            >
              <div className="flex items-center gap-2.5">
                <Radar size={16} /> Explore
              </div>
              <ChevronDown size={14} style={{ transform: isExploreOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {isExploreOpen && (
              <div className="pl-[38px] pt-1 flex flex-col gap-1.5 pb-2">
                {exploreLinks.flatMap((group) => group.items).map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="py-1 text-[13px] font-medium transition-colors flex items-center gap-2"
                    style={{ color: isActive(item) ? 'var(--accent)' : 'var(--text-faint)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = isActive(item) ? 'var(--accent)' : 'var(--text-faint)'; }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Tools */}
        <div>
          <GroupLabel>Safety Tools</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {TOOLS_NAV.map(item => (
              <NavItem key={item.path} item={item} isActive={isActive(item)} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Preferences */}
        <div>
          <GroupLabel>Preferences</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {PREFS_NAV.map(item => (
              <NavItem key={item.path} item={item} isActive={isActive(item)} />
            ))}
          </div>
        </div>

        {/* Bottom: user info + logout */}
        <div className="mt-auto pt-2">
          <div
            className="flex flex-col gap-2 rounded-xl p-2.5"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            {/* User row */}
            {isAuthenticated && (
              <Link to="/profile" className="flex items-center gap-3 p-1.5 -m-1.5 rounded-lg transition-colors group cursor-pointer"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
                  style={{ background: 'var(--accent-dim)', border: '1.5px solid var(--accent-border)', color: 'var(--accent)' }}
                >
                  {user?.displayPicture
                    ? <img src={user.displayPicture} alt={user.name} className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate group-hover:text-neon-teal transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-faint)' }}>
                    {user?.email || 'Protected account'}
                  </p>
                </div>
              </Link>
            )}

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />


            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-all duration-150"
              style={{ color: 'var(--danger)', background: 'transparent', border: '1px solid transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(192,54,78,0.07)';
                e.currentTarget.style.borderColor = 'rgba(192,54,78,0.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <IconLogout />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
