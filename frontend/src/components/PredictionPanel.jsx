import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Risk tier from score ──────────────────────────────────────────────── */
function getRiskTier(score) {
  if (score >= 81) return { label: 'Critical Risk',  color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(127,29,29,0.5) 100%)', barGradient: 'linear-gradient(90deg, rgba(239,68,68,0.2) 0%, #ef4444 100%)', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',   emoji: '🔴', glow: 'rgba(239,68,68,0.6)' };
  if (score >= 63) return { label: 'High Risk',      color: '#f97316', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(154,52,18,0.5) 100%)', barGradient: 'linear-gradient(90deg, rgba(249,115,22,0.2) 0%, #f97316 100%)', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.3)',  emoji: '🟠', glow: 'rgba(249,115,22,0.6)' };
  if (score >= 41) return { label: 'Moderate Risk',  color: '#eab308', gradient: 'linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(113,63,18,0.5) 100%)', barGradient: 'linear-gradient(90deg, rgba(234,179,8,0.2) 0%, #eab308 100%)', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.3)',   emoji: '🟡', glow: 'rgba(234,179,8,0.6)' };
  return              { label: 'Low Risk',           color: '#00d4aa', gradient: 'linear-gradient(135deg, rgba(0,212,170,0.2) 0%, rgba(6,78,59,0.5) 100%)', barGradient: 'linear-gradient(90deg, rgba(0,212,170,0.2) 0%, #00d4aa 100%)', bg: 'rgba(0,212,170,0.08)',   border: 'rgba(0,212,170,0.3)',   emoji: '🟢', glow: 'rgba(0,212,170,0.6)' };
}

/* ── Icons ─────────────────────────────────────────────────────────────── */
const IcoSwords = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26, color: '#0ea5e9' }}>
    <path d="M7 11.5L5.5 13l-3-3L4 8.5 7 11.5zm10-7l1.5-1.5 3 3L20 7.5 17 4.5zM12 12l2.5-2.5 1.5 1.5L13.5 13.5 12 12zm-3.5 3.5l1.5 1.5 6-6-1.5-1.5-6 6zm10 4l1.5 1.5-3 3-1.5-1.5 3-3zm-13-1l-1.5-1.5-3 3 1.5 1.5 3-3z"/>
  </svg>
);
const IcoMoon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26, color: '#0ea5e9' }}>
    <path d="M12 3c.13 0 .26.01.39.01A9 9 0 0 0 16 19.3c.72.33 1.48.56 2.29.68A9.96 9.96 0 0 1 12 22C6.48 22 2 17.52 2 12S6.48 2 12 2c0 .33-.01.66-.01 1z" />
    <circle cx="17" cy="7" r="2" fill="#fff" />
  </svg>
);
const IcoCheckBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24, color: '#0ea5e9' }}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22, color: '#0ea5e9' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IcoHouse = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, color: '#e2e8f0' }}>
    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.83l5 4.5V18h-2v-4H9v4H7v-7.67l5-4.5z" />
  </svg>
);
const IcoCar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, color: '#e2e8f0' }}>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);
const IcoSmallSwords = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, color: '#e2e8f0' }}>
    <path d="M7 11.5L5.5 13l-3-3L4 8.5 7 11.5zm10-7l1.5-1.5 3 3L20 7.5 17 4.5zM12 12l2.5-2.5 1.5 1.5L13.5 13.5 12 12zm-3.5 3.5l1.5 1.5 6-6-1.5-1.5-6 6zm10 4l1.5 1.5-3 3-1.5-1.5 3-3zm-13-1l-1.5-1.5-3 3 1.5 1.5 3-3z"/>
  </svg>
);
const IcoSmallMoon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, color: '#0ea5e9' }}>
    <path d="M12 3c.13 0 .26.01.39.01A9 9 0 0 0 16 19.3c.72.33 1.48.56 2.29.68A9.96 9.96 0 0 1 12 22C6.48 22 2 17.52 2 12S6.48 2 12 2c0 .33-.01.66-.01 1z" />
  </svg>
);


