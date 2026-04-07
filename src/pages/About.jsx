import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Navigation, BarChart3, Users, Lock, Database, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay }
    });

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Hero */}
                <motion.div {...fadeUp()} className="text-center mb-14">
                    <span className="px-4 py-1.5 rounded-full border border-neon-teal/30 bg-neon-teal/10 text-neon-teal text-xs font-semibold tracking-widest uppercase mb-5 inline-block">
                        About CrimeLense
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                        Safer Cities Through <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-blue-500">
                            Intelligent Insight
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        CrimeLense is an AI-driven urban safety platform that transforms raw crime data into
                        actionable intelligence — helping individuals, researchers, and city planners make
                        smarter, safer decisions.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.div {...fadeUp(0.1)} className="glass-panel p-8 rounded-2xl border border-white/5 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-teal to-blue-500 rounded-l-2xl" />
                    <div className="pl-4">
                        <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            We believe safety intelligence should be accessible to everyone. By combining machine learning
                            models with real-time crime data feeds, CrimeLense empowers users to understand risk at a granular
                            level — whether planning a daily commute, evaluating a neighbourhood, or conducting urban research.
                        </p>
                    </div>
                </motion.div>

                {/* What We Offer */}
                <motion.div {...fadeUp(0.15)} className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">What CrimeLense Offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                icon: Activity,
                                title: 'Crime Risk Prediction',
                                desc: 'AI-powered XGBoost model predicts crime likelihood for any area, date, and time with high confidence.',
                                to: '/app/tools?tool=prediction'
                            },
                            {
                                icon: Navigation,
                                title: 'Safe Route Finder',
                                desc: 'Calculates the safest travel path, dynamically avoiding known high-risk zones and hotspots.',
                                to: '/app/tools?tool=route'
                            },
                            {
                                icon: BarChart3,
                                title: 'Area Comparison',
                                desc: 'Compare crime statistics between any two areas with interactive charts and risk scores.',
                                to: '/app/tools?tool=compare'
                            },
                            {
                                icon: Shield,
                                title: 'Live Crime Heatmap',
                                desc: 'Visual density maps overlaying real-time incident reports across city zones.',
                                to: '/app/live-map'
                            },
                        ].map(({ icon: Icon, title, desc, to }, i) => (
                            <motion.div key={i} {...fadeUp(0.1 + i * 0.05)}>
                                <Link to={to} className="block glass-panel p-6 rounded-2xl border border-white/5 hover:border-neon-teal/30 transition-all duration-300 group h-full">
                                    <div className="w-11 h-11 rounded-xl bg-neon-teal/10 flex items-center justify-center mb-4 text-neon-teal group-hover:scale-110 transition-transform">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2 group-hover:text-neon-teal transition-colors">{title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div {...fadeUp(0.2)} className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Technology Behind the Platform</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: Cpu, title: 'AI & ML', desc: 'XGBoost, Random Forest, and Neural Network models trained on historical crime datasets.' },
                            { icon: Database, title: 'Real-Time Data', desc: 'Live ingestion of police APIs, community reports, and open crime records.' },
                            { icon: Lock, title: 'Privacy First', desc: 'Data is anonymised, aggregated, and never tied to personal identifiers.' },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <motion.div key={i} {...fadeUp(0.05 * i)} className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-teal/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 text-neon-teal">
                                    <Icon size={22} />
                                </div>
                                <h3 className="text-white font-bold mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Team */}
                <motion.div {...fadeUp(0.25)} className="glass-panel p-8 rounded-2xl border border-white/5 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neon-teal/10 flex items-center justify-center text-neon-teal shrink-0">
                            <Users size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Who Built This?</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                CrimeLense was built as a final-year academic project focused on applying machine learning
                                to real-world urban safety challenges. The team combined expertise in data science,
                                web engineering, and GIS to create a platform that is both technically rigorous and practically
                                useful for everyday citizens.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeUp(0.3)} className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
                    <p className="text-gray-400 mb-6">Start by predicting crime risk in your area right now.</p>
                    <Link
                        to="/app/tools?tool=prediction"
                        className="inline-flex px-8 py-3.5 rounded-xl bg-neon-teal text-deep-navy font-bold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(20,241,217,0.4)] hover:shadow-[0_0_30px_rgba(20,241,217,0.6)]"
                    >
                        Try Crime Prediction →
                    </Link>
                </motion.div>

            </div>
        </div>
    );
};

export default AboutPage;
