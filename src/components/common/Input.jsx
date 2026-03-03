import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ label, error, icon: Icon, rightElement, className, ...props }, ref) => {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-teal/50 focus:ring-1 focus:ring-neon-teal/50 transition-all duration-300",
                        Icon ? "pl-10" : "",
                        className
                    )}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
