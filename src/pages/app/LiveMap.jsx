import React from 'react';
import AlertItem from '../../components/ui/AlertItem';

const riskZones = [
  { level: 'high', title: 'Downtown Core — High Risk', meta: 'Crime spike +41% vs. 7-day avg', timestamp: '5m ago' },
  { level: 'medium', title: 'Northside District — Moderate', meta: '7 incidents logged today', timestamp: '22m ago' },
  { level: 'medium', title: 'Eastgate Corridor — Moderate', meta: 'Elevated foot traffic near market', timestamp: '1h ago' },
  { level: 'low', title: 'Riverside Park — Low Risk', meta: 'All-clear — no incidents', timestamp: '2h ago' },
];

const mapDots = [
  { x: '28%', y: '42%', color: 'var(--danger)', label: 'Downtown' },
  { x: '45%', y: '30%', color: 'var(--warning)', label: 'Northside' },
  { x: '63%', y: '55%', color: 'var(--warning)', label: 'Eastgate' },
  { x: '38%', y: '65%', color: 'var(--accent)', label: 'Riverside' },
  { x: '72%', y: '38%', color: 'var(--accent)', label: 'Westbrook' },
  { x: '55%', y: '72%', color: 'var(--danger)', label: 'Southend' },
];

const LiveMap = () => {
  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
          Live Risk Map
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Real-time risk visualization across all monitored districts.
        </p>
      </div>

      {/* Map container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden map-grid"
        style={{ height: 360, background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, var(--accent-dim) 0%, transparent 70%)' }} />

        {mapDots.map((dot, i) => (
          <div key={i} className="absolute flex items-center justify-center" style={{ left: dot.x, top: dot.y, transform: 'translate(-50%,-50%)' }}>
            <div
              className="absolute rounded-full"
              style={{ width: 28, height: 28, background: `${dot.color}20`, border: `1px solid ${dot.color}40`, animation: `pulseDot ${1.8 + i * 0.3}s ease-in-out infinite` }}
            />
            <div className="rounded-full relative z-10" style={{ width: 10, height: 10, background: dot.color, boxShadow: `0 0 8px ${dot.color}` }} />
            <span
              className="absolute whitespace-nowrap text-xs font-medium"
              style={{ top: 18, color: 'var(--text-primary)', background: 'var(--surface)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}
            >
              {dot.label}
            </span>
          </div>
        ))}

        {/* Legend */}
        <div
          className="absolute bottom-4 right-4 rounded-xl p-3 flex flex-col gap-2"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Risk Level</p>
          {[
            { color: 'var(--danger)', label: 'High' },
            { color: 'var(--warning)', label: 'Medium' },
            { color: 'var(--accent)', label: 'Low' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="rounded-full" style={{ width: 8, height: 8, background: color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Placeholder badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
        >
          🗺 Leaflet map renders here in production
        </div>
      </div>

      {/* Risk zone list */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
          Current risk zones
        </h2>
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}>
          {riskZones.map((zone, i) => (
            <AlertItem key={i} {...zone} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
