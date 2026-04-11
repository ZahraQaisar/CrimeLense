import React from 'react';

/**
 * AmbientBackground — responds to [data-theme="light"] / [data-theme="dark"]
 * via CSS so it always matches the active theme without any JS state.
 */
const AmbientBackground = () => (
    <>
        {/* Fixed base layer — colour set by CSS theme classes */}
        <div
            aria-hidden="true"
            className="cl-ambient-bg"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
        >
            {/* Orb 1 — top-left */}
            <div className="cl-orb cl-orb-1" />
            {/* Orb 2 — right */}
            <div className="cl-orb cl-orb-2" />
            {/* Orb 3 — bottom */}
            <div className="cl-orb cl-orb-3" />
            {/* Dot grid */}
            <div className="cl-dot-grid" />
            {/* Edge vignette */}
            <div className="cl-vignette" />
        </div>

        <style>{`
            /* ── Dark (default) ── */
            .cl-ambient-bg {
                background: #0b0e14;
            }
            .cl-orb {
                position: absolute;
                border-radius: 50%;
            }
            .cl-orb-1 {
                top: -12%; left: -10%;
                width: 700px; height: 700px;
                background: radial-gradient(circle, rgba(0,212,170,0.18) 0%, transparent 70%);
                animation: cl-orb 22s ease-in-out infinite alternate;
            }
            .cl-orb-2 {
                top: 35%; right: -12%;
                width: 600px; height: 600px;
                background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
                animation: cl-orb 28s ease-in-out -9s infinite alternate;
            }
            .cl-orb-3 {
                bottom: -10%; left: 30%;
                width: 550px; height: 550px;
                background: radial-gradient(circle, rgba(255,60,100,0.12) 0%, transparent 70%);
                animation: cl-orb 25s ease-in-out -5s infinite alternate;
            }
            .cl-dot-grid {
                position: absolute;
                inset: 0;
                background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
                background-size: 38px 38px;
            }
            .cl-vignette {
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(11,14,20,0.75) 100%);
            }

            /* ── Light override ── */
            [data-theme="light"] .cl-ambient-bg {
                background: #eef3f9;
            }
            [data-theme="light"] .cl-orb-1 {
                background: radial-gradient(circle, rgba(0,158,128,0.12) 0%, transparent 70%);
            }
            [data-theme="light"] .cl-orb-2 {
                background: radial-gradient(circle, rgba(26,104,212,0.10) 0%, transparent 70%);
            }
            [data-theme="light"] .cl-orb-3 {
                background: radial-gradient(circle, rgba(208,40,74,0.07) 0%, transparent 70%);
            }
            [data-theme="light"] .cl-dot-grid {
                background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
                background-size: 38px 38px;
            }
            [data-theme="light"] .cl-vignette {
                background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(220,228,240,0.6) 100%);
            }

            @keyframes cl-orb {
                0%   { transform: translate(0px,   0px)  scale(1);    }
                30%  { transform: translate(50px, -35px) scale(1.08); }
                65%  { transform: translate(-30px, 45px) scale(0.94); }
                100% { transform: translate(20px, -15px) scale(1.04); }
            }
        `}</style>
    </>
);

export default AmbientBackground;
