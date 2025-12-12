import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html, Float, Trail, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CYBER_COLORS } from '../three/ThreeBackground';

// Resume data reference
const SKILLS_DATA = {
    languages: {
        name: 'Languages',
        color: CYBER_COLORS.primary,
        skills: ['C', 'C++', 'Rust', 'Python', 'Java', 'Assembly', 'Lua'],
        orbitRadius: 6,
    },
    web: {
        name: 'Web Tech',
        color: CYBER_COLORS.secondary,
        skills: ['ReactJS', 'Node.js', 'ExpressJS', 'TypeScript', 'HTML/CSS'],
        orbitRadius: 9,
    },
    tools: {
        name: 'Tools',
        color: CYBER_COLORS.purple,
        skills: ['Git', 'Electron.js', 'PostgreSQL', 'Supabase', 'Axios'],
        orbitRadius: 12,
    },
};

// ========================================
// 🌍 SKILL PLANET
// ========================================
const SkillPlanet = ({ name, position, color, size = 0.4, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;

        const targetScale = hovered ? 1.5 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
                <mesh
                    ref={meshRef}
                    onClick={onClick}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                >
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 1.5 : 0.5}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </mesh>

                {/* Glow ring on hover */}
                {hovered && (
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[size * 1.5, 0.02, 16, 32]} />
                        <meshBasicMaterial color={color} transparent opacity={0.8} />
                    </mesh>
                )}
            </Float>

            {/* Label */}
            <Html position={[0, size + 0.5, 0]} center distanceFactor={10}>
                <div style={{
                    color: hovered ? color : '#888',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '11px',
                    fontWeight: hovered ? 'bold' : 'normal',
                    textShadow: hovered ? `0 0 10px ${color}` : 'none',
                    whiteSpace: 'nowrap',
                    padding: '2px 8px',
                    background: hovered ? 'rgba(0,0,0,0.7)' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
                }}>
                    {name}
                </div>
            </Html>
        </group>
    );
};

// ========================================
// 🪐 ORBIT RING
// ========================================
const OrbitRing = ({ radius, color, speed, children }) => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * speed;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ring path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 16, 100]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
            {children}
        </group>
    );
};

// ========================================
// ☀️ CENTRAL SUN (Core)
// ========================================
const CoreSun = () => {
    const sunRef = useRef();
    const coronaRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            sunRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
        if (coronaRef.current) {
            coronaRef.current.rotation.z = state.clock.elapsedTime * 0.1;
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            coronaRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            {/* Core sphere */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color={CYBER_COLORS.orange}
                    emissive={CYBER_COLORS.orange}
                    emissiveIntensity={2}
                    roughness={0.2}
                    metalness={0.5}
                />
            </mesh>

            {/* Corona rings */}
            <mesh ref={coronaRef}>
                <torusGeometry args={[2.5, 0.05, 16, 100]} />
                <meshBasicMaterial color={CYBER_COLORS.primary} transparent opacity={0.6} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[2.8, 0.03, 16, 100]} />
                <meshBasicMaterial color={CYBER_COLORS.secondary} transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
                <torusGeometry args={[3.1, 0.02, 16, 100]} />
                <meshBasicMaterial color={CYBER_COLORS.purple} transparent opacity={0.3} />
            </mesh>

            {/* Label */}
            <Html position={[0, 3.5, 0]} center>
                <div style={{
                    color: CYBER_COLORS.orange,
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textShadow: `0 0 20px ${CYBER_COLORS.orange}`,
                }}>
                    CORE SKILLS
                </div>
            </Html>
        </group>
    );
};

// ========================================
// 📊 SKILL INFO PANEL
// ========================================
const SkillInfoPanel = ({ skill, category, onClose }) => {
    if (!skill) return null;

    const categoryData = SKILLS_DATA[category];

    return (
        <Html position={[0, 0, 15]} center>
            <div style={{
                background: 'rgba(5, 5, 10, 0.95)',
                border: `2px solid ${categoryData.color}`,
                borderRadius: '12px',
                padding: '24px',
                minWidth: '280px',
                fontFamily: '"Fira Code", monospace',
                boxShadow: `0 0 40px ${categoryData.color}40`,
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                }}>
                    <span style={{
                        color: categoryData.color,
                        fontSize: '20px',
                        fontWeight: 'bold',
                        textShadow: `0 0 10px ${categoryData.color}`,
                    }}>
                        {skill}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: `1px solid ${categoryData.color}`,
                            color: categoryData.color,
                            padding: '4px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>
                    Category: {categoryData.name}
                </div>
                <div style={{
                    background: `${categoryData.color}20`,
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#ccc',
                    fontSize: '13px',
                    lineHeight: '1.6',
                }}>
                    {skill === 'Rust' && '⚡ Systems programming with memory safety guarantees'}
                    {skill === 'C' && '🔧 Low-level systems programming & memory management'}
                    {skill === 'Python' && '🐍 Backend development, scripting & automation'}
                    {skill === 'ReactJS' && '⚛️ Modern frontend development with hooks & JSX'}
                    {skill === 'Node.js' && '🟢 Server-side JavaScript runtime'}
                    {!['Rust', 'C', 'Python', 'ReactJS', 'Node.js'].includes(skill) && `💻 Proficient in ${skill}`}
                </div>
            </div>
        </Html>
    );
};

