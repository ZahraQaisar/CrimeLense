import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, color = 'neutral', sublabel = '' }) => {
  const colorVars = {
    teal: 'var(--accent)',
    red: 'var(--danger)',
    blue: 'var(--info)',
    neutral: 'var(--text-primary)',
  };
  const glowVars = {
    teal: 'rgba(0,212,170,0.07)',
    red: 'rgba(255,79,106,0.07)',
    blue: 'rgba(74,158,255,0.07)',
    neutral: 'transparent',
  };

  const c = colorVars[color] || colorVars.neutral;
  const glow = glowVars[color] || 'transparent';
  const trendValue = parseFloat(trend);
  const isPositive = trendValue > 0;
  const isNeutral = !trend || trendValue === 0;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        boxShadow: `0 0 30px ${glow}`,
        transition: 'transform 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex items-end gap-3">
        <span
          className="text-4xl font-bold leading-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: c }}
        >
          {value}
        </span>
        {!isNeutral && (
          <div
            className="flex items-center gap-1 text-xs font-medium mb-1 px-2 py-0.5 rounded-full"
            style={{
              color: isPositive ? 'var(--danger)' : 'var(--accent)',
              background: isPositive ? 'rgba(255,79,106,0.1)' : 'rgba(0,212,170,0.1)',
            }}
          >
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trendValue)}%
          </div>
        )}
      </div>
      {sublabel && (
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{sublabel}</p>
      )}
      <svg width="100%" height="24" viewBox="0 0 120 24" preserveAspectRatio="none">
        <polyline
          points="0,18 20,14 40,16 60,10 80,12 100,8 120,11"
          fill="none"
          stroke={c}
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <circle cx="120" cy="11" r="2.5" fill={c} opacity="0.6" />
      </svg>
    </div>
  );
};

export default StatCard;
