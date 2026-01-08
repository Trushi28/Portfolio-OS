import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Html, Float, Sphere, Box, Cylinder, Plane,
    PointerLockControls, Sky, Stars, Text, Billboard
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CYBER_COLORS } from '../three/ThreeBackground';

// Project data for landmarks
const PROJECT_LANDMARKS = [
    {
        id: 'portfolio',
        name: 'Portfolio OS',
        category: 'React',
        description: 'Interactive 3D portfolio simulating an operating system',
        position: [0, 0, 0],
        color: CYBER_COLORS.primary,
        size: 'large',
        github: 'https://github.com/Trushi28/Portfolio-OS',
    },
    {
        id: 'http-server',
        name: 'HTTP Server',
        category: 'C',
        description: 'Basic web server with socket programming',
        position: [40, 0, 30],
        color: '#f59e0b',
        size: 'medium',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
    },
    {
        id: 'compilers',
        name: 'Compiler Labs',
        category: 'Compilers',
        description: 'ZenLang & Flux - Custom programming languages',
        position: [-50, 0, 40],
        color: '#8b5cf6',
        size: 'large',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Compiler',
    },
    {
        id: 'ascii-game',
        name: 'ASCII Game',
        category: 'Electron',
        description: 'Cyberpunk hacking simulator with retro aesthetics',
        position: [60, 0, -30],
        color: '#00ff88',
        size: 'medium',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Electron',
    },
    {
        id: 'neowm',
        name: 'NeoWM Desktop',
        category: 'Electron',
        description: 'Complete desktop environment simulation',
        position: [-40, 0, -50],
        color: CYBER_COLORS.secondary,
        size: 'large',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Electron',
    },
    {
        id: 'cosmic-drift',
        name: 'Cosmic Drift',
        category: 'Python',
        description: 'Multiplayer space racing with real-time networking',
        position: [30, 0, -60],
        color: '#a855f7',
        size: 'medium',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Python',
    },
    {
        id: 'dungeon-crawler',
        name: 'Dungeon Crawler',
        category: 'Python',
        description: 'Procedurally generated roguelike adventure',
        position: [-60, 0, 10],
        color: '#ef4444',
        size: 'medium',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Python',
    },
    {
        id: 'ecoscan',
        name: 'EcoScan',
        category: 'React',
        description: 'Sustainability checker with eco-score visualization',
        position: [0, 0, 70],
        color: '#22c55e',
        size: 'medium',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/React/Eco-App',
    },
    {
        id: 'gtk-demo',
        name: 'GTK Demo',
        category: 'C',
        description: 'Desktop GUI application development',
        position: [-30, 0, -30],
        color: '#f97316',
        size: 'small',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
    },
];

// ========================================
// 🏙️ CYBERPUNK BUILDING
// ========================================
const CyberBuilding = ({ position, height, width, color }) => {
    const meshRef = useRef();
    const [windowFlicker] = useState(() => Math.random() * 2);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle building sway
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1 + position[0]) * 0.01;
        }
    });

    const windowRows = Math.floor(height / 3);
    const windowCols = Math.floor(width / 2);

    return (
        <group position={position}>
            {/* Building body */}
            <mesh ref={meshRef} position={[0, height / 2, 0]}>
                <boxGeometry args={[width, height, width * 0.8]} />
                <meshStandardMaterial
                    color="#0a0a15"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Neon edge lighting */}
            <mesh position={[0, height / 2, width * 0.41]}>
                <boxGeometry args={[width + 0.2, height, 0.1]} />
                <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>

            {/* Top accent */}
            <mesh position={[0, height + 0.5, 0]}>
                <boxGeometry args={[width + 1, 1, width * 0.8 + 1]} />
                <meshBasicMaterial color={color} opacity={0.5} transparent />
            </mesh>

            {/* Windows - simplified as emissive strips */}
            {Array.from({ length: windowRows }).map((_, row) => (
                <mesh key={row} position={[0, row * 3 + 2, width * 0.42]}>
                    <planeGeometry args={[width - 1, 1.5]} />
                    <meshBasicMaterial
                        color={row % 3 === 0 ? color : '#1a1a2e'}
                        opacity={0.8}
                        transparent
                    />
                </mesh>
            ))}
        </group>
    );
};

