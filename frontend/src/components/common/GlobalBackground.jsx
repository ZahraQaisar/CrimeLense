import React, { useEffect, useRef } from 'react';

/**
 * GlobalBackground
 * Renders behind all content:
 *  - Animated floating colour orbs
 *  - Subtle dot-grid overlay
 *  - Film-grain noise (SVG feTurbulence, no external image needed)
 *
 * Usage: place once near the top of a layout, before <Outlet />.
 * It is position:fixed so it doesn't affect document flow.
 */

const ORBS = [
    /* color,        size,  top,   left,  duration, delay */
    { color: '#00d4aa', size: 520, top: -10, left: -8, dur: 18, delay: 0 },
    { color: '#ff4f6a', size: 400, top: 40, left: 60, dur: 22, delay: -6 },
    { color: '#0ea5e9', size: 350, top: 70, left: -5, dur: 26, delay: -12 },
    { color: '#ffaa3b', size: 300, top: 10, left: 80, dur: 20, delay: -4 },
    { color: '#00d4aa', size: 250, top: 55, left: 45, dur: 30, delay: -9 },
];

const GlobalBackground = () => {
    return (
        <>
            {/* ── Fixed canvas behind everything ─────────────────── */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}
            >
                {/* Floating blurred colour orbs */}
                {ORBS.map((orb, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${orb.top}%`,
                            left: `${orb.left}%`,
                            width: orb.size,
                            height: orb.size,
                            borderRadius: '50%',
                            background: orb.color,
                            opacity: 0.045,
                            filter: 'blur(90px)',
                            animation: `orb-drift ${orb.dur}s ease-in-out ${orb.delay}s infinite alternate`,
                            willChange: 'transform',
                        }}
                    />
                ))}

                {/* Dot grid */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        opacity: 0.45,
                    }}
                />

                {/* Film grain via inline SVG filter */}
                <svg
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}
                >
                    <filter id="grain">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.75"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grain)" />
                </svg>

                {/* Vignette — darkens edges */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(ellipse at center, transparent 40%, rgba(11,14,20,0.75) 100%)',
                    }}
                />
            </div>

            {/* Keyframes injected once */}
            <style>{`
        @keyframes orb-drift {
          0%   { transform: translate(0px, 0px)   scale(1);    }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 25px) scale(0.97); }
          100% { transform: translate(15px, -10px) scale(1.02); }
        }
      `}</style>
        </>
    );
};

export default GlobalBackground;
