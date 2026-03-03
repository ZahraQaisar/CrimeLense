import React from 'react';
import { motion } from 'framer-motion';

const RiskGauge = ({ score }) => {
    // score 0-100
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s < 40) return "#22C55E"; // Safe Green
        if (s < 70) return "#F59E0B"; // Warning Amber
        return "#FF4D4D"; // Danger Red
    };

    const color = getColor(score);

    return (
        <div className="relative flex items-center justify-center w-64 h-64 mx-auto">
            {/* Background Circle */}
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90 block"
            >
                <circle
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <div className="text-4xl font-bold text-white mb-1">{score}%</div>
                    <div className="text-sm font-medium uppercase tracking-wider" style={{ color }}>
                        {score < 40 ? 'Safe' : score < 70 ? 'Moderate' : 'High Risk'}
                    </div>
                </motion.div>
            </div>

            {/* Decorative Glow */}
            <div
                className="absolute inset-0 rounded-full blur-[60px] -z-10 opacity-20 transition-colors duration-500"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

export default RiskGauge;
