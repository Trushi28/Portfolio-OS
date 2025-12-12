import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Trail, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ========================================
// 🎨 CYBERPUNK COLOR PALETTE
// ========================================
export const CYBER_COLORS = {
    primary: '#00f3ff',      // Cyan neon
    secondary: '#ff00ff',    // Magenta
    accent: '#ff3366',       // Hot pink
    purple: '#9d4edd',       // Electric purple
    blue: '#4361ee',         // Electric blue
    green: '#39ff14',        // Matrix green
    orange: '#ff6b35',       // Neon orange
    dark: '#0a0a0f',         // Deep space
    darker: '#050508',       // Void black
};

// ========================================
// ✨ FLOATING PARTICLES COMPONENT
// ========================================
export const FloatingParticles = ({ count = 500, color = CYBER_COLORS.primary, speed = 0.2, spread = 50 }) => {
    const mesh = useRef();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
            scales[i] = Math.random() * 0.5 + 0.1;
            speeds[i] = Math.random() * speed + 0.1;
        }
        return { positions, scales, speeds };
    }, [count, spread, speed]);

    useFrame((state) => {
        if (!mesh.current) return;
        const positions = mesh.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] += particles.speeds[i] * 0.02;
            if (positions[i * 3 + 1] > spread / 2) {
                positions[i * 3 + 1] = -spread / 2;
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={particles.positions}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color={color}
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// ========================================
// 🔷 FLOATING GEOMETRY SHAPES
// ========================================
export const FloatingShape = ({ position, geometry, color, speed = 1, scale = 1 }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    });

    const geometryComponent = useMemo(() => {
        switch (geometry) {
            case 'torus': return <torusGeometry args={[1, 0.3, 16, 32]} />;
            case 'octahedron': return <octahedronGeometry args={[1]} />;
            case 'icosahedron': return <icosahedronGeometry args={[1]} />;
            case 'dodecahedron': return <dodecahedronGeometry args={[1]} />;
            case 'torusKnot': return <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />;
            default: return <boxGeometry args={[1, 1, 1]} />;
        }
    }, [geometry]);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geometryComponent}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    wireframe
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
};

// ========================================
// 🌊 CYBER GRID FLOOR
// ========================================
export const CyberGrid = ({ size = 100, divisions = 50, color = CYBER_COLORS.primary }) => {
    const gridRef = useRef();

    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.elapsedTime * 2) % (size / divisions * 2);
        }
    });

    return (
        <group ref={gridRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <gridHelper args={[size, divisions, color, color]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    );
};

// ========================================
// 💫 ENERGY RING
// ========================================
export const EnergyRing = ({ radius = 3, color = CYBER_COLORS.primary, speed = 1 }) => {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * speed;
            ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
        }
    });

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
    );
};

// ========================================
// 🎆 POST-PROCESSING EFFECTS
// ========================================
export const CyberpunkEffects = ({ intensity = 1 }) => (
    <EffectComposer>
        <Bloom
            intensity={0.8 * intensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
        />
        <Vignette
            offset={0.3}
            darkness={0.7}
            eskil={false}
        />
        <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.001 * intensity, 0.001 * intensity]}
        />
    </EffectComposer>
);

// ========================================
// 🌌 NEBULA BACKGROUND
// ========================================
export const NebulaBackground = () => {
    return (
        <>
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            <FloatingParticles count={300} color={CYBER_COLORS.primary} speed={0.1} spread={80} />
            <FloatingParticles count={200} color={CYBER_COLORS.secondary} speed={0.15} spread={60} />
            <FloatingParticles count={100} color={CYBER_COLORS.purple} speed={0.08} spread={40} />
        </>
    );
};

// ========================================
// 🖥️ THREE CANVAS WRAPPER
// ========================================
export const ThreeCanvas = ({ children, effects = true, camera = { position: [0, 0, 10], fov: 75 } }) => {
    return (
        <Canvas
            camera={camera}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
            <color attach="background" args={[CYBER_COLORS.darker]} />
            <fog attach="fog" args={[CYBER_COLORS.darker, 10, 80]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color={CYBER_COLORS.primary} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color={CYBER_COLORS.secondary} />

            {children}

            {effects && <CyberpunkEffects />}
        </Canvas>
    );
};

export default ThreeCanvas;
