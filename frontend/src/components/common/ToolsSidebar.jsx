import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Navigation, BarChart3, ChevronRight } from 'lucide-react';

const links = [
    {
        icon: Activity,
        label: 'Crime Prediction',
        desc: 'Predict risk for any area & time',
        to: '/prediction',
    },
    {
        icon: Navigation,
        label: 'Safe Route Finder',
        desc: 'Find the safest path to destination',
        to: '/safe-route',
    },
    {
        icon: BarChart3,
        label: 'Compare Areas',
        desc: 'Compare crime stats side by side',
        to: '/compare',
    },
];

const pageTitles = {
    '/prediction': { title: 'Crime Risk', highlight: 'Prediction', desc: 'AI-powered risk analysis for any location and time.' },
    '/safe-route': { title: 'Safe', highlight: 'Route Finder', desc: 'Find the safest path, avoiding high-risk zones.' },
    '/compare': { title: 'Compare', highlight: 'Areas', desc: 'Compare crime statistics between two areas.' },
};

const ToolsSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const page = pageTitles[pathname] || { title: 'Tools', highlight: '', desc: '' };

    return (
        <aside className="hidden lg:flex w-64 shrink-0 flex-col">
            <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col border-r border-white/10 bg-[#0d1526] py-6 px-5">

                {/* Page title */}
                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-white leading-tight">
                        {page.title} <span className="text-neon-teal">{page.highlight}</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{page.desc}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/8 mb-5" />

                {/* Section label */}
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3 px-1">
                    Tools
                </p>

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                    {links.map(({ icon: Icon, label, desc, to }) => {
                        const active = pathname === to;
                        return (
                            <button
                                key={to}
                                onClick={() => navigate(to)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group ${active
                                        ? 'bg-neon-teal/12 border border-neon-teal/25 text-neon-teal'
                                        : 'border border-transparent hover:bg-white/5 hover:border-white/8 text-gray-300 hover:text-white'
                                    }`}
                            >
                                {/* Icon container */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${active
                                        ? 'bg-neon-teal/15 text-neon-teal'
                                        : 'bg-white/5 text-gray-500 group-hover:bg-white/8 group-hover:text-neon-teal'
                                    }`}>
                                    <Icon size={16} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-sm leading-tight ${active ? 'text-neon-teal' : 'text-gray-200 group-hover:text-white'}`}>
                                        {label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
                                        {desc}
                                    </div>
                                </div>

                                {/* Active chevron */}
                                <ChevronRight
                                    size={14}
                                    className={`shrink-0 transition-all ${active ? 'opacity-100 text-neon-teal' : 'opacity-0 group-hover:opacity-40'}`}
                                />
                            </button>
                        );
                    })}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom tagline */}
                <div className="mt-4 px-1 pt-5 border-t border-white/8">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        AI-powered urban safety intelligence.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default ToolsSidebar;
