import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Edit2, Trash2, MapPin, X, AlertTriangle, Save, Navigation, Search, Loader, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Dummy data ─────────────────────────────────────────────────────────────
const initialHotspots = [
  { id: 1, name: 'Central Station',  lat: 34.0522, lng: -118.2437, risk: 'High',   incidents: 145, description: 'High vehicle theft and pickpocketing zone near transit hub.' },
  { id: 2, name: 'Downtown Market',  lat: 34.0480, lng: -118.2520, risk: 'High',   incidents: 118, description: 'Frequent robbery and assault reports in evening hours.' },
  { id: 3, name: 'West End Park',    lat: 34.0600, lng: -118.2600, risk: 'Medium', incidents: 87,  description: 'Drug-related incidents reported near park benches after dark.' },
  { id: 4, name: 'Harbor District',  lat: 34.0430, lng: -118.2700, risk: 'Medium', incidents: 64,  description: 'Vandalism and trespassing in industrial area.' },
  { id: 5, name: 'North Suburbs',    lat: 34.0700, lng: -118.2350, risk: 'Low',    incidents: 39,  description: 'Occasional residential burglaries reported.' },
];

const RISK_COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#22C55E' };
const RISK_STYLES = {
  High:   'bg-danger/10 text-danger border-danger/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Low:    'bg-safe/10 text-safe border-safe/20',
};
const EMPTY_FORM = { name: '', lat: '', lng: '', risk: 'Medium', incidents: '', description: '' };

