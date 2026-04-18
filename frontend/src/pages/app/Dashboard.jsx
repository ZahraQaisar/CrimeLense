import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { predictionService, dataService } from '../../services/predictionService';
import LA_AREAS from '../../constants/areas';

/* ══════════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════════ */
const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoMapRoute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 42, height: 42 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IcoWaveform = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 42, height: 42 }}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </svg>
);
const IcoHeatGrid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 42, height: 42 }}>
    <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27z" />
    <path d="M12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27z" />
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);
const IcoRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);
const IcoCup = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
  </svg>
);
const IcoBadge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const IcoKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M21 2l-9.6 9.6M15.5 7.5l2 2M18 5l2 2" />
  </svg>
);
const IcoStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════ */
const SAFETY_TIPS = [
  'Park in well-lit areas at night.',
  'Share your live location with a trusted contact.',
  'Avoid using your phone while walking alone.',
  'Trust your instincts — if something feels off, leave.',
  'Keep emergency numbers saved and accessible.',
  'Stick to well-populated routes after dark.',
  'Report suspicious activity to local authorities.',
  'Charge your phone before heading out at night.',
];

const ADVISORIES = [
  { name: 'J. Doe', time: '3h ago', msg: 'Streetlight out on Grand Ave.' },
  { name: 'M. Chen', time: '5h ago', msg: 'Suspicious vehicle spotted near 5th St.' },
  { name: 'R. Smith', time: '6h ago', msg: 'Road closure advisory in effect on Broadway.' },
  { name: 'A. Khan', time: '8h ago', msg: 'Graffiti reported near Central Park entrance.' },
  { name: 'L. Torres', time: '12h ago', msg: 'Broken glass on Olympic Blvd sidewalk.' },
];

const GLASS = {};

const RISK_META = {
  LOW: { color: '#00d4aa', label: 'LOW RISK', glow: 'rgba(0,212,170,0.35)' },
  MEDIUM: { color: '#f59e0b', label: 'MEDIUM RISK', glow: 'rgba(245,158,11,0.35)' },
  HIGH: { color: '#ef4444', label: 'HIGH RISK', glow: 'rgba(239,68,68,0.35)' },
  CRITICAL: { color: '#dc2626', label: 'CRITICAL RISK', glow: 'rgba(220,38,38,0.40)' },
  UNKNOWN: { color: '#6b7280', label: 'CHECKING…', glow: 'rgba(107,114,128,0.2)' },
  ERROR: { color: '#f97316', label: 'BACKEND OFFLINE', glow: 'rgba(249,115,22,0.2)' },
};

