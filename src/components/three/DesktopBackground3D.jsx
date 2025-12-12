import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Trail, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CYBER_COLORS } from './ThreeBackground';

// ========================================
// 🌊 WAVE MESH - Aurora-like effect
// ========================================
const WaveMesh = ({ color = CYBER_COLORS.purple, position = [0, -15, -20] }) => {
    const meshRef = useRef();
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(100, 40, 64, 32);
        return geo;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const positions = meshRef.current.geometry.attributes.position.array;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 3;
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <mesh ref={meshRef} geometry={geometry} position={position} rotation={[-Math.PI / 4, 0, 0]}>
            <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// ========================================
// 💫 ORBITING LIGHT TRAILS
// ========================================
const OrbitingLight = ({ radius = 30, speed = 0.2, color = CYBER_COLORS.primary, offset = 0 }) => {
    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * speed + offset;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
        ref.current.position.y = Math.sin(t * 2) * 5;
    });

    return (
        <Trail
            width={1}
            length={15}
            color={color}
            attenuation={(t) => t * t}
        >
            <mesh ref={ref}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </Trail>
    );
};

// ========================================
// 🔷 FLOATING WIREFRAME SHAPES
// ========================================
const FloatingWireframes = () => {
    const shapes = useMemo(() => [
        { type: 'dodecahedron', pos: [-25, 10, -30], scale: 3, color: CYBER_COLORS.primary, speed: 0.3 },
        { type: 'icosahedron', pos: [30, -5, -25], scale: 4, color: CYBER_COLORS.secondary, speed: 0.2 },
        { type: 'octahedron', pos: [-15, -10, -35], scale: 2.5, color: CYBER_COLORS.purple, speed: 0.4 },
        { type: 'torusKnot', pos: [20, 15, -40], scale: 2, color: CYBER_COLORS.accent, speed: 0.25 },
        { type: 'torus', pos: [0, 20, -30], scale: 3, color: CYBER_COLORS.blue, speed: 0.35 },
    ], []);

    return (
        <group>
            {shapes.map((shape, i) => (
                <FloatingShape key={i} {...shape} />
            ))}
        </group>
    );
};

const FloatingShape = ({ type, pos, scale, color, speed }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
        meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
        meshRef.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * speed) * 2;
    });

    const geometryComponent = useMemo(() => {
        switch (type) {
            case 'dodecahedron': return <dodecahedronGeometry args={[1]} />;
            case 'icosahedron': return <icosahedronGeometry args={[1]} />;
            case 'octahedron': return <octahedronGeometry args={[1]} />;
            case 'torusKnot': return <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />;
            case 'torus': return <torusGeometry args={[1, 0.3, 16, 32]} />;
            default: return <boxGeometry args={[1, 1, 1]} />;
        }
    }, [type]);

    return (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <mesh ref={meshRef} position={pos} scale={scale}>
                {geometryComponent}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.4}
                    wireframe
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </Float>
    );
};

// ========================================
// ✨ PARTICLE NEBULA
// ========================================
const ParticleNebula = ({ count = 1000 }) => {
    const pointsRef = useRef();
    const { mouse } = useThree();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const colorPalette = [
            new THREE.Color(CYBER_COLORS.primary),
            new THREE.Color(CYBER_COLORS.secondary),
            new THREE.Color(CYBER_COLORS.purple),
            new THREE.Color(CYBER_COLORS.accent),
        ];

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 30 + Math.random() * 40;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi) - 30;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return { positions, colors };
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 + mouse.x * 0.3;
        pointsRef.current.rotation.x = mouse.y * 0.2;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={particles.positions}
                    count={count}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    array={particles.colors}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// ========================================
// 🎨 DESKTOP BACKGROUND 3D - Main Export
// ========================================
export const DesktopBackground3D = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                <color attach="background" args={[CYBER_COLORS.darker]} />
                <fog attach="fog" args={[CYBER_COLORS.darker, 20, 100]} />
                <ambientLight intensity={0.1} />
                <pointLight position={[20, 20, 20]} intensity={0.5} color={CYBER_COLORS.primary} />
                <pointLight position={[-20, -20, 20]} intensity={0.3} color={CYBER_COLORS.secondary} />

                <Suspense fallback={null}>
                    {/* Star field */}
                    <Stars
                        radius={100}
                        depth={80}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={0.5}
                    />

                    {/* Particle nebula with mouse interaction */}
                    <ParticleNebula count={1500} />

                    {/* Floating geometric shapes */}
                    <FloatingWireframes />

                    {/* Aurora wave effect */}
                    <WaveMesh color={CYBER_COLORS.primary} position={[0, -25, -30]} />
                    <WaveMesh color={CYBER_COLORS.secondary} position={[0, -30, -35]} />

                    {/* Orbiting light trails */}
                    <OrbitingLight radius={35} speed={0.15} color={CYBER_COLORS.primary} offset={0} />
                    <OrbitingLight radius={40} speed={0.1} color={CYBER_COLORS.secondary} offset={Math.PI} />
                    <OrbitingLight radius={30} speed={0.2} color={CYBER_COLORS.purple} offset={Math.PI / 2} />
                </Suspense>

                <EffectComposer>
                    <Bloom
                        intensity={0.6}
                        luminanceThreshold={0.1}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                    <Vignette eskil={false} offset={0.2} darkness={0.8} />
                    <Noise opacity={0.02} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default DesktopBackground3D;
