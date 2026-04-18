import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePrediction from '../../hooks/usePrediction';
import PredictionPanel from '../../components/PredictionPanel';
import LA_AREAS from '../../constants/areas';

const TEAL = '#00d4aa';
const TEAL_DIM = 'rgba(0,212,170,0.12)';
const GRADIENT = 'linear-gradient(135deg, #0ea5e9 0%, #00d4aa 100%)';

const TIME_SLOTS = [
  { label: 'Morning (8 AM)', hour: 8 },
  { label: 'Afternoon (2 PM)', hour: 14 },
  { label: 'Evening (6 PM)', hour: 18 },
  { label: 'Night (10 PM)', hour: 22 },
  { label: 'Late Night (2 AM)', hour: 2 },
];

/* ── Animated radar for idle state ─────────────────────────── */
const RadarIdle = () => (
  <div style={{ position: 'relative', width: 110, height: 110 }}>
    <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: 'absolute', inset: 0 }}>
      {[46, 32, 18].map((r, i) => (
        <circle key={r} cx="55" cy="55" r={r} fill="none" stroke={`rgba(0,212,170,${0.06 + i * 0.04})`} strokeWidth="1" />
      ))}
      <circle cx="55" cy="55" r="4" fill="rgba(0,212,170,0.6)" />
    </svg>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <linearGradient id="rdr-sweep" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="55" y1="55" x2="55" y2="9" stroke="url(#rdr-sweep)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  </div>
);

const RiskPredictPage = () => {
  const [selectedArea, setSelectedArea] = useState(LA_AREAS[0]);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [weaponUsed, setWeaponUsed] = useState(false);
  const [date, setDate] = useState('');

  const { predict, result, loading, error } = usePrediction();

  // No auto-scroll needed anymore since it's a one-pager with top-down flow

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = useCustom ? parseFloat(customLat) : selectedArea.lat;
    const lon = useCustom ? parseFloat(customLon) : selectedArea.lon;
    if (isNaN(lat) || isNaN(lon)) return;
    const d = date ? new Date(date) : new Date();
    await predict({
      latitude: lat,
      longitude: lon,
      hour: timeSlot.hour,
      month: d.getMonth() + 1,
      weapon_used: weaponUsed ? 1 : 0
    });
    // Track risk checks count for dashboard "Your Impact"
    try {
      const prev = parseInt(localStorage.getItem('cl_risk_checks') || '0', 10);
      localStorage.setItem('cl_risk_checks', prev + 1);
    } catch { /* ignore */ }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', transition: 'all 0.2s',
  };

  const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700, marginBottom: 6, display: 'block', letterSpacing: '0.07em', textTransform: 'uppercase' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif", maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <style>{`
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        @keyframes rp-dots { 0%,100%{opacity:0.2} 50%{opacity:1} }
        .rp-input:focus { border-color: #0ea5e9 !important; box-shadow: 0 0 0 2px rgba(14,165,233,0.2) !important; }
        .rp-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(14,165,233,0.3) !important; }
        .rp-btn:active:not(:disabled) { transform: translateY(0) !important; }
      `}</style>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>
          Risk <span style={{ color: '#0ea5e9' }}>Prediction</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          Configure your parameters below to generate an instant risk assessment report.
        </p>
      </div>

      {/* Top Input Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{
        borderRadius: 16, padding: '20px', border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          
          {/* Location */}
          <div style={{ flex: '1 1 200px', minWidth: 200 }}>
            <label style={labelStyle}>Location Area</label>
            <select
              value={useCustom ? '__custom__' : selectedArea.label}
              onChange={e => {
                if (e.target.value === '__custom__') { setUseCustom(true); }
                else { setUseCustom(false); setSelectedArea(LA_AREAS.find(a => a.label === e.target.value)); }
              }}
              className="rp-input"
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              {LA_AREAS.map(a => <option key={a.label} value={a.label} style={{ background: '#111827' }}>{a.label}</option>)}
              <option value="__custom__" style={{ background: '#111827' }}>Custom coordinates…</option>
            </select>
          </div>

          {useCustom && (
            <>
              <div style={{ flex: '1 1 120px' }}>
                <label style={labelStyle}>Latitude</label>
                <input className="rp-input" value={customLat} onChange={e => setCustomLat(e.target.value)} placeholder="34.05" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={labelStyle}>Longitude</label>
                <input className="rp-input" value={customLon} onChange={e => setCustomLon(e.target.value)} placeholder="-118.24" style={inputStyle} />
              </div>
            </>
          )}

          {/* Date */}
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={labelStyle}>Date</label>
            <input className="rp-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>

          {/* Time */}
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={labelStyle}>Time Window</label>
            <select className="rp-input" value={timeSlot.label} onChange={e => setTimeSlot(TIME_SLOTS.find(t => t.label === e.target.value))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              {TIME_SLOTS.map(t => <option key={t.label} value={t.label} style={{ background: '#111827' }}>{t.label}</option>)}
            </select>
          </div>

          {/* Weapon Toggle */}
          <div style={{ flex: '1 1 180px', minWidth: 160 }}>
            <label style={labelStyle}>Weapon Factor</label>
            <div
              onClick={() => setWeaponUsed(!weaponUsed)}
              style={{
                ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                background: weaponUsed ? 'rgba(14,165,233,0.1)' : 'rgba(0,0,0,0.3)',
                borderColor: weaponUsed ? '#0ea5e9' : 'rgba(255,255,255,0.1)'
              }}
            >
              <span style={{ color: weaponUsed ? '#0ea5e9' : '#fff', fontWeight: weaponUsed ? 600 : 400 }}>Include Weapon</span>
              <div style={{ width: 36, height: 20, background: weaponUsed ? '#0ea5e9' : 'rgba(255,255,255,0.2)', borderRadius: 20, position: 'relative', transition: '0.2s' }}>
                <div style={{ position: 'absolute', top: 2, left: weaponUsed ? 18 : 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: '0.2s' }} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ flex: '1 1 150px', minWidth: 150 }}>
            <button
              type="submit" disabled={loading} className="btn-primary"
              style={{
                width: '100%', padding: '10px 16px',
                fontSize: 13, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 41, transition: 'all 0.2s', opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'rp-spin 0.8s linear infinite' }} /> Analyzing...</>
              ) : (
                <>Analyze Risk</>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 400 }}>
        
        {/* Loading state */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, padding: 40 }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.04)', borderTopColor: '#0ea5e9', animation: 'rp-spin 1.2s linear infinite' }} />
              <div style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.03)', borderTopColor: '#38bdf8', animation: 'rp-spin 1.8s linear infinite reverse' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Compiling Report</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Running multi-model risk assessment…</p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ margin: 'auto', padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center', maxWidth: 320 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#ef4444' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', margin: '0 0 4px' }}>Analysis Failed</p>
            <p style={{ fontSize: 12, color: 'rgba(239,68,68,0.65)', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Idle state */}
        {!loading && !result && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, padding: 40 }}>
            <RadarIdle />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>Awaiting Parameters</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: 300, lineHeight: 1.5 }}>
                Fill in the details above and hit <strong>Analyze Risk</strong> to view the complete area assessment report right here.
              </p>
            </div>
          </motion.div>
        )}

        {/* Result state */}
        {!loading && result && (
          <PredictionPanel result={result} />
        )}
      </div>

    </div>
  );
};

export default RiskPredictPage;
