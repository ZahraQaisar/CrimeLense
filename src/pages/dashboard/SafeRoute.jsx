import React, { useState } from 'react';
import { Navigation, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';
import CrimeMap from '../../components/map/CrimeMap';
import Input from '../../components/common/Input';
import { motion } from 'framer-motion';

const SafeRoute = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        start: '',
        end: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        // Mock Route Calculation
        setTimeout(() => {
            setLoading(false);
            setResult({
                safetyScore: 92,
                distance: "4.2 km",
                eta: "14 mins",
                polylines: [
                    // Safe Route (Green)
                    {
                        positions: [
                            [51.505, -0.09],
                            [51.51, -0.1],
                            [51.515, -0.12]
                        ],
                        color: "#22C55E", // Safe Green
                        weight: 5
                    },
                    // Avoided Danger Zone (Red Dashed)
                    {
                        positions: [
                            [51.505, -0.09],
                            [51.51, -0.08], // Risky detour
                            [51.515, -0.12]
                        ],
                        color: "#FF4D4D",
                        dashArray: "10, 10",
                        weight: 3
                    }
                ],
                markers: [
                    { position: [51.505, -0.09], title: "Start Location", desc: "My Location", risk: "Low" },
                    { position: [51.515, -0.12], title: "Destination", desc: "Office", risk: "Low" }
                ]
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* Route Panel */}
            <div className="w-full lg:w-96 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full lg:h-auto overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Navigation className="text-neon-teal" />
                    Safe Route Finder
                </h2>

                <form onSubmit={handleSearch} className="space-y-4 mb-8">
                    <Input
                        label="Start Location"
                        placeholder="Current Location"
                        icon={MapPin}
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        required
                    />
                    <Input
                        label="Destination"
                        placeholder="Search destination..."
                        icon={MapPin}
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all disabled:opacity-50"
                    >
                        {loading ? "Calculating Safest Path..." : "Find Safe Route"}
                    </button>
                </form>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center p-4 bg-safe/10 rounded-xl border border-safe/20">
                            <div className="text-safe font-bold text-lg mb-1 flex items-center justify-center gap-2">
                                <ShieldCheck /> Safe Route Found
                            </div>
                            <div className="text-3xl font-bold text-white">{result.safetyScore}% <span className="text-sm font-normal text-gray-400">Safety Score</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Distance</div>
                                <div className="text-white font-bold text-lg">{result.distance}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Est. Time</div>
                                <div className="text-white font-bold text-lg">{result.eta}</div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 text-warning mt-1">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <h4 className="text-warning font-bold text-sm">Route Advisory</h4>
                                    <p className="text-gray-400 text-sm mt-1">Avoided 2 high-risk zones near North Market. Route diverted via safe corridor.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
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
