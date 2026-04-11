import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/* ══════════════════════════════════════════════════════════════════
   CUSTOM SVG ICONS
══════════════════════════════════════════════════════════════════ */
const IcoRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" />
    <path d="M6 17V9a2 2 0 0 1 2-2h4" />
    <polyline points="14 4 18 5 17 9" />
  </svg>
);
const IcoHeatmap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IcoPredict = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IcoCompare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="3" width="9" height="18" rx="2" /><rect x="13" y="3" width="9" height="18" rx="2" />
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoTip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcoTrendDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
);

const glass = {
  background: 'var(--surface)',
  border: '1px solid var(--border-subtle)',
  boxShadow: 'var(--card-shadow)',
};

/* ══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
══════════════════════════════════════════════════════════════════ */
const useCountUp = (target, duration = 1400, start = 0) => {
  const [value, setValue] = useState(start);
  const raf = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const isFloat = String(target).includes('.');
    const isPct = String(target).includes('%');
    const num = parseFloat(String(target).replace('%', ''));

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (num - start) * eased;
      setValue(isFloat ? current.toFixed(1) : Math.round(current));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, start]);

  return String(target).includes('%') ? `${value}%` : String(value);
};

/* ══════════════════════════════════════════════════════════════════
   SVG SPARKLINE
══════════════════════════════════════════════════════════════════ */
const Sparkline = ({ data, color, height = 32 }) => {
  const width = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const area = `M0,${height} L${pts.split(' ').map(p => p).join(' L')} L${width},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = pts.split(' ').at(-1)?.split(',') || ['0', '0'];
        return <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />;
      })()}
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════
   TOOL CARD
══════════════════════════════════════════════════════════════════ */
const TiltCard = ({ tool, navigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden select-none"
      style={{
        ...glass,
        border: hovered ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.10)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered
          ? 'inset 0 1px 0 rgba(255,255,255,0.13), 0 18px 40px rgba(0,0,0,0.30)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.22)',
      }}
    >
      {/* Subtle white wash on hover */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{ background: 'rgba(255,255,255,0.025)', opacity: hovered ? 1 : 0 }} />

      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', opacity: hovered ? 1 : 0 }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: `${tool.accent}14`,
            border: `1px solid ${tool.accent}30`,
            color: tool.accent,
          }}>
          <tool.Icon />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          {tool.tag}
        </span>
      </div>

      {/* Text */}
      <div className="relative z-10 mb-3">
        <h3 className="text-sm font-semibold mb-1.5 text-white">{tool.name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
      </div>

      {/* CTA Button */}
      <button 
        onClick={() => navigate(tool.path)}
        className="mt-auto relative z-10 w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
        style={{ 
          background: hovered ? tool.accent : 'rgba(255,255,255,0.05)',
          color: hovered ? '#fff' : tool.accent,
          border: hovered ? `1px solid ${tool.accent}` : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {tool.cta} {hovered && <IcoArrow />}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   USER-FRIENDLY AI INSIGHT CARD
══════════════════════════════════════════════════════════════════ */
const UserInsightCard = ({ insight, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col gap-3 cursor-default"
    style={{
      background: 'var(--surface)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${insight.accent}`,
      borderRadius: 14,
      padding: '18px 20px',
    }}
  >
    {/* Category + AI label */}
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em]"
        style={{ color: insight.accent }}>
        {insight.category}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.2)' }}>
        AI Generated
      </span>
    </div>

    {/* Title */}
    <h3 className="text-sm font-semibold text-white leading-snug">
      {insight.title}
    </h3>

    {/* Summary */}
    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
      {insight.summary}
    </p>

    {/* Tip */}
    <div className="border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: 'rgba(255,255,255,0.3)' }}>
        Recommended Action
      </p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {insight.tip}
      </p>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-1">
      <span className="text-[10px] font-medium" style={{ color: insight.accent }}>
        {insight.certainty} confidence
      </span>
      <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
        {insight.updated}
      </span>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════
   ANIMATED METRIC CARD
