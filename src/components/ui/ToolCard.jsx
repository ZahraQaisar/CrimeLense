import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ToolCard = ({ icon: Icon, name, description, path, color, delay }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => navigate(path)}
      className="relative text-left rounded-[20px] p-6 flex flex-col gap-5 group w-full overflow-hidden bg-[#111928]/80 backdrop-blur-md border border-white/5"
    >
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className={`absolute -inset-10 opacity-30 blur-2xl rounded-full transition-colors`} style={{ backgroundColor: color }} />
        </div>

      <div
        className="flex items-center justify-center rounded-2xl w-14 h-14 relative z-10 transition-colors duration-300"
        style={{ backgroundColor: `${color}1A`, border: `1px solid ${color}33`, color: color }}
      >
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-white transition-colors">
          {name}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2">
          {description}
        </p>
      </div>
      <div
        className="flex items-center gap-1.5 text-xs font-bold transition-all duration-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 relative z-10 uppercase tracking-widest mt-1"
        style={{ color: color }}
      >
        Launch Tool <ArrowRight size={14} />
      </div>
    </motion.button>
  );
};

export default ToolCard;
