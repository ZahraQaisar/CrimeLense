import React, { useEffect, useRef } from 'react';

const CyberCoreCanvas = () => {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let t = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const drawRings = (cx, cy) => {
            // Base aesthetic variables
            const baseRadius = 240;

            // Ring 1 (Outer dashed boundary)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(t * 0.05);
            ctx.beginPath();
            ctx.arc(0, 0, baseRadius + 40, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 12]);
            ctx.stroke();
            ctx.restore();

            // Ring 2 (Thick static glow ring)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.beginPath();
            ctx.arc(0, 0, baseRadius + 20, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(74, 158, 255, 0.1)';
            ctx.lineWidth = 15;
            ctx.setLineDash([]);
            ctx.stroke();

            // Neon accents on Ring 2
            ctx.rotate(-t * 0.1);
            ctx.beginPath();
            ctx.arc(0, 0, baseRadius + 20, 0, Math.PI * 0.3);
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.5)';
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, baseRadius + 20, Math.PI, Math.PI * 1.3);
            ctx.strokeStyle = 'rgba(74, 158, 255, 0.5)';
            ctx.stroke();
            ctx.restore();

            // Ring 3 (Inner complex arc segments)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(t * 0.15);
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, baseRadius, (i * Math.PI) / 3, (i * Math.PI) / 3 + 0.5);
                ctx.strokeStyle = 'rgba(0, 212, 170, 0.4)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            ctx.restore();

            // Ring 4 (Data track)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-t * 0.08);
            ctx.beginPath();
            ctx.arc(0, 0, baseRadius - 30, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 40;
            ctx.stroke();

            // Active tracking blip
            ctx.rotate(t * 0.5);
            ctx.fillStyle = 'rgba(0, 212, 170, 0.8)';
            ctx.fillRect(baseRadius - 45, -5, 30, 10);
            ctx.restore();

            // Central Core
            ctx.save();
            ctx.translate(cx, cy);

            // Core hexagonal boundary
            ctx.rotate(t * 0.02);
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x = (baseRadius - 80) * Math.cos(angle);
                const y = (baseRadius - 80) * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(74, 158, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pulsing center dot
            const pulse = (Math.sin(t * 0.5) + 1) / 2;
            ctx.beginPath();
            ctx.arc(0, 0, 15 + pulse * 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 170, ${0.2 + pulse * 0.3})`;
            ctx.fill();

            // Core rings
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(74, 158, 255, 0.3)`;
            ctx.setLineDash([2, 6]);
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        };

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            t += 0.05;

            // Center position (slightly offset to visual center left)
            const cx = W * 0.5;
            const cy = H * 0.5;

            // Draw target reticles
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(W, cy);
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, H);
            ctx.stroke();

            drawRings(cx, cy);

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.85 }} />;
}

export default CyberCoreCanvas;
