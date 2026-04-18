import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* ── localStorage helpers ───────────────────────────────────── */
function loadSavedRoutes() {
  try { return JSON.parse(localStorage.getItem('cl_my_routes') || '[]'); } catch { return []; }
}
function removeSavedRoute(id) {
  const routes = loadSavedRoutes().filter(r => r.id !== id);
  localStorage.setItem('cl_my_routes', JSON.stringify(routes));
}

function getInitialRoutes() {
  return loadSavedRoutes();
}

/* ── Icons ─────────────────────────────────────────────────── */
const IcoNav = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const IcoPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IcoTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 52, height: 52 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ── Risk Badge ─────────────────────────────────────────────── */
function RiskBadge({ risk }) {
  const cfg = risk === 'LOW'
    ? { color: '#00d4aa', bg: 'rgba(0,212,170,0.1)', border: 'rgba(0,212,170,0.3)' }
    : { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' };
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: 99,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {risk} RISK
    </span>
  );
}

/* ── Route Card ─────────────────────────────────────────────── */
function RouteCard({ route, onDelete, onRun, index }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={{ delay: index * 0.07, duration: 0.25 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="glass-panel"
      style={{
        borderRadius: 16, padding: '18px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        border: hov ? '1px solid rgba(0,212,170,0.22)' : undefined,
        boxShadow: hov ? '0 0 24px rgba(0,212,170,0.08), 0 8px 32px rgba(0,0,0,0.4)' : undefined,
        transition: 'all 0.22s ease',
      }}
    >
      {/* Icon + Details */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'rgba(0,212,170,0.09)', border: '1px solid rgba(0,212,170,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4aa',
        }}>
          <IcoNav />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {route.nickname}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px', marginBottom: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <IcoPin /> From: <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{route.start}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <IcoPin /> To: <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{route.end}</span>
            </span>
          </div>
          {route.modeLabel && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontStyle: 'italic' }}>
              {route.modeLabel}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <RiskBadge risk={route.risk} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              <IcoClock /> {route.eta}
            </span>
            {route.distance && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{route.distance}</span>
            )}
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>• Saved {route.saved}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onDelete(route.id)}
          title="Delete"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
        >
          <IcoTrash />
        </button>
        <button
          onClick={() => onRun(route)}
          style={{
            padding: '8px 18px', borderRadius: 10,
            fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
            background: hov ? 'linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%)' : 'rgba(0,212,170,0.08)',
            border: hov ? 'none' : '1px solid rgba(0,212,170,0.25)',
            color: hov ? '#03150f' : '#00d4aa',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: hov ? '0 0 16px rgba(0,212,170,0.3)' : 'none',
            transition: 'all 0.22s ease',
          }}
        >
          <IcoPlay /> Run Route
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
const MyRoutesPage = () => {
  const [routes, setRoutes] = useState(getInitialRoutes);
  const navigate = useNavigate();

  // Re-sync whenever the component mounts (in case routes were added from SafeRoutePage)
  useEffect(() => {
    setRoutes(loadSavedRoutes());
  }, []);

  const handleDelete = id => {
    if (window.confirm('Delete this saved route?')) {
      if (typeof id === 'number') removeSavedRoute(id); // only remove real routes from storage
      setRoutes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleRun = route => {
    navigate(`/app/safe-route`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
            My Account
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '4px 0 0', lineHeight: 1.2 }}>
            My <span className="text-neon-teal">Saved Routes</span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '5px 0 0' }}>
            Quickly access your most frequent safe paths.
          </p>
        </div>
        <button
          onClick={() => navigate('/app/safe-route')}
          style={{
            padding: '11px 20px', borderRadius: 12,
            fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%)',
            color: '#03150f', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 0 20px rgba(0,212,170,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,170,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,170,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <IcoPlus /> New Route
        </button>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Routes', value: routes.length, color: '#00d4aa' },
          { label: 'Low Risk Routes', value: routes.filter(r => r.risk === 'LOW').length, color: '#00d4aa' },
          { label: 'Moderate Risk Routes', value: routes.filter(r => r.risk === 'MODERATE').length, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Routes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {routes.map((route, i) => (
            <RouteCard
              key={route.id}
              route={route}
              index={i}
              onDelete={handleDelete}
              onRun={handleRun}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {routes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
              borderRadius: 20, padding: '60px 24px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.15)' }}>
              <IcoShield />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>No Saved Routes</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 auto', maxWidth: 360, lineHeight: 1.6 }}>
                You haven't saved any routes yet. Use the Safe Route Finder to generate and save your daily paths for quick access.
              </p>
            </div>
            <button
              onClick={() => navigate('/app/safe-route')}
              style={{
                marginTop: 8, padding: '12px 28px', borderRadius: 12,
                fontSize: 13, fontWeight: 800, letterSpacing: '0.05em',
                background: 'linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%)',
                color: '#03150f', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 20px rgba(0,212,170,0.3)',
              }}
            >
              <IcoNav style={{ width: 16, height: 16 }} /> Find a Safe Route
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyRoutesPage;
