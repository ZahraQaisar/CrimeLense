import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { motion } from 'framer-motion';
import NetworkCanvas from '../components/ui/NetworkCanvas';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [focused, setFocused] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    const inputClass = (field) => `
        w-full rounded-lg py-2.5 px-10 text-[13px] outline-none transition-all duration-200 text-white bg-transparent
        ${focused === field
            ? 'bg-neon-teal/10 border-neon-teal/50 shadow-[0_0_0_2px_rgba(0,212,170,0.12)] border'
            : 'bg-white/5 border border-white/10'
        }
    `;

    return (
        <div className="min-h-screen flex bg-deep-navy overflow-hidden">

            {/* ══ LEFT PANEL — custom background ══ */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end p-8 shrink-0 bg-deep-navy">
                <NetworkCanvas />
                {/* Dot grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(11,14,20,0.65) 100%)' }} />
            </div>

            {/* ══ RIGHT PANEL — signup form ══ */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex items-center justify-center py-4 px-6 bg-surface shrink-0 z-10 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-[380px]"
                >

                    {/* Heading */}
                    <div className="mb-6 mt-16 lg:mt-0">
                        <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-xs text-gray-400">
                            Join the safety network today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'name' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocused('name')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoComplete="name"
                                    className={inputClass('name')}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'email' ? 'text-neon-teal' : 'text-gray-400'}`} />
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
                            <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'password' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoComplete="new-password"
                                    className={inputClass('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'confirm' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    onFocus={() => setFocused('confirm')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    autoComplete="new-password"
                                    className={inputClass('confirm')}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-2.5 rounded-lg text-sm font-bold text-deep-navy flex items-center justify-center gap-2 transition-all duration-200 mt-1 ${loading ? 'bg-neon-teal/60 cursor-not-allowed' : 'bg-gradient-to-br from-neon-teal to-[#00b894] shadow-[0_0_20px_rgba(0,212,170,0.25)] cursor-pointer hover:shadow-[0_0_25px_rgba(0,212,170,0.4)]'}`}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-[2px] border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
                            ) : 'Create Account'}
                        </motion.button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-5">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[11px] uppercase tracking-wider text-white/30 whitespace-nowrap">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign in link */}
                    <p className="text-center text-[13px] text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-neon-teal font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
