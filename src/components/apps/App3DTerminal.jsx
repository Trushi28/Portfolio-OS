import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Html, Float, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Scanline, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import { CYBER_COLORS } from '../three/ThreeBackground';

// ========================================
// 💾 HOLOGRAPHIC TERMINAL SCREEN
// ========================================
const HoloScreen = ({ history, input, cwd }) => {
    const screenRef = useRef();

    useFrame((state) => {
        if (screenRef.current) {
            // Subtle floating animation
            screenRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            screenRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
        }
    });

    return (
        <group ref={screenRef}>
            {/* Main holographic screen */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[14, 10]} />
                <meshBasicMaterial
                    color={CYBER_COLORS.darker}
                    transparent
                    opacity={0.85}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Glowing border */}
            <lineSegments position={[0, 0, 0.01]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(14, 10)]} />
                <lineBasicMaterial color={CYBER_COLORS.primary} linewidth={2} />
            </lineSegments>

            {/* Corner decorations */}
            {[[-7, 5], [7, 5], [-7, -5], [7, -5]].map(([x, y], i) => (
                <group key={i} position={[x, y, 0.02]}>
                    <mesh>
                        <boxGeometry args={[0.5, 0.1, 0.01]} />
                        <meshBasicMaterial color={CYBER_COLORS.secondary} />
                    </mesh>
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.5, 0.1, 0.01]} />
                        <meshBasicMaterial color={CYBER_COLORS.secondary} />
                    </mesh>
                </group>
            ))}

            {/* Terminal header */}
            <Html position={[0, 4.5, 0.1]} center style={{ width: '550px' }}>
                <div style={{
                    background: `linear-gradient(90deg, ${CYBER_COLORS.primary}30, transparent, ${CYBER_COLORS.secondary}30)`,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '12px',
                }}>
                    <span style={{ color: CYBER_COLORS.primary }}>◈ NEXUS SHELL v3.0</span>
                    <span style={{ color: '#666' }}>HOLOGRAPHIC MODE</span>
                </div>
            </Html>

            {/* Terminal content */}
            <Html position={[-6.5, 3.5, 0.1]} style={{ width: '520px', height: '350px' }}>
                <div style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '13px',
                    color: CYBER_COLORS.green,
                    height: '350px',
                    overflowY: 'auto',
                    padding: '10px',
                }}>
                    {history.map((line, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: '4px',
                                textShadow: `0 0 5px ${CYBER_COLORS.green}`,
                            }}
                            dangerouslySetInnerHTML={{ __html: line }}
                        />
                    ))}
                    <div style={{
                        display: 'flex',
                        color: '#fff',
                        marginTop: '8px',
                    }}>
                        <span style={{ color: CYBER_COLORS.primary, marginRight: '8px' }}>
                            user@nexus:/{cwd.join('/')}$
                        </span>
                        <span style={{
                            borderRight: '2px solid ' + CYBER_COLORS.primary,
                            animation: 'blink 1s step-end infinite',
                            paddingRight: '2px',
                        }}>
                            {input}
                        </span>
                    </div>
                </div>
                <style>{`
          @keyframes blink {
            50% { border-color: transparent; }
          }
        `}</style>
            </Html>
        </group>
    );
};

// ========================================
// ✨ FLOATING DATA PARTICLES
// ========================================
const DataParticles = ({ count = 50 }) => {
    const groupRef = useRef();

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 15,
            z: (Math.random() - 0.5) * 5,
            speed: Math.random() * 0.5 + 0.2,
            char: Math.random() > 0.5 ? '0' : '1',
        }));
    }, [count]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <Float key={i} speed={p.speed} rotationIntensity={0} floatIntensity={0.5}>
                    <Text
                        position={[p.x, p.y, p.z]}
                        fontSize={0.15}
                        color={CYBER_COLORS.primary}
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.3}
                    >
                        {p.char}
                    </Text>
                </Float>
            ))}
        </group>
    );
};

