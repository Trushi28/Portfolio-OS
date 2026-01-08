import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, Float, Sphere, Trail, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, Scanline } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import { CYBER_COLORS, FloatingParticles, EnergyRing } from './ThreeBackground';

// ========================================
// ⚡ POWER ORB - 3D Power Button
// ========================================
const PowerOrb = ({ onClick, isActive }) => {
    const orbRef = useRef();
    const ringsRef = useRef([]);
    const [hovered, setHovered] = useState(false);
    const [pulseIntensity, setPulseIntensity] = useState(0);

    useFrame((state) => {
        if (!orbRef.current) return;

        // Pulse effect
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
        orbRef.current.scale.setScalar(pulse * (hovered ? 1.2 : 1));

        // Rotate rings
        ringsRef.current.forEach((ring, i) => {
            if (ring) {
                ring.rotation.x = state.clock.elapsedTime * (0.5 + i * 0.2);
                ring.rotation.y = state.clock.elapsedTime * (0.3 + i * 0.1);
            }
        });

        // Glow intensity
        if (hovered) {
            setPulseIntensity(Math.sin(state.clock.elapsedTime * 5) * 0.3 + 0.7);
        }
    });

    return (
        <group>
            {/* Central Orb */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh
                    ref={orbRef}
                    onClick={onClick}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    style={{ cursor: 'pointer' }}
                >
                    <sphereGeometry args={[1.5, 64, 64]} />
                    <meshStandardMaterial
                        color={CYBER_COLORS.primary}
                        emissive={CYBER_COLORS.primary}
                        emissiveIntensity={hovered ? 2 + pulseIntensity : 0.8}
                        transparent
                        opacity={0.9}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
            </Float>

            {/* Power Symbol */}
            <mesh position={[0, 0, 1.6]}>
                <ringGeometry args={[0.3, 0.4, 32, 1, 0, Math.PI * 1.5]} />
                <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.5, 1.6]}>
                <boxGeometry args={[0.1, 0.5, 0.05]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Orbiting Energy Rings */}
            {[2.5, 3, 3.5].map((radius, i) => (
                <mesh key={i} ref={(el) => (ringsRef.current[i] = el)}>
                    <torusGeometry args={[radius, 0.02, 16, 100]} />
                    <meshBasicMaterial
                        color={i === 0 ? CYBER_COLORS.primary : i === 1 ? CYBER_COLORS.secondary : CYBER_COLORS.purple}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}

            {/* Particles */}
            <FloatingParticles count={200} color={CYBER_COLORS.primary} speed={0.3} spread={15} />
        </group>
    );
};

// ========================================
// 💾 BIOS TEXT - Matrix-style falling characters
// ========================================
const MatrixRain = ({ count = 100 }) => {
    const groupRef = useRef();
    const chars = useMemo(() => {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        return Array.from({ length: count }, () => ({
            char: characters[Math.floor(Math.random() * characters.length)],
            x: (Math.random() - 0.5) * 30,
            y: Math.random() * 20 - 10,
            z: (Math.random() - 0.5) * 10,
            speed: Math.random() * 0.1 + 0.05,
            opacity: Math.random() * 0.5 + 0.5,
        }));
    }, [count]);

    const [positions, setPositions] = useState(chars);

    useFrame(() => {
        setPositions((prev) =>
            prev.map((char) => ({
                ...char,
                y: char.y - char.speed,
                ...(char.y < -10 && { y: 10, char: '01アイウエオカキクケコ'[Math.floor(Math.random() * 20)] }),
            }))
        );
    });

    return (
        <group ref={groupRef}>
            {positions.map((char, i) => (
                <Html
                    key={i}
                    position={[char.x, char.y, char.z]}
                    center
                    style={{
                        color: CYBER_COLORS.green,
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        opacity: char.opacity,
                        textShadow: `0 0 10px ${CYBER_COLORS.green}`,
                        userSelect: 'none',
                    }}
                >
                    {char.char}
                </Html>
            ))}
        </group>
    );
};

// ========================================
// 🔲 BIOS SCREEN - Floating terminal with system info
// ========================================
const BiosScreen = ({ memoryProgress, onComplete }) => {
    const screenRef = useRef();

    useFrame((state) => {
        if (screenRef.current) {
            screenRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={screenRef}>
            {/* Main Screen */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[12, 8]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.95} />
            </mesh>

            {/* Screen border */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[12.2, 8.2]} />
                <meshBasicMaterial color={CYBER_COLORS.primary} transparent opacity={0.3} />
            </mesh>

            {/* Content */}
            <Html position={[-5.5, 3.5, 0.1]} style={{ width: '500px' }}>
                <div style={{
                    fontFamily: '"Fira Code", monospace',
                    color: CYBER_COLORS.green,
                    textShadow: `0 0 10px ${CYBER_COLORS.green}`,
                    fontSize: '14px',
                    lineHeight: '1.6',
                }}>
                    <div style={{ color: CYBER_COLORS.primary, marginBottom: '20px' }}>
                        ╔════════════════════════════════════════════╗<br />
                        ║  NEXUS HYPERVISOR BIOS v4.0 Rev 6.1       ║<br />
                        ╚════════════════════════════════════════════╝
                    </div>
                    <div>▸ CPU: AMD Ryzen 9 7950X @ 5.7GHz</div>
                    <div>▸ GPU: NVIDIA RTX 4090 24GB GDDR6X</div>
                    <div>▸ RAM: {Math.floor(memoryProgress / 1000)}GB / 64GB DDR5-6000</div>
                    <div style={{ marginTop: '15px' }}>
                        <div style={{ color: CYBER_COLORS.primary }}>Memory Test:</div>
                        <div style={{
                            background: '#111',
                            border: `1px solid ${CYBER_COLORS.primary}`,
                            height: '20px',
                            width: '300px',
                            marginTop: '5px',
                        }}>
                            <div style={{
                                background: `linear-gradient(90deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.secondary})`,
                                height: '100%',
                                width: `${(memoryProgress / 64000) * 100}%`,
                                transition: 'width 0.1s',
                                boxShadow: `0 0 10px ${CYBER_COLORS.primary}`,
                            }} />
                        </div>
                        <div style={{ marginTop: '5px' }}>{memoryProgress}KB / 64000KB</div>
                    </div>
                    <div style={{ marginTop: '20px', color: CYBER_COLORS.secondary }}>
                        ▸ Initializing Neural Interface...
                    </div>
                </div>
            </Html>

            {/* Decorative elements */}
            <EnergyRing radius={6} color={CYBER_COLORS.primary} speed={0.5} />
        </group>
    );
};

// ========================================
// 🎲 GRUB SELECTOR - 3D Cube Selection
// ========================================
const GrubCube = ({ position, label, isSelected, onClick }) => {
    const cubeRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!cubeRef.current) return;
        cubeRef.current.rotation.x = state.clock.elapsedTime * 0.5;
        cubeRef.current.rotation.y = state.clock.elapsedTime * 0.3;

        const targetScale = isSelected || hovered ? 1.3 : 1;
        cubeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group position={position}>
            <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
                <mesh
                    ref={cubeRef}
                    onClick={onClick}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                >
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial
                        color={isSelected ? CYBER_COLORS.primary : CYBER_COLORS.purple}
                        emissive={isSelected ? CYBER_COLORS.primary : CYBER_COLORS.purple}
                        emissiveIntensity={isSelected || hovered ? 1 : 0.3}
                        wireframe={!isSelected}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </Float>

            {/* Label */}
            <Html position={[0, -2, 0]} center>
                <div style={{
                    color: isSelected ? CYBER_COLORS.primary : '#888',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    textShadow: isSelected ? `0 0 20px ${CYBER_COLORS.primary}` : 'none',
                    whiteSpace: 'nowrap',
                    padding: '5px 15px',
                    background: isSelected ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                    border: isSelected ? `1px solid ${CYBER_COLORS.primary}` : '1px solid transparent',
                    transition: 'all 0.3s',
                }}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

const GrubSelector = ({ onSelect }) => {
    const [selected, setSelected] = useState(0);
    const options = [
        { label: '▸ NEXUS OS', id: 'desktop', desc: 'Full Desktop Experience' },
        { label: '▸ CYBER WORLD', id: 'cyberworld', desc: 'Explore Projects in 3D' },
        { label: '▸ RESUME', id: 'resume', desc: 'View Resume' },
    ];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setSelected((prev) => (prev - 1 + options.length) % options.length);
            } else if (e.key === 'ArrowRight') {
                setSelected((prev) => (prev + 1) % options.length);
            } else if (e.key === 'Enter') {
                onSelect(options[selected].id);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selected, onSelect]);

    return (
        <group>
            {/* Title */}
            <Html position={[0, 5, 0]} center>
                <div style={{
                    textAlign: 'center',
                    fontFamily: 'monospace',
                }}>
                    <div style={{
                        color: CYBER_COLORS.primary,
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textShadow: `0 0 30px ${CYBER_COLORS.primary}`,
                        marginBottom: '10px',
                    }}>
                        NEXUS BOOTLOADER 3.0
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        Use ← → to navigate • Enter to boot
                    </div>
                </div>
            </Html>

            {/* Boot options as cubes */}
            {options.map((opt, i) => (
                <GrubCube
                    key={opt.id}
                    position={[(i - 1) * 5, 0, 0]}
                    label={opt.label}
                    description={opt.desc}
                    isSelected={selected === i}
                    onClick={() => {
                        setSelected(i);
                    }}
                />
            ))}

            {/* Boot button */}
            <Html position={[0, -4, 0]} center>
                <button
                    onClick={() => onSelect(options[selected].id)}
                    style={{
                        background: `linear-gradient(135deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.secondary})`,
                        border: 'none',
                        padding: '12px 40px',
                        color: '#000',
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        boxShadow: `0 0 30px ${CYBER_COLORS.primary}`,
                        transition: 'all 0.3s',
                    }}
                >
                    ▸ INITIALIZE {options[selected].id.toUpperCase()}
                </button>
            </Html>

            {/* Background particles */}
            <FloatingParticles count={300} color={CYBER_COLORS.secondary} speed={0.1} spread={50} />
        </group>
    );
};

// ========================================
// 🎬 BOOT 3D SCENES - Main Export
// ========================================
export const PowerScene = ({ onPowerOn }) => {
    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <color attach="background" args={[CYBER_COLORS.darker]} />
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} intensity={1} color={CYBER_COLORS.primary} />
            <pointLight position={[-5, -5, 5]} intensity={0.5} color={CYBER_COLORS.secondary} />

            <Suspense fallback={null}>
                <PowerOrb onClick={onPowerOn} />
            </Suspense>

            <EffectComposer>
                <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
            </EffectComposer>
        </Canvas>
    );
};

export const BiosScene = ({ memoryProgress, onComplete }) => {
    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            <color attach="background" args={[CYBER_COLORS.darker]} />
            <ambientLight intensity={0.2} />

            <Suspense fallback={null}>
                <MatrixRain count={80} />
                <BiosScreen memoryProgress={memoryProgress} />
            </Suspense>

            <EffectComposer>
                <Bloom intensity={0.8} luminanceThreshold={0.2} />
                <Scanline density={1.5} />
            </EffectComposer>
        </Canvas>
    );
};

export const GrubScene = ({ onSelect }) => {
    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            <color attach="background" args={[CYBER_COLORS.darker]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 5]} intensity={1} color={CYBER_COLORS.primary} />

            <Suspense fallback={null}>
                <GrubSelector onSelect={onSelect} />
            </Suspense>

            <EffectComposer>
                <Bloom intensity={1} luminanceThreshold={0.15} />
            </EffectComposer>
        </Canvas>
    );
};

export default { PowerScene, BiosScene, GrubScene };
