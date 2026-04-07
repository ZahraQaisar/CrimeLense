import React from 'react';

const dotColors = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--accent)',
};

const AlertItem = ({ level = 'medium', title, meta, timestamp }) => {
  const dot = dotColors[level] || dotColors.medium;

  return (
    <div
      className="flex items-start gap-3 py-3 transition-all duration-150"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="mt-1.5 shrink-0">
        <div className="rounded-full" style={{ width: 7, height: 7, background: dot }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{title}</p>
        {meta && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{meta}</p>}
      </div>
      <span className="text-xs shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }}>{timestamp}</span>
    </div>
  );
};

export default AlertItem;
