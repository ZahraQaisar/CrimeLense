import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Mock user data
            const userData = {
                name: formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1),
                email: formData.email,
                displayPicture: null // No DP by default
            };

            login(userData);
            setLoading(false);
            // Temporarily redirect to homepage for testing (instead of /dashboard)
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-teal/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-panel p-8 rounded-2xl relative"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-neon-teal/20 rounded-xl flex items-center justify-center mb-4 text-neon-teal shadow-[0_0_15px_rgba(20,241,217,0.3)]">
                        <Shield size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Access your security dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@crimelense.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoComplete="email"
                    />

                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={Lock}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                        required
                        autoComplete="current-password"
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-neon-teal focus:ring-neon-teal" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-neon-teal hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-neon-teal font-semibold hover:underline">
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
