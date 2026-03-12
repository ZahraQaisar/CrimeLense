import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, Map, Activity, Brain, Layout, Zap, BarChart,
    Navigation, Users, Globe, Search, Mail, Github,
    ChevronDown, Twitter, Linkedin, CheckCircle, Award, Target
} from 'lucide-react';

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="relative overflow-hidden bg-deep-navy">
            {/* Hero Section */}
            <section className="relative pt-20 pb-14 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
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
                            to="/prediction"
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

            {/* TRUST / SOCIAL PROOF SECTION */}
            <section className="py-10 border-y border-white/5 bg-white/2 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-white font-semibold tracking-wide uppercase text-sm">
                            <Zap className="text-neon-teal w-5 h-5" />
                            AI Powered
                        </div>
                        <div className="w-px h-4 bg-white/20 hidden md:block" />
                        <div className="flex items-center gap-2 text-white font-semibold tracking-wide uppercase text-sm">
                            <Activity className="text-neon-teal w-5 h-5" />
                            Predictive Analytics
                        </div>
                        <div className="w-px h-4 bg-white/20 hidden md:block" />
                        <div className="flex items-center gap-2 text-white font-semibold tracking-wide uppercase text-sm">
                            <Shield className="text-neon-teal w-5 h-5" />
                            Real-Time Risk Detection
                        </div>
                        <div className="w-px h-4 bg-white/20 hidden md:block" />
                        <div className="flex items-center gap-2 text-white font-semibold tracking-wide uppercase text-sm">
                            <Navigation className="text-neon-teal w-5 h-5" />
                            Smart Navigation
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Core <span className="text-neon-teal">Intelligence</span></h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Harnessing the power of massive datasets and advanced machine learning to provide unparalleled safety insights.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mb-20">
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
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-neon-teal/30 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-teal/20 to-blue-500/20 flex items-center justify-center mb-6 text-neon-teal group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(20,241,217,0.3)] transition-all">
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

                {/* EXPANDED FEATURES SECTION */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: "Crime Risk Prediction",
                            desc: "Predicts potential crime probability based on historical patterns and temporal data."
                        },
                        {
                            icon: Layout,
                            title: "Hotspot Identification",
                            desc: "Detect statistically significant high-risk zones using advanced spatial clustering."
                        },
                        {
                            icon: BarChart,
                            title: "Trend Analysis",
                            desc: "Analyze crime patterns by time of day, day of week, and seasonal fluctuations."
                        },
                        {
                            icon: Users,
                            title: "Authority Dashboard",
                            desc: "Specialized analytics for law enforcement and city planners to monitor risks."
                        },
                        {
                            icon: Globe,
                            title: "Urban Dynamics",
                            desc: "Understanding how city growth and infrastructure changes impact local safety."
                        },
                        {
                            icon: Search,
                            title: "Granular Reports",
                            desc: "Deep dive into specific incident types and their impact on neighborhood safety scores."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-neon-teal/20 transition-all duration-300 flex flex-col items-start"
                        >
                            <div className="text-neon-teal/70 mb-4">
                                <feature.icon size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How <span className="text-neon-teal">CrimeLense</span> Works
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our advanced AI processes real-time data to keep you safe in three simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-teal/20 to-transparent -z-10" />

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
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-full bg-deep-navy border-2 border-neon-teal/30 group-hover:border-neon-teal flex items-center justify-center text-3xl font-bold text-neon-teal mb-8 shadow-[0_0_20px_rgba(20,241,217,0.1)] group-hover:shadow-[0_0_30px_rgba(20,241,217,0.3)] bg-opacity-80 backdrop-blur-sm z-10 transition-all duration-500">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed max-w-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* INTERACTIVE PRODUCT PREVIEW */}
            <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                                Powerful Crime Intelligence <br />
                                <span className="text-neon-teal">At Your Fingertips</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Our interface is designed for clarity and action. Monitor your city, predict risks, and navigate safely with a suite of professional tools.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Dynamic Heatmap Visualization",
                                    "Real-time Risk Prediction Panels",
                                    "Safe Path Generation Engine",
                                    "Historical Pattern Comparison"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80">
                                        <div className="w-5 h-5 rounded-full bg-neon-teal/20 flex items-center justify-center">
                                            <CheckCircle className="text-neon-teal w-3.5 h-3.5" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Mock Dashboard UI */}
                            <div className="rounded-2xl border border-white/10 bg-deep-navy/40 backdrop-blur-xl p-4 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/5 to-transparent pointer-events-none" />

                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono">CRIMELENSE_OS v2.4</div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-3 aspect-video bg-navy-light/50 rounded-lg border border-white/5 overflow-hidden relative">
                                        {/* Mock Map View */}
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] opacity-40 bg-cover bg-center" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent" />

                                        {/* Mock Heatmap Blobs */}
                                        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 blur-3xl animate-pulse" />
                                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-neon-teal/20 blur-2xl" />

                                        <div className="absolute top-4 left-4 p-2 bg-deep-navy/80 backdrop-blur-md rounded border border-white/10 text-[10px] flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-neon-teal animate-ping" />
                                            Scanning Active Region
                                        </div>
                                    </div>
                                    <div className="col-span-1 space-y-4">
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                            <div className="text-[10px] text-gray-400 mb-1">Risk Level</div>
                                            <div className="text-xl font-bold text-red-500">8.4</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                            <div className="text-[10px] text-gray-400 mb-1">Safe Hubs</div>
                                            <div className="text-xl font-bold text-neon-teal">12</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center uppercase tracking-tighter">
                                            <div className="text-[8px] text-gray-500 mb-1">Next Pred.</div>
                                            <div className="text-xs font-bold text-white">12:45</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-neon-teal/5 rounded-xl border border-neon-teal/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-bold text-white uppercase italic tracking-wider">Predictive Log</div>
                                        <Activity className="text-neon-teal w-4 h-4" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-1 bg-neon-teal/20 rounded-full w-full" />
                                        <div className="h-1 bg-neon-teal/20 rounded-full w-[80%]" />
                                        <div className="h-1 bg-neon-teal/20 rounded-full w-[60%]" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-teal/10 blur-[60px] rounded-full -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DATA & AI SECTION */}
            <section className="py-24 px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            How Our AI Understands <span className="text-neon-teal">Crime Patterns</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            The backbone of CrimeLense is a sophisticated data processing pipeline that transforms raw records into life-saving intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Data Aggregation",
                                desc: "We ingest massive amounts of data from official crime reports, geographic information systems, and temporal patterns."
                            },
                            {
                                icon: Brain,
                                title: "Machine Learning Analysis",
                                desc: "Our proprietary models analyze deep spatial-temporal trends to predict risk probabilities with 85%+ accuracy."
                            },
                            {
                                icon: Target,
                                title: "Actionable Insights",
                                desc: "End-users receive clear, real-time predictions, safety heatmaps, and optimized route recommendations instantly."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center p-8 group"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-white/2 border border-white/10 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="text-neon-teal -rotate-3 group-hover:rotate-0 transition-transform">
                                        <item.icon size={36} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* USE CASES SECTION */}
            <section className="py-24 px-6 lg:px-8 bg-white/2 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Built for a <span className="text-neon-teal">Safer Society</span>
                            </h2>
                            <p className="text-gray-400 text-lg">
                                From everyday citizens to high-level policy makers, CrimeLense provides the intelligence needed to make better safety decisions.
                            </p>
                        </div>
                        <Link to="/about" className="text-neon-teal font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                            View all use cases <Navigation className="w-4 h-4 rotate-90" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Users,
                                title: "City Residents",
                                desc: "Navigate safely through neighborhoods using real-time crime-aware routes."
                            },
                            {
                                icon: Layout,
                                title: "Urban Planners",
                                desc: "Identify high-risk infrastructure gaps and build safer city environments."
                            },
                            {
                                icon: Shield,
                                title: "Law Enforcement",
                                desc: "Optimizing patrol routes and monitoring localized crime hotspots effectively."
                            },
                            {
                                icon: BarChart,
                                title: "Researchers",
                                desc: "Studying behavioral patterns and societal factors influencing crime trends."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl border border-white/5 bg-navy-light/30 hover:bg-navy-light/50 transition-all duration-300"
                            >
                                <div className="text-neon-teal mb-6">
                                    <item.icon size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* IMPACT / STATISTICS SECTION */}
            <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-neon-teal/5 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { label: "Crime Records Analyzed", value: "500K+" },
                            { label: "AI Models Trained", value: "120+" },
                            { label: "Real-time Risk Mapping", value: "24/7" },
                            { label: "Prediction Accuracy", value: "85%" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono tracking-tighter shadow-neon-teal/20 drop-shadow-2xl">
                                    {stat.value}
                                </div>
                                <div className="text-neon-teal/60 text-sm font-semibold uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Frequently Asked <span className="text-neon-teal">Questions</span>
                    </h2>
                    <p className="text-gray-400">Everything you need to know about CrimeLense and how we protect your journey.</p>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            q: "What is CrimeLense?",
                            a: "CrimeLense is an advanced AI-driven safety platform that provides real-time crime risk analysis, predictive intelligence, and safe route navigation for urban environments."
                        },
                        {
                            q: "How does crime prediction work?",
                            a: "Our system uses deep learning models trained on years of historical crime data, weather patterns, local events, and urban density to forecast potential risk probabilities for specific areas and times."
                        },
                        {
                            q: "Is the data real-time?",
                            a: "Yes, we integrate with official law enforcement feeds and public safety reports to update our maps and risk scores in real-time, ensuring you always have the latest information."
                        },
                        {
                            q: "How accurate are the predictions?",
                            a: "Current models maintain an 85%+ accuracy rate in predicting high-risk temporal-spatial windows. However, these are probabilities and should be used as a supplementary safety tool."
                        }
                    ].map((faq, i) => (
                        <div key={i} className="rounded-2xl border border-white/5 bg-navy-light/20 overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-semibold text-white">{faq.q}</span>
                                <ChevronDown className={`text-neon-teal transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* CALL TO ACTION SECTION */}
            <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center border border-neon-teal/20 shadow-[0_0_50px_rgba(20,241,217,0.1)]">
                    <div className="absolute inset-0 bg-deep-navy -z-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/10 via-transparent to-blue-500/10 -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Start Navigating <br />
                            <span className="text-neon-teal">Smarter and Safer</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of citizens using CrimeLense to transform their relationship with urban safety. Get started with our predictive dashboard today.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Link
                                to="/prediction"
                                className="px-10 py-5 rounded-2xl bg-neon-teal text-deep-navy font-bold text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(20,241,217,0.4)]"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/about"
                                className="px-10 py-5 rounded-2xl border border-white/10 glass-panel text-white font-bold text-xl hover:bg-white/5 transition-all"
                            >
                                Explore Predictions
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