// ========================================
// 🎯 PROJECT LANDMARK
// ========================================
const ProjectLandmark = ({ project, onApproach, playerPosition }) => {
    const landmarkRef = useRef();
    const [isNear, setIsNear] = useState(false);
    const [hovered, setHovered] = useState(false);

    const sizeMultiplier = project.size === 'large' ? 1.5 : project.size === 'medium' ? 1 : 0.7;

    useFrame((state) => {
        if (!landmarkRef.current || !playerPosition) return;

        // Calculate distance to player
        const dx = project.position[0] - playerPosition[0];
        const dz = project.position[2] - playerPosition[2];
        const distance = Math.sqrt(dx * dx + dz * dz);

        const wasNear = isNear;
        const nowNear = distance < 20;
        setIsNear(nowNear);

        // Notify when approaching
        if (nowNear && !wasNear) {
            onApproach?.(project);
        }

        // Animate landmark
        landmarkRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
        landmarkRef.current.scale.setScalar(pulse * sizeMultiplier * (isNear ? 1.2 : 1));
    });

    return (
        <group position={project.position}>
            {/* Base platform */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[8 * sizeMultiplier, 10 * sizeMultiplier, 1, 32]} />
                <meshStandardMaterial
                    color={project.color}
                    emissive={project.color}
                    emissiveIntensity={isNear ? 0.5 : 0.2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Holographic structure */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group ref={landmarkRef} position={[0, 15 * sizeMultiplier, 0]}>
                    {/* Core shape */}
                    <mesh>
                        <octahedronGeometry args={[5 * sizeMultiplier, 0]} />
                        <meshStandardMaterial
                            color={project.color}
                            emissive={project.color}
                            emissiveIntensity={isNear ? 2 : 0.8}
                            wireframe={!isNear}
                            transparent
                            opacity={isNear ? 0.9 : 0.6}
                        />
                    </mesh>

                    {/* Inner glow */}
                    <mesh>
                        <sphereGeometry args={[3 * sizeMultiplier, 16, 16]} />
                        <meshBasicMaterial
                            color={project.color}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>

                    {/* Orbiting rings */}
                    <mesh rotation={[Math.PI / 4, 0, 0]}>
                        <torusGeometry args={[7 * sizeMultiplier, 0.2, 16, 50]} />
                        <meshBasicMaterial color={project.color} transparent opacity={0.5} />
                    </mesh>
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <torusGeometry args={[8 * sizeMultiplier, 0.15, 16, 50]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                    </mesh>
                </group>
            </Float>

            {/* Project label */}
            <Billboard position={[0, 30 * sizeMultiplier, 0]}>
                <Html center distanceFactor={50}>
                    <div style={{
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}>
                        <div style={{
                            color: project.color,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textShadow: `0 0 20px ${project.color}`,
                            marginBottom: '4px',
                        }}>
                            {project.name}
                        </div>
                        <div style={{
                            color: '#888',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                        }}>
                            {project.category}
                        </div>
                        {isNear && (
                            <div style={{
                                marginTop: '8px',
                                padding: '4px 8px',
                                background: 'rgba(0, 243, 255, 0.2)',
                                border: `1px solid ${project.color}`,
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '10px',
                            }}>
                                Press E to learn more
                            </div>
                        )}
                    </div>
                </Html>
            </Billboard>

            {/* Light beam */}
            <pointLight
                position={[0, 10, 0]}
                color={project.color}
                intensity={isNear ? 50 : 20}
                distance={40}
            />
        </group>
    );
};

// ========================================
// 🌆 CYBERPUNK CITY
// ========================================
const CyberpunkCity = () => {
    const buildings = useMemo(() => {
        const result = [];
        const gridSize = 10;
        const spacing = 25;

        for (let x = -gridSize; x <= gridSize; x++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                // Skip center area for landmarks
                if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;

                // Random chance to place building
                if (Math.random() > 0.6) continue;

                const height = Math.random() * 50 + 20;
                const width = Math.random() * 8 + 6;
                const colors = [CYBER_COLORS.primary, CYBER_COLORS.secondary, CYBER_COLORS.purple, '#ff0066'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                result.push({
                    position: [x * spacing + Math.random() * 10, 0, z * spacing + Math.random() * 10],
                    height,
                    width,
                    color,
                });
            }
        }
        return result;
    }, []);

    return (
        <group>
            {buildings.map((b, i) => (
                <CyberBuilding key={i} {...b} />
            ))}
        </group>
    );
};

// ========================================
// 🛣️ NEON ROAD GRID
// ========================================
const NeonRoads = () => {
    const gridSize = 250;
    const lines = [];

    // Create grid of roads
    for (let i = -gridSize; i <= gridSize; i += 25) {
        lines.push(
            <mesh key={`h-${i}`} position={[0, 0.1, i]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[gridSize * 2, 2]} />
                <meshBasicMaterial color={CYBER_COLORS.primary} opacity={0.1} transparent />
            </mesh>,
            <mesh key={`v-${i}`} position={[i, 0.1, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[gridSize * 2, 2]} />
                <meshBasicMaterial color={CYBER_COLORS.secondary} opacity={0.1} transparent />
            </mesh>
        );
    }

    return <group>{lines}</group>;
};

// ========================================
// 🎮 FIRST PERSON CONTROLLER
// ========================================
const FirstPersonController = ({ onPositionUpdate }) => {
    const { camera } = useThree();
    const moveSpeed = 0.5;
    const keys = useRef({});

    useEffect(() => {
        camera.position.set(0, 5, 50);

        const handleKeyDown = (e) => { keys.current[e.code] = true; };
        const handleKeyUp = (e) => { keys.current[e.code] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, (keys.current['KeyW'] ? 1 : 0) - (keys.current['KeyS'] ? 1 : 0));
        const sideVector = new THREE.Vector3((keys.current['KeyA'] ? 1 : 0) - (keys.current['KeyD'] ? 1 : 0), 0, 0);

        direction.addVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);

        if (keys.current['ShiftLeft']) {
            direction.multiplyScalar(2);
        }

        camera.translateX(-direction.x);
        camera.translateZ(-direction.z);

        // Keep at constant height
        camera.position.y = 5;

        // Report position
        onPositionUpdate?.([camera.position.x, camera.position.y, camera.position.z]);
    });

    return <PointerLockControls />;
};

// ========================================
// 📍 HUD & MINIMAP
// ========================================
const HUD = ({ activeProject, onClose, onExit }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            fontFamily: 'monospace',
            zIndex: 100,
        }}>
            {/* Title */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: CYBER_COLORS.primary,
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: `0 0 20px ${CYBER_COLORS.primary}`,
            }}>
                CYBER WORLD
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: '#666',
                fontSize: '12px',
                lineHeight: '1.8',
            }}>
                <div>WASD - Move</div>
                <div>SHIFT - Sprint</div>
                <div>E - Interact</div>
                <div style={{ marginTop: '10px', color: '#888' }}>
                    <button
                        onClick={onExit}
                        style={{
                            background: 'rgba(255, 0, 0, 0.2)',
                            border: '1px solid #f00',
                            color: '#f00',
                            padding: '8px 16px',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                        }}
                    >
                        ESC - Exit to Menu
                    </button>
                </div>
            </div>

            {/* Crosshair */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                border: `2px solid ${CYBER_COLORS.primary}`,
                borderRadius: '50%',
                opacity: 0.5,
            }} />

            {/* Project Detail Modal */}
            {activeProject && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(10, 10, 20, 0.95)',
                    border: `2px solid ${activeProject.color}`,
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '500px',
                    pointerEvents: 'auto',
                    boxShadow: `0 0 50px ${activeProject.color}50`,
                }}>
                    <div style={{
                        color: activeProject.color,
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                    }}>
                        {activeProject.name}
                    </div>
                    <div style={{
                        color: '#888',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        marginBottom: '20px',
                    }}>
                        {activeProject.category}
                    </div>
                    <div style={{
                        color: '#ccc',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                    }}>
                        {activeProject.description}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a
                            href={activeProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: `${activeProject.color}30`,
                                border: `1px solid ${activeProject.color}`,
                                borderRadius: '8px',
                                color: activeProject.color,
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            View on GitHub
                        </a>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid #666',
                                borderRadius: '8px',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Continue Exploring
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ========================================
// 🎬 MAIN CYBER WORLD SCENE
// ========================================
export default function CyberWorld({ onExit }) {
    const [playerPosition, setPlayerPosition] = useState([0, 5, 50]);
    const [activeProject, setActiveProject] = useState(null);
    const [nearbyProject, setNearbyProject] = useState(null);

    // Handle E key for interaction
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyE' && nearbyProject) {
                setActiveProject(nearbyProject);
            }
            if (e.code === 'Escape') {
                if (activeProject) {
                    setActiveProject(null);
                } else {
                    onExit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nearbyProject, activeProject, onExit]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            <Canvas camera={{ fov: 70, near: 0.1, far: 1000 }}>
                <color attach="background" args={['#050510']} />

                {/* Lighting */}
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 100, 0]} intensity={0.3} color="#ffffff" />

                {/* Fog for atmosphere */}
                <fog attach="fog" args={['#050510', 50, 300]} />

                <Suspense fallback={null}>
                    {/* Sky with stars */}
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Ground plane */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <planeGeometry args={[600, 600]} />
                        <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.1} />
                    </mesh>

                    {/* Neon road grid */}
                    <NeonRoads />

                    {/* City buildings */}
                    <CyberpunkCity />

                    {/* Project landmarks */}
                    {PROJECT_LANDMARKS.map((project) => (
                        <ProjectLandmark
                            key={project.id}
                            project={project}
                            playerPosition={playerPosition}
                            onApproach={setNearbyProject}
                        />
                    ))}

                    {/* Player controller */}
                    <FirstPersonController onPositionUpdate={setPlayerPosition} />
                </Suspense>

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
            </Canvas>

            {/* HUD Overlay */}
            <HUD
                activeProject={activeProject}
                onClose={() => setActiveProject(null)}
                onExit={onExit}
            />
        </div>
    );
}
