import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LA_AREAS from '../../constants/areas';
import { predictionService } from '../../services/predictionService';

/* ── Fix leaflet default icon ─────────────────────────────── */
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

/* ── Auto-fit map to route bounds ─────────────────────────── */
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      try {
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 13, animate: true });
      } catch (_) { }
    }
  }, [map, points]);
  return null;
}

/* ── Area label markers on map ─────────────────────────────── */
function AreaLabels({ areas }) {
  return areas.map(area => {
    const divIcon = L.divIcon({
      className: '',
      html: `<div style="
        background: rgba(15,23,42,0.82);
        color: rgba(255,255,255,0.75);
        font-size: 9px;
        font-weight: 700;
        font-family: Inter, sans-serif;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 3px 7px;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.15);
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${area.label}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
    return <Marker key={area.label} position={[area.lat, area.lon]} icon={divIcon} />;
  });
}

/* ── Custom pin marker with area name label ───────────────── */
function pinIcon(color, areaName) {
  // Short label: max 10 chars to keep it tidy
  const short = areaName && areaName.length > 10 ? areaName.slice(0, 9) + '…' : (areaName || '?');
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:${color};border:2.5px solid #fff;
        border-radius:10px 10px 10px 2px;
        box-shadow:0 3px 12px rgba(0,0,0,0.45);
        padding:4px 8px;
        white-space:nowrap;
      "><span style="color:#fff;font-weight:900;font-size:10px;font-family:Inter,sans-serif;letter-spacing:0.03em;">${short}</span></div>
      <div style="width:2px;height:8px;background:${color};margin:0 auto;"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:${color};"></div>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [30, 46],
    popupAnchor: [30, -50],
  });
}

/* ── Info bubble on map ───────────────────────────────────── */
function InfoBubble({ text }) {
  const map = useMap();
  const center = map.getCenter();
  const infoIcon = L.divIcon({
    className: '',
    html: `<div style="
      background:rgba(15,23,42,0.92);
      color:#fff;font-size:11px;font-family:Inter,sans-serif;font-weight:600;
      padding:8px 14px;border-radius:10px;
      border:1px solid rgba(255,255,255,0.15);
      box-shadow:0 4px 18px rgba(0,0,0,0.35);
      white-space:nowrap;pointer-events:none;
    ">${text}</div>`,
    iconSize: [0, 0],
    iconAnchor: [-10, 60],
  });
  return <Marker position={[center.lat + 0.015, center.lng]} icon={infoIcon} />;
}

/* ── LOCATIONS from LA_AREAS ──────────────────────────────── */
const LOCATIONS = LA_AREAS.map(a => a.label);

/* ── HIGH RISK areas (subset of LA_AREAS, pre-tagged) ─────── */
const HIGH_RISK_AREAS = [
  { label: '77th Street', lat: 33.9561, lon: -118.2785, radius: 1600 },
  { label: 'Newton', lat: 33.9966, lon: -118.2549, radius: 1400 },
  { label: 'Southeast', lat: 33.9393, lon: -118.2517, radius: 1500 },
  { label: 'Rampart', lat: 34.0621, lon: -118.2764, radius: 1300 },
  { label: 'Hollenbeck', lat: 34.0475, lon: -118.2107, radius: 1200 },
];

/* ── Icons ────────────────────────────────────────────────── */
const IcoPin = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: size, height: size, flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);
const IcoNav = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IcoRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><path d="M9 3v15M15 6v15" />
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoSave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IcoBookmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 13, height: 13 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Location autocomplete input ──────────────────────────── */
function LocationInput({ label, placeholder, icon: Icon, value, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const filtered = value.trim().length > 0
    ? LOCATIONS.filter(l => l.toLowerCase().includes(value.toLowerCase()))
    : LOCATIONS;

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 12,
        background: 'rgba(15,25,45,0.75)',
        border: open ? '1px solid rgba(0,212,170,0.5)' : '1px solid rgba(0,255,255,0.1)',
        transition: 'all 0.2s ease',
        boxShadow: open ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}><Icon /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 1, letterSpacing: '0.04em', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
          <input
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}
            placeholder={placeholder}
            value={value}
            onChange={e => { onChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        </div>
        {value && (
          <button type="button" onClick={onClear} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <IcoX />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', marginTop: 6, width: '100%',
              background: '#0d1626', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, overflowY: 'auto', maxHeight: 250, zIndex: 200,
              listStyle: 'none', padding: '6px 0', margin: 0,
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
          >
            {filtered.map(loc => (
              <li key={loc}>
                <button
                  type="button"
                  onClick={() => { onChange(loc); setOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Inter', sans-serif", transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; e.currentTarget.style.color = '#0ea5e9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <IcoPin size={12} /> {loc}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Travel mode button ───────────────────────────────────── */
function TravelModeBtn({ icon: Icon, title, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
        background: active ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid rgba(0,212,170,0.4)' : '1px solid rgba(255,255,255,0.05)',
        color: active ? '#fff' : 'rgba(255,255,255,0.4)',
        textAlign: 'center', fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 4, color: active ? '#00d4aa' : 'rgba(255,255,255,0.3)' }}>
        <Icon />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700 }}>{title}</div>
    </button>
  );
}

/* ── Save Modal ───────────────────────────────────────────── */
function SaveModal({ onClose, onSave, start, end }) {
  const [name, setName] = useState(`${start} → ${end}`);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)', zIndex: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: '#0d1626', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: 28, width: 380,
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Save Route</p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '4px 0 0' }}>Save to My Routes</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex' }}>
            <IcoX />
          </button>
        </div>
        <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nickname</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', outline: 'none', fontFamily: "'Inter', sans-serif",
            boxSizing: 'border-box',
          }}
          placeholder="e.g. Work Trip"
        />
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.18)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{start}</span>
            <span style={{ margin: '0 6px', color: 'rgba(255,255,255,0.25)' }}>→</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{end}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(name)} style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IcoBookmark /> Save Route
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Snap a lat/lon to nearest actual road via OSRM ──────────── */
async function snapToRoad(lat, lon) {
  try {
    const url = `https://router.project-osrm.org/nearest/v1/driving/${lon},${lat}?number=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.waypoints?.length) {
      const [snapLon, snapLat] = data.waypoints[0].location;
      return { lat: snapLat, lon: snapLon };
    }
  } catch { /* fall back to original */ }
  return { lat, lon };
}

/* ── OSRM real road routing ───────────────────────────────── */
async function fetchOSRMRoute(sLat, sLon, eLat, eLon, viaLat, viaLon) {
  let url;
  if (viaLat !== undefined) {
    url = `https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${viaLon},${viaLat};${eLon},${eLat}?overview=full&geometries=geojson&steps=true`;
  } else {
    url = `https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson&steps=true`;
  }
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) return null;
  const route = data.routes[0];
  // GeoJSON coords are [lon, lat] — convert to [lat, lon] for Leaflet
  const positions = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  const distKm = (route.distance / 1000).toFixed(1);
  const mins = Math.round(route.duration / 60);
  // Use actual OSRM snapped waypoints as definitive start/end
  const snappedStart = data.waypoints?.[0]?.location
    ? { lat: data.waypoints[0].location[1], lon: data.waypoints[0].location[0] }
    : { lat: sLat, lon: sLon };
  const snappedEnd = data.waypoints?.[data.waypoints.length - 1]?.location
    ? { lat: data.waypoints[data.waypoints.length - 1].location[1], lon: data.waypoints[data.waypoints.length - 1].location[0] }
    : { lat: eLat, lon: eLon };
  return { positions, distKm, mins, snappedStart, snappedEnd };
}

async function buildRouteAsync(startLabel, endLabel) {
  const startArea = LA_AREAS.find(a => a.label === startLabel) || LA_AREAS[1];
  const endArea   = LA_AREAS.find(a => a.label === endLabel)   || LA_AREAS[6];

  // Step 1: Snap both endpoints to actual roads first
  const [snapStart, snapEnd] = await Promise.all([
    snapToRoad(startArea.lat, startArea.lon),
    snapToRoad(endArea.lat,   endArea.lon),
  ]);

  const sLat = snapStart.lat, sLon = snapStart.lon;
  const eLat = snapEnd.lat,   eLon = snapEnd.lon;

  // Step 2: Fetch safe (direct) route with snapped coords
  const safe = await fetchOSRMRoute(sLat, sLon, eLat, eLon);
  if (!safe) throw new Error('Could not fetch route from OSRM. Check your internet connection.');

  // Step 3: Use safe route's actual snapped start/end as markers
  const actualStart = safe.snappedStart || { lat: sLat, lon: sLon };
  const actualEnd   = safe.snappedEnd   || { lat: eLat, lon: eLon };

  // Step 4: Generate alternative "danger" route via a high-risk zone waypoint
  const midLat = (sLat + eLat) / 2;
  const midLon = (sLon + eLon) / 2;
  const riskVia = HIGH_RISK_AREAS.reduce((best, z) => {
    const d = Math.abs(z.lat - midLat) + Math.abs(z.lon - midLon);
    return (!best || d < best.d) ? { ...z, d } : best;
  }, null);

  let dangerPositions = null;
  if (riskVia) {
    // Snap the via point too
    const snapVia = await snapToRoad(riskVia.lat, riskVia.lon);
    const danger = await fetchOSRMRoute(sLat, sLon, eLat, eLon, snapVia.lat, snapVia.lon);
    if (danger) dangerPositions = danger.positions;
  }

  // If no danger route (same area), just offset the safe route slightly as alternative
  if (!dangerPositions) dangerPositions = safe.positions;

  const nearbyRiskAreas = HIGH_RISK_AREAS.filter(hr => {
    const d = Math.sqrt(Math.pow((hr.lat - midLat) * 111, 2) + Math.pow((hr.lon - midLon) * 85, 2));
    return d < 18;
  });

  // Step 5: Get real risk scores from ML model for start & end areas
  const now = new Date();
  let safetyScore = null;
  let startRiskScore = null;
  let endRiskScore = null;
  try {
    const [startPred, endPred] = await Promise.all([
      predictionService.predict({
        latitude: startArea.lat, longitude: startArea.lon,
        hour: now.getHours(), month: now.getMonth() + 1, weapon_used: 0,
      }),
      predictionService.predict({
        latitude: endArea.lat, longitude: endArea.lon,
        hour: now.getHours(), month: now.getMonth() + 1, weapon_used: 0,
      }),
    ]);
    startRiskScore = Math.round(startPred?.risk_score ?? 50);
    endRiskScore   = Math.round(endPred?.risk_score   ?? 50);
    // Safety = inverse of average risk (capped 0-100)
    const avgRisk = (startRiskScore + endRiskScore) / 2;
    safetyScore = Math.max(0, Math.min(100, Math.round(100 - avgRisk)));
  } catch {
    // Backend offline — show null so UI can display "Unavailable"
    safetyScore = null;
  }

  return {
    safetyScore,
    startRiskScore,
    endRiskScore,
    distance: `${safe.distKm} km`,
    eta: `${safe.mins} mins`,
    safePositions: safe.positions,
    dangerPositions,
    startPos: [actualStart.lat, actualStart.lon],
    endPos:   [actualEnd.lat,   actualEnd.lon],
    allPoints: safe.positions,
    nearbyRiskAreas,
    startArea, endArea,
  };
}


/* ── Shared routes store (localStorage) ─────────────────────── */
function loadSavedRoutes() {
  try { return JSON.parse(localStorage.getItem('cl_my_routes') || '[]'); } catch { return []; }
}
function persistRoute(entry) {
  const existing = loadSavedRoutes();
  existing.unshift(entry);
  localStorage.setItem('cl_my_routes', JSON.stringify(existing));
}

/* ── Night-time hour check ───────────────────────────────────── */
function isNightHour(h) { return h >= 21 || h < 6; }
function isEveningHour(h) { return h >= 18 && h < 21; }

/* ── Main Page ─────────────────────────────────────────────────── */
const SafeRoutePage = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [travelMode, setMode] = useState('now');
  // "later" mode
  const [schedTime, setSchedTime] = useState('18:00');
  const [schedDate, setSchedDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  // "precalc" mode
  const [workPeriod, setWorkPeriod] = useState('morning'); // morning | evening | night
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [routeError, setRouteError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const canSubmit = start.trim() && end.trim() && !loading;

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSearch = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setResult(null); setSaved(false); setRouteError('');
    try {
      const r = await buildRouteAsync(start, end);

      // ── Apply mode-specific adjustments ──────────────────────
      if (travelMode === 'now') {
        // Use real current time, no adjustment needed
        const nowH = new Date().getHours();
        if (isNightHour(nowH)) {
          r.safetyScore = Math.max(55, r.safetyScore - 18);
          r.modeNote = '⚠️ Night travel detected — reduced safety score.';
        } else if (isEveningHour(nowH)) {
          r.safetyScore = Math.max(68, r.safetyScore - 8);
          r.modeNote = '🌆 Evening travel — slightly elevated risk.';
        } else {
          r.modeNote = '☀️ Daytime travel — optimal safety conditions.';
        }
        r.modeLabel = `Leaving now · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      else if (travelMode === 'later') {
        const [hStr, mStr] = schedTime.split(':');
        const h = parseInt(hStr, 10);
        if (isNightHour(h)) {
          r.safetyScore = Math.max(52, r.safetyScore - 20);
          r.modeNote = '🌙 Late-night schedule — significantly higher risk. Consider daylight travel.';
          r.eta = `${parseInt(r.eta) + 4} mins`; // night traffic/detours add time
        } else if (isEveningHour(h)) {
          r.safetyScore = Math.max(66, r.safetyScore - 10);
          r.modeNote = '🌇 Evening schedule — moderate risk increase.';
          r.eta = `${parseInt(r.eta) + 2} mins`;
        } else {
          r.modeNote = '📅 Daytime schedule — safe travel window.';
        }
        r.modeLabel = `Scheduled: ${schedDate} at ${schedTime}`;
      }

      else if (travelMode === 'precalc') {
        const periods = {
          morning: { label: 'Morning Commute (6–9 AM)', scoreAdj: 0, etaAdj: 5, note: '🚗 Rush hour — expect traffic delays but high visibility.' },
          evening: { label: 'Evening Commute (5–8 PM)', scoreAdj: -8, etaAdj: 7, note: '🌆 Evening rush — moderate risk + congestion.' },
          night: { label: 'Night Hours (9 PM–5 AM)', scoreAdj: -20, etaAdj: 0, note: '🌙 Night shift — lowest safety score. Extra caution advised.' },
        };
        const p = periods[workPeriod];
        r.safetyScore = Math.max(50, r.safetyScore + p.scoreAdj);
        r.eta = `${parseInt(r.eta) + p.etaAdj} mins`;
        r.modeNote = p.note;
        r.modeLabel = `Estimate for: ${p.label}`;
        r.weeklyBand = {
          best: Math.min(99, r.safetyScore + 6),
          worst: Math.max(45, r.safetyScore - 9),
        };
      }

      setResult(r);
    } catch (err) {
      setRouteError('Could not calculate route. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = (nickname) => {
    if (result) {
      const entry = {
        id: Date.now(),
        nickname,
        start,
        end,
        risk: result.safetyScore >= 80 ? 'LOW' : 'MODERATE',
        eta: result.eta,
        distance: result.distance,
        safetyScore: result.safetyScore,
        mode: travelMode,
        modeLabel: result.modeLabel || '',
        saved: 'Just now',
      };
      persistRoute(entry);
    }
    setShowModal(false); setSaved(true);
    showToast(`✓ "${nickname}" saved to My Routes!`);
  };

  // Nearby areas to show as labels on the map (always visible)
  const visibleAreas = LA_AREAS; // Show all areas

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes sr-spin { to { transform: rotate(360deg); } }
        @keyframes sr-pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .leaflet-container { background: #e8eaed !important; }
      `}</style>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 24, right: 24, zIndex: 9999,
              background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
              color: '#fff', padding: '10px 18px', borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              boxShadow: '0 8px 30px rgba(0,212,170,0.4)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <IcoCheck /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Save Modal ── */}
      <AnimatePresence>
        {showModal && (
          <SaveModal
            start={start} end={end}
            onClose={() => setShowModal(false)}
            onSave={handleSaveRoute}
          />
        )}
      </AnimatePresence>

      {/* ── Compact one-line header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #0ea5e9, #00d4aa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}><IcoNav /></div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
            Safe Route <span className="text-neon-teal">Planner</span>
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Plan safer urban journeys.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* ══ LEFT PANEL ══ */}
        <div className="glass-panel" style={{
          width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderTop: '1px solid rgba(0,255,255,0.25)', borderRadius: 20,
          overflow: 'hidden',
        }}>

          {/* Form section — fixed, no scroll */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {/* Phase 1 label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', fontSize: 8, fontWeight: 900, color: '#fff',
                background: 'linear-gradient(135deg, #0ea5e9, #00d4aa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>1</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Route</span>
              <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.1)', marginLeft: 2 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', fontSize: 8, fontWeight: 900, color: '#fff',
                  background: 'linear-gradient(135deg, #0ea5e9, #00d4aa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>2</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timing</span>
              </div>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <LocationInput
                label="Start"
                placeholder="Choose start..."
                icon={IcoPin}
                value={start}
                onChange={setStart}
                onClear={() => setStart('')}
              />
              <LocationInput
                label="End"
                placeholder="Choose destination..."
                icon={IcoFlag}
                value={end}
                onChange={setEnd}
                onClear={() => setEnd('')}
              />

              {/* Travel mode buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <TravelModeBtn icon={IcoClock} title="Now" active={travelMode === 'now'} onClick={() => setMode('now')} />
                <TravelModeBtn icon={IcoCalendar} title="Later" active={travelMode === 'later'} onClick={() => setMode('later')} />
                <TravelModeBtn icon={IcoRoute} title="Stats" active={travelMode === 'precalc'} onClick={() => setMode('precalc')} />
              </div>

              {travelMode === 'later' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>DATE</label>
                    <input
                      type="date"
                      value={schedDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={e => setSchedDate(e.target.value)}
                      style={{
                        width: '100%', padding: '9px 10px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff', outline: 'none', fontFamily: "'Inter',sans-serif", boxSizing: 'border-box',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>TIME</label>
                    <input
                      type="time"
                      value={schedTime}
                      onChange={e => setSchedTime(e.target.value)}
                      style={{
                        width: '100%', padding: '9px 10px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff', outline: 'none', fontFamily: "'Inter',sans-serif", boxSizing: 'border-box',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                </div>
              )}

              {travelMode === 'precalc' && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { key: 'morning', label: 'Morning', sub: '6–9 AM' },
                    { key: 'evening', label: 'Evening', sub: '5–8 PM' },
                    { key: 'night', label: 'Night', sub: '9 PM–5 AM' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setWorkPeriod(opt.key)}
                      style={{
                        flex: 1, padding: '9px 6px', borderRadius: 10, cursor: 'pointer',
                        background: workPeriod === opt.key ? 'rgba(0,212,170,0.12)' : 'rgba(255,255,255,0.03)',
                        border: workPeriod === opt.key ? '2px solid rgba(0,212,170,0.55)' : '1px solid rgba(255,255,255,0.09)',
                        color: workPeriod === opt.key ? '#fff' : 'rgba(255,255,255,0.45)',
                        fontFamily: "'Inter',sans-serif", textAlign: 'center', transition: 'all 0.18s',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800 }}>{opt.label}</div>
                      <div style={{ fontSize: 9, color: workPeriod === opt.key ? '#00d4aa' : 'rgba(255,255,255,0.3)', marginTop: 2 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  marginTop: 6, width: '100%', padding: '12px 0', borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  background: canSubmit ? 'linear-gradient(135deg, #00d4aa 0%, #0ea5e9 100%)' : 'rgba(255,255,255,0.05)',
                  color: canSubmit ? '#fff' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                {loading
                  ? <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'block', animation: 'sr-spin 0.8s linear infinite' }} /> Calculating...</>
                  : <><IcoNav /> Find Best Route</>
                }
              </button>
            </form>
          </div>

          {/* Result panel — compact, scrollable only if needed */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}
              >
                {/* Safety score + stats row */}
                {(() => {
                  const score = result.safetyScore;
                  const hasScore = score !== null && score !== undefined;
                  const scoreColor = !hasScore ? '#6b7280' : score >= 70 ? '#00d4aa' : score >= 45 ? '#f59e0b' : '#ef4444';
                  const scoreLabel = !hasScore ? 'Unavailable' : score >= 70 ? 'Safe Route' : score >= 45 ? 'Elevated Risk' : 'High Threat';
                  const scoreGrad  = !hasScore
                    ? 'rgba(107,114,128,0.1)'
                    : score >= 70 ? 'rgba(0,212,170,0.15)' : score >= 45 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
                  return (
                    <div style={{
                      borderRadius: 14, padding: '14px 16px',
                      background: `linear-gradient(180deg, ${scoreGrad} 0%, rgba(10,36,61,0.8) 100%)`,
                      border: `1px solid ${scoreColor}55`,
                      borderTop: `1px solid ${scoreColor}99`,
                      boxShadow: `0 8px 16px rgba(0,0,0,0.4), 0 0 30px ${scoreColor}18`,
                      display: 'flex', alignItems: 'center', gap: 14,
                      backdropFilter: 'blur(12px)',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: `${scoreColor}20`, border: `1px solid ${scoreColor}44`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: scoreColor,
                      }}>
                        <IcoShield />
                        <span style={{ fontSize: 7, fontWeight: 900, marginTop: 1 }}>
                          {!hasScore ? '—' : score >= 70 ? 'SAFE' : score >= 45 ? 'RISK' : 'HIGH'}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Safety Score <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>· ML Model</span>
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
                          {hasScore ? <>{score}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>%</span></> : <span style={{ fontSize: 14, color: '#6b7280' }}>Backend Offline</span>}
                        </p>
                        <p style={{ fontSize: 10, fontWeight: 700, margin: '2px 0 0', color: scoreColor }}>{scoreLabel}</p>
                        {/* Per-area risk breakdown */}
                        {(result.startRiskScore !== null && result.startRiskScore !== undefined) && (
                          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>
                            Start risk: <span style={{ fontWeight: 700, color: '#fff' }}>{result.startRiskScore}</span>
                            &nbsp;·&nbsp;
                            End risk: <span style={{ fontWeight: 700, color: '#fff' }}>{result.endRiskScore}</span>
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Dist</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{result.distance}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 2 }}>ETA</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{result.eta}</div>
                      </div>
                    </div>
                  );
                })()}





                {/* Nearby risk zones — compact row */}
                {result.nearbyRiskAreas.length > 0 && (
                  <div style={{
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
                    borderRadius: 9, padding: '8px 11px',
                    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>
                      <IcoAlert /> {result.nearbyRiskAreas.length} Alerts
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                      {result.nearbyRiskAreas.slice(0, 3).map(z => (
                        <span key={z.label} style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                          background: 'rgba(239,68,68,0.15)', color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(239,68,68,0.25)',
                        }}>{z.label}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={saved}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: saved ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.05)',
                      border: saved ? '1px solid rgba(0,212,170,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: saved ? '#00d4aa' : '#fff',
                      cursor: saved ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      transition: 'all 0.2s',
                    }}
                  >
                    {saved ? <><IcoCheck /> Saved</> : <><IcoBookmark /> Save Route</>}
                  </button>
                  <button
                    onClick={() => {
                      const msg = `Route: ${start} → ${end}\nDistance: ${result.distance}\nETA: ${result.eta}\nSafety Score: ${result.safetyScore}%`;
                      navigator.clipboard?.writeText(msg).then(() => showToast('Route info copied!'));
                    }}
                    title="Copy route info"
                    style={{
                      padding: '9px 12px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                  >
                    <IcoSave />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty / error state */}
          {!result && !loading && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
              <div style={{ textAlign: 'center', color: routeError ? '#ef4444' : 'rgba(255,255,255,0.2)' }}>
                <IcoRoute />
                {routeError
                  ? <p style={{ fontSize: 11, marginTop: 8, lineHeight: 1.6, color: '#ef4444' }}>{routeError}</p>
                  : <p style={{ fontSize: 11, marginTop: 8, lineHeight: 1.6 }}>Enter start &amp; destination to calculate your safe route.</p>
                }
              </div>
            </div>
          )}
        </div>

        {/* ══ MAP PANEL ══ */}
        <div style={{
          flex: 1, borderRadius: 18, overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minHeight: 480,
        }}>
          {/* Map info bubble overlay */}
          {!result && (
            <div style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              zIndex: 20, pointerEvents: 'none',
            }}>
              <div style={{
                background: 'rgba(13,22,38,0.92)', color: '#fff',
                fontSize: 12, fontWeight: 600, padding: '9px 16px',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.35)', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ animation: 'sr-pulse 2s ease-in-out infinite', color: '#0ea5e9' }}>●</span>
                We're pre-visualizing your safe path.
              </div>
            </div>
          )}

          {/* Map info "i" button */}
          <div style={{
            position: 'absolute', top: 16, right: 16, zIndex: 20,
          }}>
            <button style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(13,22,38,0.85)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>i</button>
          </div>

          {/* Risk zone legend overlay */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 20,
            background: 'rgba(13,22,38,0.88)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(10px)',
          }}>
            {[
              { color: '#00d4aa', label: 'Safe Route', type: 'line' },
              { color: '#ef4444', label: 'Danger Route', type: 'dashed' },
              { color: 'rgba(239,68,68,0.25)', label: 'High Risk Zone', type: 'circle' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
                {l.type === 'line' && <div style={{ width: 22, height: 3, background: l.color, borderRadius: 2 }} />}
                {l.type === 'dashed' && <div style={{ width: 22, height: 0, borderTop: '2px dashed #ef4444' }} />}
                {l.type === 'circle' && <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(239,68,68,0.35)', border: '2px solid rgba(239,68,68,0.6)', flexShrink: 0 }} />}
                {l.label}
              </div>
            ))}
          </div>

          <MapContainer
            center={[34.052, -118.243]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            {/* Light street map tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Area name labels */}
            <AreaLabels areas={visibleAreas} />

            {/* RED ZONE circles — always shown as context */}
            {HIGH_RISK_AREAS.map(zone => (
              <React.Fragment key={zone.label}>
                <Circle
                  center={[zone.lat, zone.lon]}
                  radius={zone.radius}
                  pathOptions={{
                    color: '#ef4444',
                    weight: 1.5,
                    fillColor: '#ef4444',
                    fillOpacity: 0.13,
                    dashArray: '6,4',
                  }}
                />
                <Marker
                  position={[zone.lat + 0.008, zone.lon]}
                  icon={L.divIcon({
                    className: '',
                    html: `<div style="
                      display:flex;align-items:center;gap:5px;
                      background:rgba(239,68,68,0.92);
                      color:#fff;font-size:10px;font-weight:800;
                      font-family:Inter,sans-serif;
                      padding:4px 9px;border-radius:20px;
                      box-shadow:0 2px 10px rgba(239,68,68,0.5);
                      white-space:nowrap;pointer-events:none;
                    "><span style="font-size:11px">⚠</span> Higher Risk</div>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0],
                  })}
                />
              </React.Fragment>
            ))}


            {/* ── SAFE route: real road geometry from OSRM ── */}
            {result && result.safePositions && (
              <>
                {/* Glow halo behind the route */}
                <Polyline
                  positions={result.safePositions}
                  pathOptions={{ color: '#00d4aa', weight: 16, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }}
                />
                {/* Main safe route line */}
                <Polyline
                  positions={result.safePositions}
                  pathOptions={{ color: '#00d4aa', weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
                />
              </>
            )}

            {/* ── DANGER alternative route (road-following via risk zone) ── */}
            {result && result.dangerPositions && (
              <Polyline
                positions={result.dangerPositions}
                pathOptions={{ color: '#ef4444', weight: 3.5, opacity: 0.8, dashArray: '10,8', lineCap: 'round', lineJoin: 'round' }}
              />
            )}


            {/* Start / End markers — show actual area name */}
            {result && (
              <>
                <Marker position={result.startPos} icon={pinIcon('#0ea5e9', start)}>
                  <Popup><b>{start}</b><br />Start Point</Popup>
                </Marker>
                <Marker position={result.endPos} icon={pinIcon('#00d4aa', end)}>
                  <Popup><b>{end}</b><br />Destination</Popup>
                </Marker>
                <FitBounds points={result.allPoints} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default SafeRoutePage;
