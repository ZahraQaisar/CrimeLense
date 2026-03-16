import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Search, Filter, MoreVertical, UserCheck, UserX, Shield, User, Mail, Calendar, X, Save, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Initial Data ───────────────────────────────────────────────────────────
const initialUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@example.com', role: 'Admin',   status: 'Active',    joined: '12 Jan 2024', lastSeen: '2 mins ago' },
  { id: 2, name: 'James Okonkwo',  email: 'james.ok@example.com', role: 'Analyst', status: 'Active',    joined: '28 Feb 2024', lastSeen: '1 hour ago' },
  { id: 3, name: 'Priya Sharma',   email: 'priya.s@example.com',  role: 'Viewer',  status: 'Suspended', joined: '5 Mar 2024',  lastSeen: '3 days ago' },
  { id: 4, name: 'Tom Becker',     email: 'tom.b@example.com',    role: 'Analyst', status: 'Active',    joined: '19 Apr 2024', lastSeen: '30 mins ago' },
  { id: 5, name: 'Lena Fischer',   email: 'lena.f@example.com',   role: 'Viewer',  status: 'Inactive',  joined: '7 Jun 2024',  lastSeen: '2 weeks ago' },
  { id: 6, name: 'Ahmed Karimi',   email: 'ahmed.k@example.com',  role: 'Analyst', status: 'Active',    joined: '14 Jul 2024', lastSeen: '5 mins ago' },
  { id: 7, name: 'Chloe Dupont',   email: 'chloe.d@example.com',  role: 'Viewer',  status: 'Active',    joined: '3 Sep 2024',  lastSeen: '1 day ago' },
];

const ROLE_BADGE   = { Admin: 'text-danger bg-danger/10 border-danger/20', Analyst: 'text-blue-400 bg-blue-400/10 border-blue-400/20', Viewer: 'text-gray-400 bg-white/5 border-white/10' };
const STATUS_BADGE = { Active: 'text-safe bg-safe/10 border-safe/20', Suspended: 'text-danger bg-danger/10 border-danger/20', Inactive: 'text-gray-400 bg-white/5 border-white/10' };
const EMPTY_FORM   = { name: '', email: '', role: 'Viewer', password: '', confirmPassword: '' };

// ── Shared input style ─────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-teal/50 transition-colors';
const selectStyle = {
  height: '42px',
  appearance: 'none',
  WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.05)',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

// ── Modal Overlay wrapper ──────────────────────────────────────────────────
const Overlay = ({ children, onClose }) => ReactDOM.createPortal(
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}
    onClick={onClose}
  >
    {children}
  </motion.div>,
  document.body
);

