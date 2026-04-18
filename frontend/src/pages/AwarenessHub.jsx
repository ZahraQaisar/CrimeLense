import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lightbulb, Moon, Car, Eye, Users,
    AlertTriangle, CheckCircle, ChevronRight, Phone, Info, ShieldCheck,
    BookOpen, Scale, FileText, Smartphone, Briefcase
} from 'lucide-react';

const TABS = [
    { id: 'tips', label: 'Safety Tips Library', icon: ShieldCheck },
    { id: 'articles', label: 'Awareness Articles', icon: BookOpen },
    { id: 'rights', label: 'Know Your Rights', icon: Scale },
];

const tipCategories = [
    {
        key: 'robbery', label: 'Robbery', color: '#FF4D4D', Icon: AlertTriangle,
        tips: [
            { icon: Moon, text: 'Avoid isolated or poorly lit streets after dark. Stick to busy, well-lit routes.' },
            { icon: Users, text: 'Travel in groups whenever possible, especially at night or in unfamiliar areas.' },
            { icon: Eye, text: 'Be aware of your surroundings. Avoid using your phone in exposed public areas.' },
            { icon: Shield, text: 'Keep bags and valuables close to your body and out of sight.' },
            { icon: CheckCircle, text: 'If approached, stay calm. Do not run. Report the incident to authorities immediately.' },
        ],
    },
    {
        key: 'theft', label: 'Street Theft', color: '#F59E0B', Icon: Shield,
        tips: [
            { icon: Eye, text: 'Be extra vigilant in crowded areas like markets, transit stations, and events.' },
            { icon: Shield, text: 'Use inner pockets or body bags for wallets, phones, and passports.' },
            { icon: Users, text: "Don't flash expensive items like jewelry or electronics in public." },
            { icon: CheckCircle, text: 'Keep your phone screen-side down when not in use on tables or counters.' },
            { icon: Lightbulb, text: 'Memorize emergency numbers and have them accessible without unlocking your phone.' },
        ],
    },
    {
        key: 'burglary', label: 'Burglary', color: '#0ea5e9', Icon: Shield,
        tips: [
            { icon: Shield, text: 'Always double-lock doors and windows before leaving home, even briefly.' },
            { icon: Eye, text: 'Install motion-sensor lights at entry points. Burglars avoid well-lit homes.' },
            { icon: AlertTriangle, text: "Don't advertise your absence on social media. Announce trips only after returning." },
            { icon: Users, text: 'Connect with neighbors. Alert each other of suspicious activity.' },
            { icon: CheckCircle, text: 'Use timers on lights to simulate occupancy when away for extended periods.' },
        ],
    },
    {
        key: 'vehicle', label: 'Vehicle Theft', color: '#22D3EE', Icon: Car,
        tips: [
            { icon: Car, text: 'Always park in monitored, well-lit areas — especially at night.' },
            { icon: Shield, text: 'Never leave valuables visible inside your vehicle.' },
            { icon: CheckCircle, text: 'Use a visible steering wheel lock as a visual deterrent.' },
            { icon: Eye, text: 'Double-check your car is locked before walking away.' },
            { icon: Lightbulb, text: 'Add a GPS tracker to your vehicle for recovery in case of theft.' },
        ],
    },
    {
        key: 'assault', label: 'Personal Safety', color: '#EC4899', Icon: Users,
        tips: [
            { icon: Moon, text: 'Avoid arguments or confrontations in crowded or alcohol-heavy environments.' },
            { icon: Users, text: 'Trust your instincts. If something feels wrong, leave the area immediately.' },
            { icon: Eye, text: 'Share your live location with a trusted contact when going out at night.' },
            { icon: Shield, text: 'Consider personal safety training or self-defense classes.' },
            { icon: CheckCircle, text: "Keep emergency contacts saved as 'ICE' (In Case of Emergency) in your phone." },
        ],
    },
    {
        key: 'cyber', label: 'Digital Safety', color: '#14F1D9', Icon: Smartphone,
        tips: [
            { icon: Smartphone, text: 'Do not connect to public Wi-Fi networks without a trusted VPN.' },
            { icon: Eye, text: 'Be cautious of shoulder surfers when entering passwords or PINs in public.' },
            { icon: Shield, text: 'Enable two-factor authentication on all your important accounts.' },
            { icon: Briefcase, text: 'Never leave laptops or tablets unattended in cafes or public spaces, even for a minute.' },
            { icon: AlertTriangle, text: 'Beware of urgent scam calls claiming to be from your bank or authorities.' },
        ],
    }
];

const articles = [
    {
        id: 1,
        title: 'The Psychology of Situational Awareness',
        category: 'Prevention',
        readTime: '5 min read',
        excerpt: 'Situational awareness is not about paranoia; it is about being present. Learn the military-derived "Cooper Color Code" and how to apply it to everyday civilian life to avoid becoming a target.'
    },
    {
        id: 2,
        title: 'How to Recognize and Avoid Common Street Scams',
        category: 'Urban Safety',
        readTime: '7 min read',
        excerpt: 'From the "dropped ring" to the "spilled coffee" distraction, urban scammers use predictable patterns. We break down the top 5 most common street cons and how to confidently walk away.'
    },
    {
        id: 3,
        title: 'Digital Footprints: What Criminals Learn from Your Social Media',
        category: 'Cyber Security',
        readTime: '6 min read',
        excerpt: 'Your vacation countdown might be an invitation for burglars. Discover the crucial privacy settings and posting habits necessary to keep your physical home safe while living a digital life.'
    },
    {
        id: 4,
        title: 'De-escalation Tactics: When Confrontation is Unavoidable',
        category: 'Personal Safety',
        readTime: '8 min read',
        excerpt: 'Verbal judo and physical posturing can defuse a tense situation before it turns violent. Read expert advice from law enforcement on how to manage aggressive behavior safely.'
    },
    {
        id: 5,
        title: 'Securing Your Home: Beyond the Deadbolt',
        category: 'Property Protection',
        readTime: '6 min read',
        excerpt: 'Most break-ins happen through the front door or ground floor windows. A practical guide to essential home security upgrades, from reinforced strike plates to strategic landscaping.'
    }
];

