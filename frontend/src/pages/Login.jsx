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

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(formData.email, formData.password);
            navigate(userData.role === 'admin' ? '/admin' : '/app/dashboard');
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) => `
        w-full rounded-lg py-2 px-10 text-[12px] outline-none transition-all duration-200 text-white bg-transparent
        ${focused === field
            ? 'bg-neon-teal/10 border-neon-teal/50 shadow-[0_0_0_2px_rgba(0,212,170,0.12)] border'
            : 'bg-white/5 border border-white/10'
        }
    `;

    return (
        <div className="h-screen flex bg-deep-navy overflow-hidden">

            {/* ══ LEFT PANEL — custom background ══ */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end p-12 shrink-0 bg-deep-navy">
                <GlobeCanvas />
                {/* Dot grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(11,14,20,0.65) 100%)' }} />
            </div>

            {/* ══ RIGHT PANEL — login form ══ */}
            <div className="w-full lg:w-[40%] xl:w-[35%] flex items-start justify-center pt-8 md:pt-12 px-8 bg-surface shrink-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="w-full max-w-[420px]"
                >

                    {/* Heading */}
                    <div className="mb-6 mt-8 lg:mt-0">
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-1.5 tracking-tight leading-tight">
                            Welcome <span className="text-neon-teal">Back</span>
                        </h1>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Sign in to access your security dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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

                        {/* Error message */}
                        {error && (
                            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 mt-2 btn-primary ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-[2px] border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
                            ) : 'Sign In'}
                        </motion.button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] uppercase tracking-wider text-white/30 whitespace-nowrap">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-xs text-gray-400 border-b-0 pb-0">
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
