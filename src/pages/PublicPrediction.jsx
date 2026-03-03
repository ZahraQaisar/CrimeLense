import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, Clock, MapPin, AlertCircle, CheckCircle, ArrowLeft, Navigation, BarChart3 } from 'lucide-react';
import Input from '../components/common/Input';
import RiskGauge from '../components/dashboard/RiskGauge';

const PublicPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [formData, setFormData] = useState({
        area: '',
        date: '',
        time: '',
        type: 'Theft'
    });

    const handlePredict = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate prediction
        setTimeout(() => {
            setLoading(false);
            // Random mock logic
            const score = Math.floor(Math.random() * 60) + 20; // 20-80
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
        <div className="min-h-screen pt-20 pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Crime Risk <span className="text-neon-teal">Prediction</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Use our AI-powered model to predict crime risk for any location and time.
                    </p>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/heatmap')}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-neon-teal transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Heatmap
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form - Fixed Height */}
                    <div className="glass-panel p-8 rounded-2xl border border-white/5 h-fit lg:h-[600px] flex flex-col">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Activity className="text-neon-teal" />
                            Predict Crime Risk
                        </h2>

                        <form onSubmit={handlePredict} className="space-y-6 flex-1 flex flex-col">
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
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-teal/50"
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
                                className="w-full py-4 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all disabled:opacity-50"
                            >
                                {loading ? "Running AI Model..." : "Analyze Risk"}
                            </button>
                        </form>
                    </div>

                    {/* Result Panel - Fixed Height */}
                    <div className="flex flex-col gap-6">
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 h-fit lg:h-[600px] flex flex-col items-center justify-center">
                            {prediction ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full text-center relative"
                                >
                                    {/* Background Glow based on risk */}
                                    <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${prediction.riskLevel === 'Low' ? 'bg-safe' : prediction.riskLevel === 'Medium' ? 'bg-warning' : 'bg-danger'}`} />

                                    <h3 className="text-gray-400 font-medium mb-6 mt-4">AI Prediction Result</h3>

                                    <RiskGauge score={prediction.score} />

                                    <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <div className="text-gray-400 text-xs">Confidence</div>
                                            <div className="text-white font-bold text-xl">{prediction.confidence}%</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <div className="text-gray-400 text-xs">Model</div>
                                            <div className="text-white font-bold text-xl">XGBoost-V2</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                                        <div className="flex items-start gap-3">
                                            {prediction.riskLevel === 'Low'
                                                ? <CheckCircle className="text-safe shrink-0" size={20} />
                                                : <AlertCircle className={`shrink-0 ${prediction.riskLevel === 'Medium' ? 'text-warning' : 'text-danger'}`} size={20} />
                                            }
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {prediction.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center text-gray-500 opacity-50">
                                    <Activity size={64} className="mx-auto mb-4" />
                                    <p className="text-lg">Enter details to generate risk prediction</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Appear after prediction */}
                        {prediction && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <button
                                    onClick={() => navigate('/safe-route')}
                                    className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-neon-teal/10 hover:border-neon-teal/50 transition-all duration-300"
                                >
                                    <Navigation size={20} className="group-hover:text-neon-teal transition-colors" />
                                    <span className="group-hover:text-neon-teal transition-colors">Find Safer Route</span>
                                </button>

                                <button
                                    onClick={() => navigate('/compare')}
                                    className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-neon-teal/10 hover:border-neon-teal/50 transition-all duration-300"
                                >
                                    <BarChart3 size={20} className="group-hover:text-neon-teal transition-colors" />
                                    <span className="group-hover:text-neon-teal transition-colors">Compare Areas</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPrediction;
