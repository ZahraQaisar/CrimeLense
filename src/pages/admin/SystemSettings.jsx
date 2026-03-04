import React, { useState } from 'react';
import { Settings, Moon, Bell, Shield, Database, RefreshCw, Save, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Toggle = ({ enabled, onChange, label, desc }) => (
    <div className="flex items-center justify-between py-3.5">
        <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${enabled ? 'bg-neon-teal shadow-[0_0_10px_rgba(20,241,217,0.4)]' : 'bg-white/10'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${enabled ? 'left-6' : 'left-1'}`} />
        </button>
    </div>
);

const Section = ({ icon: Icon, title, children }) => (
    <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-neon-teal/10 flex items-center justify-center text-neon-teal">
                <Icon size={18} />
            </div>
            <h2 className="text-base font-bold text-white">{title}</h2>
        </div>
        <div className="px-6 divide-y divide-white/5">{children}</div>
    </div>
);

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        darkMode: true,
        emailAlerts: true,
        smsAlerts: false,
        autoRetrain: true,
        maintenanceMode: false,
        twoFactor: true,
        apiAccess: true,
        dataEncryption: true,
        autoBackup: true,
        compressionEnabled: false,
    });
    const [modelVersion, setModelVersion] = useState('v2.4');
    const [retainDays, setRetainDays] = useState('90');
    const [saved, setSaved] = useState(false);

    const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Settings</h1>
                    <p className="text-gray-400 text-sm mt-1">Configure platform behaviour, security, and data policies</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-safe text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-neon-teal text-deep-navy shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:bg-white'}`}
                >
                    <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* Maintenance Banner */}
            {settings.maintenanceMode && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/30 text-warning">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span className="text-sm font-semibold">Maintenance mode is active — public access is restricted</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* General */}
                <Section icon={Settings} title="General">
                    <Toggle enabled={settings.darkMode} onChange={() => toggle('darkMode')} label="Dark Mode" desc="Use dark theme across the dashboard" />
                    <Toggle enabled={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} label="Maintenance Mode" desc="Restrict public access during updates" />
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <div className="text-sm font-semibold text-white">Active Model Version</div>
                            <div className="text-xs text-gray-500 mt-0.5">AI prediction model currently in use</div>
                        </div>
                        <select
                            value={modelVersion}
                            onChange={e => setModelVersion(e.target.value)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-neon-teal/50"
                        >
                            {['v2.4', 'v2.3', 'v2.2'].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                </Section>

                {/* Notifications */}
                <Section icon={Bell} title="Notifications">
                    <Toggle enabled={settings.emailAlerts} onChange={() => toggle('emailAlerts')} label="Email Alerts" desc="Send system events to admin email" />
                    <Toggle enabled={settings.smsAlerts} onChange={() => toggle('smsAlerts')} label="SMS Alerts" desc="Send critical alerts via SMS" />
                    <Toggle enabled={settings.autoRetrain} onChange={() => toggle('autoRetrain')} label="Auto-retrain Alerts" desc="Notify when model retraining completes" />
                </Section>

                {/* Security */}
                <Section icon={Shield} title="Security">
                    <Toggle enabled={settings.twoFactor} onChange={() => toggle('twoFactor')} label="Two-Factor Authentication" desc="Require 2FA for all admin accounts" />
                    <Toggle enabled={settings.apiAccess} onChange={() => toggle('apiAccess')} label="External API Access" desc="Allow third-party API integrations" />
                    <Toggle enabled={settings.dataEncryption} onChange={() => toggle('dataEncryption')} label="Data Encryption" desc="Encrypt all stored crime datasets" />
                </Section>

                {/* Data & Storage */}
                <Section icon={Database} title="Data & Storage">
                    <Toggle enabled={settings.autoBackup} onChange={() => toggle('autoBackup')} label="Automatic Backups" desc="Daily backup at 02:00 UTC" />
                    <Toggle enabled={settings.compressionEnabled} onChange={() => toggle('compressionEnabled')} label="Data Compression" desc="Compress old logs to save storage" />
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <div className="text-sm font-semibold text-white">Log Retention</div>
                            <div className="text-xs text-gray-500 mt-0.5">Days to keep incident logs before purge</div>
                        </div>
                        <select
                            value={retainDays}
                            onChange={e => setRetainDays(e.target.value)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-neon-teal/50"
                        >
                            {['30', '60', '90', '180', '365'].map(d => <option key={d} value={d}>{d} days</option>)}
                        </select>
                    </div>
                </Section>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel rounded-2xl border border-danger/20 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-danger/15">
                    <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
                        <AlertTriangle size={18} />
                    </div>
                    <h2 className="text-base font-bold text-danger">Danger Zone</h2>
                </div>
                <div className="px-6 py-4 space-y-3">
                    {[
                        { label: 'Flush Cache', desc: 'Clear all cached predictions and map data', btn: 'Flush', icon: RefreshCw },
                        { label: 'Purge Incident Logs', desc: 'Permanently delete all logs older than retention period', btn: 'Purge', icon: Database },
                        { label: 'Reset All Settings', desc: 'Restore all system settings to factory defaults', btn: 'Reset', icon: Settings },
                    ].map(({ label, desc, btn, icon: Icon }) => (
                        <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/15">
                            <div>
                                <div className="text-sm font-semibold text-white">{label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger/40 text-danger text-xs font-bold hover:bg-danger/10 transition-all">
                                <Icon size={13} /> {btn}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
