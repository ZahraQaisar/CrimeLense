import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = "neon-teal", delay = 0 }) => {
    const isPositive = trend === 'up';

    const colorMap = {
        "neon-teal": "text-neon-teal bg-neon-teal/10 border-neon-teal/20",
        "danger": "text-danger bg-danger/10 border-danger/20",
        "warning": "text-warning bg-warning/10 border-warning/20",
        "blue": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    };

    const bgMap = {
        "neon-teal": "bg-neon-teal",
        "danger": "bg-danger",
        "warning": "bg-warning",
        "blue": "bg-blue-500",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                </div>
                {Icon && (
                    <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", colorMap[color] || colorMap['neon-teal'])}>
                        <Icon size={24} />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className={cn(
                    "flex items-center gap-1 font-semibold",
                    isPositive ? "text-safe" : "text-danger"
                )}>
                    {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {trendValue}
                </span>
                <span className="text-gray-500">vs last week</span>
            </div>

            {/* Background decoration with pulsing glow */}
            <div className={cn(
                "absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500",
                bgMap[color] || bgMap['neon-teal']
            )} />
        </motion.div>
    );
};

export default StatCard;
