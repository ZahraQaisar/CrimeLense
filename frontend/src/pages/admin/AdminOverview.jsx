import React, { useState } from 'react';
import { Activity, Server, Users, AlertOctagon, TrendingUp, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';

const BRAND_TEAL = '#00d4aa';
const BRAND_BLUE = '#0ea5e9';
const BRAND_RED = '#ef4444';

// ── Dummy data ─────────────────────────────────────────────────────────────

const trendData = {
  '7d': [
    { day: 'Mon', crimes: 38 }, { day: 'Tue', crimes: 52 }, { day: 'Wed', crimes: 45 },
    { day: 'Thu', crimes: 61 }, { day: 'Fri', crimes: 74 }, { day: 'Sat', crimes: 88 }, { day: 'Sun', crimes: 63 },
  ],
  '30d': [
    { day: 'W1', crimes: 210 }, { day: 'W2', crimes: 185 }, { day: 'W3', crimes: 240 },
    { day: 'W4', crimes: 198 }, { day: 'W5', crimes: 275 }, { day: 'W6', crimes: 260 },
    { day: 'W7', crimes: 230 }, { day: 'W8', crimes: 290 }, { day: 'W9', crimes: 310 }, { day: 'W10', crimes: 285 },
  ],
  '90d': [
    { day: 'Jan', crimes: 820 }, { day: 'Feb', crimes: 740 }, { day: 'Mar', crimes: 910 },
    { day: 'Apr', crimes: 870 }, { day: 'May', crimes: 950 }, { day: 'Jun', crimes: 1020 },
    { day: 'Jul', crimes: 980 }, { day: 'Aug', crimes: 1100 }, { day: 'Sep', crimes: 1050 },
    { day: 'Oct', crimes: 890 }, { day: 'Nov', crimes: 760 }, { day: 'Dec', crimes: 830 },
  ],
};

const crimeTypeData = [
  { name: 'Theft', value: 34 }, { name: 'Assault', value: 22 }, { name: 'Robbery', value: 18 },
  { name: 'Vandalism', value: 14 }, { name: 'Other', value: 12 },
];
// ONLY Brand Colors or white/gray
const DONUT_COLORS = [BRAND_TEAL, BRAND_BLUE, '#ffffff', 'rgba(0,212,170,0.5)', 'rgba(14,165,233,0.5)'];

const hourlyData = [
  { hour: '00', crimes: 12 }, { hour: '02', crimes: 8 }, { hour: '04', crimes: 5 }, { hour: '06', crimes: 9 },
  { hour: '08', crimes: 21 }, { hour: '10', crimes: 28 }, { hour: '12', crimes: 35 }, { hour: '14', crimes: 31 },
  { hour: '16', crimes: 42 }, { hour: '18', crimes: 55 }, { hour: '20', crimes: 67 }, { hour: '22', crimes: 48 },
];

const topAreas = [
  { rank: 1, name: 'Hollywood', incidents: 145, risk: 'High', change: +12 },
  { rank: 2, name: 'Central', incidents: 118, risk: 'High', change: -4 },
  { rank: 3, name: 'West Valley', incidents: 87, risk: 'Medium', change: +6 },
  { rank: 4, name: 'Harbor', incidents: 64, risk: 'Medium', change: -2 },
  { rank: 5, name: 'Devonshire', incidents: 39, risk: 'Low', change: +1 },
];

// ── Reusable panel wrapper ─────────────────────────────────────────────────
const Panel = ({ title, subtitle, children, className = '' }) => (
  <div className={`glass-panel rounded-2xl border border-white/5 p-6 ${className}`}>
    <div className="mb-4">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Custom tooltip for charts ──────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#fff' }} className="font-bold">
          {p.name ?? 'Crimes'}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ── Risk badge ─────────────────────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
  const dot = { High: BRAND_RED, Medium: BRAND_TEAL, Low: '#9ca3af' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.09)' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot[risk], flexShrink: 0, display: 'inline-block' }} />
      {risk}
    </span>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const AdminOverview = () => {
  const [trendRange, setTrendRange] = useState('7d');

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">System Administration</h1>
          <p className="text-gray-400 text-sm mt-0.5">Monitor system health and data integrity</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold w-fit"
          style={{ background: 'rgba(0,212,170,0.1)', color: BRAND_TEAL, borderColor: 'rgba(0,212,170,0.25)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BRAND_TEAL }} />
          All Systems Operational
        </span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Users"     value="1,248"  trend="up"   trendValue="+12"   icon={Users}        color="blue"  />
        <StatCard title="Active Incidents" value="45"    trend="down" trendValue="-3"    icon={AlertOctagon} color="teal"  />
        <StatCard title="System Load"     value="32%"   trend="up"   trendValue="+2%"   icon={Server}       color="blue"  />
        <StatCard title="Model Accuracy"  value="94.2%" trend="up"   trendValue="+0.4%" icon={Activity}     color="teal"  />
      </div>

      {/* ── Row 1: Line Chart + Donut Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <Panel
          title="Crime Trends"
          subtitle={trendRange === '7d' ? 'Daily crime count — last 7 days' : trendRange === '30d' ? 'Weekly crime count — last 30 days' : 'Monthly crime count — last 90 days'}
          className="lg:col-span-2"
        >
          <div className="flex gap-2 mb-4">
            {['7d', '30d', '90d'].map(r => (
              <button key={r} onClick={() => setTrendRange(r)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
                style={trendRange === r
                  ? { background: 'rgba(0,212,170,0.12)', borderColor: 'rgba(0,212,170,0.28)', color: BRAND_TEAL }
                  : { color: '#9ca3af', borderColor: 'transparent' }}
                onMouseEnter={e => { if (trendRange !== r) e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { if (trendRange !== r) e.currentTarget.style.color = '#9ca3af' }}>
                {r}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData[trendRange]} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="crimes" stroke={BRAND_TEAL} strokeWidth={2}
                dot={{ fill: BRAND_TEAL, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: BRAND_TEAL, stroke: 'rgba(0,212,170,0.3)', strokeWidth: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Crime Types" subtitle="Distribution by category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={crimeTypeData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {crimeTypeData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* ── Row 2: Hourly Bar + Top 5 Areas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <Panel title="Hourly Crime Activity" subtitle="Average crimes per hour of day">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={hourlyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="crimes" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.crimes >= 50 ? BRAND_BLUE : entry.crimes >= 30 ? 'rgba(14,165,233,0.5)' : BRAND_TEAL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-end">
            {[[BRAND_TEAL, 'Low'], ['rgba(14,165,233,0.5)', 'Medium'], [BRAND_BLUE, 'High']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: color }} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top 5 High-Risk Areas" subtitle="Ranked by monthly incident count">
          <div className="space-y-2.5">
            {topAreas.map(area => (
              <div key={area.rank} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                  {area.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{area.name}</p>
                  <p className="text-xs text-gray-500">{area.incidents} incidents this month</p>
                </div>
                <RiskBadge risk={area.risk} />
                <div className="flex items-center gap-0.5 text-xs font-bold shrink-0" style={{ color: area.change > 0 ? BRAND_RED : BRAND_TEAL }}>
                  {area.change > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {area.change > 0 ? '+' : ''}{area.change}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Row 3: System Logs + Pending Datasets ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Recent System Logs">
          <div className="space-y-2">
            {[
              { msg: 'Data sync completed successfully', time: '10:41 AM', status: 'success' },
              { msg: 'ML model retrained — accuracy 94.2%', time: '09:30 AM', status: 'success' },
              { msg: 'XGBoost confidence dropped below 80%', time: '08:55 AM', status: 'warning' },
              { msg: 'Crime data feed timeout — retrying', time: '08:20 AM', status: 'error' },
            ].map((log, i) => {
              const hex = log.status === 'success' ? '#fff' : log.status === 'warning' ? BRAND_RED : BRAND_RED;
              return (
                <div key={i} className="flex justify-between items-center p-3 bg-white/3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: hex }} />
                    <span className="text-xs text-gray-300">{log.msg}</span>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 ml-3">{log.time}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Pending Dataset Reviews">
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Server size={40} className="mb-2 opacity-30" />
            <p className="text-sm">No new datasets pending review</p>
          </div>
        </Panel>
      </div>

    </div>
  );
};

export default AdminOverview;