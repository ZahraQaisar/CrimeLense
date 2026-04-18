import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield, Map, Activity, Brain, Layout, Zap, BarChart,
    Navigation, Users, Globe, Search, Mail, Github,
    ChevronDown, Twitter, Linkedin, CheckCircle, Award, Target
} from 'lucide-react';
import AmbientBackground from '../components/ui/AmbientBackground';
import HeroCanvas from '../components/ui/HeroCanvas';
import MousePulseCanvas from '../components/ui/MousePulseCanvas';
import { useAuth } from '../context/AuthContext';

/* ─── Reusable animation variants ───────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.1) => ({
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
});

/* A shorthnd wrapper so every section heading animates consistently */
const SectionHeading = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
    >
        {children}
    </motion.div>
);

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCommunityClick = () => {
        if (isAuthenticated) {
            navigate('/app/community-feed');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', isolation: 'isolate' }}>
            <AmbientBackground />
            <MousePulseCanvas />

            {/* ═══════════ HERO SECTION ═══════════ */}
            <section
                style={{
                    position: 'relative',
                    zIndex: 10,
                    height: '100vh',
                    maxHeight: '100vh',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    paddingTop: '64px',
                }}
            >
                <HeroCanvas />

                <style>{`
                    .cl-hero-overlay {
                        background: radial-gradient(ellipse at 50% 50%, rgba(0,212,170,0.06) 0%, rgba(11,14,20,0.55) 100%);
                    }
                    .cl-hero-fade {
                        background: linear-gradient(to bottom, transparent, #0b0e14);
                    }
                `}</style>
                <div className="cl-hero-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    pointerEvents: 'none',
                }} />

                {/* Hero text */}
                <motion.div
                    className="mt-2"
                    style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px', maxWidth: 800 }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="px-4 py-1.5 rounded-full border border-neon-teal/40 bg-neon-teal/10 text-neon-teal text-sm font-semibold tracking-widest uppercase mb-4 inline-block"
                        style={{ boxShadow: '0 0 20px rgba(0,212,170,0.25)' }}
                    >
                        AI Powered Safety Intelligence
                    </motion.span>

                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                    >
                        Navigate the City <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-blue-400">
                            Without Fear
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-400 max-w-2xl mx-auto mb-5 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        Real-time crime risk analysis, safe route navigation, and predictive
                        intelligence powered by advanced AI models.
                    </motion.p>

                    <motion.div
                        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.95 }}
                    >
                        <Link
                            to="/app/dashboard"
                            className="px-7 py-3 rounded-xl bg-neon-teal text-deep-navy font-bold text-base hover:bg-white transition-all duration-300"
                            style={{ boxShadow: '0 0 10px rgba(0,212,170,0.15)' }}
                        >
                            Get Started Now
                        </Link>
                        <Link
                            to="/about"
                            className="px-7 py-3 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                            style={{ backdropFilter: 'blur(12px)' }}
                        >
                            Learn More
                        </Link>
                    </motion.div>

                    {/* Community Social Proof Strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        onClick={handleCommunityClick}
                        className="group mx-auto mt-4 text-left border border-neon-teal/60 rounded-xl cursor-pointer max-w-[560px] transition-all duration-300 cl-community-strip relative z-10 shadow-[0_0_20px_rgba(38,204,194,0.15)] hover:shadow-[0_0_30px_rgba(38,204,194,0.3)] hover:-translate-y-1"
                        style={{ padding: '12px 20px', display: 'flex', alignItems: 'center' }}
                    >
                        <style>{`
                            .cl-community-strip {
                                background: #0b0e14; /* dark surface */
                            }
                            .cl-community-strip:hover {
                                background: #E1F5EE !important;
                            }
                            .cl-community-strip .cl-comm-text-1 {
                                color: #f3f4f6; /* white-ish */
                            }
                            .cl-community-strip:hover .cl-comm-text-1 {
                                color: #085041 !important;
                            }
                            .cl-community-strip .cl-comm-text-2 {
                                color: #9ca3af; /* muted */
                            }
                            .cl-community-strip:hover .cl-comm-text-2 {
                                color: #085041 !important;
                                opacity: 0.8;
                            }
                            .cl-community-strip .cl-comm-link {
                                color: #26CCC2;
                            }
                            .cl-community-strip:hover .cl-comm-link {
                                color: #085041 !important;
                            }
                        `}</style>
                        <div className="flex flex-col sm:flex-row sm:items-center w-full gap-4 sm:gap-0">
                            <div className="flex items-center gap-4 w-full">
                                <div className="flex-shrink-0 w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#E1F5EE] shadow-inner">
                                    <Users size={20} className="text-[#26CCC2]" />
                                </div>
                                <div className="flex flex-col flex-1 pl-1">
                                    <span className="text-[14px] font-semibold cl-comm-text-1 transition-colors duration-300 tracking-wide">
                                        Join 2,400+ neighbors keeping LA safe
                                    </span>
                                    <span className="text-[12px] cl-comm-text-2 transition-colors duration-300 mt-0.5 font-medium">
                                        Report incidents · get alerts · stay connected
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center cl-comm-link font-bold text-[14px] transition-colors duration-300 whitespace-nowrap ml-4">
                                    Join community &rarr;
                                </div>
                            </div>
                            <div className="sm:hidden flex items-center cl-comm-link font-bold text-[14px] transition-colors duration-300 pl-[58px] mt-1">
                                Join community &rarr;
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="cl-hero-fade" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
                    zIndex: 4, pointerEvents: 'none',
                }} />
            </section>

            {/* TRUST / SOCIAL PROOF SECTION */}
            <section
                className="py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm z-10"
                style={{ position: 'relative' }}
            >
                <motion.div
                    className="max-w-7xl mx-auto px-6 lg:px-8"
                    variants={staggerContainer(0.15, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
                        variants={fadeIn}
                    >
                        {[
                            { icon: Zap, label: 'AI Powered' },
                            { icon: Activity, label: 'Predictive Analytics' },
                            { icon: Shield, label: 'Real-Time Risk Detection' },
                            { icon: Navigation, label: 'Smart Navigation' },
                        ].map(({ icon: Icon, label }, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-2 text-white font-semibold tracking-wide uppercase text-sm"
                                variants={fadeUp}
                            >
                                <Icon className="text-neon-teal w-5 h-5" />
                                {label}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════ FEATURES GRID ═══════════ */}
            <section
                id="features"
                className="py-24 px-6 lg:px-8 max-w-7xl mx-auto z-10"
                style={{ position: 'relative' }}
            >
                <SectionHeading className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Core <span className="text-neon-teal">Intelligence</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Harnessing the power of massive datasets and advanced machine learning to provide unparalleled safety insights.
                    </p>
                </SectionHeading>

                {/* Top 3 cards */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8 mb-20"
                    variants={staggerContainer(0.15, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {[
                        { icon: Map, title: 'Heatmap Visualization', desc: 'Interactive crime density maps identifying high-risk zones and safe havens.', link: '/app/live-map' },
                        { icon: Shield, title: 'Safe Routing', desc: 'AI-calculated navigation paths avoiding danger hotspots in real-time.', link: '/app/safe-route' },
                        { icon: Activity, title: 'Predictive Analytics', desc: 'Machine learning models forecasting potential risks based on historical data.', link: '/app/predict' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            onClick={() => navigate(feature.link)}
                            className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-neon-teal/30 transition-all duration-500 group relative overflow-hidden cursor-pointer"
                            whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,212,170,0.12)' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-teal/20 to-blue-500/20 flex items-center justify-center mb-6 text-neon-teal group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(20,241,217,0.3)] transition-all">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-teal transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom 6 cards */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    variants={staggerContainer(0.1, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {[
                        { icon: Brain, title: 'Crime Risk Prediction', desc: 'Predicts potential crime probability based on historical patterns and temporal data.', link: '/app/predict' },
                        { icon: Layout, title: 'Hotspot Identification', desc: 'Detect statistically significant high-risk zones using advanced spatial clustering.', link: '/trend-explorer' },
                        { icon: BarChart, title: 'Trend Analysis', desc: 'Analyze crime patterns by time of day, day of week, and seasonal fluctuations.', link: '/trend-explorer' },
                        { icon: Users, title: 'Authority Dashboard', desc: 'Specialized analytics for law enforcement and city planners to monitor risks.', link: '/login' },
                        { icon: Globe, title: 'Urban Dynamics', desc: 'Understanding how city growth and infrastructure changes impact local safety.', link: '/neighborhood-summary' },
                        { icon: Search, title: 'Granular Reports', desc: 'Deep dive into specific incident types and their impact on neighborhood safety scores.', link: '/crime-timeline' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            onClick={() => navigate(feature.link)}
                            className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-neon-teal/20 transition-all duration-300 flex flex-col items-start cursor-pointer"
                            whileHover={{ y: -4 }}
                        >
                            <div className="text-neon-teal/70 mb-4"><feature.icon size={24} /></div>
                            <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section
                id="how-it-works"
                className="py-24 px-6 lg:px-8 max-w-7xl mx-auto z-10"
                style={{ position: 'relative' }}
            >
                <SectionHeading className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How <span className="text-neon-teal">CrimeLense</span> Works
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our advanced AI processes real-time data to keep you safe in three simple steps.
                    </p>
                </SectionHeading>

                <motion.div
                    className="grid md:grid-cols-3 gap-12 relative"
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-teal/20 to-transparent -z-10" />

                    {[
                        { step: '01', title: 'Data Collection', desc: 'We aggregate crime reports, police data, and community inputs in real-time.' },
                        { step: '02', title: 'AI Analysis', desc: 'Our algorithms process patterns to identify risk zones and safe routes.' },
                        { step: '03', title: 'Safe Navigation', desc: 'You receive instant alerts and optimized routes for your journey.' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <motion.div
                                className="w-24 h-24 rounded-full bg-deep-navy border-2 border-neon-teal/30 group-hover:border-neon-teal flex items-center justify-center text-3xl font-bold text-neon-teal mb-8 shadow-[0_0_20px_rgba(20,241,217,0.1)] group-hover:shadow-[0_0_30px_rgba(20,241,217,0.3)] backdrop-blur-sm z-10 transition-all duration-500"
                                whileHover={{ scale: 1.08 }}
                            >
                                {item.step}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed max-w-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════ INTERACTIVE PRODUCT PREVIEW ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden z-10"
                style={{ position: 'relative' }}
            >
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left text panel */}
                    <motion.div
                        className="lg:w-1/2"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                            Powerful Crime Intelligence <br />
                            <span className="text-neon-teal">At Your Fingertips</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            Our interface is designed for clarity and action. Monitor your city, predict risks, and navigate safely with a suite of professional tools.
                        </p>
                        <motion.ul
                            className="space-y-4"
                            variants={staggerContainer(0.12, 0.2)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            {[
                                'Dynamic Heatmap Visualization',
                                'Real-time Risk Prediction Panels',
                                'Safe Path Generation Engine',
                                'Historical Pattern Comparison',
                            ].map((item, i) => (
                                <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-white/80">
                                    <div className="w-5 h-5 rounded-full bg-neon-teal/20 flex items-center justify-center">
                                        <CheckCircle className="text-neon-teal w-3.5 h-3.5" />
                                    </div>
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    {/* Right mock dashboard */}
                    <motion.div
                        className="lg:w-1/2 relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="relative">
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
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] opacity-40 bg-cover bg-center" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent" />
                                        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 blur-3xl animate-pulse" />
                                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-neon-teal/20 blur-2xl" />
                                        <div className="absolute top-4 left-4 p-2 bg-deep-navy/80 backdrop-blur-md rounded border border-white/10 text-[10px] flex items-center gap-2 text-white">
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
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-teal/10 blur-[60px] rounded-full -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full -z-10" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ DATA & AI SECTION ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 border-t border-white/5 overflow-hidden z-10"
                style={{ position: 'relative' }}
            >
                <div className="max-w-7xl mx-auto">
                    <SectionHeading className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            How Our AI Understands <span className="text-neon-teal">Crime Patterns</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            The backbone of CrimeLense is a sophisticated data processing pipeline that transforms raw records into life-saving intelligence.
                        </p>
                    </SectionHeading>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer(0.18, 0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: Globe, title: 'Data Aggregation', desc: 'We ingest massive amounts of data from official crime reports, geographic information systems, and temporal patterns.' },
                            { icon: Brain, title: 'Machine Learning Analysis', desc: 'Our proprietary models analyze deep spatial-temporal trends to predict risk probabilities with 85%+ accuracy.' },
                            { icon: Target, title: 'Actionable Insights', desc: 'End-users receive clear, real-time predictions, safety heatmaps, and optimized route recommendations instantly.' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="flex flex-col items-center text-center p-8 group"
                                whileHover={{ y: -6 }}
                            >
                                <motion.div
                                    className="w-20 h-20 rounded-2xl bg-white/2 border border-white/10 flex items-center justify-center mb-8 transition-transform duration-500"
                                    whileHover={{ rotate: 0, scale: 1.08 }}
                                    style={{ rotate: 3 }}
                                >
                                    <div className="text-neon-teal">
                                        <item.icon size={36} strokeWidth={1.5} />
                                    </div>
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ USE CASES ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 bg-white/[0.01] border-y border-white/5 z-10"
                style={{ position: 'relative' }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
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
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer(0.13, 0.05)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        {[
                            { icon: Users, title: 'City Residents', desc: 'Navigate safely through neighborhoods using real-time crime-aware routes.' },
                            { icon: Layout, title: 'Urban Planners', desc: 'Identify high-risk infrastructure gaps and build safer city environments.' },
                            { icon: Shield, title: 'Law Enforcement', desc: 'Optimizing patrol routes and monitoring localized crime hotspots effectively.' },
                            { icon: BarChart, title: 'Researchers', desc: 'Studying behavioral patterns and societal factors influencing crime trends.' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl border border-white/5 bg-navy-light/30 hover:bg-navy-light/50 transition-all duration-300"
                            >
                                <div className="text-neon-teal mb-6"><item.icon size={32} strokeWidth={1} /></div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ STATISTICS ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 overflow-hidden z-10"
                style={{ position: 'relative' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-neon-teal/5 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
                        variants={staggerContainer(0.15, 0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {[
                            { label: 'Crime Records Analyzed', value: '500K+' },
                            { label: 'AI Models Trained', value: '120+' },
                            { label: 'Real-time Risk Mapping', value: '24/7' },
                            { label: 'Prediction Accuracy', value: '85%' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono tracking-tighter drop-shadow-2xl">
                                    {stat.value}
                                </div>
                                <div className="text-neon-teal/60 text-sm font-semibold uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ FAQ ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 max-w-4xl mx-auto z-10"
                style={{ position: 'relative' }}
            >
                <SectionHeading className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Frequently Asked <span className="text-neon-teal">Questions</span>
                    </h2>
                    <p className="text-gray-400">Everything you need to know about CrimeLense and how we protect your journey.</p>
                </SectionHeading>

                <motion.div
                    className="space-y-4"
                    variants={staggerContainer(0.1, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {[
                        { q: 'What is CrimeLense?', a: 'CrimeLense is an advanced AI-driven safety platform that provides real-time crime risk analysis, predictive intelligence, and safe route navigation for urban environments.' },
                        { q: 'How does crime prediction work?', a: 'Our system uses deep learning models trained on years of historical crime data, weather patterns, local events, and urban density to forecast potential risk probabilities for specific areas and times.' },
                        { q: 'Is the data real-time?', a: 'Yes, we integrate with official law enforcement feeds and public safety reports to update our maps and risk scores in real-time, ensuring you always have the latest information.' },
                        { q: 'How accurate are the predictions?', a: 'Current models maintain an 85%+ accuracy rate in predicting high-risk temporal-spatial windows. However, these are probabilities and should be used as a supplementary safety tool.' },
                    ].map((faq, i) => (
                        <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-white/5 bg-navy-light/20 overflow-hidden">
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
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════ CALL TO ACTION ═══════════ */}
            <section
                className="py-24 px-6 lg:px-8 max-w-7xl mx-auto z-10"
                style={{ position: 'relative' }}
            >
                <motion.div
                    className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center border border-neon-teal/20 shadow-[0_0_50px_rgba(20,241,217,0.1)]"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="absolute inset-0 bg-deep-navy -z-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/10 via-transparent to-blue-500/10 -z-10" />

                    <motion.h2
                        className="text-4xl md:text-6xl font-bold text-white mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Start Navigating <br />
                        <span className="text-neon-teal">Smarter and Safer</span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        Join thousands of citizens using CrimeLense to transform their relationship with urban safety. Get started with our predictive dashboard today.
                    </motion.p>
                    <motion.div
                        className="flex flex-col md:flex-row gap-6 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <Link
                            to="/app/dashboard"
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
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;
