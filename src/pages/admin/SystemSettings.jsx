import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Settings, Bell, Shield, Database, RefreshCw, Save, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_TEAL = '#00d4aa';
const BRAND_BLUE = '#0ea5e9';
const BRAND_RED = '#ef4444';

// ── Toggle Component ───────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, label, desc }) => (
  <div className="flex items-center justify-between py-3.5">
    <div>
      <div className="text-sm font-semibold text-white">{label}</div>
      {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
      style={{
        background: enabled ? BRAND_TEAL : 'rgba(255,255,255,0.1)',
        boxShadow: enabled ? `0 0 10px rgba(0,212,170,0.4)` : 'none'
      }}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

// ── Section Component ──────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.1)', color: BRAND_TEAL }}>
        <Icon size={18} />
      </div>
      <h2 className="text-base font-bold text-white">{title}</h2>
    </div>
    <div className="px-6 divide-y divide-white/5">{children}</div>
  </div>
);

/* ── Primary action button (brand teal) ─────────────────────────────────── */
const PrimaryBtn = ({ onClick, children, disabled, style }) => (
  <button onClick={onClick} disabled={disabled}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed w-fit"
    style={{ background: BRAND_TEAL, color: '#0b0e14', boxShadow: `0 0 14px rgba(0,212,170,0.22)`, ...style }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.background = '#22e8bc')}
    onMouseLeave={e => !disabled && (e.currentTarget.style.background = BRAND_TEAL)}>
    {children}
  </button>
);

// ── Danger Action Confirm Modal ────────────────────────────────────────────
const DangerModal = ({ open, action, onConfirm, onClose }) => {
  const [confirmed, setConfirmed] = useState(false);

  React.useEffect(() => {
    if (open) setConfirmed(false);
  }, [open]);

  if (!action) return null;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {open && ReactDOM.createPortal(
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', zIndex: 99999 }}
          onClick={!confirmed ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-sm shadow-2xl p-6"
            style={{ background: '#0f1923', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            {confirmed ? (
              // Success state
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-4 gap-3"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.1)', color: BRAND_TEAL }}>
                  <CheckCircle size={24} />
                </div>
                <p className="text-sm font-semibold text-white">{action.successMsg}</p>
                <p className="text-xs text-gray-500">Completing action...</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: BRAND_RED }}>
                      <action.icon size={18} />
                    </div>
                    <h3 className="text-base font-bold text-white">{action.label}</h3>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X size={15} />
                  </button>
                </div>

                {/* Warning box */}
                <div className="flex items-start gap-3 p-3 rounded-xl mb-4 border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.1)' }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: BRAND_RED }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(239,68,68,0.8)' }}>{action.warning}</p>
                </div>

                <p className="text-sm text-gray-400 mb-5">{action.desc}</p>

                <div className="flex gap-3 justify-end">
                  <button onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all">
                    Cancel
                  </button>
                  <button onClick={handleConfirm}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all text-white border hover:bg-white/5"
                    style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: BRAND_RED }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                    <action.icon size={13} /> {action.btn}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>,
        document.body
      )}
    </AnimatePresence>
  );
};

// ── Danger Zone Actions Config ─────────────────────────────────────────────
const dangerActions = [
  {
    key: 'flush',
    label: 'Flush Cache',
    desc: 'This will clear all cached predictions, map data, and temporary files. The system will rebuild the cache on next request.',
    warning: 'Users may experience slower response times for a few minutes after flushing.',
    btn: 'Flush Cache',
    icon: RefreshCw,
    successMsg: 'Cache flushed successfully',
  },
  {
    key: 'purge',
    label: 'Purge Incident Logs',
    desc: 'This will permanently delete all logs older than your current retention period. This cannot be undone.',
    warning: 'Deleted logs cannot be recovered. Make sure you have exported any important records before proceeding.',
    btn: 'Purge Logs',
    icon: Database,
    successMsg: 'Incident logs purged',
  },
  {
    key: 'reset',
    label: 'Reset All Settings',
    desc: 'This will restore all system settings to factory defaults. Your data will not be affected, but all configuration changes will be lost.',
    warning: 'All custom configurations including notifications, security settings, and model preferences will be reset.',
    btn: 'Reset Settings',
    icon: Settings,
    successMsg: 'Settings reset to defaults',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────
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

  // Danger modal state
  const [dangerModal, setDangerModal] = useState({ open: false, action: null });

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const openDanger = (actionKey) => {
    const action = dangerActions.find(a => a.key === actionKey);
    setDangerModal({ open: true, action });
  };

  const handleDangerConfirm = () => {
    if (dangerModal.action?.key === 'reset') {
      setTimeout(() => {
        setSettings({
          darkMode: true, emailAlerts: true, smsAlerts: false,
          autoRetrain: true, maintenanceMode: false, twoFactor: true,
          apiAccess: true, dataEncryption: true, autoBackup: true, compressionEnabled: false,
        });
        setModelVersion('v2.4');
        setRetainDays('90');
      }, 1400);
    }
  };

  const selectStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    paddingRight: '28px',
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all w-fit"
          style={{
            background: saved ? 'transparent' : BRAND_TEAL,
            color: saved ? BRAND_TEAL : '#0b0e14',
            border: saved ? `1px solid ${BRAND_TEAL}` : '1px solid transparent',
            boxShadow: saved ? 'none' : `0 0 20px rgba(0,212,170,0.3)`
          }}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.background = '#22e8bc'; }}
          onMouseLeave={e => { if (!saved) e.currentTarget.style.background = BRAND_TEAL; }}
        >
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Maintenance Banner */}
      <AnimatePresence>
        {settings.maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-2xl border"
            style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: BRAND_RED }}
          >
            <AlertTriangle size={18} className="shrink-0" />
            <span className="text-sm font-semibold">Maintenance mode is active — public access is restricted</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Grid */}
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
            <select value={modelVersion} onChange={e => setModelVersion(e.target.value)}
              style={selectStyle}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none transition-colors"
              onFocus={e => { e.target.style.borderColor = BRAND_TEAL }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}>
              {['v2.4', 'v2.3', 'v2.2'].map(v => (
                <option key={v} value={v} style={{ background: '#0f1923' }}>{v}</option>
              ))}
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
            <select value={retainDays} onChange={e => setRetainDays(e.target.value)}
              style={selectStyle}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none transition-colors"
              onFocus={e => { e.target.style.borderColor = BRAND_TEAL }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}>
              {['30', '60', '90', '180', '365'].map(d => (
                <option key={d} value={d} style={{ background: '#0f1923' }}>{d} days</option>
              ))}
            </select>
          </div>
        </Section>
      </div>

      {/* Critical Actions (Replaces "Danger Zone") */}
      <div className="glass-panel rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', color: BRAND_RED }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: BRAND_RED }}>Danger Zone</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(239,68,68,0.6)' }}>These actions are irreversible. Proceed with caution.</p>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 space-y-3">
          {dangerActions.map(({ key, label, desc, btn, icon: Icon }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </div>
              <button
                onClick={() => openDanger(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all shrink-0 w-fit"
                style={{ borderColor: 'rgba(239,68,68,0.4)', color: BRAND_RED }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon size={13} /> {btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Confirmation Modal */}
      <DangerModal
        open={dangerModal.open}
        action={dangerModal.action}
        onConfirm={handleDangerConfirm}
        onClose={() => setDangerModal({ open: false, action: null })}
      />
    </div>
  );
};

export default SystemSettings;