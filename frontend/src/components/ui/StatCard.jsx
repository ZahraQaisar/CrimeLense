import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, color, sublabel, icon: Icon }) => {
  const colorMap = {
    teal: { text: '#00D4AA', bg: 'rgba(0, 212, 170, 0.1)', border: 'rgba(0, 212, 170, 0.2)' },
    red: { text: '#FF4C4C', bg: 'rgba(255, 76, 76, 0.1)', border: 'rgba(255, 76, 76, 0.2)' },
    blue: { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
    neutral: { text: '#F3F4F6', bg: 'rgba(243, 244, 246, 0.05)', border: 'rgba(243, 244, 246, 0.1)' },
  };

  const scheme = colorMap[color] || colorMap.neutral;
  const trendValue = parseFloat(trend);
  const isPositive = trendValue > 0;
  const isNeutral = !trend || trendValue === 0;

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#111928]/80 backdrop-blur-md border border-white/5 p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 relative z-10">
            {Icon && (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: scheme.bg, border: `1px solid ${scheme.border}` }}>
                    <Icon size={20} color={scheme.text} />
                </div>
            )}
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
            </p>
        </div>

      <div className="flex items-end gap-4 relative z-10">
        <span className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
          {value}
        </span>
        {!isNeutral && (
          <div
            className="flex items-center gap-1 text-xs font-bold mb-1.5 px-2.5 py-1 rounded-md"
            style={{
              color: isPositive ? '#FF4C4C' : '#00D4AA',
              backgroundColor: isPositive ? 'rgba(255,76,76,0.1)' : 'rgba(0,212,170,0.1)',
            }}
          >
            {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
            {Math.abs(trendValue)}%
          </div>
        )}
      </div>
      {sublabel && (
        <p className="text-xs text-gray-500 mt-4 relative z-10 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: scheme.text }} />
            {sublabel}
        </p>
      )}
    </div>
  );
};

export default StatCard;
