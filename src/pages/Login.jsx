import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlobeCanvas from '../components/ui/GlobeCanvas';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [focused, setFocused] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const isAdmin = formData.email.toLowerCase().includes('admin');
            const name = formData.email.split('@')[0];
            const userData = {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                email: formData.email,
                role: isAdmin ? 'admin' : 'user',
                displayPicture: null,
            };
            login(userData);
            setLoading(false);
            navigate(isAdmin ? '/admin' : '/');
        }, 1500);
    };

    const inputClass = (field) => `
        w-full rounded-xl py-3 px-11 text-sm outline-none transition-all duration-200 text-white bg-transparent
        ${focused === field
            ? 'bg-neon-teal/10 border-neon-teal/50 shadow-[0_0_0_3px_rgba(0,212,170,0.12)] border'
            : 'bg-white/5 border border-white/10'
        }
    `;

    return (
        <div className="min-h-screen flex bg-deep-navy">

            {/* ══ LEFT PANEL — custom background ══ */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end p-12 shrink-0 bg-deep-navy">
                <GlobeCanvas />
                {/* Dot grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(11,14,20,0.65) 100%)' }} />
            </div>

            {/* ══ RIGHT PANEL — login form ══ */}
            <div className="w-full lg:w-[40%] xl:w-[35%] flex items-center justify-center py-10 px-8 bg-surface shrink-0">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="w-full max-w-[420px]"
                >

                    {/* Heading */}
                    <div className="mb-9">
                        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-gray-400">
                            Sign in to access your security dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
                        <div>
                            <label className="block text-[13px] font-semibold text-white/70 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'email' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoComplete="email"
                                    className={inputClass('email')}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[13px] font-semibold text-white/70 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'password' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoComplete="current-password"
                                    className={inputClass('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between mt-1">
                            <label className="flex items-center gap-2 text-[13px] text-gray-400 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" className="accent-neon-teal w-3.5 h-3.5 rounded border-white/20" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-[13px] text-neon-teal font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full py-3.5 rounded-xl text-[15px] font-bold text-deep-navy flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${loading ? 'bg-neon-teal/60 cursor-not-allowed' : 'bg-gradient-to-br from-neon-teal to-[#00b894] shadow-[0_0_24px_rgba(0,212,170,0.35)] cursor-pointer hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]'
                                }`}
                        >
                            {loading ? (
                                <span className="w-4.5 h-4.5 border-[2.5px] border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
                            ) : 'Sign In'}
                        </motion.button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-7">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-white/30 whitespace-nowrap">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-400 border-b-0 pb-0">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-neon-teal font-semibold hover:underline">
                            Create account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
