import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.96;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

export default function ParticleCursor() {
    const canvasRef = useRef(null);
    const { particlesEnabled } = useSettingsStore();
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);

    useEffect(() => {
        if (!particlesEnabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Colors for particles (cyberpunk theme)
        const colors = ['#00f3ff', '#bf00ff', '#00ff88', '#ff0088', '#ffffff'];

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;

            // Add particles on mouse move
            for (let i = 0; i < 2; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                particlesRef.current.push(new Particle(e.clientX, e.clientY, color));
            }

            // Limit particles
            if (particlesRef.current.length > 100) {
                particlesRef.current = particlesRef.current.slice(-100);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.update();
                if (particle.life > 0 && particle.size > 0.1) {
                    particle.draw(ctx);
                    return true;
                }
                return false;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, [particlesEnabled]);

    if (!particlesEnabled) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1000]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}

// Toggle button for particles
export function ParticlesToggle() {
    const { particlesEnabled, setParticlesEnabled } = useSettingsStore();

    return (
        <button
            onClick={() => setParticlesEnabled(!particlesEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${particlesEnabled
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                    : 'bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20'
                }`}
        >
            {particlesEnabled ? '✦ PARTICLES ON' : '✧ PARTICLES OFF'}
        </button>
    );
}