// ========================================
// 🔮 HOLOGRAPHIC PROJECTOR BASE
// ========================================
const ProjectorBase = () => {
    const baseRef = useRef();

    useFrame((state) => {
        if (baseRef.current) {
            baseRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group position={[0, -6, 0]}>
            {/* Base platform */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[3, 4, 0.5, 32]} />
                <meshStandardMaterial
                    color="#111"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>

            {/* Glowing ring */}
            <mesh ref={baseRef} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.1, 16, 64]} />
                <meshBasicMaterial color={CYBER_COLORS.primary} />
            </mesh>

            {/* Projection beam */}
            <mesh position={[0, 3, 0]}>
                <cylinderGeometry args={[0.5, 3, 6, 32, 1, true]} />
                <meshBasicMaterial
                    color={CYBER_COLORS.primary}
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

// ========================================
// 🖥️ MAIN 3D TERMINAL APP
// ========================================
const App3DTerminal = ({ onLaunch }) => {
    const [history, setHistory] = useState([
        '<span style="color: #00f3ff">╔════════════════════════════════════════════════╗</span>',
        '<span style="color: #00f3ff">║</span>  NEXUS HOLOGRAPHIC SHELL v3.0                  <span style="color: #00f3ff">║</span>',
        '<span style="color: #00f3ff">║</span>  <span style="color: #888">Neural Interface: ACTIVE</span>                      <span style="color: #00f3ff">║</span>',
        '<span style="color: #00f3ff">╚════════════════════════════════════════════════╝</span>',
        '',
        'Type <span style="color: #ff00ff">help</span> for available commands.',
    ]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState(['home', 'user']);
    const inputRef = useRef();

    const handleCmd = (cmd) => {
        const parts = cmd.trim().split(' ');
        const command = parts[0].toLowerCase();
        let newHistory = [...history, `<span style="color: #4361ee">user@nexus:/${cwd.join('/')}$</span> ${cmd}`];

        switch (command) {
            case 'help':
                newHistory.push(
                    '<span style="color: #ff00ff">Available Commands:</span>',
                    '  <span style="color: #00f3ff">ls</span>        - List directory contents',
                    '  <span style="color: #00f3ff">cd</span>        - Change directory',
                    '  <span style="color: #00f3ff">clear</span>     - Clear terminal',
                    '  <span style="color: #00f3ff">whoami</span>    - Display user info',
                    '  <span style="color: #00f3ff">skills</span>    - Launch Skills Orbit',
                    '  <span style="color: #00f3ff">matrix</span>    - Enter the matrix',
                    '  <span style="color: #00f3ff">neofetch</span>  - System information',
                );
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'whoami':
                newHistory.push(
                    '<span style="color: #00f3ff">┌──────────────────────────────┐</span>',
                    '<span style="color: #00f3ff">│</span> <span style="color: #ff00ff">BETHU TRUSHI</span>                <span style="color: #00f3ff">│</span>',
                    '<span style="color: #00f3ff">│</span> Computer Science Student     <span style="color: #00f3ff">│</span>',
                    '<span style="color: #00f3ff">│</span> Systems Programmer           <span style="color: #00f3ff">│</span>',
                    '<span style="color: #00f3ff">└──────────────────────────────┘</span>',
                );
                break;
            case 'skills':
                newHistory.push('<span style="color: #39ff14">▸ Launching Skills Orbit...</span>');
                onLaunch?.('skills');
                break;
            case 'matrix':
                newHistory.push('<span style="color: #39ff14">Wake up, Neo...</span>');
                newHistory.push('<span style="color: #39ff14">The Matrix has you...</span>');
                break;
            case 'neofetch':
                newHistory.push(
                    '<span style="color: #ff00ff">        ▄▄▄▄▄▄▄▄▄▄▄</span>        <span style="color: #00f3ff">user</span>@<span style="color: #ff00ff">nexus</span>',
                    '<span style="color: #ff00ff">       █           █</span>       ──────────────',
                    '<span style="color: #ff00ff">       █  ▀▀▀▀▀▀▀  █</span>       <span style="color: #00f3ff">OS:</span> NEXUS Hypervisor',
                    '<span style="color: #ff00ff">       █  █     █  █</span>       <span style="color: #00f3ff">Kernel:</span> 6.0-cyber',
                    '<span style="color: #ff00ff">       █  ▀▀▀▀▀▀▀  █</span>       <span style="color: #00f3ff">Uptime:</span> ∞',
                    '<span style="color: #ff00ff">       █           █</span>       <span style="color: #00f3ff">Shell:</span> nexus-shell',
                    '<span style="color: #ff00ff">        ▀▀▀▀▀▀▀▀▀▀▀</span>        <span style="color: #00f3ff">CPU:</span> Neural Core',
                );
                break;
            case 'ls':
                newHistory.push('<span style="color: #4361ee">projects/</span>  <span style="color: #4361ee">documents/</span>  resume.pdf  skills.dat');
                break;
            case 'cd': {
                const target = parts[1];

                if (!target) {
                    newHistory.push('<span style="color:#ff3366">cd: missing operand</span>');
                    break;
                }

                if (target === '..') {
                    if (cwd.length > 1) {
                        setCwd(cwd.slice(0, -1));
                    }
                    break;
                }

                // Allowed directories shown by "ls"
                const validDirs = ['projects', 'documents'];

                if (validDirs.includes(target)) {
                    setCwd([...cwd, target]);
                } else {
                    newHistory.push(`<span style="color:#ff3366">cd: ${target}: No such directory</span>`);
                }
                break;
            }
            default:
                newHistory.push(`<span style="color: #ff3366">bash: ${command}: command not found</span>`);
        }

        setHistory(newHistory);
        setInput('');
    };

    return (
        <div
            style={{ width: '100%', height: '100%', background: '#050508' }}
            onClick={() => inputRef.current?.focus()}
        >
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <color attach="background" args={['#050508']} />
                <fog attach="fog" args={['#050508', 15, 40]} />

                <ambientLight intensity={0.1} />
                <pointLight position={[0, 5, 10]} intensity={0.8} color={CYBER_COLORS.primary} />
                <pointLight position={[0, -5, 5]} intensity={0.4} color={CYBER_COLORS.secondary} />

                <Suspense fallback={null}>
                    <HoloScreen history={history} input={input} cwd={cwd} />
                    <DataParticles count={40} />
                    <ProjectorBase />
                </Suspense>

                <EffectComposer>
                    <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
                    <Scanline density={1.2} opacity={0.1} />
                </EffectComposer>
            </Canvas>

            {/* Hidden input for keyboard capture */}
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCmd(input);
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                }}
                autoFocus
            />
        </div>
    );
};

export default App3DTerminal;
