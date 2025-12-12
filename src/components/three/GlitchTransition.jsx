import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ========================================
// 🎆 GLITCH TRANSITION EFFECT
// ========================================

const CYBER_COLORS = {
    primary: '#00f3ff',
    secondary: '#ff00ff',
    accent: '#ff3366',
};

export const GlitchTransition = ({ isActive, onComplete, duration = 500 }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setPhase(0);
            return;
        }

        const phases = [
            setTimeout(() => setPhase(1), 0),
            setTimeout(() => setPhase(2), duration * 0.3),
            setTimeout(() => setPhase(3), duration * 0.6),
            setTimeout(() => {
                setPhase(0);
                onComplete?.();
            }, duration),
        ];

        return () => phases.forEach(clearTimeout);
    }, [isActive, duration, onComplete]);

    if (!isActive && phase === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}
            >
                {/* Scan lines */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 243, 255, 0.03) 2px,
            rgba(0, 243, 255, 0.03) 4px
          )`,
                    animation: 'scanMove 0.1s linear infinite',
                }} />

                {/* RGB Split effect */}
                {phase >= 1 && (
                    <>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: CYBER_COLORS.primary,
                            mixBlendMode: 'multiply',
                            opacity: 0.3,
                            transform: `translateX(${Math.random() * 10 - 5}px)`,
                            animation: 'glitchShift 0.05s ease infinite',
                        }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: CYBER_COLORS.secondary,
                            mixBlendMode: 'multiply',
                            opacity: 0.3,
                            transform: `translateX(${Math.random() * -10 + 5}px)`,
                            animation: 'glitchShift 0.07s ease infinite reverse',
                        }} />
                    </>
                )}

                {/* Glitch blocks */}
                {phase >= 2 && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 200 + 50}px`,
                                    height: `${Math.random() * 20 + 5}px`,
                                    background: i % 2 === 0 ? CYBER_COLORS.primary : CYBER_COLORS.secondary,
                                    opacity: 0.4,
                                    animation: `glitchBlock 0.1s ease ${i * 0.02}s infinite alternate`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Flash */}
                {phase === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'white',
                        }}
                    />
                )}

                <style>{`
          @keyframes scanMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
          }
          @keyframes glitchShift {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-3px); }
          }
          @keyframes glitchBlock {
            0% { transform: translateX(0) scaleX(1); opacity: 0.4; }
            100% { transform: translateX(${Math.random() * 20 - 10}px) scaleX(${Math.random() + 0.5}); opacity: 0.6; }
          }
        `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

// ========================================
// ⚡ CYBER LOADING SPINNER
// ========================================
export const CyberLoader = ({ size = 60 }) => (
    <div style={{
        width: size,
        height: size,
        position: 'relative',
    }}>
        {/* Outer ring */}
        <div style={{
            position: 'absolute',
            inset: 0,
            border: `2px solid ${CYBER_COLORS.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            boxShadow: `0 0 20px ${CYBER_COLORS.primary}`,
        }} />
        {/* Inner ring */}
        <div style={{
            position: 'absolute',
            inset: '20%',
            border: `2px solid ${CYBER_COLORS.secondary}`,
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite reverse',
            boxShadow: `0 0 15px ${CYBER_COLORS.secondary}`,
        }} />
        {/* Center dot */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            background: CYBER_COLORS.accent,
            borderRadius: '50%',
            animation: 'pulse 0.5s ease-in-out infinite alternate',
            boxShadow: `0 0 10px ${CYBER_COLORS.accent}`,
        }} />
        <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        from { transform: translate(-50%, -50%) scale(1); }
        to { transform: translate(-50%, -50%) scale(1.3); }
      }
    `}</style>
    </div>
);

// ========================================
// 🔲 HOLOGRAPHIC ICON EFFECT
// ========================================
export const HolographicIcon = ({ children, isActive }) => (
    <div style={{
        position: 'relative',
        transition: 'all 0.3s',
        transform: isActive ? 'translateY(-5px)' : 'none',
    }}>
        {/* Holographic glow layers */}
        {isActive && (
            <>
                <div style={{
                    position: 'absolute',
                    inset: '-10px',
                    background: `linear-gradient(135deg, ${CYBER_COLORS.primary}40, transparent, ${CYBER_COLORS.secondary}40)`,
                    borderRadius: '12px',
                    filter: 'blur(10px)',
                    animation: 'holoShift 2s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    inset: '-2px',
                    background: `linear-gradient(135deg, ${CYBER_COLORS.primary}20, ${CYBER_COLORS.secondary}20)`,
                    borderRadius: '10px',
                    animation: 'holoPulse 1s ease-in-out infinite alternate',
                }} />
            </>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
        </div>
        <style>{`
      @keyframes holoShift {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
      @keyframes holoPulse {
        from { opacity: 0.3; }
        to { opacity: 0.6; }
      }
    `}</style>
    </div>
);

// ========================================
// 📺 CRT SCREEN OVERLAY
// ========================================
export const CRTOverlay = ({ intensity = 1 }) => (
    <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
    }}>
        {/* Scanlines */}
        <div style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, ${0.1 * intensity}) 2px,
        rgba(0, 0, 0, ${0.1 * intensity}) 4px
      )`,
            animation: 'crtScan 8s linear infinite',
        }} />
        {/* Vignette */}
        <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, ${0.4 * intensity}) 100%)`,
        }} />
        {/* Subtle color shift */}
        <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, 
        rgba(255, 0, 100, ${0.02 * intensity}) 0%, 
        transparent 50%, 
        rgba(0, 255, 255, ${0.02 * intensity}) 100%
      )`,
            mixBlendMode: 'overlay',
        }} />
        <style>{`
      @keyframes crtScan {
        0% { background-position: 0 0; }
        100% { background-position: 0 100vh; }
      }
    `}</style>
    </div>
);

export default GlitchTransition;
