import React, { useEffect, useRef } from 'react';

const MousePulseCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        const COLORS = ['#00d4aa', '#0ea5e9', '#00d4aa', '#00d4aa', '#0ea5e9'];

        // ── Resize handler ──
        const onResize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        };
        window.addEventListener('resize', onResize);

        // ── Single Expanding Pulse ──────────────────────────────────────────────
        let pulseRings = [];
        let mouse = { x: -1000, y: -1000 };

        const spawnPulse = (x, y) => {
            // Keep strictly one circle on screen at all times per user request
            pulseRings = [{
                x,
                y,
                r: 0,
                maxR: Math.random() * 60 + 60,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }];
        };

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Only pop a new circle if the current one has finished (or if none exists)
            // This guarantees absolutely no spam and "buss aik he rakho" visually.
            if (pulseRings.length === 0) {
                spawnPulse(mouse.x, mouse.y);
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        // Also allow popping a circle on click
        const onClick = (e) => {
            spawnPulse(e.clientX, e.clientY);
        };
        window.addEventListener('click', onClick);

        // ── Draw loop ──────────────────────────────────────────────
        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            pulseRings = pulseRings.filter(ring => ring.r < ring.maxR);

            pulseRings.forEach(ring => {
                ring.r += 1.5;
                const alpha = (1 - ring.r / ring.maxR) * 0.7;
                ctx.beginPath();
                ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
                ctx.strokeStyle = ring.color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    );
};

export default MousePulseCanvas;
