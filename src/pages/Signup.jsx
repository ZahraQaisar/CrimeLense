import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/common/Input';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden py-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-panel p-8 rounded-2xl relative"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join the safety network today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        icon={User}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoComplete="name"
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoComplete="email"
                    />

                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
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
                        autoComplete="new-password"
                    />

                    <Input
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        icon={Lock}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        autoComplete="new-password"
                    />

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
