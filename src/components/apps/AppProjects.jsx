import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, ExternalLink, Github,
    Code, Database, Globe, Cpu, Leaf, Terminal
} from 'lucide-react';
import { CYBER_COLORS } from '../three/ThreeBackground';

const PROJECTS_DATA = [
    {
        id: 1,
        name: 'EcoScan',
        description: 'Sustainability checker web app with eco-score visualization and Open Food Facts API integration',
        tech: ['React', 'Node.js', 'API Integration', 'TypeScript'],
        category: 'web',
        icon: Leaf,
        color: '#10b981',
        github: 'https://github.com',
        demo: null,
        features: ['Eco-score calculator', 'Product search', 'Sustainability metrics', 'API integration'],
    },
    {
        id: 2,
        name: 'NexusOS',
        description: 'Custom operating system built from scratch in Rust with VFS, scheduler, and usermode support',
        tech: ['Rust', 'Assembly', 'OS Dev', 'Low-level'],
        category: 'systems',
        icon: Cpu,
        color: CYBER_COLORS.primary,
        github: 'https://github.com',
        demo: null,
        features: ['Custom kernel', 'Virtual filesystem', 'Process scheduler', 'Ring 3 usermode'],
    },
    {
        id: 3,
        name: 'C Algorithms Library',
        description: 'Custom memory allocators and data structures (Linked Lists, Trees, Hash Tables) built from scratch',
        tech: ['C', 'Data Structures', 'Algorithms', 'Memory Management'],
        category: 'systems',
        icon: Database,
        color: '#f59e0b',
        github: 'https://github.com',
        demo: null,
        features: ['Custom allocator', 'Linked lists', 'Binary trees', 'Hash tables'],
    },
    {
        id: 4,
        name: 'Toy Compiler',
        description: 'Educational compiler with lexical analyzer, parser, and intermediate code generation',
        tech: ['C++', 'Compiler Design', 'Parsing', 'Code Generation'],
        category: 'systems',
        icon: Code,
        color: '#8b5cf6',
        github: 'https://github.com',
        demo: null,
        features: ['Lexical analysis', 'Syntax parsing', 'IR generation', 'Error handling'],
    },
    {
        id: 5,
        name: 'Portfolio OS',
        description: 'Interactive 3D portfolio website simulating an operating system with boot sequence and apps',
        tech: ['React', 'Three.js', 'Framer Motion', 'WebGL'],
        category: 'web',
        icon: Globe,
        color: CYBER_COLORS.secondary,
        github: 'https://github.com',
        demo: 'https://example.com',
        features: ['3D graphics', 'Boot sequence', 'Window manager', 'Mini applications'],
    },
];

const TECH_FILTERS = ['All', 'React', 'Rust', 'C', 'C++', 'Node.js', 'TypeScript', 'WebGL'];

const ProjectCard = ({ project }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all"
        >
            {/* Card Header */}
            <div className="p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                                background: `${project.color}20`,
                                border: `2px solid ${project.color}`,
                            }}
                        >
                            <project.icon size={24} style={{ color: project.color }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{project.name}</h3>
                            <span className="text-xs text-gray-400 uppercase">{project.category}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded text-xs font-mono hover:bg-white/20 transition-colors"
                    >
                        {expanded ? 'COLLAPSE' : 'EXPAND'}
                    </button>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>
            </div>

            {/* Tech Stack */}
            <div className="p-4 flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                    <span
                        key={i}
                        className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs font-mono text-cyan-400"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            <div>
                                <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase">Key Features</h4>
                                <ul className="space-y-1">
                                    {project.features.map((feature, i) => (
                                        <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex gap-2 pt-2">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:border-cyan-400 transition-colors text-sm font-mono"
                                    >
                                        <Github size={16} />
                                        GitHub
                                    </a>
                                )}
                                {project.demo && (
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm font-mono text-cyan-400"
                                    >
                                        <ExternalLink size={16} />
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function AppProjects() {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredProjects = PROJECTS_DATA.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'All' || project.tech.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 p-4">
                <h1 className="text-2xl font-black mb-4" style={{ color: CYBER_COLORS.primary }}>
                    PROJECT SHOWCASE
                </h1>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {TECH_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all ${activeFilter === filter
                                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </AnimatePresence>
                {filteredProjects.length === 0 && (
                    <div className="col-span-2 text-center py-20 text-gray-500">
                        <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No projects found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
