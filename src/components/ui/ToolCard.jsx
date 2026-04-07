import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToolCard = ({ icon: Icon, name, description, path, color = 'var(--accent)' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="text-left rounded-xl p-5 flex flex-col gap-4 group w-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 44, height: 44, background: 'rgba(38, 204, 194, 0.08)', border: '1px solid rgba(38, 204, 194, 0.3)' }}
      >
        <Icon size={20} color="#26CCC2" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
          {name}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
      <div
        className="flex items-center gap-1.5 text-xs font-medium transition-all duration-150 opacity-0 group-hover:opacity-100"
        style={{ color: 'var(--accent)' }}
      >
        Open tool <ArrowRight size={12} />
      </div>
    </button>
  );
};

export default ToolCard;