══════════════════════════════════════════════════════════════════ */
const MetricCard = ({ stat, delay }) => {
  const animatedValue = useCountUp(stat.rawValue, 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl px-5 py-4 relative overflow-hidden transition-all duration-300 group cursor-default"
      style={glass}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid rgba(${stat.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')},0.25)`;
        e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Corner glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${stat.color}30 0%, transparent 70%)` }} />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)` }} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}32`, color: stat.color }}>
              <stat.Icon />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              {stat.label}
            </p>
          </div>
          <p className="text-3xl font-extrabold tracking-tight leading-none text-white mb-1">
            {stat.suffix ? `${animatedValue}${stat.suffix}` : animatedValue}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded`}
              style={{
                color: stat.trendUp ? '#00d4aa' : '#ef4444',
                background: stat.trendUp ? 'rgba(0,212,170,0.12)' : 'rgba(239,68,68,0.12)',
              }}>
              {stat.trendUp ? <IcoTrendUp /> : <IcoTrendDown />}
              {stat.trend}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{stat.sub}</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 mt-1">
          <Sparkline data={stat.spark} color={stat.color} />
        </div>
      </div>
    </motion.div>
  );
};



/* ══════════════════════════════════════════════════════════════════
   LIVE ALERT FEED
══════════════════════════════════════════════════════════════════ */
const ALERTS = [
  { level: 'high', area: 'Downtown', msg: 'Crime spike +34% — avoid after dark.', time: '2m' },
  { level: 'medium', area: 'Eastgate', msg: '3 new incidents near central market.', time: '18m' },
  { level: 'low', area: 'Riverside', msg: 'All-clear — safe corridor confirmed.', time: '1h' },
  { level: 'medium', area: 'Northside', msg: 'Road closure advisory in effect.', time: '2h' },
];
const L_CFG = {
  high: { c: '#ef4444', label: 'HIGH' },
  medium: { c: '#0ea5e9', label: 'MED' },
  low: { c: '#00d4aa', label: 'LOW' },
};