/* ── Gauge ─────────────────────────────────────────────────────────────── */
function DashboardGauge({ score }) {
  const r = 50;
  const circ = Math.PI * r; 
  const filled = circ * (score / 100);
  
  const gradientId = "gauge-grad";

  return (
    <div style={{ position: 'relative', width: 120, height: 60, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <svg width="120" height="60" viewBox="0 0 120 60" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#00d4aa" />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        
        {/* Background Track */}
        <path d={`M 10 60 A ${r} ${r} 0 0 1 110 60`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Progress */}
        <motion.path
          d={`M 10 60 A ${r} ${r} 0 0 1 110 60`}
          fill="none" stroke={`url(#${gradientId})`} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset="0"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${filled} ${circ}` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
          filter="url(#gauge-glow)"
        />

        {/* Needle/Tick Mark */}
        <motion.line
           x1="60" y1="60" x2="60" y2="10"
           stroke="#00d4aa" strokeWidth="2" strokeLinecap="round"
           style={{ transformOrigin: '60px 60px' }}
           initial={{ rotate: -90 }}
           animate={{ rotate: -90 + (score/100)*180 }}
           transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
           strokeDasharray="10 50"
           strokeDashoffset="-40"
        />
      </svg>
      <div style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: 24, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>
          {score}
        </motion.span>
      </div>
    </div>
  );
}


/* ── Main Component ────────────────────────────────────────────────────── */
const PredictionPanel = ({ result }) => {
  const [activeTab, setActiveTab] = useState('Summary');
  
  if (!result) return null;

  const score      = result.risk_score ?? 0;
  const tier       = getRiskTier(score);
  const category   = result.category ?? {};
  const inputs     = result.inputs ?? {};
  const hotspot    = result.nearest_hotspot;

  const top3 = (category.top3 ?? [
    { category: 'VIOLENT_CRIME', probability: 36 },
    { category: 'PROPERTY_CRIME', probability: 24 },
    { category: 'VEHICLE_CRIME', probability: 20 }
  ]).filter(c => c.probability > 0);

  const formatHour = (h) => {
    if (h === undefined) return '22:00 hrs';
    return `${h.toString().padStart(2, '0')}:00 hrs`;
  };

  const tabs = ['Summary', 'Breakdown', 'History', 'Map'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-panel"
      style={{
        display: 'flex',
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        width: '100%',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Left Sidebar Tabs ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        width: 48, background: 'rgba(0,0,0,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 40
      }}>
        {tabs.map(tab => (
          <div key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '24px 0',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              textAlign: 'center',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
              background: activeTab === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderLeft: activeTab === tab ? '2px solid #00d4aa' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, background: 'rgba(255,255,255,0.02)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.05em', color: '#fff' }}>AREA RISK ASSESSMENT REPORT</h3>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Report ID: 60403210540</span>
        </div>

        {/* ── Overall Risk Card ───────────────────────────────────────── */}
        <div style={{
          background: tier.gradient,
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${tier.border}`,
          borderLeft: `4px solid ${tier.color}`,
          backdropFilter: 'blur(10px)'
        }}>
          {/* Subtle background glow from the left border */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 150, background: `linear-gradient(90deg, ${tier.bg} 0%, transparent 100%)`, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '70%' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', margin: '0 0 6px', letterSpacing: '0.05em' }}>OVERALL RISK STATUS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 }}>{tier.label}</h1>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: tier.color, boxShadow: `0 0 16px 4px ${tier.glow}` }} />
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
              This area has {tier.label.toLowerCase()} during this time window. Follow basic safety precautions and avoid isolated areas.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <DashboardGauge score={score} />
          </div>
        </div>

        {/* ── 3 Info Cards ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {/* Threat */}
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoSwords />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', letterSpacing: '0.05em' }}>TOP THREAT</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{top3[0]?.category?.replace('_', ' ') || 'General'}</p>
            </div>
          </div>
          
          {/* Time */}
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoMoon />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', letterSpacing: '0.05em' }}>TIME WINDOW</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{formatHour(inputs.hour)}</p>
            </div>
          </div>

          {/* Weapon */}
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoCheckBox />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', letterSpacing: '0.05em' }}>WEAPON PROB.</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{inputs.weapon_used ? 'Elevated' : 'Standard'}</p>
            </div>
          </div>
        </div>

        {/* ── Threat Breakdown ────────────────────────────────────────── */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', letterSpacing: '0.05em' }}>THREAT BREAKDOWN</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {top3.map((c, i) => {
              const label = c.category === 'VIOLENT_CRIME' ? 'Violent Crime' : c.category === 'PROPERTY_CRIME' ? 'Property Crime' : c.category === 'VEHICLE_CRIME' ? 'Vehicle Crime' : c.category;
              const Icon = c.category === 'VIOLENT_CRIME' ? IcoSmallSwords : c.category === 'PROPERTY_CRIME' ? IcoHouse : IcoCar;
              const barColor = i === 2 ? 'linear-gradient(90deg, rgba(0,212,170,0.3) 0%, #00d4aa 100%)' : 'linear-gradient(90deg, rgba(14,165,233,0.3) 0%, #0ea5e9 100%)';
              const textCol = i === 2 ? '#00d4aa' : '#0ea5e9';
              
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 120, display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0' }}>
                    <Icon />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
                  </div>
                  <div style={{ flex: 1, height: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 99, padding: 2 }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${c.probability}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      style={{ height: '100%', borderRadius: 99, background: barColor, boxShadow: `0 0 10px ${textCol}40` }}
                    />
                  </div>
                  <div style={{ width: 36, textAlign: 'right', fontSize: 14, fontWeight: 800, color: textCol }}>
                    {c.probability.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Insights & Hotspot ──────────────────────────────────────── */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.05em' }}>INSIGHTS & HOTSPOT</p>
          
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Left side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, minWidth: 250 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 4px', letterSpacing: '0.05em' }}>NEAREST HOTSPOT</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IcoPin />
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{hotspot?.radius_km?.toFixed(1) || '1.2'} km away</h3>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}><span style={{ color: tier.color, fontWeight: 700 }}>{tier.label.split(' ')[0].toUpperCase()}</span> zone</p>
                  </div>
                </div>
              </div>
              
              {/* Map Illustration Box */}
              <div style={{ width: 100, height: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', marginLeft: 'auto' }}>
                <svg width="100" height="50" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                  <path d="M0 20L40 20L60 0 M40 20L40 60 M60 30L140 30" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,212,170,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa' }} />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 250 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', letterSpacing: '0.05em' }}>TIME CONTEXT</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <IcoSmallMoon />
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
                  Based on the selected time, visibility is a factor. Stick to well-lit main streets.<br/>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default PredictionPanel;
