import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, Briefcase, Award, Code, Heart,
    Zap, Calendar, MapPin, ChevronRight, Sparkles,
    Github, Linkedin, Mail, Phone
} from 'lucide-react';
import { CYBER_COLORS } from '../three/ThreeBackground';

const TIMELINE_DATA = [
    {
        year: '2027',
        type: 'education',
        title: 'B.Tech in Computer Science',
        org: 'CMR Engineering College',
        location: 'Hyderabad, India',
        description: 'CGPA: 8.55 | Focus on Systems Programming & Compiler Design',
        icon: GraduationCap,
    },
    {
        year: '2023',
        type: 'education',
        title: 'Intermediate (MPC)',
        org: 'Rajiv Gandhi University',
        location: 'India',
        description: '80% | Mathematics, Physics, Chemistry',
        icon: GraduationCap,
    },
];

const SKILLS_DATA = {
    'Systems': ['C', 'C++', 'Rust', 'Assembly'],
    'Web Development': ['React', 'Node.js', 'TypeScript', 'Express'],
    'Tools & Tech': ['Git', 'PostgreSQL', 'Electron.js', 'Linux'],
    'Languages': ['Python', 'Java', 'Lua', 'JavaScript'],
};

const INTERESTS = [
    { icon: Code, label: 'Low-level Programming', color: CYBER_COLORS.primary },
    { icon: Zap, label: 'OS Development', color: CYBER_COLORS.secondary },
    { icon: Award, label: 'Compiler Design', color: CYBER_COLORS.purple },
    { icon: Sparkles, label: 'Fullstack Dev', color: CYBER_COLORS.green },
];

const CONTACT_INFO = [
    { icon: Mail, label: 'trushibethu@gmail.com', action: 'mailto:trushibethu@gmail.com' },
    { icon: Phone, label: '+91 9059165740', action: 'tel:+919059165740' },
    { icon: Github, label: 'GitHub', action: 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', action: 'https://linkedin.com' },
];

export default function AppAbout() {
    const [activeTab, setActiveTab] = useState('timeline');

    return (
        <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-y-auto">
            {/* Header */}
            <div className="relative p-8 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
                <div className="relative">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight mb-2"
                        style={{
                            background: `linear-gradient(135deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.secondary})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        BETHU TRUSHI
                    </motion.h1>
                    <p className="text-gray-400 text-lg font-mono">Computer Science Student | Systems Programmer</p>
                    <div className="flex gap-3 mt-4">
                        {CONTACT_INFO.map((contact, i) => (
                            <motion.a
                                key={i}
                                href={contact.action}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400 transition-colors"
                                style={{ color: CYBER_COLORS.primary }}
                            >
                                <contact.icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/10 bg-black/20">
                {['timeline', 'skills', 'interests'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${activeTab === tab
                                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400 shadow-lg'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'timeline' && (
                    <div className="space-y-6">
                        {TIMELINE_DATA.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-8 border-l-2 border-cyan-500/30 hover:border-cyan-400 transition-colors"
                            >
                                {/* Icon */}
                                <div
                                    className="absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
                                    style={{
                                        background: 'rgba(0, 243, 255, 0.1)',
                                        borderColor: CYBER_COLORS.primary,
                                    }}
                                >
                                    <item.icon size={16} style={{ color: CYBER_COLORS.primary }} />
                                </div>

                                {/* Content */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-purple-500/20 border border-purple-400/50 rounded text-xs font-mono text-purple-300">
                                            {item.year}
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={12} /> {item.location}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-cyan-400 font-mono text-sm mb-2">{item.org}</p>
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(SKILLS_DATA).map(([category, skills], i) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-cyan-400/50 transition-all"
                            >
                                <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                    <ChevronRight size={16} />
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, j) => (
                                        <span
                                            key={j}
                                            className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs font-mono text-gray-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'interests' && (
                    <div className="grid grid-cols-2 gap-4">
                        {INTERESTS.map((interest, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center hover:border-cyan-400/50 transition-all cursor-pointer"
                            >
                                <div
                                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `${interest.color}20`,
                                        border: `2px solid ${interest.color}`,
                                    }}
                                >
                                    <interest.icon size={28} style={{ color: interest.color }} />
                                </div>
                                <h3 className="font-bold text-white">{interest.label}</h3>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
