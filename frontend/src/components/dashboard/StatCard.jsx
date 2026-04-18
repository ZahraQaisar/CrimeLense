import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = 'teal', delay = 0 }) => {
    const isPositive = trend === 'up';

    // Vivid brand palette
    const palette = {
        teal:    { hex: '#00d4aa', rgb: '0,212,170' },
        blue:    { hex: '#0ea5e9', rgb: '14,165,233' },
        warning: { hex: '#0ea5e9', rgb: '14,165,233' },
        danger:  { hex: '#ef4444', rgb: '239,68,68' },
        purple:  { hex: '#a78bfa', rgb: '167,139,250' },
    };
    const p = palette[color] || palette.teal;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="p-6 rounded-2xl relative overflow-hidden group transition-all duration-300"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--card-shadow)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = `rgba(${p.rgb},0.30)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{title}</h3>
                    <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</div>
                </div>
                {Icon && (
                    <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" style={{
                        color: p.hex,
                        background: `rgba(${p.rgb},0.12)`,
                        border: `1px solid rgba(${p.rgb},0.22)`,
                    }}>
                        <Icon size={24} />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 font-semibold"
                    style={{ color: isPositive ? '#00d4aa' : '#ef4444' }}>
                    {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {trendValue}
                </span>
                <span style={{ color: 'var(--text-faint)' }}>vs last week</span>
            </div>

            {/* Soft corner accent glow */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-15 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: p.hex, filter: 'blur(32px)' }} />
        </motion.div>
    );
};

export default StatCard;
