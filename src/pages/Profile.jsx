import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleSaveProfile = () => {
        updateUser({ name: formData.name });
        setEditMode(false);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        // Mock password change
        if (passwordData.newPassword === passwordData.confirmPassword) {
            alert('Password changed successfully!');
            setShowChangePassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            alert('Passwords do not match!');
        }
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length > 1) {
            return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
        }
        return user.name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        My <span className="text-neon-teal">Profile</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Picture Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
                            <div className="relative inline-block mb-4">
                                {user?.displayPicture ? (
                                    <img
                                        src={user.displayPicture}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-neon-teal/30"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-neon-teal/20 border-4 border-neon-teal/50 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-neon-teal">
                                            {getUserInitials()}
                                        </span>
                                    </div>
                                )}
                                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-neon-teal text-deep-navy shadow-[0_0_20px_rgba(20,241,217,0.4)] hover:shadow-[0_0_30px_rgba(20,241,217,0.6)] transition-all">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                        </div>
                    </motion.div>

                    {/* Profile Information Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-panel p-8 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Account Information</h3>
                                {!editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="px-4 py-2 rounded-lg bg-neon-teal/10 text-neon-teal border border-neon-teal/50 font-semibold hover:bg-neon-teal hover:text-deep-navy transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                                        Full Name
                                    </label>
                                    {editMode ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            icon={User}
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                                            <User size={18} className="text-gray-400" />
                                            <span className="text-white">{user?.name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field (Read-only) */}
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg opacity-60">
                                        <Mail size={18} className="text-gray-400" />
                                        <span className="text-white">{user?.email}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                                        Password
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                                        <Lock size={18} className="text-gray-400" />
                                        <span className="text-white flex-1">
                                            {showPassword ? 'password123' : '••••••••••'}
                                        </span>
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {editMode ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                                        >
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({ name: user?.name || '', email: user?.email || '' });
                                            }}
                                            className="flex-1 py-3 bg-white/5 text-gray-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowChangePassword(!showChangePassword)}
                                        className="w-full py-3 bg-white/5 text-neon-teal font-bold rounded-xl border border-neon-teal/30 hover:bg-neon-teal/10 hover:border-neon-teal/50 transition-all"
                                    >
                                        Change Password
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Change Password Modal */}
                {showChangePassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowChangePassword(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    placeholder="Enter current password"
                                    icon={Lock}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="Enter new password"
                                    icon={Lock}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    icon={Lock}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowChangePassword(false)}
                                        className="flex-1 py-3 bg-white/5 text-gray-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Profile;
