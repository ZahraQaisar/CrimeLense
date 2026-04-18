import React, { useState, useRef, useEffect } from 'react';
import { Navigation, MapPin, ShieldCheck, AlertTriangle, LocateFixed, X } from 'lucide-react';
import CrimeMap from '../../components/map/CrimeMap';
import { motion, AnimatePresence } from 'framer-motion';
import { AREA_NAMES } from '../../constants/areas';

/* ── Mock location suggestions ───────────────────────────────────────────── */
const LOCATIONS = AREA_NAMES;

/* ── Location Input with suggestions + GPS ─────────────────────────── */
function LocationInput({ label, placeholder, value, onChange, onClear, showGPS = false, onGPS, gpsLoading }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const filtered = value.trim().length > 0
        ? LOCATIONS.filter(l => l.toLowerCase().includes(value.toLowerCase()))
        : LOCATIONS.slice(0, 6);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-neon-teal/50 transition-all">
                <MapPin size={16} className="text-neon-teal shrink-0" />
                <input
                    className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={e => { onChange(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    required
                />
                {value && (
                    <button type="button" onClick={onClear} className="text-gray-600 hover:text-gray-300 transition-colors">
                        <X size={14} />
                    </button>
                )}
                {showGPS && (
                    <button
                        type="button"
                        onClick={onGPS}
                        title="Use my current location"
                        className="text-gray-500 hover:text-neon-teal transition-colors"
                    >
                        {gpsLoading
                            ? <span className="w-4 h-4 border-2 border-neon-teal/30 border-t-neon-teal rounded-full animate-spin block" />
                            : <LocateFixed size={16} />
                        }
                    </button>
                )}
            </div>

            <AnimatePresence>
                {open && filtered.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute z-50 top-full mt-1 w-full rounded-xl overflow-hidden border border-white/10 bg-[#0e1825] shadow-xl"
                    >
                        {filtered.map(loc => (
                            <li key={loc}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(loc); setOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-neon-teal/10 hover:text-neon-teal flex items-center gap-2 transition-colors"
                                >
                                    <MapPin size={12} className="text-gray-600 shrink-0" />
                                    {loc}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Main Component ─────────────────────────────────────────────────── */
const SafeRoute = () => {
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({ start: '', end: '' });
    const [gpsError, setGpsError] = useState('');

    const handleGPS = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            return;
        }
        setGpsLoading(true);
        setGpsError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setFormData(fd => ({ ...fd, start: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
                setGpsLoading(false);
            },
            (err) => {
                setGpsError('Could not get location. Please allow access or type manually.');
                setGpsLoading(false);
            },
            { timeout: 10000 }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            setLoading(false);
            setResult({
                safetyScore: 92,
                distance: '4.2 km',
                eta: '14 mins',
                polylines: [
                    {
                        positions: [[51.505, -0.09], [51.51, -0.1], [51.515, -0.12]],
                        color: '#22C55E',
                        weight: 5,
                    },
                    {
                        positions: [[51.505, -0.09], [51.51, -0.08], [51.515, -0.12]],
                        color: '#FF4D4D',
                        dashArray: '10, 10',
                        weight: 3,
                    },
                ],
                markers: [
                    { position: [51.505, -0.09], title: 'Start Location', desc: formData.start || 'My Location', risk: 'Low' },
                    { position: [51.515, -0.12], title: 'Destination', desc: formData.end || 'Office', risk: 'Low' },
                ],
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* Route Panel */}
            <div className="w-full lg:w-96 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full lg:h-auto overflow-y-auto">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Navigation size={20} className="text-neon-teal" />
                    Safe Route
                </h2>

                <form onSubmit={handleSearch} className="space-y-4 mb-8">
                    <LocationInput
                        label="Start"
                        placeholder="Search location..."
                        value={formData.start}
                        onChange={v => setFormData(fd => ({ ...fd, start: v }))}
                        onClear={() => setFormData(fd => ({ ...fd, start: '' }))}
                        showGPS
                        onGPS={handleGPS}
                        gpsLoading={gpsLoading}
                    />
                    {gpsError && (
                        <p className="text-xs text-red-400 -mt-2 flex items-center gap-1">
                            <AlertTriangle size={12} /> {gpsError}
                        </p>
                    )}

                    <LocationInput
                        label="End"
                        placeholder="Search destination..."
                        value={formData.end}
                        onChange={v => setFormData(fd => ({ ...fd, end: v }))}
                        onClear={() => setFormData(fd => ({ ...fd, end: '' }))}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-neon-teal text-deep-navy font-bold rounded-lg shadow-[0_0_20px_rgba(20,241,217,0.2)] hover:shadow-[0_0_30px_rgba(20,241,217,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading
                            ? <><span className="w-3.5 h-3.5 border-2 border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" /> Calculating...</>
                            : <><Navigation size={14} /> Find Best Route</>
                        }
                    </button>
                </form>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center p-3 bg-safe/5 rounded-xl border border-safe/10">
                                <div className="text-safe font-bold text-sm mb-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                                    <ShieldCheck size={16} /> Optimal Route
                                </div>
                                <div className="text-2xl font-bold text-white">{result.safetyScore}% <span className="text-xs font-normal text-gray-400">Score</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tight">Dist</div>
                                    <div className="text-white font-bold text-base">{result.distance}</div>
                                </div>
                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tight">ETA</div>
                                    <div className="text-white font-bold text-base">{result.eta}</div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-warning/10 bg-warning/5">
                                <div className="flex items-start gap-2.5">
                                    <div className="shrink-0 text-warning mt-0.5"><AlertTriangle size={16} /></div>
                                    <div>
                                        <h4 className="text-warning font-bold text-xs uppercase tracking-wide">Advisory</h4>
                                        <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">Avoided 2 high-risk zones. Diverted via safe corridor.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Map */}
            <div className="flex-1 glass-panel rounded-2xl overflow-hidden border border-white/5">
                <CrimeMap
                    polylines={result?.polylines}
                    markers={result?.markers || []}
                />
            </div>
        </div>
    );
};

export default SafeRoute;
