import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { motion } from 'framer-motion';
import NetworkCanvas from '../components/ui/NetworkCanvas';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [focused, setFocused] = useState(null);

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await register(fullName, formData.email, formData.password);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Registration failed.');
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
            <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end p-8 shrink-0 bg-deep-navy">
                <NetworkCanvas />
                {/* Dot grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(11,14,20,0.65) 100%)' }} />
            </div>

            {/* ══ RIGHT PANEL — signup form ══ */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex items-start justify-center pt-8 md:pt-12 px-6 bg-surface shrink-0 z-10 shadow-2xl overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-[380px]"
                >

                    {/* Heading */}
                    <div className="mb-6 mt-8 lg:mt-0">
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-1.5 tracking-tight leading-tight">
                            Create <span className="text-neon-teal">Account</span>
                        </h1>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Join the safety network today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                        {/* Name Fields */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'firstName' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        onFocus={() => setFocused('firstName')}
                                        onBlur={() => setFocused(null)}
                                        required
                                        autoComplete="given-name"
                                        className={inputClass('firstName')}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === 'lastName' ? 'text-neon-teal' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        onFocus={() => setFocused('lastName')}
                                        onBlur={() => setFocused(null)}
                                        required
                                        autoComplete="family-name"
                                        className={inputClass('lastName')}
                                    />
                                </div>
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


                        {/* Error */}
                        {error && (
                            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 mt-2 btn-primary ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-[2px] border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
                            ) : 'Create Account'}
                        </motion.button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] uppercase tracking-wider text-white/30 whitespace-nowrap">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google Signup */}
                    <button
                        type="button"
                        className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-3 transition-all duration-200 mb-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:scale-[0.98]"
                    >
                        <svg viewBox="0 0 24 24" width="15" height="15">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign up with Google
                    </button>

                    {/* Sign in link */}
                    <p className="text-center text-xs text-gray-400">
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
