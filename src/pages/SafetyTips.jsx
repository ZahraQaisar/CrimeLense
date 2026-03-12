import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lightbulb, Moon, Car, Eye, Users,
    AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react';

const tipCategories = [
    {
        key: 'robbery',
        label: 'Robbery',
        color: '#FF4D4D',
        Icon: AlertTriangle,
        tips: [
            { icon: Moon, text: 'Avoid isolated or poorly lit streets after dark. Stick to busy, well-lit routes.' },
            { icon: Users, text: 'Travel in groups whenever possible, especially at night or in unfamiliar areas.' },
            { icon: Eye, text: 'Be aware of your surroundings. Avoid using your phone in exposed public areas.' },
            { icon: Shield, text: 'Keep bags and valuables close to your body and out of sight.' },
            { icon: CheckCircle, text: 'If approached, stay calm. Do not run. Report the incident to authorities immediately.' },
        ],
    },
    {
        key: 'theft',
        label: 'Street Theft',
        color: '#F59E0B',
        Icon: Shield,
        tips: [
            { icon: Eye, text: 'Be extra vigilant in crowded areas like markets, transit stations, and events.' },
            { icon: Shield, text: 'Use inner pockets or body bags for wallets, phones, and passports.' },
            { icon: Users, text: "Don't flash expensive items like jewelry or electronics in public." },
            { icon: CheckCircle, text: 'Keep your phone screen-side down when not in use on tables or counters.' },
            { icon: Lightbulb, text: 'Memorize emergency numbers and have them accessible without unlocking your phone.' },
        ],
    },
    {
        key: 'burglary',
        label: 'Burglary',
        color: '#6366F1',
        Icon: Shield,
        tips: [
            { icon: Shield, text: 'Always double-lock doors and windows before leaving home, even briefly.' },
            { icon: Eye, text: 'Install motion-sensor lights at entry points. Burglars avoid well-lit homes.' },
            { icon: AlertTriangle, text: "Don't advertise your absence on social media. Announce trips only after returning." },
            { icon: Users, text: 'Connect with neighbors. Alert each other of suspicious activity.' },
            { icon: CheckCircle, text: 'Use timers on lights to simulate occupancy when away for extended periods.' },
        ],
    },
    {
        key: 'vehicle',
        label: 'Vehicle Theft',
        color: '#22D3EE',
        Icon: Car,
        tips: [
            { icon: Car, text: 'Always park in monitored, well-lit areas — especially at night.' },
            { icon: Shield, text: 'Never leave valuables visible inside your vehicle.' },
            { icon: CheckCircle, text: 'Use a visible steering wheel lock as a visual deterrent.' },
            { icon: Eye, text: 'Double-check your car is locked before walking away.' },
            { icon: Lightbulb, text: 'Add a GPS tracker to your vehicle for recovery in case of theft.' },
        ],
    },
    {
        key: 'assault',
        label: 'Personal Safety',
        color: '#EC4899',
        Icon: Users,
        tips: [
            { icon: Moon, text: 'Avoid arguments or confrontations in crowded or alcohol-heavy environments.' },
            { icon: Users, text: 'Trust your instincts. If something feels wrong, leave the area immediately.' },
            { icon: Eye, text: 'Share your live location with a trusted contact when going out at night.' },
            { icon: Shield, text: 'Consider personal safety training or self-defense classes.' },
            { icon: CheckCircle, text: "Keep emergency contacts saved as 'ICE' (In Case of Emergency) in your phone." },
        ],
    },
];

export default function SafetyTips() {
    const [activeKey, setActiveKey] = useState('robbery');
    const active = tipCategories.find(c => c.key === activeKey);

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal text-sm font-medium mb-4">
                        <Shield size={14} /> Crime Awareness Tips
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Safety <span className="text-neon-teal">Awareness Tips</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Practical, research-backed tips to help you stay safe based on common crime patterns.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {tipCategories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveKey(cat.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeKey === cat.key
                                    ? 'text-deep-navy border-transparent font-bold'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                                }`}
                            style={activeKey === cat.key ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                        >
                            <cat.Icon size={14} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {active && (
                        <motion.div
                            key={active.key}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Category header banner */}
                            <div
                                className="flex items-center gap-4 p-5 rounded-2xl mb-6 border"
                                style={{ backgroundColor: `${active.color}10`, borderColor: `${active.color}30` }}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${active.color}20` }}
                                >
                                    <active.Icon size={24} style={{ color: active.color }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{active.label} Prevention</h2>
                                    <p className="text-gray-400 text-sm">{active.tips.length} safety recommendations</p>
                                </div>
                            </div>

                            {/* Tips cards */}
                            <div className="space-y-3">
                                {active.tips.map((tip, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="glass-panel rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 p-5 flex items-start gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${active.color}15`, border: `1px solid ${active.color}30` }}
                                        >
                                            <tip.icon size={18} style={{ color: active.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-300 text-sm leading-relaxed">{tip.text}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-600 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Info footer */}
                            <div className="mt-8 p-5 rounded-xl bg-neon-teal/5 border border-neon-teal/20 flex items-start gap-3">
                                <Lightbulb size={18} className="text-neon-teal shrink-0 mt-0.5" />
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    These tips are generated based on historical crime pattern analysis. Staying informed and
                                    alert is one of the most effective ways to reduce personal risk.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