// ========================================
// 🪐 SKILL ORBIT SYSTEM
// ========================================
const SkillOrbitSystem = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSkillClick = (skill, category) => {
        setSelectedSkill(skill);
        setSelectedCategory(category);
    };

    return (
        <group>
            {/* Central core */}
            <CoreSun />

            {/* Orbit rings with skill planets */}
            {Object.entries(SKILLS_DATA).map(([key, category]) => (
                <OrbitRing
                    key={key}
                    radius={category.orbitRadius}
                    color={category.color}
                    speed={0.1 / (category.orbitRadius / 6)}
                >
                    {/* Category label */}
                    <Html position={[0, 0.5, category.orbitRadius]} center>
                        <div style={{
                            color: category.color,
                            fontFamily: '"Fira Code", monospace',
                            fontSize: '10px',
                            opacity: 0.6,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                        }}>
                            {category.name}
                        </div>
                    </Html>

                    {/* Skill planets distributed around the orbit */}
                    {category.skills.map((skill, i) => {
                        const angle = (i / category.skills.length) * Math.PI * 2;
                        const x = Math.cos(angle) * category.orbitRadius;
                        const z = Math.sin(angle) * category.orbitRadius;

                        return (
                            <SkillPlanet
                                key={skill}
                                name={skill}
                                position={[x, 0, z]}
                                color={category.color}
                                size={0.35 + Math.random() * 0.15}
                                onClick={() => handleSkillClick(skill, key)}
                            />
                        );
                    })}
                </OrbitRing>
            ))}

            {/* Info panel for selected skill */}
            {selectedSkill && (
                <SkillInfoPanel
                    skill={selectedSkill}
                    category={selectedCategory}
                    onClose={() => setSelectedSkill(null)}
                />
            )}
        </group>
    );
};

// ========================================
// 🌌 MAIN SKILLS ORBIT APP
// ========================================
const AppSkillsOrbit = () => {
    return (
        <div style={{ width: '100%', height: '100%', background: CYBER_COLORS.darker }}>
            <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
                <color attach="background" args={[CYBER_COLORS.darker]} />
                <fog attach="fog" args={[CYBER_COLORS.darker, 30, 80]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[0, 0, 0]} intensity={2} color={CYBER_COLORS.orange} />
                <pointLight position={[20, 10, 10]} intensity={0.5} color={CYBER_COLORS.primary} />
                <pointLight position={[-20, -10, 10]} intensity={0.3} color={CYBER_COLORS.secondary} />

                <Suspense fallback={null}>
                    <SkillOrbitSystem />
                </Suspense>

                {/* Orbit controls for user interaction */}
                <OrbitControls
                    enablePan={false}
                    minDistance={15}
                    maxDistance={50}
                    minPolarAngle={0.3}
                    maxPolarAngle={Math.PI / 2}
                    autoRotate
                    autoRotateSpeed={0.5}
                />

                <EffectComposer>
                    <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
                    <Vignette eskil={false} offset={0.2} darkness={0.7} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#fff',
                fontFamily: '"Fira Code", monospace',
                zIndex: 10,
            }}>
                <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    background: `linear-gradient(90deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Skills Orbit
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                    🖱️ Drag to rotate • Scroll to zoom • Click skill for details
                </div>
            </div>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontFamily: '"Fira Code", monospace',
                fontSize: '11px',
                zIndex: 10,
            }}>
                {Object.entries(SKILLS_DATA).map(([key, cat]) => (
                    <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px',
                        color: cat.color,
                    }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: cat.color,
                            boxShadow: `0 0 10px ${cat.color}`,
                        }} />
                        {cat.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppSkillsOrbit;
