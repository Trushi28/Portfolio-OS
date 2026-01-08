import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, ExternalLink, Github, Star, GitFork,
    Code, Server, Gamepad2, Globe, Cpu, Leaf, Terminal, Monitor,
    Layers, Layout, Joystick, Rocket, Sword, Puzzle, Box
} from 'lucide-react';
import { CYBER_COLORS } from '../three/ThreeBackground';

const PROJECTS_DATA = [
    // === C PROJECTS ===
    {
        id: 1,
        name: 'Simple HTTP Server',
        description: 'A lightweight HTTP server built from scratch in C, handling GET/POST requests with custom routing and response handling.',
        tech: ['C', 'Networking', 'HTTP Protocol', 'Sockets'],
        category: 'systems',
        icon: Server,
        color: '#f59e0b',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
        demo: null,
        features: ['Custom HTTP parsing', 'Request routing', 'Response handling', 'Socket programming'],
        language: 'C',
    },
    {
        id: 2,
        name: 'GTK Frontend Demo',
        description: 'A graphical user interface demo application built with GTK toolkit, showcasing C GUI programming capabilities.',
        tech: ['C', 'GTK', 'GUI Programming', 'Linux'],
        category: 'desktop',
        icon: Monitor,
        color: '#10b981',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
        demo: null,
        features: ['GTK widgets', 'Event handling', 'Custom layouts', 'Native GUI'],
        language: 'C',
    },
    {
        id: 3,
        name: 'HTTP Guessing Game',
        description: 'An interactive number guessing game served over HTTP, demonstrating web server and game logic integration.',
        tech: ['C', 'HTTP', 'Game Logic', 'Web Server'],
        category: 'games',
        icon: Gamepad2,
        color: '#8b5cf6',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
        demo: null,
        features: ['HTTP-based gameplay', 'Session management', 'Score tracking', 'Interactive responses'],
        language: 'C',
    },
    {
        id: 4,
        name: 'Sliding Block Puzzle',
        description: 'Classic sliding puzzle game implemented in C with efficient algorithms for tile movement and win detection.',
        tech: ['C', 'Algorithms', 'Game Dev', 'Console UI'],
        category: 'games',
        icon: Puzzle,
        color: '#ec4899',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/C',
        demo: null,
        features: ['Puzzle logic', 'Move validation', 'Win detection', 'Terminal graphics'],
        language: 'C',
    },

    // === COMPILER PROJECTS ===
    {
        id: 5,
        name: 'ZenLang Compiler',
        description: 'A custom programming language with lexical analyzer, parser, and code generation in a Zen-inspired syntax.',
        tech: ['Compiler Design', 'Lexer', 'Parser', 'Code Gen'],
        category: 'systems',
        icon: Code,
        color: CYBER_COLORS.primary,
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Compiler',
        demo: null,
        features: ['Custom language syntax', 'Lexical analysis', 'AST generation', 'Target code output'],
        language: 'Compiler',
    },
    {
        id: 6,
        name: 'Flux Compiler',
        description: 'Experimental compiler project with focus on intermediate representation and optimization passes.',
        tech: ['Compiler Design', 'IR', 'Optimization', 'Code Gen'],
        category: 'systems',
        icon: Cpu,
        color: '#f97316',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Compiler',
        demo: null,
        features: ['IR generation', 'Optimization passes', 'Error handling', 'Multi-stage compilation'],
        language: 'Compiler',
    },

    // === ELECTRON PROJECTS ===
    {
        id: 7,
        name: 'ASCII Game',
        description: 'Cyberpunk Hack Adventure - An immersive ASCII-based adventure game with hacking mechanics and cyberpunk aesthetics.',
        tech: ['Electron', 'JavaScript', 'ASCII Art', 'Game Engine'],
        category: 'games',
        icon: Terminal,
        color: '#00ff88',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Electron',
        demo: null,
        features: ['Cyberpunk narrative', 'ASCII graphics', 'Hacking mechanics', 'Interactive story'],
        language: 'Electron',
    },
    {
        id: 8,
        name: 'Dashboard & TODO',
        description: 'Professional Productivity Suite - A sleek dashboard with task management, analytics, and productivity tracking.',
        tech: ['Electron', 'React', 'Charts', 'Local Storage'],
        category: 'desktop',
        icon: Layout,
        color: '#3b82f6',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Electron',
        demo: null,
        features: ['Task management', 'Analytics dashboard', 'Progress tracking', 'Cross-platform'],
        language: 'Electron',
    },
    {
        id: 9,
        name: 'NeoWM Desktop',
        description: 'Complete OS Environment - A full-featured desktop environment simulation with window management and system apps.',
        tech: ['Electron', 'React', 'Window Manager', 'OS Simulation'],
        category: 'desktop',
        icon: Layers,
        color: CYBER_COLORS.secondary,
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Electron',
        demo: null,
        features: ['Window management', 'Virtual filesystem', 'System apps', 'Desktop environment'],
        language: 'Electron',
    },

    // === PYTHON PROJECTS ===
    {
        id: 10,
        name: 'Cosmic Drift',
        description: 'A space-themed adventure game with procedural generation, exploration, and cosmic visuals built in Python.',
        tech: ['Python', 'Pygame', 'Procedural Gen', 'Graphics'],
        category: 'games',
        icon: Rocket,
        color: '#a855f7',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Python',
        demo: null,
        features: ['Space exploration', 'Procedural worlds', 'Particle effects', 'Cosmic soundtrack'],
        language: 'Python',
    },
    {
        id: 11,
        name: 'Dungeon Crawler',
        description: 'A roguelike dungeon crawler with procedural dungeons, combat system, and pixel art aesthetics.',
        tech: ['Python', 'Pygame', 'Roguelike', 'Procedural'],
        category: 'games',
        icon: Sword,
        color: '#ef4444',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/Python',
        demo: null,
        features: ['Procedural dungeons', 'Combat system', 'Item drops', 'Permadeath mechanics'],
        language: 'Python',
    },

    // === REACT PROJECTS ===
    {
        id: 12,
        name: 'EcoScan',
        description: 'Sustainability checker web app with eco-score visualization and Open Food Facts API integration.',
        tech: ['React', 'Node.js', 'API Integration', 'TypeScript'],
        category: 'web',
        icon: Leaf,
        color: '#22c55e',
        github: 'https://github.com/Trushi28/Hobby-Projects/tree/main/React/Eco-App',
        demo: null,
        features: ['Eco-score calculator', 'Product search', 'Sustainability metrics', 'API integration'],
        language: 'React',
    },

    // === PORTFOLIO PROJECT ===
    {
        id: 13,
        name: 'Portfolio OS',
        description: 'Interactive 3D portfolio website simulating an operating system with boot sequence, window manager, and apps.',
        tech: ['React', 'Three.js', 'Framer Motion', 'WebGL'],
        category: 'web',
        icon: Globe,
        color: CYBER_COLORS.purple,
        github: 'https://github.com/Trushi28/Portfolio-OS',
        demo: null,
        features: ['3D graphics', 'Boot sequence', 'Window manager', 'Mini applications'],
        language: 'React',
    },
];