const AlertFeed = () => (
  <div className="flex flex-col">
    {ALERTS.map((a, i) => {
      const cfg = L_CFG[a.level];
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
          className="flex items-start gap-3 py-3 border-b last:border-b-0 last:pb-0 first:pt-0 group/alert cursor-default transition-colors duration-150 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          {/* Pulsing dot */}
          <div className="relative mt-1.5 shrink-0">
            <span className="block w-2 h-2 rounded-full" style={{ background: cfg.c }} />
            {a.level === 'high' && (
              <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: cfg.c }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-white">{a.area}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ color: cfg.c, background: `${cfg.c}18` }}>{cfg.label}</span>
            </div>
            <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{a.msg}</p>
          </div>
          <span className="text-[10px] font-mono shrink-0 mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-faint)' }}>
            <IcoClock />{a.time}
          </span>
        </motion.div>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════════════════════════════════ */
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-faint)' }}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════════
   DAILY TIPS
══════════════════════════════════════════════════════════════════ */
const TIPS = [
  "Keep your phone in your front pocket in busy or crowded areas.",
  "Share your live location with a trusted contact when going out at night.",
  "Always park in well-lit, monitored areas — avoid isolated spots.",
  "Avoid wearing headphones in both ears on isolated streets.",
  "Memorise at least one emergency number by heart.",
  "Stay aware of your surroundings every 30 seconds in crowded transit hubs.",
  "Keep a digital copy of important documents in a secure cloud folder.",
];
const getDailyTip = () => {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return TIPS[day % TIPS.length];
};

/* ══════════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════════ */
const STATS = [
  {
    label: 'Active Hotspots',
    rawValue: 12, suffix: '',
    trend: '+3 today', trendUp: false,
    sub: 'Across 5 districts',
    Icon: IcoPin, color: '#ef4444',
    spark: [6, 8, 7, 10, 9, 11, 12],
  },
  {
    label: 'Safe Routes',
    rawValue: 847, suffix: '',
    trend: '+124', trendUp: true,
    sub: 'Last 24 hours',
    Icon: IcoRoute, color: '#00d4aa',
    spark: [520, 640, 710, 690, 780, 810, 847],
  },
  {
    label: 'AI Confidence',
    rawValue: 94, suffix: '%',
    trend: '+1.2%', trendUp: true,
    sub: 'Live accuracy',
    Icon: IcoShield, color: '#0ea5e9',
    spark: [88, 90, 91, 89, 92, 93, 94],
  },
];

const TOOLS = [
  { id: 'route', Icon: IcoRoute, name: 'Safe Route Finder', desc: 'Plan the safest path between two locations, auto-avoiding high-risk zones.', path: '/app/tools?tool=route', accent: '#00d4aa', tag: 'Navigation', cta: 'Find Safe Route' },
  { id: 'heatmap', Icon: IcoHeatmap, name: 'Live Crime Heatmap', desc: 'Visualise real-time incident density across every district on an animated map.', path: '/app/live-map', accent: '#0ea5e9', tag: 'Map', cta: 'View Heatmap' },
  { id: 'predict', Icon: IcoPredict, name: 'Risk Prediction', desc: 'AI forecasts based on thousands of historical incident patterns.', path: '/app/tools?tool=prediction', accent: '#00d4aa', tag: 'AI', cta: 'Check Risk Now' },
  { id: 'compare', Icon: IcoCompare, name: 'Compare Areas', desc: 'Side-by-side safety comparison of multiple neighbourhoods across crime categories.', path: '/app/tools?tool=compare', accent: '#0ea5e9', tag: 'Analysis', cta: 'Analyze Area' },
];

/* User-friendly AI insights — plain language, no ML jargon */
const USER_INSIGHTS = [
  {
    title: 'Crime rising in Gulshan after 6 PM',
    category: 'High-Risk Area',
    summary: 'Our AI has noticed more incidents in the Gulshan district during evening hours. If you are in or near this area, stick to main, well-lit roads and avoid isolated streets.',
    tip: 'Try to complete errands in Gulshan before 6 PM, or use our Safe Route tool to find a safer path.',
    accent: '#ef4444',
    certainty: 'Very High',
    updated: '10 min ago',
  },
  {
    title: 'Unusual activity near University Road',
    category: 'Activity Spike',
    summary: 'Several phone snatching incidents have been reported near University Road over the last few hours — significantly more than usual for this time of day.',
    tip: 'Keep your phone stored away and avoid using it while walking in this area.',
    accent: '#0ea5e9',
    certainty: 'High',
    updated: '25 min ago',
  },
  {
    title: 'Late-night hours are riskier this weekend',
    category: 'Upcoming Risk',
    summary: 'Based on patterns from past weekends, our AI predicts a higher chance of incidents in commercial areas on Friday and Saturday nights. Plan ahead to stay safe.',
    tip: 'Going out this weekend? Share your live location with a trusted contact and park in well-lit areas.',
    accent: '#00d4aa',
    certainty: 'High',
    updated: '1h ago',
  },
  {
    title: 'Riverside corridor — confirmed safe',
    category: 'Safe Zone',
    summary: 'Riverside corridor has had zero incidents in the past two weeks. Our AI has confirmed it as a low-risk zone and a reliable alternative route.',
    tip: 'Consider using Riverside as an alternative if you normally pass through higher-risk areas.',
    accent: '#00d4aa',
    certainty: 'Very High',
    updated: '2h ago',
  },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/* ══════════════════════════════════════════════════════════════════
   PERSONALIZED AREA INSIGHTS
══════════════════════════════════════════════════════════════════ */
const PERSONALIZED_DATA = {
  'Gulshan': {
    riskLvl: 'High', score: 82, trend: '+12%', color: '#ef4444',
    alerts: [
      { id: 1, title: 'Evening Snatching Spikes', desc: 'Avoid solitary walks after 6 PM near main markets. Use main arterial roads.', Icon: IcoShield },
      { id: 2, title: 'Alternative Route Suggested', desc: 'University Rd is currently a safer parallel option.', Icon: IcoRoute }
    ]
  },
  'DHA Phase 5': {
    riskLvl: 'Low', score: 28, trend: '-5%', color: '#00d4aa',
    alerts: [
      { id: 1, title: 'Routine Patrols Active', desc: 'Increased security presence mapped in commercial sectors. All clear.', Icon: IcoShield }
    ]
  },
  'Clifton': {
    riskLvl: 'Medium', score: 56, trend: '+4%', color: '#0ea5e9',
    alerts: [
      { id: 1, title: 'Weekend Traffic & Pickpockets', desc: 'High congestion expected near the beach. Keep belongings secured.', Icon: IcoPin }
    ]
  }
};

const PersonalizedInsights = () => {
  const [area, setArea] = useState('Gulshan');
  const data = PERSONALIZED_DATA[area];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-2xl p-5 relative overflow-hidden flex flex-col" style={glass}>
      {/* Background glow behind widget based on risk level */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none transition-all duration-1000 blur-[80px]" style={{ background: data.color, opacity: 0.1 }} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>Personalized Safety Insights</h2>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Tailored alerts based on your selected location</p>
        </div>
        <div className="relative group">
          <select 
            value={area} 
            onChange={e => setArea(e.target.value)}
            className="appearance-none bg-transparent text-sm font-bold text-white pl-4 pr-10 py-2.5 rounded-xl outline-none cursor-pointer transition-all w-full sm:w-auto"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          >
            {Object.keys(PERSONALIZED_DATA).map(loc => (
              <option key={loc} value={loc} className="bg-gray-900 text-white">{loc}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }}>
            <IcoArrow />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={area}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10"
        >
          {/* Risk Score Gauge Component */}
          <div className="rounded-xl p-6 flex items-center justify-center flex-col text-center relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${data.color} 0%, transparent 70%)` }} />
            
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <motion.circle 
                  cx="48" cy="48" r="44" fill="none" 
                  stroke={data.color} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray="276"
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * (data.score / 100)) }}
                  transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black tracking-tighter leading-none" style={{ color: '#fff' }}>{data.score}</span>
              </div>
            </div>

            <div className="text-[14px] font-bold tracking-wide uppercase mb-1" style={{ color: data.color }}>{data.riskLvl} RISK</div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
               {data.trend.startsWith('+') ? <span style={{color: '#ef4444'}}>▲</span> : <span style={{color: '#00d4aa'}}>▼</span>}
               <span style={{ color: 'var(--text-muted)' }}>{data.trend.replace(/[+-]/g, '')} vs last week</span>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="md:col-span-2 flex flex-col justify-center gap-3">
            {data.alerts.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className="flex gap-4 p-4 rounded-xl items-start relative overflow-hidden transition-all duration-300 hover:scale-[1.01]" 
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `linear-gradient(90deg, ${data.color}, transparent)` }} />
                <div className="w-9 h-9 rounded-full flex flex-shrink-0 items-center justify-center relative z-10" style={{ background: `${data.color}15`, color: data.color, border: `1px solid ${data.color}30` }}>
                  <alert.Icon />
                </div>
                <div className="relative z-10 mt-0.5">
                  <h4 className="text-[13px] font-bold text-white mb-1 leading-snug">{alert.title}</h4>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{alert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════

   FUTURE RISK FORECAST
══════════════════════════════════════════════════════════════════ */
const FORECAST_DATA = [
  { label: 'Now', risk: 'Low', color: '#00d4aa' },
  { label: 'In 3h', risk: 'Low', color: '#00d4aa' },
  { label: 'In 6h', risk: 'Medium', color: '#0ea5e9' },
  { label: 'Tonight', risk: 'High', color: '#ef4444' },
  { label: 'Tomorrow', risk: 'Medium', color: '#0ea5e9' },
  { label: 'Weekend', risk: 'Low', color: '#00d4aa' },
];

const FutureRiskForecast = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-5 w-full relative overflow-hidden flex flex-col gap-4" style={glass}>
    <div className="flex items-center justify-between">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>Future Risk Forecast</h2>
      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Updated hourly</span>
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {FORECAST_DATA.map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all duration-300" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[10px] font-semibold mb-2.5 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
          <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}80` }} />
          <span className="text-[9.5px] font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.risk}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const firstName = isAuthenticated && user?.name ? user.name.split(' ')[0] : null;

  const filteredAlerts = activeTab === 'all'
    ? ALERTS
    : ALERTS.filter(a => a.level === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-[1200px] w-full relative">

      {/* ── Ambient background blobs — removed; bg handled at body level ── */}


      {/* ── Welcome Banner ───────────────────────────────────── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden', marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-2xl flex items-center gap-4 px-6 py-4"
            style={{
              background: 'linear-gradient(120deg, rgba(0,212,170,0.08) 0%, rgba(14,165,233,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,212,170,0.22)',
              boxShadow: 'inset 0 1px 0 rgba(0,212,170,0.12)',
            }}
          >
            {/* Animated shimmer gradient */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(0,212,170,0.04) 50%, transparent 60%)',
                animation: 'shimmer 3s linear infinite', backgroundSize: '200% 100%'
              }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.6), transparent)' }} />

            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10"
              style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)', color: 'var(--accent)' }}>
              <IcoShield />
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-base font-bold text-white">
                  {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
                </span>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ color: 'var(--accent)', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                  Live
                </motion.span>
                <LiveClock />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                CrimeLense AI is actively monitoring your city — all safety systems are online.
              </p>
            </div>

            <button
              onClick={() => setBannerVisible(false)}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center relative z-10 transition-all duration-150"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)'; }}
            >
              <IcoX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page heading + date ──────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Overview</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Your personal safety intelligence hub — updated in real time.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-faint)' }}>
            <IcoClock />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </motion.div>

      {/* ── Personalized Insights ────────────────────────────── */}
      <PersonalizedInsights />
      
      {/* ── Future Risk Forecast ─────────────────────────────── */}
      <FutureRiskForecast />

      {/* ── Main Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Tool Cards (2/3) */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
              Safety Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <TiltCard key={tool.id} tool={tool} navigate={navigate} />
            ))}
          </div>

        </div>

        {/* Right: Alerts + Tip (1/3) */}
        <div className="flex flex-col gap-4">

          {/* Advisories header + tab filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
              Live Advisories
            </h2>
            <div className="flex items-center gap-1">
              {['all', 'high', 'medium', 'low'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-all duration-150"
                  style={{
                    color: activeTab === tab ? 'var(--accent)' : 'var(--text-faint)',
                    background: activeTab === tab ? 'rgba(0,212,170,0.12)' : 'transparent',
                    border: activeTab === tab ? '1px solid rgba(0,212,170,0.25)' : '1px solid transparent',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Alert feed glass card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.38 }}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={glass}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,79,106,0.45), transparent)' }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((a, i) => {
                    const cfg = L_CFG[a.level];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 py-3.5 border-b last:border-b-0 last:pb-0 first:pt-0 cursor-default hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors duration-150"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <div className="relative mt-1.5 shrink-0">
                          <span className="block w-2 h-2 rounded-full" style={{ background: cfg.c }} />
                          {a.level === 'high' && (
                            <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: cfg.c }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-bold text-white">{a.area}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                              style={{ color: cfg.c, background: `${cfg.c}18` }}>{cfg.label}</span>
                          </div>
                          <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{a.msg}</p>
                        </div>
                        <span className="text-[10px] font-mono shrink-0 mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-faint)' }}>
                          <IcoClock />{a.time}
                        </span>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-faint)' }}>
                    No {activeTab} alerts right now.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Daily Tip card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.38 }}
            className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={glass}
          >
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)' }} />

            <div className="flex items-center gap-2 relative z-10">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--accent)' }}>
                <IcoTip />
              </div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
                Daily Safety Tip
              </h2>
            </div>
            <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--text-muted)' }}>
              {getDailyTip()}
            </p>
          </motion.div>

          {/* City Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3 relative overflow-hidden"
            style={glass}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block w-2 h-2 rounded-full shrink-0"
              style={{ background: '#0ea5e9', boxShadow: '0 0 6px rgba(14,165,233,0.6)' }}
            />
            <span className="text-xs flex-1" style={{ color: 'var(--text-muted)' }}>
              City safety trend this month:&nbsp;
              <span className="font-bold" style={{ color: '#0ea5e9' }}>Stable</span>
            </span>
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{ color: 'var(--text-faint)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              30d avg
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── AI Safety Insights ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', color: '#00d4aa' }}>
              ✦
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">AI Safety Insights</h2>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>Personalised by CrimeLense AI · Updates every 15 min</p>
            </div>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ color: '#00d4aa', background: 'rgba(0,212,170,0.10)', border: '1px solid rgba(0,212,170,0.22)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4aa' }} />
            Live
          </motion.span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {USER_INSIGHTS.map((insight, i) => (
            <UserInsightCard key={insight.title} insight={insight} delay={0.55 + i * 0.08} />
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