/* ══════════════════════════════════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════════════════════════════════ */
const LiveClock = () => {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = () => {
      const n = new Date();
      const hm = n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const dy = n.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      setT(`${hm}, ${dy}`);
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    {t}
  </span>;
};

/* ══════════════════════════════════════════════════════════════════
   MINI BAR CHART (Risk Prediction Overview)
══════════════════════════════════════════════════════════════════ */
const BAR_LABELS = ['Now', 'In 3h', 'In 6h', 'Tonight'];

function scoreToRiskColor(score) {
  if (score === null || score === undefined) return '#374151';
  if (score >= 75) return '#ef4444';   // Critical — red
  if (score >= 55) return '#f97316';   // High — orange
  if (score >= 35) return '#eab308';   // Medium — yellow
  return '#00d4aa';                    // Low — teal
}

const RiskBarChart = ({ forecasts, loading }) => {
  const labels = forecasts?.labels ?? ['Now', 'Window 2', 'Window 3', 'Window 4'];
  const scores = forecasts?.scores ?? null;

  const bars = labels.map((label, i) => {
    const score = scores ? scores[i] : null;
    return { score, color: scoreToRiskColor(score), label };
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        {[
          { color: '#00d4aa', label: 'Low (0–34)' },
          { color: '#eab308', label: 'Medium (35–54)' },
          { color: '#f97316', label: 'High (55–74)' },
          { color: '#ef4444', label: 'Critical (75+)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Y-axis labels + bars */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 90 }}>
        {/* Y labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingBottom: 20, fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'right', minWidth: 22 }}>
          <span>100</span><span>50</span><span>0</span>
        </div>
        {/* Bars */}
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, justifyContent: 'flex-end', height: '100%' }}>
            {loading
              ? <div style={{ width: '100%', flex: 1, borderRadius: '4px 4px 0 0', background: 'rgba(255,255,255,0.06)', animation: 'rpo-pulse 1.2s ease-in-out infinite' }} />
              : <motion.div
                  key={b.score}
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  title={b.score !== null ? `Score: ${b.score}` : 'No data'}
                  style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: b.score !== null ? `${Math.max(4, b.score)}%` : '4%',
                    background: b.score !== null
                      ? `linear-gradient(180deg, ${b.color} 0%, ${b.color}88 100%)`
                      : 'rgba(255,255,255,0.07)',
                    boxShadow: b.score !== null ? `0 0 8px ${b.color}60` : 'none',
                    cursor: 'default',
                  }}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{b.label}</span>
              {!loading && b.score !== null && (
                <span style={{ fontSize: 8, fontWeight: 700, color: b.color }}>{b.score}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════════════════
   ACTION TOOL CARD
══════════════════════════════════════════════════════════════════ */
const ToolCard = ({ icon: Icon, title, btnLabel, btnColor, desc, tooltip, onClick, accentColor }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="glass-panel"
      style={{
        borderRadius: 16,
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 0, position: 'relative',
        border: hov ? `1px solid rgba(255,255,255,0.2)` : '1px solid rgba(255,255,255,0.09)',
        boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.6)' : undefined,
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', top: -46, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(30,38,55,0.97)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 12px', fontSize: 11, color: 'rgba(255,255,255,0.8)',
          width: 210, textAlign: 'left', zIndex: 20, lineHeight: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {tooltip}
        </div>
      )}

      {/* Icon */}
      <div style={{ color: accentColor, marginBottom: 10 }}>
        <Icon />
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 14px' }}>
        {title}
      </h3>

      {/* CTA Button */}
      <button
        onClick={onClick}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 10,
          fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
          background: btnColor,
          color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          boxShadow: hov ? `0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 0 20px rgba(0,0,0,0.1)` : `0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 20px rgba(0,0,0,0.15)`,
          transition: 'all 0.2s ease',
          transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {btnLabel}
      </button>

      {/* Footer desc */}
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 12, lineHeight: 1.55 }}>
        {desc}
      </p>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* ── State ── */
  const [bannerVisible, setBannerVisible] = useState(true);
  const [tipIdx, setTipIdx] = useState(() => new Date().getDate() % SAFETY_TIPS.length);
  const [activeTab, setActiveTab] = useState(0); // 0=Recent Verified, 1=Other
  const [selectedArea, setSelectedArea] = useState(() => {
    const saved = localStorage.getItem(`default_area_${user?.id || 'demo'}`);
    if (saved) {
      const match = LA_AREAS.find(a => a.label === saved);
      if (match) return match;
    }
    return LA_AREAS[1];
  });
  const [riskStatus, setRiskStatus] = useState('UNKNOWN');
  const [riskScore, setRiskScore] = useState(null);
  const [areaProfile, setAreaProfile] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [forecasts, setForecasts] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [nearbyHotspots, setNearbyHotspots] = useState([]);
  const [hotspotsLoading, setHotspotsLoading] = useState(false);
  // Real impact stats from localStorage
  const savedRoutesCount = (() => { try { return JSON.parse(localStorage.getItem('cl_my_routes') || '[]').length; } catch { return 0; } })();
  const riskChecksCount = (() => { try { return parseInt(localStorage.getItem('cl_risk_checks') || '0', 10); } catch { return 0; } })();
  const communityStats = { riskChecks: riskChecksCount, routes: savedRoutesCount };

  // Calculate Gamification Badge
  const totalActions = riskChecksCount + savedRoutesCount;
  const userLevel = Math.floor(totalActions / 5) + 1;
  let userBadgeTitle = 'Novice';
  if (userLevel === 2) userBadgeTitle = 'Safety Scout';
  if (userLevel === 3) userBadgeTitle = 'Area Guide';
  if (userLevel === 4) userBadgeTitle = 'Top Explorer';
  if (userLevel >= 5) userBadgeTitle = 'Local Legend';

  const firstName = isAuthenticated && user?.name ? user.name.split(' ')[0] : 'User';

  /* ── Fetch real prediction for selected area ── */
  const fetchRisk = useCallback(async (area) => {
    setPredictLoading(true);
    setRiskStatus('UNKNOWN');
    setRiskScore(null);
    try {
      const now = new Date();
      const result = await predictionService.predict({
        latitude: area.lat,
        longitude: area.lon,
        hour: now.getHours(),
        month: now.getMonth() + 1,
        weapon_used: 0,
      });
      // result shape: { risk_score, binary, severity, category, explanation }
      const score = result?.risk_score ?? null;
      if (score === null) throw new Error('No score returned');
      setRiskScore(Math.round(score));
      if (score >= 75) setRiskStatus('CRITICAL');
      else if (score >= 55) setRiskStatus('HIGH');
      else if (score >= 35) setRiskStatus('MEDIUM');
      else setRiskStatus('LOW');
    } catch {
      // Backend unreachable — show error state instead of fake data
      setRiskScore(null);
      setRiskStatus('ERROR');
    } finally {
      setPredictLoading(false);
    }
  }, []);

  /* ── Smart context-aware time windows ──
     Based on current hour, pick 4 meaningful future points.
     Rules:
       Early Morning (0–5)   → Now | Morning 8am | Afternoon 2pm | Evening 6pm
       Morning       (6–11)  → Now | Afternoon 2pm | Evening 6pm | Tonight 10pm
       Afternoon     (12–17) → Now | Evening 6pm | Tonight 10pm | Tmrw Morning 8am
       Evening       (18–21) → Now | Tonight 10pm | Tmrw Morning 8am | Tmrw Afternoon 2pm
       Night         (22–23) → Now | Late Night 2am | Tmrw Morning 8am | Tmrw Afternoon 2pm
  */
  const fetchForecasts = useCallback(async (area) => {
    setForecastLoading(true);
    setForecasts(null);
    const now = new Date();
    const h = now.getHours();
    const month = now.getMonth() + 1;

    let windows; // [{ hour, label }]
    if (h >= 0 && h < 6) {
      windows = [
        { hour: h,  label: 'Now' },
        { hour: 8,  label: 'Morning' },
        { hour: 14, label: 'Afternoon' },
        { hour: 18, label: 'Evening' },
      ];
    } else if (h >= 6 && h < 12) {
      windows = [
        { hour: h,  label: 'Now' },
        { hour: 14, label: 'Afternoon' },
        { hour: 18, label: 'Evening' },
        { hour: 22, label: 'Tonight' },
      ];
    } else if (h >= 12 && h < 18) {
      windows = [
        { hour: h,  label: 'Now' },
        { hour: 18, label: 'Evening' },
        { hour: 22, label: 'Tonight' },
        { hour: 8,  label: 'Tmrw AM' },
      ];
    } else if (h >= 18 && h < 22) {
      windows = [
        { hour: h,  label: 'Now' },
        { hour: 22, label: 'Tonight' },
        { hour: 8,  label: 'Tmrw AM' },
        { hour: 14, label: 'Tmrw PM' },
      ];
    } else {
      // 22:00 – 23:59
      windows = [
        { hour: h,  label: 'Now' },
        { hour: 2,  label: 'Late Night' },
        { hour: 8,  label: 'Tmrw AM' },
        { hour: 14, label: 'Tmrw PM' },
      ];
    }

    try {
      const results = await Promise.all(
        windows.map(({ hour }) =>
          predictionService.predict({ latitude: area.lat, longitude: area.lon, hour, month, weapon_used: 0 })
            .then(r => Math.round(r?.risk_score ?? 0))
            .catch(() => null)
        )
      );
      if (results.some(s => s !== null)) {
        setForecasts({
          scores: results.map(s => s ?? 0),
          labels: windows.map(w => w.label),
        });
      }
    } catch { /* silent */ } finally {
      setForecastLoading(false);
    }
  }, []);

  /* ── Fetch nearby hotspots from backend ── */
  const fetchHotspots = useCallback(async (area) => {
    setHotspotsLoading(true);
    try {
      const resp = await dataService.getHotspots();
      // Backend returns { zones: [...], total: N }
      const all = resp?.zones ?? (Array.isArray(resp) ? resp : []);
      if (!all.length) { setNearbyHotspots([]); return; }
      // Sort by distance to selected area centroid
      const withDist = all.map(h => ({
        ...h,
        dist: Math.sqrt(
          Math.pow((h.lat - area.lat) * 111, 2) +
          Math.pow((h.lon - area.lon) * 85, 2)
        )
      }));
      withDist.sort((a, b) => a.dist - b.dist);
      setNearbyHotspots(withDist.slice(0, 3));
    } catch {
      setNearbyHotspots([]);
    } finally {
      setHotspotsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRisk(selectedArea);
    fetchForecasts(selectedArea);
    fetchHotspots(selectedArea);
  }, [selectedArea, fetchRisk, fetchForecasts, fetchHotspots]);


  useEffect(() => {
    const handlePrefUpdate = () => {
      const saved = localStorage.getItem(`default_area_${user?.id || 'demo'}`);
      if (saved) {
        const match = LA_AREAS.find(a => a.label === saved);
        if (match) setSelectedArea(match);
      }
    };
    window.addEventListener('preferencesUpdated', handlePrefUpdate);
    return () => window.removeEventListener('preferencesUpdated', handlePrefUpdate);
  }, [user]);

  const meta = RISK_META[riskStatus] ?? RISK_META.UNKNOWN;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1280, width: '100%', paddingBottom: 48, fontFamily: "'Inter', sans-serif" }}>
      <style>{`@keyframes rpo-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>

      {/* ══ SAFETY PULSE BANNER ═════════════════════════════════════ */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: -20, overflow: 'hidden' }}
            transition={{ duration: 0.25 }}
            className="glass-panel"
            style={{
              borderRadius: 16, padding: '16px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid rgba(0,212,170,0.28)',
              background: 'linear-gradient(105deg, rgba(0,212,170,0.08) 0%, rgba(14,165,233,0.05) 60%, rgba(17,24,39,0.7) 100%)',
              boxShadow: '0 0 30px rgba(0,212,170,0.06)',
            }}
          >
            {/* Shimmer top line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.6), transparent)' }} />
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Safety Pulse</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '3px 0 0' }}>
                Welcome to CrimeLense, {firstName}. Your personalized safety hub is now live.
              </p>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              style={{
                padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Skip Tour <IcoX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MAIN GRID (left 2fr | right 1fr) ═══════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
        className="xl:grid-cols-[2fr_1fr]"
      >
        <style>{`@media(min-width:1280px){.xl\\:grid-cols-\\[2fr_1fr\\]{grid-template-columns:2fr 1fr}}`}</style>

        {/* ════ LEFT COLUMN ════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ── CURRENT STATUS — clean minimal bar ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="glass-panel relative z-50"
            style={{
              borderRadius: 14, padding: '14px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}
          >
            {/* LEFT: label + location */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 5px' }}>
                Current Status
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1 }}>
                  Your selected location is:&nbsp;<span style={{ fontWeight: 800, color: '#fff' }}>{selectedArea.label}</span>
                </h2>
                <div className="relative group" style={{ zIndex: 100 }}>
                  <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px', paddingLeft: '8px', paddingRight: '8px', color: '#00d4aa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', transition: 'all 0.2s' }}>
                    <IcoEdit /> Change
                  </button>
                  <div className="absolute top-10 left-0 w-56 bg-[#0a101d] border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden" style={{ backdropFilter: 'blur(10px)' }}>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }} className="scrollbar-hide flex flex-col py-2">
                      {LA_AREAS.map(area => (
                        <button
                          key={area.label}
                          onClick={() => setSelectedArea(area)}
                          style={{ textAlign: 'left', padding: '10px 16px', fontSize: 13, color: selectedArea.label === area.label ? '#00d4aa' : '#fff', cursor: 'pointer', background: selectedArea.label === area.label ? 'rgba(0,212,170,0.1)' : 'transparent', border: 'none', transition: 'background 0.2s', fontWeight: selectedArea.label === area.label ? 700 : 500 }}
                          onMouseEnter={(e) => {
                            if (selectedArea.label !== area.label) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedArea.label !== area.label) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: clock + shield + status */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <LiveClock />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ color: meta.color, filter: `drop-shadow(0 0 8px ${meta.color}80)` }}>
                  <IcoShield />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={riskStatus} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    <span style={{ fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>STATUS: </span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: meta.color, letterSpacing: '0.04em' }}>
                      {predictLoading ? 'CHECKING…' : meta.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── 3 ACTION CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, paddingTop: 8 }}>
            <ToolCard
              icon={IcoMapRoute}
              title="Plan a Safe Route"
              btnLabel="Start Planning"
              btnColor="#10b981"
              accentColor="#10b981"
              desc="Navigate from A to B while avoiding known danger zones."
              tooltip={null}
              onClick={() => navigate('/app/safe-route')}
            />
            <ToolCard
              icon={IcoWaveform}
              title="Predict Area Risk"
              btnLabel="Check Risk Forecast"
              btnColor="#f59e0b"
              accentColor="#f59e0b"
              desc="Share regular updates about specific areas to refine predictions."
              tooltip={null}
              onClick={() => navigate('/app/predict')}
            />
            <ToolCard
              icon={IcoHeatGrid}
              title="Explore Live Map"
              btnLabel="View Heatmap"
              btnColor="#3b82f6"
              accentColor="#3b82f6"
              desc="Visualize recent incidents and safety corridors across the city."
              tooltip={null}
              onClick={() => navigate('/app/live-map')}
            />
          </div>

          {/* ── BOTTOM TRIO: Risk Overview | Compare | Community Voice ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'stretch' }}>

            {/* Risk Prediction Overview */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel"
              style={{ borderRadius: 14, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Risk Prediction Overview</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 7px' }}>
                  {predictLoading ? '…' : `Score: ${riskScore ?? '--'}`}
                </span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>
                Risk forecast for {selectedArea.label}
              </p>
              <RiskBarChart forecasts={forecasts} loading={forecastLoading} />
            </motion.div>

            {/* Compare Areas Tool */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="glass-panel"
              style={{ borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Compare Areas Tool</span>

              {/* Area A pill */}
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{selectedArea.label}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '3px 0 0' }}>Incidents per 10k</p>
              </div>

              <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>VS</div>

              {/* Area B picker */}
              <button
                onClick={() => navigate('/app/compare')}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(0,212,170,0.3)',
                  borderRadius: 12, padding: '10px 14px', textAlign: 'center', cursor: 'pointer',
                  color: 'rgba(0,212,170,0.7)', fontSize: 12, fontWeight: 600,
                  transition: 'all 0.2s', marginTop: 'auto'
                }}
              >
                + Select Area
              </button>
            </motion.div>

            {/* Your Impact (Gamification Stats) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="glass-panel"
              style={{
                borderRadius: 14, padding: '16px',
                display: 'flex', flexDirection: 'column', gap: 14, height: '100%'
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your Impact</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                {/* Badge Icon */}
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa', flexShrink: 0 }}>
                  <IcoBadge />
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.1 }}>{userBadgeTitle}</p>
                  <p style={{ fontSize: 11, color: '#00d4aa', margin: '4px 0 0', fontWeight: 600 }}>Level {userLevel} Contributor</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{communityStats.riskChecks}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>Risk Checks</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{communityStats.routes}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>Saved Routes</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ════ RIGHT COLUMN ═══════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── LIVE HOTSPOT RADAR ── */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel"
            style={{ borderRadius: 14, padding: '18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, position: 'relative', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 2 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Nearby Hotspot Radar</span>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '4px 0 0', fontWeight: 600 }}>Active zones in {selectedArea.label}</p>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 99, padding: '3px 10px' }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                Scanning
              </span>
            </div>

            {/* Radar Animation Area */}
            <div style={{ position: 'relative', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, margin: '14px 0' }}>
              {/* Radar Grid/Circles */}
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.1)' }} />
              <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', border: '1px dashed rgba(245,158,11,0.2)' }} />
              <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }} />

              {/* Sweeping gradient */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', width: 200, height: 200, background: 'conic-gradient(from 0deg, transparent 70%, rgba(245,158,11,0.15) 100%)', borderRadius: '50%', clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
              />

              {/* Center point */}
              <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 12px #f59e0b' }} />

              {/* Blip 1 */}
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} style={{ position: 'absolute', top: 30, right: 60, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
              {/* Blip 2 */}
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 2.1 }} style={{ position: 'absolute', bottom: 40, left: 70, width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            </div>

            {/* Hotspot List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2 }}>
              {hotspotsLoading ? (
                [1, 2].map(i => (
                  <div key={i} style={{ height: 52, borderRadius: 10, background: 'rgba(255,255,255,0.05)', animation: 'rpo-pulse 1.2s ease-in-out infinite' }} />
                ))
              ) : nearbyHotspots.length > 0 ? (
                nearbyHotspots.map((h, i) => {
                  const isCritical = h.tier === 'CRITICAL' || h.tier === 'HIGH';
                  const dotColor = isCritical ? '#ef4444' : '#f59e0b';
                  const bgColor = isCritical ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.08)';
                  const borderColor = isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)';
                  const distKm = h.dist ? h.dist.toFixed(1) : '—';
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: bgColor, border: `1px solid ${borderColor}`, padding: '10px 14px', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 8px ${dotColor}`, flexShrink: 0 }} />
                        <div>
                          <h4 style={{ fontSize: 12, fontWeight: 800, color: '#fff', margin: 0 }}>{h.area || h.location || 'Hotspot'}</h4>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
                            {h.tier || 'HIGH'} Risk • {h.crime_count ? `${h.crime_count.toLocaleString()} incidents` : 'Active Zone'}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: dotColor, background: `${dotColor}18`, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                        {distKm} km
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  No hotspots detected nearby
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/app/live-map')}
              style={{ padding: '12px', marginTop: 'auto', borderRadius: 10, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              Analyze on Live Map
            </button>

          </motion.div>

          {/* ── DAILY SAFETY TIP ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,35,0.95) 0%, rgba(0,60,48,0.65) 100%)',
              border: '1px solid rgba(0,212,170,0.22)',
              borderRadius: 14, padding: '12px 14px',
              boxShadow: '0 0 20px rgba(0,212,170,0.06), 0 8px 32px rgba(0,0,0,0.4)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Glow blob */}
            <div style={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Daily Safety Tip
              </span>
              <button
                onClick={() => setTipIdx(i => (i + 1) % SAFETY_TIPS.length)}
                style={{
                  padding: 0, background: 'none', border: 'none', fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00d4aa',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s', opacity: 0.8
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
              >
                Next <IcoStar />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4aa', flexShrink: 0 }}>
                <IcoKey />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIdx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.25 }}
                  style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.35 }}
                >
                  {SAFETY_TIPS[tipIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
