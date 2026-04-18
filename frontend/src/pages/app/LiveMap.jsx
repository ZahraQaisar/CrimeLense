import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { dataService } from '../../services/predictionService';

/* ── Tier config ─────────────────────────────────────────────────────────── */
const TIER_CFG = {
  CRITICAL: { color: '#ef4444', fill: '#ef4444', label: 'Critical' },
  HIGH:     { color: '#f97316', fill: '#f97316', label: 'High'     },
  MEDIUM:   { color: '#eab308', fill: '#eab308', label: 'Medium'   },
  LOW:      { color: '#00d4aa', fill: '#00d4aa', label: 'Low'      },
};

/* ── Auto-fit map to clusters ─────────────────────────────────────────── */
const AutoFit = ({ zones }) => {
  const map = useMap();
  useEffect(() => {
    if (!zones.length) return;
    const lats = zones.map(z => z.lat);
    const lons = zones.map(z => z.lon);
    map.fitBounds([
      [Math.min(...lats) - 0.05, Math.min(...lons) - 0.05],
      [Math.max(...lats) + 0.05, Math.max(...lons) + 0.05],
    ], { padding: [30, 30] });
  }, [zones, map]);
  return null;
};

/* ── LiveMap ─────────────────────────────────────────────────────────────── */
const LiveMap = () => {
  const [zones,      setZones]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [tierFilter, setTierFilter] = useState('ALL');
  const [stats,      setStats]      = useState({ total: 0, totalIncidents: 0 });

  useEffect(() => {
    dataService.getHotspots()
      .then(data => {
        // Backend returns { zones: [...], total: N }
        const list = data?.zones ?? (Array.isArray(data) ? data : []);
        setZones(list);
        setStats({
          total: list.length,
          totalIncidents: list.reduce((s, z) => s + (z.crime_count || 0), 0),
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err?.response?.data?.error || 'Failed to load hotspot data. Make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  const filtered = tierFilter === 'ALL' ? zones : zones.filter(z => z.tier === tierFilter);

  const counts = zones.reduce((acc, z) => {
    acc[z.tier] = (acc[z.tier] || 0) + 1;
    return acc;
  }, {});

  // Top 4 zones by crime_count for bottom cards
  const topZones = [...zones].sort((a, b) => (b.crime_count || 0) - (a.crime_count || 0)).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
          Live <span style={{ color: '#0ea5e9' }}>Risk Map</span>
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
          Real crime hotspot clusters from DBSCAN analysis of 964K+ LA incidents.
          {!loading && !error && <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>
            {stats.total} zones · {stats.totalIncidents.toLocaleString()} total incidents
          </span>}
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(tier => {
          const cfg   = TIER_CFG[tier] || {};
          const count = tier === 'ALL' ? zones.length : (counts[tier] || 0);
          const active = tierFilter === tier;
          return (
            <button key={tier} onClick={() => setTierFilter(tier)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.06em',
              background:  active ? (cfg.color || '#0ea5e9') : 'rgba(255,255,255,0.05)',
              color:       active ? '#fff' : (cfg.color || 'rgba(255,255,255,0.5)'),
              border:      `1px solid ${active ? (cfg.color || '#0ea5e9') : 'rgba(255,255,255,0.1)'}`,
            }}>
              {tier === 'ALL' ? 'All Zones' : cfg.label}
              {count > 0 && <span style={{ opacity: 0.75, marginLeft: 5 }}>({count})</span>}
            </button>
          );
        })}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
          {loading ? 'Loading…' : `${filtered.length} cluster${filtered.length !== 1 ? 's' : ''} shown`}
        </span>
      </div>

      {/* Map */}
      <div className="glass-panel" style={{ borderRadius: 16, overflow: 'hidden', height: 430, position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,16,29,0.9)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Loading hotspot data…</p>
            </div>
          </div>
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,16,29,0.9)', padding: 24 }}>
            <div style={{ textAlign: 'center', maxWidth: 360 }}>
              <p style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>⚠ {error}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                Start backend: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>cd backend && node server.js</code>
              </p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <MapContainer
            center={[34.05, -118.25]}
            zoom={10}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              maxZoom={19}
            />
            <AutoFit zones={filtered} />
            {filtered.map(zone => {
              const cfg    = TIER_CFG[zone.tier] || TIER_CFG.LOW;
              const radius = Math.max((zone.radius_km || 0.5) * 650, 800);
              const topSev = zone.severity_dist
                ? Object.entries(zone.severity_dist).sort((a, b) => b[1] - a[1])[0]
                : null;
              return (
                <Circle
                  key={zone.cluster_id}
                  center={[zone.lat, zone.lon]}
                  radius={radius}
                  pathOptions={{
                    color:       cfg.color,
                    fillColor:   cfg.fill,
                    fillOpacity: zone.tier === 'CRITICAL' ? 0.3 : 0.18,
                    weight:      zone.tier === 'CRITICAL' ? 2 : 1,
                    dashArray:   zone.tier === 'LOW' ? '4 4' : null,
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 190, padding: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <strong style={{ fontSize: 13, color: '#111' }}>Zone #{zone.cluster_id}</strong>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                          background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44`,
                        }}>{zone.tier}</span>
                      </div>
                      <p style={{ fontSize: 11, margin: '0 0 6px', color: '#666' }}>
                        📍 {zone.lat?.toFixed(4)}, {zone.lon?.toFixed(4)}
                      </p>
                      <p style={{ fontSize: 11, margin: '0 0 8px', color: '#444' }}>
                        <strong>{(zone.crime_count || 0).toLocaleString()}</strong> incidents · <strong>{zone.radius_km || '?'}</strong> km radius
                      </p>
                      {topSev && (
                        <p style={{ fontSize: 11, margin: 0, color: '#555' }}>
                          Top severity: <strong>{topSev[0]}</strong> ({Math.round(topSev[1] * 100)}%)
                        </p>
                      )}
                      {zone.severity_dist && (
                        <div style={{ marginTop: 8, borderTop: '1px solid #eee', paddingTop: 8 }}>
                          {Object.entries(zone.severity_dist).map(([sev, pct]) => (
                            <div key={sev} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0' }}>
                              <span style={{ color: '#888' }}>{sev}</span>
                              <span style={{ fontWeight: 700 }}>{Math.round(pct * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Tier summary cards */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {Object.entries(TIER_CFG).map(([tier, cfg]) => {
            const tierZones    = zones.filter(z => z.tier === tier);
            const tierCount    = tierZones.length;
            const tierInc      = tierZones.reduce((s, z) => s + (z.crime_count || 0), 0);
            const avgRadius    = tierZones.length
              ? (tierZones.reduce((s, z) => s + (z.radius_km || 0), 0) / tierZones.length).toFixed(1)
              : '—';
            return (
              <div key={tier} className="glass-panel" style={{
                padding: '14px 16px', borderRadius: 12,
                borderLeft: `3px solid ${cfg.color}`,
                cursor: 'pointer',
                opacity: tierFilter !== 'ALL' && tierFilter !== tier ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }} onClick={() => setTierFilter(tierFilter === tier ? 'ALL' : tier)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cfg.label}
                  </span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{tierCount}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                  {tierInc.toLocaleString()} incidents
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
                  Avg radius: {avgRadius} km
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Top hotspot zones table */}
      {!loading && !error && topZones.length > 0 && (
        <div className="glass-panel" style={{ borderRadius: 14, padding: '16px 20px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Top Hotspot Zones by Incident Count
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topZones.map((z, i) => {
              const cfg = TIER_CFG[z.tier] || TIER_CFG.LOW;
              const topSev = z.severity_dist
                ? Object.entries(z.severity_dist).sort((a, b) => b[1] - a[1])[0]
                : null;
              return (
                <div key={z.cluster_id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 14px', borderRadius: 10,
                  background: `${cfg.color}0d`, border: `1px solid ${cfg.color}25`,
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: cfg.color, minWidth: 28 }}>
                    #{i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Zone {z.cluster_id}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '1px 7px', borderRadius: 99,
                        background: `${cfg.color}20`, color: cfg.color,
                      }}>{z.tier}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>
                      {z.lat?.toFixed(3)}, {z.lon?.toFixed(3)} · {z.radius_km} km radius
                      {topSev ? ` · Top severity: ${topSev[0]} (${Math.round(topSev[1] * 100)}%)` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                      {(z.crime_count || 0).toLocaleString()}
                    </p>
                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: '1px 0 0' }}>incidents</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LiveMap;
