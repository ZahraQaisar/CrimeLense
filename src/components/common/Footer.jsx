import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-20 px-6 lg:px-8 border-t border-white/5 bg-deep-navy relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-white mb-6 flex items-center gap-2 group w-fit">
                            <Shield className="text-neon-teal group-hover:scale-110 transition-transform" />
                            <span>Crime<span className="text-neon-teal">Lense</span></span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            AI-powered urban safety intelligence. We are dedicated to making cities safer through data-driven predictive analysis and smart navigation.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon-teal hover:bg-white/10 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon-teal hover:bg-white/10 transition-all">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon-teal hover:bg-white/10 transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Home</Link></li>
                            <li><Link to="/prediction" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Risk Prediction</Link></li>
                            <li><Link to="/safe-route" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Safe Route</Link></li>
                            <li><Link to="/compare" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Compare Areas</Link></li>
                            <li><Link to="/risk-score" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Risk Score</Link></li>
                            <li><Link to="/safety-ranking" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Safety Ranking</Link></li>
                            <li><Link to="/trend-explorer" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Trend Explorer</Link></li>
                            <li><Link to="/ai-insights" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">AI Insights</Link></li>
                            <li><Link to="/risk-forecast" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Risk Forecast</Link></li>
                            <li><Link to="/nearby-scanner" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Nearby Scanner</Link></li>
                            <li><Link to="/safety-tips" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Safety Tips</Link></li>
                            <li><Link to="/crime-timeline" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Crime Timeline</Link></li>
                            <li><Link to="/map-layers" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Map Layers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Documentation</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Research Papers</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">API Access</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-neon-teal transition-colors text-sm">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Mail size={16} className="text-neon-teal" />
                                support@crimelense.ai
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Globe size={16} className="text-neon-teal" />
                                San Francisco, CA
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-[10px] sm:text-xs">
                    <p>© {new Date().getFullYear()} CrimeLense AI. Built for urban safety. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
