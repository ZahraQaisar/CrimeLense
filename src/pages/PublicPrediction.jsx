import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, Clock, MapPin, AlertCircle, CheckCircle, Navigation, BarChart3 } from 'lucide-react';
import Input from '../components/common/Input';
import RiskGauge from '../components/dashboard/RiskGauge';
import ToolsSidebar from '../components/common/ToolsSidebar';

const PublicPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [formData, setFormData] = useState({ area: '', date: '', time: '', type: 'Theft' });

    const handlePredict = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const score = Math.floor(Math.random() * 60) + 20;
            setPrediction({
                score,
                confidence: 89,
                riskLevel: score < 40 ? 'Low' : score < 70 ? 'Medium' : 'High',
                recommendation: score < 40
                    ? "Area is currently safe for travel. Standard precautions advised."
                    : score < 70
                        ? "Exercise caution. Avoid unlit areas and travel in groups if possible."
                        : "High risk detected. Alternative routes recommended. Avoid if possible."
            });
        }, 1500);
    };

    return (
        <div className="flex min-h-[calc(100vh-5rem)]">
            <ToolsSidebar />

            {/* Page content */}
            <div className="flex-1 min-w-0 px-6 lg:px-8 py-6">
                {/* Two-col grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                    {/* Input Form */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
                        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                            <Activity className="text-neon-teal" />
                            Predict Crime Risk
                        </h2>

                        <form onSubmit={handlePredict} className="flex-1 flex flex-col gap-4">
                            <Input
                                label="Target Area / Postcode"
                                placeholder="e.g. Camden Town"
                                icon={MapPin}
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Date"
                                    type="date"
                                    icon={Calendar}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Time"
                                    type="time"
                                    icon={Clock}
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Crime Category</label>
                                <select
                                    className="w-full h-[50px] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-teal/50 focus:ring-1 focus:ring-neon-teal/50 transition-all duration-300 appearance-none cursor-pointer"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Theft">Street Theft</option>
                                    <option value="Assault">Assault</option>
                                    <option value="Burglary">Burglary</option>
                                    <option value="Vandalism">Vandalism</option>
                                </select>
                            </div>
                            <div className="flex-1" />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all disabled:opacity-50"
                            >
                                {loading ? "Running AI Model..." : "Analyze Risk"}
                            </button>
                        </form>
                    </div>

                    {/* Result Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
                        {prediction ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col h-full"
                            >
                                <div className={`h-1 w-full rounded-full mb-4 ${prediction.riskLevel === 'Low' ? 'bg-safe' : prediction.riskLevel === 'Medium' ? 'bg-warning' : 'bg-danger'}`} />
                                <h3 className="text-gray-400 font-medium mb-4 text-center">AI Prediction Result</h3>
                                <div className="flex-1 flex items-center justify-center">
                                    <RiskGauge score={prediction.score} />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <div className="text-gray-400 text-xs mb-1">Confidence</div>
                                        <div className="text-white font-bold text-lg">{prediction.confidence}%</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <div className="text-gray-400 text-xs mb-1">Model</div>
                                        <div className="text-white font-bold text-lg">XGBoost-V2</div>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-start gap-3">
                                        {prediction.riskLevel === 'Low'
                                            ? <CheckCircle className="text-safe shrink-0 mt-0.5" size={18} />
                                            : <AlertCircle className={`shrink-0 mt-0.5 ${prediction.riskLevel === 'Medium' ? 'text-warning' : 'text-danger'}`} size={18} />
                                        }
                                        <p className="text-gray-300 text-sm leading-relaxed">{prediction.recommendation}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navigate('/safe-route')}
                                        className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-neon-teal/10 hover:border-neon-teal/50 transition-all duration-300 text-sm"
                                    >
                                        <Navigation size={16} className="group-hover:text-neon-teal transition-colors" />
                                        <span className="group-hover:text-neon-teal transition-colors">Find Safer Route</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/compare')}
                                        className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-neon-teal/10 hover:border-neon-teal/50 transition-all duration-300 text-sm"
                                    >
                                        <BarChart3 size={16} className="group-hover:text-neon-teal transition-colors" />
                                        <span className="group-hover:text-neon-teal transition-colors">Compare Areas</span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 opacity-40">
                                <Activity size={56} className="mx-auto mb-3" />
                                <p className="text-base">Enter details to generate risk prediction</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPrediction;
