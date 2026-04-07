import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Security');

    // Security State
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        emailAlerts: true,
        pushNotifications: true,
        marketingUpdates: false,
        communityActivity: true,
    });

    // Appearance State
    const [theme, setTheme] = useState(
        document.documentElement.getAttribute('data-theme') || 'dark'
    );
    const [accentColor, setAccentColor] = useState('#26CCC2');

    const tabs = ['Profile Info', 'Security', 'Notifications', 'Appearance', 'Billing'];

    const handlePasswordUpdate = () => {
        if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        alert('Password updated successfully!');
        setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSavePreferences = () => {
        alert('Notification preferences saved successfully!');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile Info':
                return (
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="text-base font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Profile Settings Moved</h2>
                        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] flex flex-col items-start gap-4">
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                To avoid confusion, all personal information, avatars, and safety preferences are now managed on your main Profile page.
                            </p>
                            <Link to="/profile" className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: 'var(--accent)', color: '#0b0e14', fontFamily: "'Space Grotesk', sans-serif" }}>
                                Go to Profile Page
                            </Link>
                        </div>
                    </div>
                );
            case 'Security':
                return (
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Security Settings</h2>
                        
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Current Password</label>
                            <input type="password" value={securityData.currentPassword} onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})} placeholder="••••••••" className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }} />
                        </div>
                        
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">New Password</label>
                            <input type="password" value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} placeholder="••••••••" className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }} />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Confirm New Password</label>
                            <input type="password" value={securityData.confirmPassword} onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }} />
                        </div>

                        <div className="flex items-center justify-between p-4 mt-2 border rounded-xl" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-elevated)' }}>
                            <div>
                                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</h3>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security to your account.</p>
                            </div>
                            <button 
                                onClick={() => setSecurityData({...securityData, twoFactorEnabled: !securityData.twoFactorEnabled})}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${securityData.twoFactorEnabled ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-transparent'}`} 
                                style={{ borderColor: securityData.twoFactorEnabled ? '' : 'var(--border-subtle)', color: securityData.twoFactorEnabled ? '' : 'var(--text-primary)' }}
                            >
                                {securityData.twoFactorEnabled ? 'Enabled' : 'Enable'}
                            </button>
                        </div>

                        <div className="pt-4 mt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button onClick={handlePasswordUpdate} className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: 'var(--accent)', color: '#0b0e14', fontFamily: "'Space Grotesk', sans-serif" }}>
                                Update Password
                            </button>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Notification Preferences</h2>
                        
                        <div className="flex flex-col gap-4">
                            {[
                                { id: 'emailAlerts', title: 'Email Alerts', desc: 'Receive daily summary of incidents in your saved areas.' },
                                { id: 'pushNotifications', title: 'Push Notifications', desc: 'Instant alerts for high-risk events near your active route.' },
                                { id: 'marketingUpdates', title: 'Marketing Updates', desc: 'News about new tools and CrimeLense features.' },
                                { id: 'communityActivity', title: 'Community Activity', desc: 'When someone replies to your community post.' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--surface-elevated)]">
                                    <div>
                                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={preferences[item.id]} 
                                            onChange={() => setPreferences({...preferences, [item.id]: !preferences[item.id]})}
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 mt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button onClick={handleSavePreferences} className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: 'var(--accent)', color: '#0b0e14', fontFamily: "'Space Grotesk', sans-serif" }}>
                                Save Preferences
                            </button>
                        </div>
                    </div>
                );
            case 'Appearance':
                return (
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Appearance & Theme</h2>
                        
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-4">Theme</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div 
                                    onClick={() => {
                                        setTheme('dark');
                                        document.documentElement.setAttribute('data-theme', 'dark');
                                    }}
                                    className="border-[2px] rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all" 
                                    style={{ borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
                                >
                                    <div className="w-16 h-12 rounded bg-[#0A0A0A] border border-gray-800 flex items-center justify-center">
                                        <div className="w-8 h-2 bg-gray-800 rounded"></div>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Dark Mode</span>
                                </div>
                                <div 
                                    onClick={() => {
                                        setTheme('light');
                                        document.documentElement.setAttribute('data-theme', 'light');
                                    }}
                                    className="border-[2px] rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all" 
                                    style={{ borderColor: theme === 'light' ? 'var(--accent)' : 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
                                >
                                    <div className="w-16 h-12 rounded bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                                        <div className="w-8 h-2 bg-gray-300 rounded"></div>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Light Mode</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-4 mt-4">Accent Color</label>
                            <div className="flex items-center gap-3">
                                {[
                                    { color: '#26CCC2' },
                                    { color: '#3B82F6' },
                                    { color: '#8B5CF6' },
                                    { color: '#EC4899' },
                                    { color: '#F59E0B' },
                                ].map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => {
                                            setAccentColor(item.color);
                                            document.documentElement.style.setProperty('--accent', item.color);
                                            // Provide tiny feedback
                                        }}
                                        className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110" 
                                        style={{ background: item.color, border: accentColor === item.color ? '2px solid white' : 'none', opacity: accentColor === item.color ? 1 : 0.6 }}
                                    >
                                        {accentColor === item.color && <div className="w-3 h-3 rounded-full bg-white"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Billing':
                return (
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Subscription & Billing</h2>

                        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-10"></div>
                            
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Current Plan</p>
                                    <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Free Tier</h3>
                                </div>
                                <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-xs font-bold">
                                    Active
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {[
                                    'Basic Threat Feeds',
                                    'Up to 3 Saved Areas',
                                    'Standard Live Map Access'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => alert('Plan Upgrades are handled by Stripe billing portal.')} className="w-full py-2.5 rounded-lg text-sm font-bold transition-all bg-white/5 border border-[var(--border-subtle)] hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>
                                Upgrade to Pro
                            </button>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Payment Methods</h3>
                            <div className="flex items-center justify-center p-6 border border-dashed rounded-xl cursor-not-allowed" style={{ borderColor: 'var(--border-subtle)' }}>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No payment methods added.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1100px]">
            <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Settings</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your application preferences and configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)]' : 'hover:bg-white/5 border border-transparent'}`} 
                            style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="md:col-span-3 rounded-2xl p-6 md:p-8 min-h-[500px]" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
