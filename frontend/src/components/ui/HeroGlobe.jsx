import React from 'react';

/* Animated Radar Globe — pure SVG + CSS, no external deps */
const HeroGlobe = () => (
    <div style={{ position: 'relative', width: 420, height: 420, flexShrink: 0 }}>
        <style>{`
            @keyframes radar-sweep {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }
            @keyframes ping-dot {
                0%, 100% { opacity: 1; r: 4px; }
                50%       { opacity: 0.3; r: 7px; }
            }
            @keyframes float-globe {
                0%   { transform: translateY(0px); }
                50%  { transform: translateY(-14px); }
                100% { transform: translateY(0px); }
            }
            @keyframes pulse-ring {
                0%   { stroke-opacity: 0.5; }
                50%  { stroke-opacity: 0.15; }
                100% { stroke-opacity: 0.5; }
            }
            .globe-wrap {
                animation: float-globe 6s ease-in-out infinite;
            }
            .radar-arm {
                transform-origin: 210px 210px;
                animation: radar-sweep 4s linear infinite;
            }
            .pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
            .pulse-ring-2 { animation: pulse-ring 3s ease-in-out -1.5s infinite; }
            .dot-a { animation: ping-dot 2s ease-in-out infinite; }
            .dot-b { animation: ping-dot 2s ease-in-out -0.7s infinite; }
            .dot-c { animation: ping-dot 2s ease-in-out -1.3s infinite; }
        `}</style>

        <svg
            viewBox="0 0 420 420"
            width="420"
            height="420"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Defs: sweep gradient */}
            <defs>
                <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%">
                    <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#0b0e14" stopOpacity="0" />
                </radialGradient>
                <clipPath id="circleClip">
                    <circle cx="210" cy="210" r="155" />
                </clipPath>
            </defs>

            {/* Glow backdrop */}
            <circle cx="210" cy="210" r="180" fill="url(#bgGrad)" />

            <g className="globe-wrap">
                {/* === Outer rings === */}
                <circle cx="210" cy="210" r="160" fill="none" stroke="#00d4aa" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 4" className="pulse-ring" />
                <circle cx="210" cy="210" r="130" fill="none" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.15" className="pulse-ring-2" />
                <circle cx="210" cy="210" r="100" fill="none" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.15" className="pulse-ring" />
                <circle cx="210" cy="210" r="70" fill="none" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.2" className="pulse-ring-2" />

                {/* === Globe wireframe === */}
                <circle cx="210" cy="210" r="155" fill="none" stroke="#00d4aa" strokeWidth="1.2" strokeOpacity="0.3" />

                {/* Latitude lines */}
                {[-90, -60, -30, 0, 30, 60, 90].map((lat, i) => {
                    const y = 210 + (lat / 90) * 130;
                    const halfW = Math.sqrt(Math.max(0, 155 * 155 - ((y - 210) ** 2)));
                    return halfW > 5
                        ? <ellipse key={i} cx="210" cy={y} rx={halfW} ry={halfW * 0.25} fill="none" stroke="#00d4aa" strokeWidth="0.6" strokeOpacity="0.2" />
                        : null;
                })}

                {/* Longitude lines */}
                {[0, 30, 60, 90, 120, 150].map((angle, i) => (
                    <ellipse
                        key={i}
                        cx="210"
                        cy="210"
                        rx={155 * Math.abs(Math.cos((angle * Math.PI) / 180)) + 8}
                        ry="155"
                        fill="none"
                        stroke="#00d4aa"
                        strokeWidth="0.6"
                        strokeOpacity="0.15"
                        transform={`rotate(${angle}, 210, 210)`}
                    />
                ))}

                {/* === Radar sweep === */}
                <g className="radar-arm" clipPath="url(#circleClip)">
                    <path
                        d="M 210 210 L 210 55"
                        stroke="#00d4aa"
                        strokeWidth="1.5"
                        strokeOpacity="0.9"
                    />
                    {/* Sweep wedge */}
                    <path
                        d={`M 210 210 L ${210 + 155 * Math.sin(-40 * Math.PI / 180)} ${210 - 155 * Math.cos(-40 * Math.PI / 180)} A 155 155 0 0 1 210 55 Z`}
                        fill="url(#sweepGrad)"
                    />
                </g>

                {/* === Pulsing location dots === */}
                {/* Dot A */}
                <circle className="dot-a" cx="258" cy="155" r="4" fill="#00d4aa" fillOpacity="0.9" />
                <circle cx="258" cy="155" r="10" fill="none" stroke="#00d4aa" strokeWidth="1" strokeOpacity="0.3" className="dot-a" />

                {/* Dot B */}
                <circle className="dot-b" cx="175" cy="235" r="4" fill="#0ea5e9" fillOpacity="0.9" />
                <circle cx="175" cy="235" r="10" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.3" className="dot-b" />

                {/* Dot C */}
                <circle className="dot-c" cx="230" cy="270" r="4" fill="#ff4f6a" fillOpacity="0.9" />
                <circle cx="230" cy="270" r="10" fill="none" stroke="#ff4f6a" strokeWidth="1" strokeOpacity="0.3" className="dot-c" />

                {/* Connection lines between dots */}
                <line x1="258" y1="155" x2="175" y2="235" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 3" />
                <line x1="175" y1="235" x2="230" y2="270" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 3" />
                <line x1="258" y1="155" x2="230" y2="270" stroke="#ff4f6a" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 3" />

                {/* Center dot */}
                <circle cx="210" cy="210" r="4" fill="#00d4aa" fillOpacity="0.8" />
                <circle cx="210" cy="210" r="8" fill="none" stroke="#00d4aa" strokeWidth="1" strokeOpacity="0.4" />
            </g>
        </svg>
    </div>
);

export default HeroGlobe;