const CATEGORY_FILTERS = [
    { key: 'all', label: 'All', icon: Box },
    { key: 'systems', label: 'Systems', icon: Cpu },
    { key: 'games', label: 'Games', icon: Gamepad2 },
    { key: 'desktop', label: 'Desktop', icon: Monitor },
    { key: 'web', label: 'Web', icon: Globe },
];

const LANGUAGE_FILTERS = ['All', 'C', 'Compiler', 'Electron', 'Python', 'React'];

const ProjectCard = ({ project, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
        >
            {/* Glow Effect */}
            <motion.div
                className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${project.color}40, transparent)` }}
            />

            <div className="relative bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-opacity-50 transition-all duration-300"
                style={{ borderColor: isHovered ? project.color : 'rgba(255,255,255,0.1)' }}
            >
                {/* Card Header */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${project.color}30, ${project.color}10)`,
                                    border: `2px solid ${project.color}`,
                                    boxShadow: isHovered ? `0 0 20px ${project.color}40` : 'none',
                                }}
                            >
                                <project.icon size={24} style={{ color: project.color }} />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{project.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
                                        style={{
                                            background: `${project.color}20`,
                                            color: project.color,
                                            border: `1px solid ${project.color}40`,
                                        }}
                                    >
                                        {project.language}
                                    </span>
                                    <span className="text-[10px] text-gray-500 uppercase">{project.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{project.description}</p>
                </div>

                {/* Tech Stack */}
                <div className="p-4 flex flex-wrap gap-1.5">
                    {project.tech.map((tech, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] font-mono text-gray-300 hover:border-cyan-400/50 hover:text-cyan-400 transition-colors cursor-default"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>

                {/* Expandable Features */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 overflow-hidden"
                        >
                            <div className="p-4 space-y-3">
                                <div>
                                    <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">Key Features</h4>
                                    <ul className="grid grid-cols-2 gap-1">
                                        {project.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full" style={{ background: project.color }} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="p-4 pt-0 flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExpanded(!expanded)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        {expanded ? '▲ COLLAPSE' : '▼ DETAILS'}
                    </motion.button>
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all"
                        style={{
                            background: `${project.color}20`,
                            border: `1px solid ${project.color}`,
                            color: project.color,
                        }}
                    >
                        <Github size={14} />
                        VIEW CODE
                    </motion.a>
                </div>

                {/* Shimmer Effect on Hover */}
                {isHovered && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${project.color}10, transparent)`,
                        }}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default function AppProjects() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeLanguage, setActiveLanguage] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const searchRef = useRef(null);

    // Focus search on mount
    useEffect(() => {
        const timer = setTimeout(() => searchRef.current?.focus(), 300);
        return () => clearTimeout(timer);
    }, []);

    const filteredProjects = PROJECTS_DATA.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase()) ||
            project.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
        const matchesLanguage = activeLanguage === 'All' || project.language === activeLanguage;
        return matchesSearch && matchesCategory && matchesLanguage;
    });

    const projectCounts = {
        all: PROJECTS_DATA.length,
        systems: PROJECTS_DATA.filter(p => p.category === 'systems').length,
        games: PROJECTS_DATA.filter(p => p.category === 'games').length,
        desktop: PROJECTS_DATA.filter(p => p.category === 'desktop').length,
        web: PROJECTS_DATA.filter(p => p.category === 'web').length,
    };

    return (
        <div className="h-full bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 text-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10">
                <div className="p-4 pb-3">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight" style={{ color: CYBER_COLORS.primary }}>
                                PROJECT SHOWCASE
                            </h1>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                                {filteredProjects.length} of {PROJECTS_DATA.length} projects
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com/Trushi28"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:border-cyan-400 transition-colors text-xs font-mono"
                            >
                                <Github size={14} />
                                @Trushi28
                            </a>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects, technologies..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 font-mono text-sm transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {CATEGORY_FILTERS.map((cat) => (
                            <motion.button
                                key={cat.key}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${activeCategory === cat.key
                                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/20'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <cat.icon size={12} />
                                {cat.label}
                                <span className="opacity-50">({projectCounts[cat.key]})</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Language Filters */}
                    <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-thin">
                        {LANGUAGE_FILTERS.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLanguage(lang)}
                                className={`px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-all ${activeLanguage === lang
                                    ? 'bg-purple-500/20 border border-purple-400 text-purple-400'
                                    : 'bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="p-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Terminal size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-500 font-mono">No projects found matching "{search}"</p>
                        <button
                            onClick={() => { setSearch(''); setActiveCategory('all'); setActiveLanguage('All'); }}
                            className="mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-mono hover:bg-white/20 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
