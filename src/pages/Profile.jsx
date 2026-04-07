import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Camera, Save, Trash2, ShieldCheck, Clock, ToggleLeft, ToggleRight, MapPin, Phone, Bell, Home, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);
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

    // Safety Preferences State
    const [preferences, setPreferences] = useState({
        homeArea: 'Downtown District',
        emergencyContact: '+1 234 567 8900',
        emailAlertsEnabled: true,
        queryHistoryEnabled: true,
    });

    // Mock Saved Areas
    const [savedAreas, setSavedAreas] = useState([
        { id: 1, name: 'Downtown District', risk: 'HIGH' },
        { id: 2, name: 'Northside Residential', risk: 'LOW' },
        { id: 3, name: 'Midtown Commercial', risk: 'MODERATE' },
    ]);

    const handleRemoveArea = (id) => {
        setSavedAreas(savedAreas.filter(area => area.id !== id));
        // Mock toast
        alert('Area removed from saved list.');
    };

    // Mock login activity log
    const loginActivity = [
        { time: 'Today, 2:10 PM', device: 'Windows Chrome — Current Session' },
        { time: 'Yesterday, 9:45 AM', device: 'Windows Chrome' },
        { time: 'Mar 14, 6:30 PM', device: 'Android Mobile' },
        { time: 'Mar 12, 1:15 PM', device: 'Windows Firefox' },
        { time: 'Mar 10, 8:00 AM', device: 'Windows Chrome' },
    ];

    const handleSaveProfile = () => {
        updateUser({ name: formData.name });
        setEditMode(false);
        // Mock toast
        alert('Profile saved successfully!');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ displayPicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
        <div className="min-h-screen pt-28 pb-12 px-6 lg:px-8">
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
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-neon-teal text-deep-navy shadow-[0_0_20px_rgba(20,241,217,0.4)] hover:shadow-[0_0_30px_rgba(20,241,217,0.6)] transition-all"
                                >
                                    <Camera size={18} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    hidden 
                                    accept="image/*" 
                                    onChange={handlePhotoChange} 
                                />
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
                                <Input label="Current Password" type="password" placeholder="Enter current password" icon={Lock}
                                    value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                                <Input label="New Password" type="password" placeholder="Enter new password" icon={Lock}
                                    value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" icon={Lock}
                                    value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all">Update Password</button>
                                    <button type="button" onClick={() => setShowChangePassword(false)} className="flex-1 py-3 bg-white/5 text-gray-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* My Safety Preferences */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldCheck size={24} className="text-neon-teal" /> My Safety Preferences
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Settings */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                                        <Home size={16} className="text-gray-400" /> Home Area
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={preferences.homeArea}
                                            onChange={(e) => setPreferences({ ...preferences, homeArea: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-teal/50 transition-all"
                                            placeholder="Set your home district"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                        Dashboard will personalize based on this area.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" /> Emergency Contact
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="tel"
                                            value={preferences.emergencyContact}
                                            onChange={(e) => setPreferences({ ...preferences, emergencyContact: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-teal/50 transition-all"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                        Used for the global "I'm Safe" SMS feature.
                                    </p>
                                </div>

                                {/* Toggles */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-white font-medium text-sm flex items-center gap-2">
                                                <Bell size={16} className={preferences.emailAlertsEnabled ? "text-neon-teal" : "text-gray-400"} />
                                                Email Safety Alerts
                                            </p>
                                            <p className="text-gray-500 text-xs mt-0.5">Get notified when a saved area changes risk tier</p>
                                        </div>
                                        <button onClick={() => setPreferences({ ...preferences, emailAlertsEnabled: !preferences.emailAlertsEnabled })} className="text-neon-teal">
                                            {preferences.emailAlertsEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-500" />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-white font-medium text-sm">Save Query History</p>
                                            <p className="text-gray-500 text-xs mt-0.5">Allow system to save search history for personalization</p>
                                        </div>
                                        <button onClick={() => setPreferences({ ...preferences, queryHistoryEnabled: !preferences.queryHistoryEnabled })} className="text-neon-teal">
                                            {preferences.queryHistoryEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-500" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Saved Areas & Subscriptions */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" /> Saved Areas & Subscriptions
                                    </label>
                                    <span className="text-xs text-neon-teal font-medium">{savedAreas.length} / 10 limit</span>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-2 space-y-1 max-h-[340px] overflow-y-auto custom-scrollbar">
                                    {savedAreas.length > 0 ? (
                                        savedAreas.map(area => (
                                            <div key={area.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors group">
                                                <div>
                                                    <p className="text-white font-medium text-sm">{area.name}</p>
                                                    <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                                                        Current Risk: <span className={
                                                            area.risk === 'HIGH' ? 'text-danger' :
                                                                area.risk === 'MODERATE' ? 'text-warning' : 'text-safe'
                                                        }>{area.risk}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveArea(area.id)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    title="Unsubscribe & Remove"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            No areas saved yet. Use the Search tools to add areas to your watchlist.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Login Activity Log */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                            <Clock size={20} className="text-neon-teal" /> Login Activity
                        </h3>
                        <div className="space-y-2">
                            {loginActivity.map((entry, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-safe' : 'bg-gray-600'}`} />
                                        <span className="text-gray-300 text-sm">{entry.device}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs">{entry.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Account Deletion */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
                    <div className="glass-panel p-6 rounded-2xl border border-danger/20">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Trash2 size={20} className="text-danger" /> Danger Zone
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete your account? All your data will be permanently erased. This cannot be undone.')) {
                                    alert('Account deletion request submitted. Your data will be wiped within 24 hours.');
                                }
                            }}
                            className="px-6 py-2.5 bg-danger/10 text-danger font-bold rounded-xl border border-danger/30 hover:bg-danger/20 transition-all text-sm flex items-center gap-2 w-fit cursor-pointer"
                        >
                            <Trash2 size={16} /> Delete My Account
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
