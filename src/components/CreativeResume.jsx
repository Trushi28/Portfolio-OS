import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, Github, Linkedin, MapPin, Calendar, GraduationCap,
    Code2, Rocket, ArrowLeft, Download, ExternalLink, Terminal,
    Cpu, Database, Globe, Layers, Zap, Award, Briefcase, Star,
    CheckCircle, Sparkles, ChevronRight, BookOpen
} from 'lucide-react';
import { CYBER_COLORS } from './three/ThreeBackground';

// ========================================
// 📝 ACTUAL RESUME DATA FROM PDF
// ========================================
const RESUME_DATA = {
    name: "BETHU TRUSHI",
    role: "Computer Science Student | Systems Programmer | Fullstack Developer",
    contact: {
        email: "trushibethu@gmail.com",
        phone: "+91 9059165740",
        github: "Trushi28",
        linkedin: "trushi-bethu",
    },
    summary: "Innovative Computer Science student passionate about systems programming, fullstack development, and compiler design. Skilled in building robust, efficient solutions from low-level utilities to scalable fullstack apps. Proven problem-solver with strong technical expertise, seeking a challenging internship role that leverages skills for growth and innovation.",
    education: [
        {
            school: "CMR Engineering College",
            degree: "Bachelor of Technology | Computer Science and Engineering",
            grade: "CGPA: 8.55",
            year: "2023 - 2027 (Expected)",
            icon: GraduationCap,
            color: '#00f3ff',
        },
        {
            school: "Rajiv Gandhi University of Knowledge Technologies (RGUKT)",
            degree: "Intermediate | MPC",
            grade: "80%",
            year: "2021 - 2023",
            icon: BookOpen,
            color: '#bf00ff',
        },
        {
            school: "Johnson Grammar School",
            degree: "CBSE",
            grade: "80%",
            year: "2021",
            icon: Star,
            color: '#00ff88',
        },
    ],
    skills: {
        coursework: {
            title: "Coursework",
            icon: BookOpen,
            color: '#f59e0b',
            items: ["Data Structures & Algorithms", "Memory Management", "Compiler Design", "Fullstack Development"],
        },
        languages: {
            title: "Programming Languages",
            icon: Code2,
            color: '#00f3ff',
            items: ["C", "C++", "Java", "Python", "Rust", "Assembly", "C#", "Lua"],
        },
        web: {
            title: "Web Development",
            icon: Globe,
            color: '#22c55e',
            items: ["HTML", "CSS", "JavaScript", "TypeScript", "ReactJS", "ExpressJS", "NodeJS"],
        },
        database: {
            title: "Database Management",
            icon: Database,
            color: '#a855f7',
            items: ["MySQL", "PostgreSQL", "Supabase"],
        },
        tools: {
            title: "Tools & Frameworks",
            icon: Layers,
            color: '#ef4444',
            items: ["Electron.js", "Axios", "REST APIs", "Git & GitHub", "Three.js"],
        },
    },
    projects: [
        {
            name: "ECOSCAN – Product Sustainability Checker",
            tech: ["ReactJS", "Node.js", "Supabase"],
            desc: "Fullstack app enabling eco-conscious shopping with sustainability insights. Built responsive frontend with eco-score visuals (A–E rating) & persistent search history, developed Node.js backend integrating Open Food Facts API.",
            year: "2024",
            color: '#22c55e',
            icon: '🌿',
        },
        {
            name: "C Language Systems & Algorithms",
            tech: ["C", "Memory Management", "Data Structures"],
            desc: "Low-level utilities and algorithms emphasizing performance and efficiency. Created custom data structures (linked lists, stacks, trees) without libraries, built sorting/searching algorithms and custom memory allocators.",
            year: "2024",
            color: '#f59e0b',
            icon: '⚙️',
        },
        {
            name: "Custom Compiler Implementations",
            tech: ["C", "Rust", "Compiler Design"],
            desc: "Implemented lexical analyzers and parsers for toy programming languages (Flux & ZenLang). Added semantic checks, error handling, and intermediate code generation.",
            year: "2024",
            color: '#8b5cf6',
            icon: '🔬',
        },
        {
            name: "Python Utilities & Applications",
            tech: ["Python", "CLI Tools", "Automation"],
            desc: "Automated workflows with Python scripts for file management & API data processing. Built interactive CLI tools including Cosmic Drift (multiplayer space racing) and Dungeon Crawler (roguelike adventure).",
            year: "2024",
            color: '#3b82f6',
            icon: '🐍',
        },
        {
            name: "Electron.js Desktop Applications",
            tech: ["Electron.js", "JavaScript", "HTML/CSS"],
            desc: "Developed cross-platform desktop apps with persistent local storage. Including ASCII Game (cyberpunk hacking simulator), Dashboard & TODO, and NeoWM Desktop (complete desktop environment simulation).",
            year: "2024",
            color: '#06b6d4',
            icon: '🖥️',
        },
        {
            name: "Portfolio OS",
            tech: ["React", "Three.js", "Framer Motion"],
            desc: "Interactive 3D portfolio simulating an operating system with cyberpunk aesthetics. Features boot sequence, 3D terminal, project showcase, and Cyber World exploration mode.",
            year: "2024",
            color: CYBER_COLORS.primary,
            icon: '💻',
        },
    ],
    achievements: [
        "Awarded certificate for outstanding performance in the Internal Smart India Hackathon",
        "5-6 fully documented public projects hosted on GitHub with comprehensive documentation",
        "Strong foundation in low-level systems programming & modern fullstack development",
        "Self-driven learner, consistently applying knowledge to real-world solutions",
    ],
    languages: ["English", "Hindi", "Telugu"],
};