// ── Modal ──────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [geoQuery, setGeoQuery] = useState('');
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | loading | success | error
  const [geoResults, setGeoResults] = useState([]);

  useEffect(() => {
    setForm(initial ? { ...initial, lat: String(initial.lat), lng: String(initial.lng), incidents: String(initial.incidents) } : EMPTY_FORM);
    setGeoQuery('');
    setGeoStatus('idle');
    setGeoResults([]);
  }, [initial, open]);

  if (!open) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Geocoding via OpenStreetMap Nominatim — free, no API key needed
  const handleGeoSearch = async () => {
    if (!geoQuery.trim()) return;
    setGeoStatus('loading');
    setGeoResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geoQuery)}&format=json&limit=4`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.length === 0) { setGeoStatus('error'); return; }
      setGeoResults(data);
      setGeoStatus('results');
    } catch {
      setGeoStatus('error');
    }
  };

  const applyGeoResult = (result) => {
    set('lat', parseFloat(result.lat).toFixed(4));
    set('lng', parseFloat(result.lon).toFixed(4));
    if (!form.name.trim()) set('name', result.display_name.split(',')[0]);
    setGeoStatus('success');
    setGeoResults([]);
    setGeoQuery(result.display_name.split(',').slice(0, 2).join(','));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.lat || !form.lng) return;
    onSave({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng), incidents: parseInt(form.incidents) || 0 });
    onClose();
  };

  return ReactDOM.createPortal(
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ 
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)', 
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <style>{`.hs-modal::-webkit-scrollbar { display: none; }`}</style>
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="hs-modal"
          style={{ 
            background: '#0f1923', 
            border: '1px solid rgba(255,255,255,0.12)', 
            borderRadius: '16px',
            width: '100%',
            maxWidth: '32rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neon-teal/10 flex items-center justify-center text-neon-teal">
                <MapPin size={16} />
              </div>
              <h2 className="text-base font-bold text-white">{initial ? 'Edit Hotspot' : 'Add New Hotspot'}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5 space-y-4">

            {/* ── Geocoding Search ── */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                Search Location <span className="text-gray-600 font-normal">(auto-fill coordinates)</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={geoQuery}
                    onChange={e => { setGeoQuery(e.target.value); setGeoStatus('idle'); }}
                    onKeyDown={e => e.key === 'Enter' && handleGeoSearch()}
                    placeholder="Type area name e.g. Downtown Los Angeles"
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors"
                  />
                </div>
                <button
                  onClick={handleGeoSearch}
                  disabled={geoStatus === 'loading' || !geoQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-neon-teal/10 border border-neon-teal/30 text-neon-teal text-xs font-bold hover:bg-neon-teal/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  {geoStatus === 'loading'
                    ? <><Loader size={13} className="animate-spin" /> Searching</>
                    : geoStatus === 'success'
                    ? <><CheckCircle size={13} /> Found!</>
                    : <><Search size={13} /> Search</>}
                </button>
              </div>

              {/* Results dropdown */}
              {geoStatus === 'results' && geoResults.length > 0 && (
                <div className="mt-1.5 rounded-xl overflow-hidden border border-white/10" style={{ background: '#0f1923' }}>
                  {geoResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => applyGeoResult(r)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0 flex items-start gap-2"
                    >
                      <MapPin size={12} className="text-neon-teal shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{r.display_name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Status messages */}
              {geoStatus === 'error' && (
                <p className="text-xs text-danger mt-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={11} /> Location not found. Try a different name or enter coordinates manually.
                </p>
              )}
              {geoStatus === 'success' && (
                <p className="text-xs text-safe mt-1.5 flex items-center gap-1.5">
                  <CheckCircle size={11} /> Coordinates auto-filled successfully!
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-gray-600">or fill manually</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Location Name *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Central Station"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors"
              />
            </div>

            {/* Lat / Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Latitude *</label>
                <input
                  value={form.lat}
                  onChange={e => set('lat', e.target.value)}
                  placeholder="34.0522"
                  type="number"
                  step="0.0001"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Longitude *</label>
                <input
                  value={form.lng}
                  onChange={e => set('lng', e.target.value)}
                  placeholder="-118.2437"
                  type="number"
                  step="0.0001"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors"
                />
              </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-gray-600 flex items-center gap-1.5 -mt-1">
              <Navigation size={11} /> Tip: Click on the map to auto-fill coordinates
            </p>

            {/* Risk + Incidents */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Risk Level</label>
                <select
                  value={form.risk}
                  onChange={e => set('risk', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-neon-teal/50 transition-colors"
                  style={{ height: '42px', appearance: 'none', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.05)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  {['High', 'Medium', 'Low'].map(r => (
                    <option key={r} value={r} style={{ background: '#0f1923', color: '#fff' }}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Monthly Incidents</label>
                <input
                  value={form.incidents}
                  onChange={e => set('incidents', e.target.value)}
                  placeholder="0"
                  type="number"
                  min="0"
                  style={{ height: '42px' }}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Brief description of crime activity in this area..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name.trim() || !form.lat || !form.lng}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-teal text-deep-navy font-bold text-sm hover:bg-white transition-colors shadow-[0_0_16px_rgba(20,241,217,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={14} /> {initial ? 'Save Changes' : 'Add Hotspot'}
            </button>
          </div>
        </motion.div>
      </motion.div>,
    document.body
  );
};

// ── Modal Overlay wrapper ──────────────────────────────────────────────────
const Overlay = ({ children, onClose }) => ReactDOM.createPortal(
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}
    onClick={onClose}
  >
    {children}
  </motion.div>,
  document.body
);

// ── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteModal = ({ open, name, onConfirm, onClose }) => (
  <AnimatePresence>
    {open && (
      <Overlay onClose={onClose}>
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
          className="w-full max-w-sm shadow-2xl p-6"
          style={{ background: '#0f1923', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Delete Hotspot</h3>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            Are you sure you want to delete <span className="text-white font-semibold">"{name}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 text-sm font-bold transition-all">
              Delete
            </button>
          </div>
        </motion.div>
      </Overlay>
    )}
  </AnimatePresence>
);

// ── Leaflet Map Component ──────────────────────────────────────────────────
const HotspotMap = ({ hotspots, onMapClick, selectedId, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true }).setView([34.052, -118.245], 13);
      mapInstanceRef.current = map;

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Map click → pass coords to parent
      map.on('click', e => onMapClick(e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)));
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers whenever hotspots change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    hotspots.forEach(h => {
      const color = RISK_COLORS[h.risk];
      const isSelected = h.id === selectedId;
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${isSelected ? 22 : 16}px;
          height:${isSelected ? 22 : 16}px;
          background:${color};
          border-radius:50%;
          border:3px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.4)'};
          box-shadow:0 0 ${isSelected ? 14 : 8}px ${color};
          cursor:pointer;
          transition:all .2s;
        "></div>`,
        iconSize: [isSelected ? 22 : 16, isSelected ? 22 : 16],
        iconAnchor: [isSelected ? 11 : 8, isSelected ? 11 : 8],
      });

      const marker = L.marker([h.lat, h.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindTooltip(`
          <div style="font-family:sans-serif;min-width:160px;">
            <div style="font-weight:700;font-size:12px;margin-bottom:3px;color:#fff;">${h.name}</div>
            <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:4px;">${h.risk} Risk · ${h.incidents} incidents/mo</div>
            <div style="font-size:10px;color:#9ca3af;">${h.description}</div>
          </div>
        `, {
          className: 'dark-tooltip',
          direction: 'top',
          offset: [0, -10],
          opacity: 1,
        })
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:180px;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#fff;">${h.name}</div>
            <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:6px;">${h.risk} Risk · ${h.incidents} incidents/mo</div>
            <div style="font-size:11px;color:#9ca3af;line-height:1.5;">${h.description}</div>
          </div>
        `, {
          className: 'dark-popup',
          maxWidth: 220,
        })
        .on('click', () => onMarkerClick(h.id));

      markersRef.current.push(marker);
    });
  }, [hotspots, selectedId]);

  return (
    <>
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .dark-popup .leaflet-popup-tip { background: #0d1117; }
        .dark-popup .leaflet-popup-close-button { color: #9ca3af !important; }
        .leaflet-control-zoom a { background: #0d1117 !important; color: #fff !important; border-color: rgba(255,255,255,0.1) !important; }
        .leaflet-pane { z-index: 4 !important; }
        .leaflet-tile-pane { z-index: 2 !important; }
        .leaflet-overlay-pane { z-index: 4 !important; }
        .leaflet-shadow-pane { z-index: 5 !important; }
        .leaflet-marker-pane { z-index: 6 !important; }
        .leaflet-tooltip-pane { z-index: 7 !important; }
        .leaflet-popup-pane { z-index: 8 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 9 !important; }
        .dark-tooltip {
          background: #0d1117 !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 10px !important;
          color: #fff !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important;
          padding: 8px 12px !important;
          font-size: 12px !important;
        }
        .dark-tooltip.leaflet-tooltip-top::before {
          border-top-color: rgba(255,255,255,0.12) !important;
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '0', position: 'relative', zIndex: 1 }} />
    </>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const ManageHotspots = () => {
  const [hotspots, setHotspots] = useState(initialHotspots);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingCoords, setPendingCoords] = useState(null);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyOpen = modalOpen || !!deleteTarget;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen, deleteTarget]);

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (h) => { setEditTarget(h); setModalOpen(true); };

  const handleSave = (form) => {
    if (editTarget) {
      setHotspots(hs => hs.map(h => h.id === editTarget.id ? { ...h, ...form } : h));
    } else {
      setHotspots(hs => [...hs, { ...form, id: Date.now() }]);
    }
  };

  const handleDelete = () => {
    setHotspots(hs => hs.filter(h => h.id !== deleteTarget.id));
    if (selectedId === deleteTarget.id) setSelectedId(null);
    setDeleteTarget(null);
  };

  const handleMapClick = (lat, lng) => {
    setPendingCoords({ lat, lng });
    setEditTarget(prev => prev ? { ...prev, lat: parseFloat(lat), lng: parseFloat(lng) } : null);
    if (!modalOpen) setModalOpen(true);
  };

  // Stats
  const highCount = hotspots.filter(h => h.risk === 'High').length;
  const medCount  = hotspots.filter(h => h.risk === 'Medium').length;
  const lowCount  = hotspots.filter(h => h.risk === 'Low').length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Hotspots</h1>
          <p className="text-gray-400 text-sm mt-0.5">Add, edit or remove high-risk zones on the crime map</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-neon-teal text-deep-navy font-bold rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(20,241,217,0.3)] text-sm w-fit"
        >
          <Plus size={16} /> Add New Hotspot
        </button>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hotspots', value: hotspots.length,  color: 'text-blue-400',  bg: 'bg-blue-400/10' },
          { label: 'High Risk',      value: highCount,         color: 'text-danger',    bg: 'bg-danger/10'   },
          { label: 'Medium Risk',    value: medCount,          color: 'text-warning',   bg: 'bg-warning/10'  },
          { label: 'Low Risk',       value: lowCount,          color: 'text-safe',      bg: 'bg-safe/10'     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} text-lg font-bold shrink-0`}>
              {value}
            </div>
            <div className={`text-sm font-semibold ${color}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-3 border-b border-white/5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Crime Hotspot Map</h3>
            <p className="text-xs text-gray-500 mt-0.5">Click a marker to highlight · Click map to place new hotspot</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            {Object.entries(RISK_COLORS).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '420px' }}>
          <HotspotMap
            hotspots={hotspots}
            onMapClick={handleMapClick}
            selectedId={selectedId}
            onMarkerClick={setSelectedId}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">All Hotspots</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr>
                {['Location', 'Risk Level', 'Incidents / Month', 'Coordinates', 'Description', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hotspots.map(h => (
                <motion.tr
                  key={h.id}
                  layout
                  className={`hover:bg-white/3 transition-colors cursor-pointer ${selectedId === h.id ? 'bg-white/5' : ''}`}
                  onClick={() => setSelectedId(h.id === selectedId ? null : h.id)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5" style={{ color: RISK_COLORS[h.risk] }}>
                        <MapPin size={16} />
                      </div>
                      <span className="font-semibold text-white text-sm">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap inline-block ${RISK_STYLES[h.risk]}`}>
                      {h.risk} Risk
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{h.incidents}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-mono">{h.lat}, {h.lng}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs max-w-xs truncate">{h.description}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(h)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(h)}
                        className="p-2 rounded-lg hover:bg-danger/10 text-gray-400 hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-500">
          {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setPendingCoords(null); }}
        onSave={handleSave}
        initial={editTarget ? editTarget : pendingCoords ? { ...EMPTY_FORM, lat: pendingCoords.lat, lng: pendingCoords.lng } : null}
      />
      <DeleteModal
        open={!!deleteTarget}
        name={deleteTarget?.name}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageHotspots;