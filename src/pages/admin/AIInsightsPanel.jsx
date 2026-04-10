import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

/* ── Brand constants ─────────────────────────────────────────────────────── */
const T  = '#00d4aa';
const B  = '#0ea5e9';
const R  = '#ef4444';
const AM = '#f59e0b';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
};

/* ── useCountUp hook ─────────────────────────────────────────────────────── */
const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const num = parseFloat(target);
    const isFloat = String(target).includes('.');
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(isFloat ? (num * eased).toFixed(2) : Math.round(num * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
};

/* ── Data ────────────────────────────────────────────────────────────────── */
const TREND_FORECAST = [
  { hour: '00', actual: 18, predicted: 20 },
  { hour: '03', actual: 12, predicted: 13 },
  { hour: '06', actual: 9,  predicted: 11 },
  { hour: '09', actual: 22, predicted: 24 },
  { hour: '12', actual: 31, predicted: 29 },
  { hour: '15', actual: 41, predicted: 43 },
  { hour: '18', actual: 68, predicted: 72 },
  { hour: '21', actual: 55, predicted: 60 },
  { hour: '24', actual: null, predicted: 48 },
];

const RISK_MAP_DATA = [
  { zone: 'Gulshan',  risk: 87, trend: 'up' },
  { zone: 'Univ Rd', risk: 79, trend: 'up' },
  { zone: 'DHA P5',  risk: 64, trend: 'up' },
  { zone: 'Saddar',  risk: 58, trend: 'stable' },
  { zone: 'Clifton', risk: 44, trend: 'down' },
  { zone: 'Korangi', risk: 38, trend: 'stable' },
  { zone: 'Riverside', risk: 21, trend: 'down' },
];

const INSIGHTS = [
  {
    id: 1, type: 'Rising Trend', severity: 'high', accent: R,
    title: 'Evening Theft Surge — Gulshan District',
    desc: 'Model detected a statistically significant +41% spike in petty theft between 18:00–21:00 over the past 6 days. Isolated pedestrian zones are highest-risk corridors.',
    confidence: 94, recommendation: 'Increase patrol frequency in Zone-G4 between 18:00–22:00.',
    timeframe: 'Next 48h', generated: '4 min ago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: 2, type: 'Anomaly Detection', severity: 'high', accent: R,
    title: 'Unusual Cluster — University Road',
    desc: '7 mobile snatching events within a 0.4km radius in 9 hours — 3.2× above the seasonal baseline for this zone.',
    confidence: 88, recommendation: 'Deploy undercover officers at University Chowk during peak transit hours.',
    timeframe: 'Next 24h', generated: '11 min ago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    id: 3, type: 'Risk Forecast', severity: 'medium', accent: AM,
    title: 'Weekend High-Risk Window — DHA Phase 5',
    desc: 'LSTM + RandomForest ensemble projects a 68% probability of elevated vehicle theft in commercial parking zones on Friday-Saturday nights.',
    confidence: 91, recommendation: 'Issue community advisory and coordinate with private security in P5 commercial zones.',
    timeframe: 'Fri–Sat Night', generated: '22 min ago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 4, type: 'Pattern Recognition', severity: 'medium', accent: B,
    title: 'Patrol Shift-Gap Exploitation Pattern',
    desc: 'Incidents cluster in a 20-minute window at 02:00 and 06:00 — aligning precisely with patrol shift transitions (p < 0.02).',
    confidence: 96, recommendation: 'Overlap patrol shifts by 30 minutes to eliminate the exploitation window.',
    timeframe: 'Ongoing', generated: '35 min ago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 5, type: 'Safe Zone Validation', severity: 'low', accent: T,
    title: 'Riverside Corridor — Reclassified Safe',
    desc: 'After 14 days of zero incidents, the model has downgraded Riverside from MEDIUM to LOW risk. Patrol allocation can be redistributed.',
    confidence: 87, recommendation: 'Reallocate 2 patrol units from Riverside to the University Road cluster zone.',
    timeframe: 'Immediate', generated: '1h ago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

/* ── Model Performance Data ──────────────────────────────────────────────── */
const CLASS_METRICS = [
  { label: 'Theft',     precision: 0.96, recall: 0.92, f1: 0.94, support: 412 },
  { label: 'Assault',   precision: 0.88, recall: 0.91, f1: 0.89, support: 247 },
  { label: 'Robbery',   precision: 0.93, recall: 0.87, f1: 0.90, support: 198 },
  { label: 'Vandalism', precision: 0.84, recall: 0.88, f1: 0.86, support: 163 },
  { label: 'Other',     precision: 0.79, recall: 0.82, f1: 0.80, support: 134 },
];

// Confusion matrix: rows=Actual, cols=Predicted [Theft, Assault, Robbery, Vandalism, Other]
const CONFUSION = {
  labels: ['Theft', 'Assault', 'Robbery', 'Vandalism', 'Other'],
  matrix: [
    [379, 10,  8,  9,  6],
    [  9, 225, 4,  5,  4],
    [  8,  5, 172, 7,  6],
    [  7,  4,  5, 143, 4],
    [  6,  5,  4,  9, 110],
  ],
};

const F1_BAR_DATA = CLASS_METRICS.map(m => ({ name: m.label, f1: parseFloat((m.f1 * 100).toFixed(1)) }));

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const SeverityBadge = ({ severity }) => {
  const cfg = {
    high:   { label: 'HIGH',   color: R,  bg: 'rgba(239,68,68,0.10)'  },
    medium: { label: 'MEDIUM', color: AM, bg: 'rgba(245,158,11,0.10)' },
    low:    { label: 'LOW',    color: T,  bg: 'rgba(0,212,170,0.10)'  },
  }[severity];
  return (
    <span style={{
      fontSize: 8, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 99, color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
    }}>{cfg.label}</span>
  );
};

const AnimatedBar = ({ value, color, delay }) => (
  <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value * 100}%` }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}50` }}
    />
  </div>
);

/* ── Custom Tooltip ──────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...glass, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Hour {label}:00</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name === 'actual' ? 'Actual' : 'ML Forecast'}: {p.value ?? '—'}
        </p>
      ))}
    </div>
  );
};

const F1Tooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...glass, borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: T, fontWeight: 700 }}>F1: {payload[0].value}%</p>
    </div>
  );
};

/* ── Insight Card ────────────────────────────────────────────────────────── */
const InsightCard = ({ insight, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setExpanded(e => !e)}
      style={{
        ...glass,
        borderRadius: 14,
        padding: '16px 20px',
        cursor: 'pointer',
        borderLeft: `3px solid ${insight.accent}`,
        position: 'relative',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ position: 'absolute', top: 12, right: 16 }}>
        <SeverityBadge severity={insight.severity} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 70 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${insight.accent}18`, border: `1px solid ${insight.accent}30`, color: insight.accent,
        }}>
          {insight.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: insight.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
            {insight.type}
          </p>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>{insight.title}</h3>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>{insight.desc}</p>

          {/* Confidence bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confidence</span>
              <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>{insight.confidence}%</span>
            </div>
            <AnimatedBar value={insight.confidence / 100} color={insight.accent} delay={0.05 * index + 0.2} />
          </div>

          <div style={{ display: 'flex', gap: 16, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            <span>Updated {insight.generated}</span>
            <span>Timeframe: {insight.timeframe}</span>
            <span style={{ color: insight.accent, fontWeight: 600 }}>{expanded ? '▲ Hide' : '▼ Recommendation'}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 9, color: T, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                Recommended Action
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{insight.recommendation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
const AIInsightsPanel = () => {
  const [filter, setFilter] = useState('all');
  const [cmActive, setCmActive] = useState(null); // [row, col]

  const filtered = filter === 'all' ? INSIGHTS : INSIGHTS.filter(i => i.severity === filter);

  const macroF1 = (CLASS_METRICS.reduce((s, m) => s + m.f1, 0) / CLASS_METRICS.length).toFixed(2);
  const macroPrecision = (CLASS_METRICS.reduce((s, m) => s + m.precision, 0) / CLASS_METRICS.length).toFixed(2);
  const macroRecall = (CLASS_METRICS.reduce((s, m) => s + m.recall, 0) / CLASS_METRICS.length).toFixed(2);

  const f1Count = useCountUp(parseFloat(macroF1) * 100, 1400);
  const precCount = useCountUp(parseFloat(macroPrecision) * 100, 1400);
  const recCount = useCountUp(parseFloat(macroRecall) * 100, 1400);
  const accCount = useCountUp(94, 1400);

  // Confusion matrix max (for colour scaling, skip diagonal)
  const cmMax = Math.max(...CONFUSION.matrix.flat().filter((_, i) => {
    const row = Math.floor(i / CONFUSION.labels.length);
    const col = i % CONFUSION.labels.length;
    return row !== col;
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 48 }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          ...glass,
          borderRadius: 18,
          padding: '20px 26px',
          background: 'linear-gradient(120deg, rgba(0,212,170,0.06) 0%, rgba(14,165,233,0.04) 100%)',
          border: '1px solid rgba(0,212,170,0.20)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T}70, transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>AI Crime Insights</h1>
              <span style={{
                fontSize: 8, fontWeight: 900, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: B, background: 'rgba(14,165,233,0.15)', border: `1px solid rgba(14,165,233,0.3)`,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: B, display: 'inline-block' }}
                />
                LIVE ML SYNC
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Lense-ML v2.4 · Ensemble model (LSTM + RandomForest) · Updated every 15 min
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: `${accCount}%`, sub: 'Accuracy', color: T },
              { label: `${f1Count}%`, sub: 'Macro F1', color: B },
              { label: `${INSIGHTS.length}`, sub: 'Active Insights', color: T },
            ].map(({ label, sub, color }) => (
              <div key={sub} style={{ ...glass, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>{label}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══ MODEL PERFORMANCE SECTION ═══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.38 }}
      >
        {/* Section title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 3, height: 18, borderRadius: 2,
            background: `linear-gradient(180deg, ${T}, ${B})`,
          }} />
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Model Performance</h2>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>Evaluation on 1,154 test samples</span>
        </div>

        {/* Top KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Overall Accuracy', value: accCount, suffix: '%', color: T, desc: 'Correct predictions out of all samples' },
            { label: 'Macro Precision', value: precCount, suffix: '%', color: B, desc: 'Avg precision across all crime classes' },
            { label: 'Macro Recall', value: recCount, suffix: '%', color: B, desc: 'Avg recall across all crime classes' },
            { label: 'Macro F1-Score', value: f1Count, suffix: '%', color: T, desc: 'Harmonic mean of precision and recall' },
          ].map(({ label, value, suffix, color, desc }) => (
            <div key={label} style={{ ...glass, borderRadius: 14, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.5 }} />
              <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, marginBottom: 6 }}>{value}{suffix}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Per-class table + F1 bar chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

          {/* Per-class metrics table */}
          <div style={{ ...glass, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Per-Class Evaluation Metrics</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Precision · Recall · F1-Score per crime category</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Class', 'Precision', 'Recall', 'F1-Score', 'Support'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: h === 'Class' ? 'left' : 'center',
                      fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASS_METRICS.map((m, i) => (
                  <motion.tr
                    key={m.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{m.label}</span>
                    </td>
                    {[m.precision, m.recall, m.f1].map((val, vi) => {
                      const col = val >= 0.92 ? T : val >= 0.86 ? B : AM;
                      return (
                        <td key={vi} style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{(val * 100).toFixed(0)}%</span>
                            <div style={{ width: 44, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val * 100}%` }}
                                transition={{ delay: 0.2 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                style={{ height: '100%', background: col, borderRadius: 99 }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      {m.support}
                    </td>
                  </motion.tr>
                ))}
                {/* Macro avg row */}
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Macro Avg</td>
                  {[macroPrecision, macroRecall, macroF1].map((v, vi) => (
                    <td key={vi} style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: T }}>{(parseFloat(v) * 100).toFixed(0)}%</td>
                  ))}
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>1,154</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* F1 bar chart */}
          <div style={{ ...glass, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>F1-Score by Class</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Higher = better balance of precision & recall</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={F1_BAR_DATA} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[70, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<F1Tooltip />} />
                <Bar dataKey="f1" radius={[0, 4, 4, 0]}>
                  {F1_BAR_DATA.map((entry, i) => {
                    const col = entry.f1 >= 92 ? T : entry.f1 >= 86 ? B : AM;
                    return <Cell key={i} fill={col} fillOpacity={0.85} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Confusion Matrix ────────────────────────────────────── */}
        <div style={{ ...glass, borderRadius: 14, padding: '20px 24px', marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Confusion Matrix</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                Rows = Actual class &nbsp;·&nbsp; Columns = Predicted class &nbsp;·&nbsp; Diagonal = correct predictions
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: `${T}50`, display: 'inline-block' }} /> Correct (diagonal)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: `${R}40`, display: 'inline-block' }} /> Misclassified
              </span>
            </div>
          </div>

          {/* Predicted label row */}
          <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${CONFUSION.labels.length}, 1fr)`, gap: 4 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textAlign: 'right', paddingRight: 8, alignSelf: 'end', paddingBottom: 4 }}>
              Actual \ Predicted →
            </div>
            {CONFUSION.labels.map(l => (
              <div key={l} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', padding: '4px 0' }}>
                {l}
              </div>
            ))}

            {CONFUSION.matrix.map((row, ri) => (
              <React.Fragment key={ri}>
                {/* Row label */}
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                  textAlign: 'right', paddingRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                }}>
                  {CONFUSION.labels[ri]}
                </div>
                {row.map((val, ci) => {
                  const isDiag = ri === ci;
                  const intensity = isDiag ? 0.55 : Math.min(val / cmMax, 1) * 0.45;
                  const bg = isDiag ? `rgba(0,212,170,${intensity})` : `rgba(239,68,68,${intensity})`;
                  const isActive = cmActive && cmActive[0] === ri && cmActive[1] === ci;
                  return (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + (ri * CONFUSION.labels.length + ci) * 0.01 }}
                      onMouseEnter={() => setCmActive([ri, ci])}
                      onMouseLeave={() => setCmActive(null)}
                      style={{
                        background: bg,
                        border: isActive ? `2px solid ${isDiag ? T : R}` : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8,
                        padding: '10px 6px',
                        textAlign: 'center',
                        cursor: 'default',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{
                        fontSize: 13, fontWeight: isDiag ? 800 : 600,
                        color: isDiag ? (isActive ? '#fff' : `rgba(255,255,255,0.9)`) : (val > 5 ? '#fff' : 'rgba(255,255,255,0.5)'),
                      }}>
                        {val}
                      </span>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Hover tooltip */}
          <AnimatePresence>
            {cmActive && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  marginTop: 14, padding: '10px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, color: 'rgba(255,255,255,0.7)',
                }}
              >
                {cmActive[0] === cmActive[1]
                  ? <><span style={{ color: T, fontWeight: 700 }}>{CONFUSION.matrix[cmActive[0]][cmActive[1]]} correct</span> — Model correctly classified <strong style={{ color: '#fff' }}>{CONFUSION.labels[cmActive[0]]}</strong></>
                  : <><span style={{ color: R, fontWeight: 700 }}>{CONFUSION.matrix[cmActive[0]][cmActive[1]]} misclassified</span> — Actual: <strong style={{ color: '#fff' }}>{CONFUSION.labels[cmActive[0]]}</strong> was predicted as <strong style={{ color: '#fff' }}>{CONFUSION.labels[cmActive[1]]}</strong></>
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── 24h Forecast + Risk Zones ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.38 }}
          style={{ ...glass, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${B}50, transparent)` }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>24-Hour Incident Forecast</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Actual vs. ML-predicted incident volume by hour</p>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 10 }}>
              <span style={{ color: T, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 16, height: 2, background: T, display: 'inline-block', borderRadius: 2 }} /> Actual
              </span>
              <span style={{ color: B, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 16, height: 2, background: B, display: 'inline-block', borderRadius: 2, borderTop: '2px dashed' }} /> Forecast
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_FORECAST} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={T} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={B} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={B} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="actual" stroke={T} strokeWidth={2} fill="url(#gA)" dot={false} />
              <Area type="monotone" dataKey="predicted" stroke={B} strokeWidth={2} strokeDasharray="5 3" fill="url(#gB)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.38 }}
          style={{ ...glass, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Predicted High-Risk Zones</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Risk score · Next 24h forecast</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {RISK_MAP_DATA.map((zone, i) => {
              const col = zone.risk >= 75 ? R : zone.risk >= 50 ? AM : T;
              const trendColor = zone.trend === 'up' ? R : zone.trend === 'down' ? T : 'rgba(255,255,255,0.35)';
              const trendArrow = zone.trend === 'up' ? '↑' : zone.trend === 'down' ? '↓' : '→';
              return (
                <motion.div key={zone.zone} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{zone.zone}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10, color: trendColor, fontWeight: 700 }}>{trendArrow}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: col }}>{zone.risk}%</span>
                    </div>
                  </div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.risk}%` }}
                      transition={{ delay: 0.25 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', borderRadius: 99, background: col }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            Lense-ML · Next update in 14 min
          </p>
        </motion.div>
      </div>

      {/* ── Active Insights ──────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg, ${T}, ${B})` }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Active Insights ({filtered.length})</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'high', 'medium', 'low'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                  padding: '4px 12px', borderRadius: 99, cursor: 'pointer', transition: 'all 0.15s',
                  color: filter === f ? T : 'rgba(255,255,255,0.4)',
                  background: filter === f ? 'rgba(0,212,170,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {f === 'all' ? 'All' : f === 'high' ? 'High' : f === 'medium' ? 'Medium' : 'Low / Safe'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence mode="wait">
            {filtered.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default AIInsightsPanel;
