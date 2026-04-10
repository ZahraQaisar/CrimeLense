import React, { useEffect, useRef } from 'react';

const CompareBar = ({ label, score, color }) => {
  const barRef = useRef(null);
  const autoColor = score >= 70 ? 'var(--danger)' : score >= 35 ? '#0ea5e9' : 'var(--accent)';
  const barColor = color || autoColor;

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transition = 'width 0.8s ease-out';
      barRef.current.style.width = `${score}%`;
    }
  }, [score]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-right shrink-0" style={{ width: 80, color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 10, background: 'var(--border-subtle)' }}>
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{ width: '0%', background: barColor }}
        />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ width: 30, color: barColor, fontFamily: "'Space Grotesk', sans-serif" }}>
        {score}
      </span>
    </div>
  );
};

export default CompareBar;
