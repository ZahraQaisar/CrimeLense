import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap, Navigation, BarChart2,
  Map, Bell, FileText, Settings, HelpCircle, Users
} from 'lucide-react';

const quickAccess = [
  { name: 'Crime Prediction', path: '/app/tools?tool=prediction', icon: Zap, color: 'var(--danger)' },
  { name: 'Safe Route Finder', path: '/app/tools?tool=route', icon: Navigation, color: 'var(--accent)' },
  { name: 'Compare Areas', path: '/app/tools?tool=compare', icon: BarChart2, color: 'var(--info)' },
];

const insights = [
  { name: 'Live Map', path: '/app/live-map', icon: Map, color: 'var(--accent)' },
  { name: 'Alerts & Reports', path: '/app/dashboard', icon: Bell, color: 'var(--warning)' },
  { name: 'Community', path: '/app/community-feed', icon: Users, color: 'var(--info)' },
];

const preferences = [
  { name: 'Settings', path: '/app/settings', icon: Settings, color: 'var(--text-muted)' },
  { name: 'Help & Support', path: '/app/help', icon: HelpCircle, color: 'var(--text-muted)' },
];

const SidebarItem = ({ item, isActive }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 group"
      style={{
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--border-subtle)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {/* Icon box */}
      <div
        className="flex items-center justify-center rounded-lg shrink-0 transition-all duration-150"
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: 'transparent',
          border: '1px solid transparent',
        }}
      >
        <Icon
          size={16}
          color={isActive ? '#26CCC2' : '#6B7280'}
          strokeWidth={2}
        />
      </div>
      {/* Label */}
      <span
        className="text-sm font-medium"
        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        {item.name}
      </span>


    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.path.includes('?')) {
      const [base, query] = item.path.split('?');
      return location.pathname === base && location.search.includes(query.split('=')[1]);
    }
    return location.pathname === item.path;
  };

  return (
    <aside
      className="fixed left-0 flex flex-col"
      style={{
        top: 60,
        bottom: 0,
        width: 240,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '20px 12px',
        overflowY: 'auto',
      }}
    >
      {/* Quick Access */}
      <div className="mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          style={{ color: 'var(--text-faint)', letterSpacing: '0.08em' }}
        >
          Quick Access
        </p>
        <div className="flex flex-col gap-1">
          {quickAccess.map((item) => (
            <SidebarItem key={item.name} item={item} isActive={isItemActive(item)} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 12px 20px' }} />

      {/* Insights */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          style={{ color: 'var(--text-faint)', letterSpacing: '0.08em' }}
        >
          Insights
        </p>
        <div className="flex flex-col gap-1">
          {insights.map((item) => (
            <SidebarItem key={item.name} item={item} isActive={isItemActive(item)} />
          ))}
        </div>
      </div>

      {/* Preferences (bottom) */}
      <div className="mt-auto pt-6">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          style={{ color: 'var(--text-faint)', letterSpacing: '0.08em' }}
        >
          Preferences
        </p>
        <div className="flex flex-col gap-1">
          {preferences.map((item) => (
            <SidebarItem key={item.name} item={item} isActive={isItemActive(item)} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