// ── Add / Edit User Modal ──────────────────────────────────────────────────
const UserModal = ({ open, onClose, onSave, editUser }) => {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});

  React.useEffect(() => {
    if (editUser) {
      setForm({ name: editUser.name, email: editUser.email, role: editUser.role, password: '', confirmPassword: '' });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setShowPass(false);
  }, [editUser, open]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!editUser) {
      if (!form.password)              e.password        = 'Password is required';
      else if (form.password.length < 6) e.password      = 'Min 6 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, id: editUser?.id, status: editUser?.status || 'Active', joined: editUser?.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), lastSeen: 'Just now' });
    onClose();
  };

  return (
    <AnimatePresence>
      <Overlay onClose={onClose}>
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="w-full max-w-md shadow-2xl overflow-hidden hide-scroll"
          style={{ background: '#0f1923', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neon-teal/10 flex items-center justify-center text-neon-teal">
                <User size={15} />
              </div>
              <h2 className="text-base font-bold text-white">{editUser ? 'Edit User' : 'Add New User'}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Avatar preview */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-teal/30 to-blue-600/30 flex items-center justify-center text-white font-bold text-base shrink-0">
                {form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{form.name || 'New User'}</p>
                <p className="text-xs text-gray-500">{form.email || 'email@example.com'}</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. John Smith" className={inputCls} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Email Address *</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="user@example.com" type="email"
                  className={`${inputCls} pl-9`} />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}
                className={`${inputCls}`} style={selectStyle}>
                {['Admin', 'Analyst', 'Viewer'].map(r => (
                  <option key={r} value={r} style={{ background: '#0f1923', color: '#fff' }}>{r}</option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-1">
                {form.role === 'Admin' ? 'Full system access including settings and user management'
                  : form.role === 'Analyst' ? 'Can view and analyze crime data, cannot manage users'
                  : 'Read-only access to public crime reports'}
              </p>
            </div>

            {/* Password — only for new users */}
            {!editUser && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Password *</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={form.password} onChange={e => set('password', e.target.value)}
                      placeholder="Min 6 characters" type={showPass ? 'text' : 'password'}
                      className={`${inputCls} pl-9 pr-10`} />
                    <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      placeholder="Repeat password" type={showPass ? 'text' : 'password'}
                      className={`${inputCls} pl-9`} />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {/* Edit password hint */}
            {editUser && (
              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                <Lock size={11} /> Password change is handled separately via the security settings.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-teal text-deep-navy font-bold text-sm hover:bg-white transition-colors shadow-[0_0_16px_rgba(20,241,217,0.25)]">
              <Save size={14} /> {editUser ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </motion.div>
      </Overlay>
    </AnimatePresence>
  );
};

// ── Suspend Confirm Modal ──────────────────────────────────────────────────
const SuspendModal = ({ open, user, onConfirm, onClose }) => (
  <AnimatePresence>
    {open && (
      <Overlay onClose={onClose}>
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
          className="w-full max-w-sm shadow-2xl p-6"
          style={{ background: '#0f1923', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '16px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning shrink-0">
              <UserX size={18} />
            </div>
            <h3 className="text-base font-bold text-white">
              {user?.status === 'Suspended' ? 'Unsuspend User' : 'Suspend User'}
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            {user?.status === 'Suspended'
              ? <>Are you sure you want to restore access for <span className="text-white font-semibold">{user?.name}</span>? They will be able to log in again.</>
              : <>Are you sure you want to suspend <span className="text-white font-semibold">{user?.name}</span>? They will lose access immediately.</>
            }
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">
              Cancel
            </button>
            <button onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${user?.status === 'Suspended' ? 'bg-safe/10 border border-safe/30 text-safe hover:bg-safe/20' : 'bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20'}`}>
              {user?.status === 'Suspended' ? 'Yes, Restore Access' : 'Yes, Suspend'}
            </button>
          </div>
        </motion.div>
      </Overlay>
    )}
  </AnimatePresence>
);

// ── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteModal = ({ open, user, onConfirm, onClose }) => (
  <AnimatePresence>
    {open && (
      <Overlay onClose={onClose}>
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
          className="w-full max-w-sm shadow-2xl p-6"
          style={{ background: '#0f1923', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Delete User</h3>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Are you sure you want to permanently delete <span className="text-white font-semibold">{user?.name}</span>?
          </p>
          <p className="text-xs text-danger/70 mb-5">This action cannot be undone. All data associated with this account will be removed.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 text-sm font-bold transition-all">
              Delete Permanently
            </button>
          </div>
        </motion.div>
      </Overlay>
    )}
  </AnimatePresence>
);

// ── Change Role Modal ──────────────────────────────────────────────────────
const RoleModal = ({ open, user, onConfirm, onClose }) => {
  const [role, setRole] = useState('');
  React.useEffect(() => { if (user) setRole(user.role); }, [user]);
  if (!open) return null;
  return (
    <AnimatePresence>
      <Overlay onClose={onClose}>
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
          className="w-full max-w-sm shadow-2xl p-6"
          style={{ background: '#0f1923', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400 shrink-0">
              <Shield size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Change Role</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Update role for <span className="text-white font-semibold">{user?.name}</span>:
          </p>
          <div className="space-y-2 mb-5">
            {[
              { value: 'Admin',   desc: 'Full system access including settings and user management' },
              { value: 'Analyst', desc: 'Can view and analyze crime data, cannot manage users' },
              { value: 'Viewer',  desc: 'Read-only access to public crime reports' },
            ].map(({ value, desc }) => (
              <button key={value} onClick={() => setRole(value)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${role === value ? 'border-neon-teal/40 bg-neon-teal/5' : 'border-white/5 bg-white/3 hover:bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${ROLE_BADGE[value].split(' ')[0]}`}>{value}</span>
                  {role === value && <span className="w-2 h-2 rounded-full bg-neon-teal" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">
              Cancel
            </button>
            <button onClick={() => { onConfirm(role); onClose(); }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-teal text-deep-navy font-bold text-sm hover:bg-white transition-colors">
              <Save size={14} /> Update Role
            </button>
          </div>
        </motion.div>
      </Overlay>
    </AnimatePresence>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const UserManagement = () => {
  const [users, setUsers]           = useState(initialUsers);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [openMenu, setOpenMenu]     = useState(null);

  // Modal states
  const [userModalOpen, setUserModalOpen]   = useState(false);
  const [editTarget, setEditTarget]         = useState(null);
  const [suspendTarget, setSuspendTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [roleTarget, setRoleTarget]         = useState(null);

  // Lock body scroll when any modal is open
  React.useEffect(() => {
    const anyOpen = userModalOpen || !!suspendTarget || !!deleteTarget || !!roleTarget;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [userModalOpen, suspendTarget, deleteTarget, roleTarget]);

  const filtered = users.filter(u =>
    (filter === 'All' || u.status === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Handlers
  const handleAddOrEdit = (form) => {
    if (form.id) {
      setUsers(us => us.map(u => u.id === form.id ? { ...u, name: form.name, email: form.email, role: form.role } : u));
    } else {
      setUsers(us => [...us, { ...form, id: Date.now() }]);
    }
  };

  const handleSuspend = () => {
    setUsers(us => us.map(u => u.id === suspendTarget.id
      ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u));
    setSuspendTarget(null);
  };

  const handleDelete = () => {
    setUsers(us => us.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleRoleChange = (newRole) => {
    setUsers(us => us.map(u => u.id === roleTarget.id ? { ...u, role: newRole } : u));
  };

  const openEdit = (user) => { setEditTarget(user); setUserModalOpen(true); setOpenMenu(null); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage accounts, roles and access permissions</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setUserModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-teal text-deep-navy font-bold text-sm hover:bg-white transition-colors shadow-[0_0_20px_rgba(20,241,217,0.3)] w-fit"
        >
          <User size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length,                                   icon: User,      color: 'text-blue-400' },
          { label: 'Active',      value: users.filter(u => u.status === 'Active').length,    icon: UserCheck, color: 'text-safe'    },
          { label: 'Suspended',   value: users.filter(u => u.status === 'Suspended').length, icon: UserX,     color: 'text-danger'  },
          { label: 'Admins',      value: users.filter(u => u.role === 'Admin').length,       icon: Shield,    color: 'text-warning' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-xl font-bold text-white">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Panel */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-white/5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-teal/50" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-500" />
            {['All', 'Active', 'Suspended', 'Inactive'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-neon-teal/15 text-neon-teal border border-neon-teal/30' : 'text-gray-400 hover:text-white border border-transparent hover:bg-white/5'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Role', 'Status', 'Joined', 'Last Seen', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(user => (
                <motion.tr key={user.id} layout className="hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-teal/30 to-blue-600/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_BADGE[user.role]}`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${STATUS_BADGE[user.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-safe animate-pulse' : user.status === 'Suspended' ? 'bg-danger' : 'bg-gray-500'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={12} />{user.joined}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{user.lastSeen}</td>
                  <td className="px-5 py-4 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                    <AnimatePresence>
                      {openMenu === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-6 top-10 z-20 w-44 rounded-xl border border-white/10 shadow-xl py-1 overflow-hidden"
                          style={{ background: '#0f1923' }}
                        >
                          {/* Edit */}
                          <button onClick={() => openEdit(user)}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            ✏️ Edit User
                          </button>
                          {/* Change Role */}
                          <button onClick={() => { setRoleTarget(user); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            🛡️ Change Role
                          </button>
                          {/* Suspend / Unsuspend */}
                          <button onClick={() => { setSuspendTarget(user); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-warning hover:bg-warning/5 transition-colors">
                            {user.status === 'Suspended' ? '✅ Unsuspend' : '⏸️ Suspend'}
                          </button>
                          <div className="my-1 border-t border-white/5" />
                          {/* Delete */}
                          <button onClick={() => { setDeleteTarget(user); setOpenMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-danger hover:bg-danger/5 transition-colors">
                            🗑️ Delete User
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-14 text-gray-500">
              <User size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users match your search</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* ── Modals ── */}
      <UserModal
        open={userModalOpen}
        onClose={() => { setUserModalOpen(false); setEditTarget(null); }}
        onSave={handleAddOrEdit}
        editUser={editTarget}
      />
      <SuspendModal
        open={!!suspendTarget}
        user={suspendTarget}
        onConfirm={handleSuspend}
        onClose={() => setSuspendTarget(null)}
      />
      <DeleteModal
        open={!!deleteTarget}
        user={deleteTarget}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <RoleModal
        open={!!roleTarget}
        user={roleTarget}
        onConfirm={handleRoleChange}
        onClose={() => setRoleTarget(null)}
      />
    </div>
  );
};

export default UserManagement;