// ========================================
// ✨ ANIMATED COMPONENTS
// ========================================

// Glowing text effect
const GlowText = ({ children, color = CYBER_COLORS.primary, className = "" }) => (
    <span
        className={className}
        style={{
            color,
            textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`,
        }}
    >
        {children}
    </span>
);

// Typing effect with cursor
const TypeWriter = ({ text, delay = 30, className = "" }) => {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                // Blink cursor after typing completes
                const cursorTimer = setInterval(() => setShowCursor(s => !s), 500);
                return () => clearInterval(cursorTimer);
            }
        }, delay);
        return () => clearInterval(timer);
    }, [text, delay]);

    return (
        <span className={className}>
            {displayText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </span>
    );
};

// Skill badge with hover animation
const SkillBadge = ({ skill, color, delay }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, y: -2 }}
        className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-default transition-all"
        style={{
            background: `${color}15`,
            border: `1px solid ${color}40`,
            color: color,
        }}
    >
        {skill}
    </motion.span>
);

// Animated counter
const AnimatedNumber = ({ value, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}{suffix}</span>;
};

// Section header with animated line
const SectionHeader = ({ icon: Icon, title, color = CYBER_COLORS.primary }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-8"
    >
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
                background: `${color}20`,
                border: `1px solid ${color}50`,
                boxShadow: `0 0 20px ${color}30`,
            }}
        >
            <Icon size={24} style={{ color }} />
        </div>
        <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-0.5 mt-1"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            />
        </div>
    </motion.div>
);

// Project card with 3D hover effect
const ProjectCard = ({ project, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative overflow-hidden rounded-2xl p-6 group cursor-default"
        style={{
            background: `linear-gradient(135deg, ${project.color}10, transparent)`,
            border: `1px solid ${project.color}30`,
        }}
    >
        {/* Glow effect */}
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                background: `radial-gradient(circle at 50% 0%, ${project.color}20, transparent 70%)`,
            }}
        />

        <div className="relative">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{project.icon}</span>
                <span className="text-xs font-mono text-gray-500">{project.year}</span>
            </div>

            <h3
                className="text-lg font-bold mb-2 group-hover:translate-x-1 transition-transform"
                style={{ color: project.color }}
            >
                {project.name}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {project.desc}
            </p>

            <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => (
                    <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{
                            background: `${project.color}20`,
                            color: project.color,
                        }}
                    >
                        {t}
                    </span>
                ))}
            </div>
        </div>
    </motion.div>
);

// ========================================
// 🎬 MAIN COMPONENT
// ========================================
export default function CreativeResume({ onExit }) {
    const [loaded, setLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);

        const handleKeyDown = (e) => {
            if (e.code === 'Escape') onExit();
        };

        const handleScroll = () => setScrollY(window.scrollY);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onExit]);

    return (
        <div className="min-h-screen bg-[#030308] text-white font-mono overflow-auto">
            {/* Animated grid background */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(${CYBER_COLORS.primary}08 1px, transparent 1px),
                        linear-gradient(90deg, ${CYBER_COLORS.primary}08 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    transform: `translateY(${scrollY * 0.1}px)`,
                }}
            />

            {/* Floating orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: CYBER_COLORS.primary }}
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
                    style={{ background: '#bf00ff' }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/5"
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={onExit}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back to Menu</span>
                    </motion.button>

                    <div className="flex items-center gap-3">
                        <motion.a
                            whileHover={{ scale: 1.1, y: -2 }}
                            href={`https://github.com/${RESUME_DATA.contact.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
                        >
                            <Github size={18} />
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.1, y: -2 }}
                            href={`https://linkedin.com/in/${RESUME_DATA.contact.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors"
                        >
                            <Linkedin size={18} />
                        </motion.a>
                    </div>
                </div>
            </motion.nav>

            {/* Main Content */}
            <main className="relative pt-20 pb-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto space-y-20">

                    {/* ========== HERO SECTION ========== */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-[80vh] flex flex-col items-center justify-center text-center py-20"
                    >
                        {/* Terminal prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-cyan-500/30 mb-8"
                        >
                            <Terminal size={14} className="text-cyan-400" />
                            <span className="text-sm text-gray-500 font-mono">~/resume $ whoami</span>
                        </motion.div>

                        {/* Name with glitch effect */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6"
                        >
                            <GlowText>{RESUME_DATA.name}</GlowText>
                        </motion.h1>

                        {/* Role with typing effect */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl"
                        >
                            {loaded ? <TypeWriter text={RESUME_DATA.role} delay={25} /> : RESUME_DATA.role}
                        </motion.p>

                        {/* Contact badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href={`mailto:${RESUME_DATA.contact.email}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 hover:border-cyan-400 transition-all"
                            >
                                <Mail size={16} className="text-cyan-400" />
                                <span className="text-sm">{RESUME_DATA.contact.email}</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href={`tel:${RESUME_DATA.contact.phone}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/30 hover:border-green-400 transition-all"
                            >
                                <Phone size={16} className="text-green-400" />
                                <span className="text-sm">{RESUME_DATA.contact.phone}</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href={`https://github.com/${RESUME_DATA.contact.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/30 hover:border-purple-400 transition-all"
                            >
                                <Github size={16} className="text-purple-400" />
                                <span className="text-sm">{RESUME_DATA.contact.github}</span>
                            </motion.a>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{ delay: 1, duration: 2, repeat: Infinity }}
                            className="absolute bottom-10 text-gray-600"
                        >
                            <ChevronRight size={24} className="rotate-90" />
                        </motion.div>
                    </motion.section>

                    {/* ========== ABOUT SECTION ========== */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,243,255,0.1) 0%, rgba(191,0,255,0.1) 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <motion.div
                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
                            style={{ background: CYBER_COLORS.primary }}
                        />

                        <div className="relative flex items-start gap-6">
                            <div className="hidden sm:block w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
                                <Zap size={28} className="text-black" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <Zap size={24} className="text-yellow-400 sm:hidden" />
                                    About Me
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {RESUME_DATA.summary}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* ========== SKILLS SECTION ========== */}
                    <section>
                        <SectionHeader icon={Code2} title="Technical Skills" color={CYBER_COLORS.primary} />

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(RESUME_DATA.skills).map(([key, category], catIndex) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: catIndex * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${category.color}08, transparent)`,
                                        border: `1px solid ${category.color}20`,
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <category.icon size={20} style={{ color: category.color }} />
                                        <h3 className="font-bold">{category.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map((skill, i) => (
                                            <SkillBadge
                                                key={skill}
                                                skill={skill}
                                                color={category.color}
                                                delay={0.1 + i * 0.03}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ========== EDUCATION SECTION ========== */}
                    <section>
                        <SectionHeader icon={GraduationCap} title="Education" color="#a855f7" />

                        <div className="space-y-6">
                            {RESUME_DATA.education.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="relative pl-8 border-l-2 py-4"
                                    style={{ borderColor: `${edu.color}50` }}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-0 top-6 w-4 h-4 rounded-full -translate-x-[9px]"
                                        style={{
                                            background: edu.color,
                                            boxShadow: `0 0 15px ${edu.color}80`,
                                        }}
                                    />

                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold" style={{ color: edu.color }}>
                                                {edu.school}
                                            </h3>
                                            <p className="text-gray-400">{edu.degree}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">
                                                {edu.grade}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <Calendar size={12} />
                                                {edu.year}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ========== PROJECTS SECTION ========== */}
                    <section>
                        <SectionHeader icon={Rocket} title="Featured Projects" color="#f97316" />

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {RESUME_DATA.projects.map((project, i) => (
                                <ProjectCard key={project.name} project={project} index={i} />
                            ))}
                        </div>
                    </section>

                    {/* ========== ACHIEVEMENTS SECTION ========== */}
                    <section>
                        <SectionHeader icon={Award} title="Achievements & Certifications" color="#eab308" />

                        <div className="grid sm:grid-cols-2 gap-4">
                            {RESUME_DATA.achievements.map((achievement, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20"
                                >
                                    <CheckCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-300">{achievement}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ========== LANGUAGES SECTION ========== */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <span className="text-gray-500">Languages:</span>
                        {RESUME_DATA.languages.map((lang, i) => (
                            <span key={lang} className="text-gray-300">
                                {lang}{i < RESUME_DATA.languages.length - 1 && " •"}
                            </span>
                        ))}
                    </motion.section>

                    {/* ========== CTA SECTION ========== */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center py-16 border-t border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-4">Interested in working together?</h3>
                        <p className="text-gray-500 mb-8">Let's build something amazing!</p>

                        <motion.a
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            href={`mailto:${RESUME_DATA.contact.email}`}
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-black transition-all"
                            style={{
                                background: `linear-gradient(135deg, ${CYBER_COLORS.primary}, #bf00ff)`,
                                boxShadow: `0 0 40px ${CYBER_COLORS.primary}50`,
                            }}
                        >
                            <Mail size={22} />
                            Get In Touch
                            <Sparkles size={18} />
                        </motion.a>
                    </motion.section>

                </div>
            </main>
        </div>
    );
}
