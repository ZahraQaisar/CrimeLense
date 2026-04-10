import React, { useEffect, useRef } from 'react';

/**
 * Full-coverage animated canvas background:
 * - Floating particles connected by lines (node network)
 * - A slow radar pulse ring emanating from center
 * - Teal / blue / red color palette to match CrimeLense brand
 */
const HeroCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let W = canvas.offsetWidth;
        let H = canvas.offsetHeight;
        canvas.width = W;
        canvas.height = H;

        // ── Resize handler ──
        const onResize = () => {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W;
            canvas.height = H;
            initParticles();
        };
        window.addEventListener('resize', onResize);

        // ── Particles ──────────────────────────────────────────────
        const PARTICLE_COUNT = Math.floor((W * H) / 10000); // density
        const MAX_DIST = 160;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const COLORS = isLight
            ? ['#009e80', '#1a68d4', '#009e80', '#009e80', '#0ea5e9']
            : ['#00d4aa', '#0ea5e9', '#00d4aa', '#00d4aa', '#0ea5e9'];
        let particles = [];

        const initParticles = () => {
            particles = Array.from({ length: Math.max(40, PARTICLE_COUNT) }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.8 + 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                opacity: isLight
                    ? Math.random() * 0.4 + 0.2
                    : Math.random() * 0.6 + 0.3,
            }));
        };
        initParticles();



        // ── Draw loop ──────────────────────────────────────────────
        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Move & draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });

            // Draw connecting lines
            ctx.globalAlpha = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * (isLight ? 0.2 : 0.35);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = a.color;
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }



            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    );
};

export default HeroCanvas;
