import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Map, Activity } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-teal/20 blur-[100px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="px-4 py-1.5 rounded-full border border-neon-teal/30 bg-neon-teal/10 text-neon-teal text-sm font-semibold tracking-wider uppercase mb-6 inline-block shadow-[0_0_10px_rgba(20,241,217,0.2)]">
                        AI Powered Safety Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Navigate the City <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-blue-500 text-shadow-glow">
                            Without Fear
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Real-time crime risk analysis, safe route navigation, and predictive intelligence powered by advanced AI models.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            to="/heatmap"
                            className="px-8 py-4 rounded-xl bg-neon-teal text-deep-navy font-bold text-lg hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(20,241,217,0.4)] hover:shadow-[0_0_30px_rgba(20,241,217,0.6)]"
                        >
                            Get Started Now
                        </Link>
                        <Link
                            to="/about"
                            className="px-8 py-4 rounded-xl border border-white/10 glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Map,
                            title: "Heatmap Visualization",
                            desc: "Interactive crime density maps identifying high-risk zones and safe havens."
                        },
                        {
                            icon: Shield,
                            title: "Safe Routing",
                            desc: "AI-calculated navigation paths avoiding danger hotspots in real-time."
                        },
                        {
                            icon: Activity,
                            title: "Predictive Analytics",
                            desc: "Machine learning models forecasting potential risks based on historical data."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-neon-teal/30 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-teal/20 to-blue-500/20 flex items-center justify-center mb-6 text-neon-teal group-hover:scale-110 transition-transform">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-teal transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-6 lg:px-8 max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How <span className="text-neon-teal">CrimeLense</span> Works
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our advanced AI processes real-time data to keep you safe in three simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-teal/30 to-transparent -z-10" />

                    {[
                        {
                            step: "01",
                            title: "Data Collection",
                            desc: "We aggregate crime reports, police data, and community inputs in real-time."
                        },
                        {
                            step: "02",
                            title: "AI Analysis",
                            desc: "Our algorithms process patterns to identify risk zones and safe routes."
                        },
                        {
                            step: "03",
                            title: "Safe Navigation",
                            desc: "You receive instant alerts and optimized routes for your journey."
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-deep-navy border-2 border-neon-teal/30 flex items-center justify-center text-3xl font-bold text-neon-teal mb-6 shadow-[0_0_20px_rgba(20,241,217,0.2)] bg-opacity-80 backdrop-blur-sm z-10">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed max-w-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
