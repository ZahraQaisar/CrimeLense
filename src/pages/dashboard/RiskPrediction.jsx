import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import RiskGauge from '../../components/dashboard/RiskGauge';

const RiskPrediction = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)] items-center">
            {/* Input Form */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Activity className="text-neon-teal" />
                    Predict Crime Risk
                </h2>

                <form onSubmit={handlePredict} className="space-y-6">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? "Running AI Model..." : "Analyze Risk"}
                    </button>
                </form>
            </div>

            {/* Result Panel */}
            <div className="flex flex-col items-center justify-center">
                {prediction ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden"
                    >
                        {/* Background Glow based on risk */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-${prediction.riskLevel === 'Low' ? 'safe' : prediction.riskLevel === 'Medium' ? 'warning' : 'danger'}`} />

                        <h3 className="text-gray-400 font-medium mb-6">AI Prediction Result</h3>

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
        </div>
    );
};

export default RiskPrediction;
