import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';

export default function MatrixRain() {
    const canvasRef = useRef(null);
    const { matrixRainEnabled } = useSettingsStore();

    useEffect(() => {
        if (!matrixRainEnabled) return;

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

        // Matrix characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ァカサタナハマヤャラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユュルグズブヅプエケセテネヘメレヱゲゼデベペオコソトノホモヨョロヲゴゾドボポヴッン';
        const charArray = chars.split('');

        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = new Array(columns).fill(1);

        // Animation loop
        let animationId;
        const draw = () => {
            // Semi-transparent black to create fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Green text
            ctx.fillStyle = '#00f3ff';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = charArray[Math.floor(Math.random() * charArray.length)];

                // Random color variation
                const brightness = Math.random() > 0.95 ? '#ffffff' :
                    Math.random() > 0.7 ? '#00f3ff' : '#00f3ff50';
                ctx.fillStyle = brightness;

                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                // Reset drop randomly or when it goes off screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [matrixRainEnabled]);

    if (!matrixRainEnabled) return null;

    return (
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}

// Toggle button for Matrix Rain
export function MatrixRainToggle() {
    const { matrixRainEnabled, setMatrixRainEnabled } = useSettingsStore();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMatrixRainEnabled(!matrixRainEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${matrixRainEnabled
                    ? 'bg-green-500/20 border border-green-400 text-green-400'
                    : 'bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20'
                }`}
        >
            {matrixRainEnabled ? '◈ MATRIX ON' : '◇ MATRIX OFF'}
        </motion.button>
    );
}
