import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-deep-navy/80 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neon-teal to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(20,241,217,0.3)]">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                Crime<span className="text-neon-teal">Lense</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            AI-powered safety intelligence to help you navigate the city with confidence.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a href="https://github.com" target="_blank" rel="noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                <Github size={16} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="mailto:contact@crimelense.io"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Tools */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Tools</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Crime Prediction', to: '/prediction' },
                                { label: 'Safe Route Finder', to: '/safe-route' },
                                { label: 'Compare Areas', to: '/compare' },
                            ].map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to} className="text-gray-500 hover:text-neon-teal text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Company</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'About Us', to: '/about' },
                                { label: 'How It Works', to: '/#how-it-works' },
                                { label: 'Features', to: '/#features' },
                            ].map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to} className="text-gray-500 hover:text-neon-teal text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Account</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Login', to: '/login' },
                                { label: 'Sign Up', to: '/signup' },
                                { label: 'Dashboard', to: '/dashboard' },
                            ].map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to} className="text-gray-500 hover:text-neon-teal text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} CrimeLense. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Built with AI · Powered by real-time data
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
