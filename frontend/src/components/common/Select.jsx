import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Cross-browser consistent styled select.
 * - Hides the native OS/browser dropdown arrow via appearance-none
 * - Renders a single custom ChevronDown icon at a consistent position
 * - Matches the Input component's styling (bg-white/5, border-white/10, rounded-lg, px-4 py-3)
 */
const Select = ({ label, error, icon: Icon, className, children, ...props }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-300">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        <Icon size={18} />
                    </div>
                )}
                <select
                    className={cn(
                        // Reset native arrow on all browsers
                        "appearance-none",
                        // Base styling matching Input component
                        "w-full bg-white/5 border border-white/10 rounded-lg py-3 text-white",
                        "focus:outline-none focus:border-neon-teal/50 focus:ring-1 focus:ring-neon-teal/50",
                        "transition-all duration-300 cursor-pointer",
                        // Enough right padding so text never overlaps the chevron icon
                        "pr-10",
                        // Shift text right if icon is present
                        Icon ? "pl-10" : "pl-4",
                        // Fix Firefox rendering option background
                        "[&>option]:bg-[#0e1825] [&>option]:text-white",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {/* Custom dropdown arrow — always in the same spot, same size, every browser */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
        </div>
    );
};

export default Select;
