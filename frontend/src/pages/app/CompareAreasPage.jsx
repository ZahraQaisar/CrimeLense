import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LA_AREAS from '../../constants/areas';
import { predictionService, dataService } from '../../services/predictionService';

const LOCATIONS = LA_AREAS.map(a => a.label);
const CRIME_TYPES = ['PROPERTY_CRIME', 'VIOLENT_CRIME', 'VEHICLE_CRIME', 'VANDALISM', 'OTHER'];

// Formatter to make backend constants look nice
const formatLabel = (str) => {
  if (!str) return '';
  return str.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

function getRiskColor(score) {
  if (score >= 70) return '#ef4444';
  if (score >= 45) return '#f59e0b';
  return '#00d4aa';
}

function getRiskLabel(score) {
  if (score >= 70) return 'HIGH RISK';
  if (score >= 45) return 'MEDIUM RISK';
  return 'LOW RISK';
}

/* ── Icons ─────────────────────────────────────────────────── */
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 12, height: 12 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);
const IcoCompare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 38, height: 38 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    <rect x="9" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.2" stroke="none" rx="1" />
  </svg>
);

/* ── Area Selector ──────────────────────────────────────────── */
function AreaSelector({ label, value, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  const filtered = query.trim()
    ? LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase()))
    : LOCATIONS;

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setQuery(''); }}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12, textAlign: 'left',
          background: 'rgba(255,255,255,0.05)',
          border: open ? `1px solid ${accentColor}55` : '1px solid rgba(255,255,255,0.1)',
          color: value ? '#fff' : 'rgba(255,255,255,0.35)',
          fontSize: 14, fontWeight: value ? 700 : 400,
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s',
          boxShadow: open ? `0 0 0 3px ${accentColor}12` : 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: accentColor }}><IcoPin /></span>
          {value || 'Select area…'}
        </span>
        {value && (
          <span
            onClick={e => { e.stopPropagation(); onChange(''); }}
            style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', cursor: 'pointer' }}
          >
            <IcoX />
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', marginTop: 4, width: '100%', zIndex: 100,
              background: '#0d1626', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search area…"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: 12,
                  outline: 'none', fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <ul style={{ listStyle: 'none', padding: '4px 0', margin: 0, maxHeight: 200, overflowY: 'auto' }}>
              {filtered.map(loc => (
                <li key={loc}>
                  <button
                    type="button"
                    onClick={() => { onChange(loc); setOpen(false); setQuery(''); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 14px',
                      background: value === loc ? `${accentColor}12` : 'none',
                      border: 'none', cursor: 'pointer',
                      color: value === loc ? accentColor : 'rgba(255,255,255,0.65)',
                      fontSize: 12, fontFamily: "'Inter', sans-serif",
                      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (value !== loc) { e.currentTarget.style.background = `${accentColor}09`; e.currentTarget.style.color = accentColor; } }}
                    onMouseLeave={e => { if (value !== loc) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
                  >
                    <IcoPin /> {loc}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Risk Score Bar ─────────────────────────────────────────── */
function RiskBar({ label, score, color, delay = 0 }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>
          {score}/100 — <span style={{ fontSize: 11 }}>{getRiskLabel(score)}</span>
        </span>
      </div>
      <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay, duration: 0.7, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}bb, ${color})`, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

/* ── Custom Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(13,22,38,0.97)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 6px', fontWeight: 700 }}>{formatLabel(label)}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill, margin: '2px 0', fontWeight: 700 }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

/* ── Main Page ─────────────────────────────────────────────── */
const CompareAreasPage = () => {
  const [areaA, setAreaA] = useState('');
  const [areaB, setAreaB] = useState('');
  const [compared, setCompared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState({});
  const [statsA, setStatsA] = useState(null);
  const [statsB, setStatsB] = useState(null);

  useEffect(() => {
    // Load historical area profiles
    dataService.getAreaProfiles()
      .then(data => setProfiles(data))
      .catch(() => {}); // handle silently
  }, []);

  const handleCompare = async () => {
    if (!areaA || !areaB) return;
    setCompared(false);
    setLoading(true);

    const aData = LA_AREAS.find(a => a.label === areaA);
    const bData = LA_AREAS.find(a => a.label === areaB);
    const now = new Date();

    try {
      const [predA, predB] = await Promise.all([
        predictionService.predict({
          latitude: aData.lat, longitude: aData.lon,
          hour: now.getHours(), month: now.getMonth() + 1, weapon_used: 0
        }),
        predictionService.predict({
          latitude: bData.lat, longitude: bData.lon,
          hour: now.getHours(), month: now.getMonth() + 1, weapon_used: 0
        })
      ]);

      const profA = profiles[areaA] || {};
      const profB = profiles[areaB] || {};

      const crimesA = CRIME_TYPES.map(type => ({
        name: type,
        value: Math.round((profA?.crime_distribution?.[type] || 0) * 100)
      }));
      const crimesB = CRIME_TYPES.map(type => ({
        name: type,
        value: Math.round((profB?.crime_distribution?.[type] || 0) * 100)
      }));

      setStatsA({ riskScore: predA.risk_score, crimes: crimesA });
      setStatsB({ riskScore: predB.risk_score, crimes: crimesB });
      setCompared(true);
    } catch (e) {
      // Backend offline fallback
      setStatsA({ riskScore: 0, crimes: CRIME_TYPES.map(t => ({ name: t, value: 0 })) });
      setStatsB({ riskScore: 0, crimes: CRIME_TYPES.map(t => ({ name: t, value: 0 })) });
      setCompared(true);
    } finally {
      setLoading(false);
    }
  };

  const chartData = statsA && statsB
    ? CRIME_TYPES.map((type, i) => ({
      name: formatLabel(type),
      [areaA]: statsA.crimes[i].value,
      [areaB]: statsB.crimes[i].value,
    }))
    : [];

  const canCompare = areaA && areaB && areaA !== areaB && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
      <style>{`@keyframes ca-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
          Safety Tools
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '4px 0 0', lineHeight: 1.2 }}>
          Compare <span className="text-neon-teal">Areas</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '5px 0 0' }}>
          Compare crime statistics and risk scores between two areas side by side.
        </p>
      </div>

      {/* Selector Card */}
      <div className="glass-panel" style={{ borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c6fdff', flexShrink: 0 }}>
            <IcoCompare />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Select Two Areas</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Choose two different areas to compare their crime data.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginTop: 20, flexWrap: 'wrap' }}>
          <AreaSelector label="Area A" value={areaA} onChange={v => { setAreaA(v); setCompared(false); }} accentColor="#0ea5e9" />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 2 }}>
            <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
              VS
            </div>
          </div>

          <AreaSelector label="Area B" value={areaB} onChange={v => { setAreaB(v); setCompared(false); }} accentColor="#00d4aa" />

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className={canCompare ? 'btn-primary' : 'btn-ghost'}
            style={{
              flexShrink: 0,
              opacity: !canCompare ? 0.45 : 1,
              cursor: canCompare ? 'pointer' : 'not-allowed',
            }}
          >
            {loading
              ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(3,21,15,0.3)', borderTop: '2px solid #03150f', borderRadius: '50%', display: 'block', animation: 'ca-spin 0.8s linear infinite' }} /> Comparing…</>
              : <><IcoRefresh /> Compare Now</>
            }
          </button>
        </div>

        {areaA && areaB && areaA === areaB && (
          <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 10 }}>⚠ Please select two different areas to compare.</p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {compared && statsA && statsB && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Risk Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Area A card */}
              <div className="glass-panel" style={{ borderRadius: 14, padding: 20, borderTop: `2px solid ${getRiskColor(statsA.riskScore)}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Area A</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>{areaA}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: getRiskColor(statsA.riskScore) }}>{statsA.riskScore}</span>
                  <div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Risk Score</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: getRiskColor(statsA.riskScore), margin: '2px 0 0' }}>{getRiskLabel(statsA.riskScore)}</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${statsA.riskScore}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ height: '100%', background: getRiskColor(statsA.riskScore), borderRadius: 99 }}
                  />
                </div>
              </div>

              {/* Area B card */}
              <div className="glass-panel" style={{ borderRadius: 14, padding: 20, borderTop: `2px solid ${getRiskColor(statsB.riskScore)}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Area B</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>{areaB}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: getRiskColor(statsB.riskScore) }}>{statsB.riskScore}</span>
                  <div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Risk Score</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: getRiskColor(statsB.riskScore), margin: '2px 0 0' }}>{getRiskLabel(statsB.riskScore)}</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${statsB.riskScore}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    style={{ height: '100%', background: getRiskColor(statsB.riskScore), borderRadius: 99 }}
                  />
                </div>
              </div>
            </div>

            {/* Crime Breakdown Chart */}
            <div className="glass-panel" style={{ borderRadius: 14, padding: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Crime Type Breakdown
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                {areaA} <span style={{ color: 'rgba(255,255,255,0.35)' }}>vs</span> {areaB}
              </p>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[{ color: '#0ea5e9', label: areaA }, { color: '#00d4aa', label: areaB }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>

              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={4} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey={areaA} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={areaB} fill="#00d4aa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verdict */}
            <div className="glass-panel" style={{ borderRadius: 14, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>Safer Area</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#00d4aa', margin: 0 }}>
                  {statsA.riskScore <= statsB.riskScore ? areaA : areaB}
                </p>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 360, textAlign: 'right' }}>
                Based on combined crime statistics and risk scoring model.
                Difference in risk score: <span style={{ color: '#fff', fontWeight: 700 }}>{Math.abs(statsA.riskScore - statsB.riskScore)} pts</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default CompareAreasPage;