const rights = [
    {
        id: 'stop-search',
        title: 'Stop and Search Rights',
        points: [
            'Police must have reasonable grounds to suspect you are carrying illegal drugs, a weapon, stolen property, or something that could be used to commit a crime.',
            'Before you are searched, the officer must tell you their name, police station, what they expect to find, the reason they want to search you, and why they are legally allowed to search you.',
            'You do not have to give your name and address during a stop and search (unless specifically required by a local bylaw or specific condition).',
            'You are entitled to a receipt or a record of the search.'
        ]
    },
    {
        id: 'arrest',
        title: 'If You Are Arrested',
        points: [
            'You have the right to free legal advice from a duty solicitor or your own lawyer.',
            'You have the right to tell someone where you are (the police can delay this in very specific, serious circumstances).',
            'You have the right to medical help if you are feeling ill.',
            'You have the right to see the rules the police must follow (the Codes of Practice).'
        ]
    },
    {
        id: 'questioning',
        title: 'Police Questioning',
        points: [
            'You do not have to answer police questions. However, if your case goes to court, it may harm your defense if you do not mention something you later rely on in court.',
            'Any interview must be recorded.',
            'You should always have legal representation present before answering questions.',
            'If you are under 18 or a vulnerable adult, you must have an "appropriate adult" present during questioning.'
        ]
    },
    {
        id: 'witness',
        title: 'If You Are a Witness or Victim',
        points: [
            'You have the right to make a Witness Statement outlining your account of the event.',
            'You have the right to be kept informed about the progress of the case.',
            'As a victim, you have the right to read a Victim Personal Statement to the court explaining how the crime has affected you.',
            'You have the right to be referred to support services (like Victim Support).'
        ]
    }
];

export default function AwarenessHub() {
    const [activeTab, setActiveTab] = useState('tips');
    const [activeTipKey, setActiveTipKey] = useState('robbery');
    
    const activeTipCategory = tipCategories.find(c => c.key === activeTipKey);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Awareness <span className="text-neon-teal">Content Hub</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                        Empower yourself with knowledge. From practical street tips to understanding your legal rights, 
                        our curated content is designed to keep you informed and safe.
                    </p>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit mx-auto">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-neon-teal text-deep-navy shadow-[0_0_15px_rgba(20,241,217,0.3)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        
                        {/* TAB 1: SAFETY TIPS */}
                        {activeTab === 'tips' && (
                            <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {tipCategories.map(cat => (
                                        <button
                                            key={cat.key}
                                            onClick={() => setActiveTipKey(cat.key)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                                                activeTipKey === cat.key
                                                    ? 'text-deep-navy border-transparent font-bold bg-neon-teal'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                                            }`}
                                            style={activeTipKey === cat.key ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                                        >
                                            <cat.Icon size={14} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    {activeTipCategory && (
                                        <motion.div key={activeTipCategory.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                            <div className="flex items-center gap-4 p-5 rounded-2xl mb-6 border bg-white/5 border-white/10">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${activeTipCategory.color}20` }}>
                                                    <activeTipCategory.Icon size={24} style={{ color: activeTipCategory.color }} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{activeTipCategory.label} Prevention</h2>
                                                    <p className="text-gray-400 text-sm">{activeTipCategory.tips.length} safety recommendations</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeTipCategory.tips.map((tip, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-xl border border-white/5 p-5 flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${activeTipCategory.color}15`, border: `1px solid ${activeTipCategory.color}30` }}>
                                                            <tip.icon size={18} style={{ color: activeTipCategory.color }} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-gray-300 text-sm leading-relaxed">{tip.text}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* TAB 2: ARTICLES */}
                        {activeTab === 'articles' && (
                            <motion.div key="articles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {articles.map((article, i) => (
                                        <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-bold uppercase tracking-wider text-neon-teal bg-neon-teal/10 px-3 py-1 rounded-md">
                                                    {article.category}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium">{article.readTime}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-teal transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                                                {article.excerpt}
                                            </p>
                                            <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-neon-teal transition-colors w-fit">
                                                <FileText size={16} /> Read Full Article
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 3: RIGHTS */}
                        {activeTab === 'rights' && (
                            <motion.div key="rights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto space-y-6">
                                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3 mb-8">
                                    <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <strong className="text-warning block mb-1">Legal Disclaimer:</strong>
                                        The information provided here is for general educational purposes only. It does not constitute formal legal advice. Laws and procedures vary by jurisdiction and can change. Always consult a qualified legal professional for advice regarding your specific situation.
                                    </p>
                                </div>

                                {rights.map((right, i) => (
                                    <motion.div key={right.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5">
                                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-neon-teal/10 flex items-center justify-center shrink-0">
                                                <Scale size={20} className="text-neon-teal" />
                                            </div>
                                            {right.title}
                                        </h3>
                                        <ul className="space-y-4">
                                            {right.points.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm md:text-base leading-relaxed">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-teal shrink-0 mt-2" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
