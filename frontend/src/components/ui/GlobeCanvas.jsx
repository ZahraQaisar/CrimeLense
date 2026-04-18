import React, { useEffect, useRef } from 'react';

const GlobeCanvas = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let rotationX = 0;
        let rotationY = 0;

        // Generate sphere nodes
        const nodes = [];
        const numNodes = 250; // density
        for (let i = 0; i < numNodes; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / numNodes);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const r = 180; // smaller globe radius as requested
            nodes.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
            });
        }

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const CX = W / 2;
            const CY = H / 2;

            ctx.clearRect(0, 0, W, H);

            rotationY += 0.004; // rotate
            rotationX += 0.001; // tilt

            const cosX = Math.cos(rotationX);
            const sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);

            const projected = nodes.map(node => {
                const y1 = node.y * cosX - node.z * sinX;
                const z1 = node.y * sinX + node.z * cosX;
                const x2 = node.x * cosY + z1 * sinY;
                const z2 = -node.x * sinY + z1 * cosY;

                const distance = 800; // perspective
                const scale = distance / (distance - z2);

                return {
                    x: CX + x2 * scale,
                    y: CY + y1 * scale,
                    z: z2,
                    scale: scale
                };
            });

            projected.sort((a, b) => a.z - b.z);

            ctx.strokeStyle = 'rgba(0, 212, 170, 0.15)';
            for (let i = 0; i < projected.length; i++) {
                if (projected[i].z < -50) continue;

                for (let j = i + 1; j < projected.length; j++) {
                    const dx = projected[i].x - projected[j].x;
                    const dy = projected[i].y - projected[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 40 * projected[i].scale) {
                        ctx.beginPath();
                        ctx.moveTo(projected[i].x, projected[i].y);
                        ctx.lineTo(projected[j].x, projected[j].y);
                        ctx.stroke();
                    }
                }
            }

            projected.forEach((p, idx) => {
                const opacity = (p.z + 180) / 360;
                const clampedOpacity = Math.max(0.1, Math.min(1, opacity));

                const isBlue = idx % 5 === 0;
                ctx.fillStyle = isBlue
                    ? `rgba(74, 158, 255, ${clampedOpacity * 1.5})`
                    : `rgba(0, 212, 170, ${clampedOpacity})`;

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, 2 * p.scale), 0, Math.PI * 2);
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default GlobeCanvas;
