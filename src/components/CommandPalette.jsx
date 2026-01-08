import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Terminal, Folder, User, Gamepad2, Layout,
    GripHorizontal, Globe, FileText, Leaf, Mail, FolderOpen,
    Sparkles, Command, ArrowRight, Clock, Zap
} from 'lucide-react';
import { CYBER_COLORS } from './three/ThreeBackground';
import { useSettingsStore } from '../store/settingsStore';

const APPS_LIST = [
    { id: 'about', icon: User, title: 'About Me', description: 'Learn about my background and skills', keywords: ['about', 'me', 'bio', 'profile'] },
    { id: 'projects', icon: FolderOpen, title: 'Projects', description: 'View my portfolio of work', keywords: ['projects', 'work', 'portfolio', 'code'] },
    { id: 'contact', icon: Mail, title: 'Contact', description: 'Get in touch with me', keywords: ['contact', 'email', 'message', 'reach'] },
    { id: 'terminal3d', icon: Sparkles, title: 'Holo Terminal', description: 'Interactive 3D terminal experience', keywords: ['terminal', 'console', 'command', 'holo', '3d'] },
    { id: 'terminal', icon: Terminal, title: 'Terminal', description: 'Classic terminal interface', keywords: ['terminal', 'console', 'command', 'shell'] },
    { id: 'explorer', icon: Folder, title: 'File Explorer', description: 'Browse virtual filesystem', keywords: ['files', 'folder', 'explorer', 'browse'] },
    { id: 'skills', icon: Globe, title: 'Skills Orbit', description: '3D visualization of skills', keywords: ['skills', 'tech', 'orbit', '3d'] },
    { id: 'resume', icon: FileText, title: 'Resume', description: 'View my professional resume', keywords: ['resume', 'cv', 'document'] },
    { id: 'ecoscan', icon: Leaf, title: 'EcoScan', description: 'Sustainability checker app', keywords: ['eco', 'scan', 'sustainability', 'green'] },
    { id: 'dashboard', icon: Layout, title: 'Dashboard', description: 'Productivity dashboard', keywords: ['dashboard', 'todo', 'task', 'productivity'] },
    { id: 'snake', icon: Gamepad2, title: 'Snake Game', description: 'Classic snake arcade game', keywords: ['snake', 'game', 'play', 'arcade'] },
    { id: 'puzzle', icon: GripHorizontal, title: 'Puzzle', description: 'Sliding tile puzzle game', keywords: ['puzzle', 'game', 'tiles', 'sliding'] },
];

const fuzzyMatch = (text, query) => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower.includes(queryLower)) return true;

    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
            queryIndex++;
        }
    }
    return queryIndex === queryLower.length;
};

export default function CommandPalette({ isOpen, onClose, onLaunch }) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const { commandPaletteHistory, addToHistory, trackShortcut } = useSettingsStore();

    // Filter and sort apps
    const filteredApps = useMemo(() => {
        if (!search.trim()) {
            // Show recent apps first, then others
            const recent = APPS_LIST.filter(app => commandPaletteHistory.includes(app.id))
                .sort((a, b) => commandPaletteHistory.indexOf(a.id) - commandPaletteHistory.indexOf(b.id));
            const others = APPS_LIST.filter(app => !commandPaletteHistory.includes(app.id));
            return [...recent, ...others];
        }

        return APPS_LIST.filter(app => {
            const matchTitle = fuzzyMatch(app.title, search);
            const matchDesc = fuzzyMatch(app.description, search);
            const matchKeywords = app.keywords.some(k => fuzzyMatch(k, search));
            return matchTitle || matchDesc || matchKeywords;
        }).sort((a, b) => {
            // Prioritize title matches
            const aTitle = a.title.toLowerCase().includes(search.toLowerCase());
            const bTitle = b.title.toLowerCase().includes(search.toLowerCase());
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            return 0;
        });
    }, [search, commandPaletteHistory]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredApps.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && filteredApps[selectedIndex]) {
                e.preventDefault();
                handleLaunch(filteredApps[selectedIndex].id);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredApps, selectedIndex]);

    // Scroll selected item into view
    useEffect(() => {
        const list = listRef.current;
        if (list) {
            const selected = list.children[selectedIndex];
            if (selected) {
                selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    const handleLaunch = (appId) => {
        addToHistory(appId);
        trackShortcut();
        onLaunch(appId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Palette */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-xl mx-4 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: `0 0 60px ${CYBER_COLORS.primary}20` }}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                        <Search size={20} className="text-gray-500" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search apps, commands..."
                            className="flex-1 bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none font-mono"
                        />
                        <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                            <span>to close</span>
                        </div>
                    </div>

                    {/* Results */}
                    <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                        {filteredApps.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Search size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No apps found for "{search}"</p>
                            </div>
                        ) : (
                            filteredApps.map((app, index) => {
                                const isRecent = commandPaletteHistory.includes(app.id);
                                const isSelected = index === selectedIndex;

                                return (
                                    <motion.button
                                        key={app.id}
                                        onClick={() => handleLaunch(app.id)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isSelected
                                                ? 'bg-cyan-500/20 border border-cyan-400/50'
                                                : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500/30' : 'bg-white/10'
                                                }`}
                                        >
                                            <app.icon size={20} className={isSelected ? 'text-cyan-400' : 'text-gray-400'} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                                    {app.title}
                                                </span>
                                                {isRecent && (
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <Clock size={10} />
                                                        recent
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{app.description}</p>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-cyan-400"
                                            >
                                                <ArrowRight size={16} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-600 font-mono">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
                                navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">enter</kbd>
                                open
                            </span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: CYBER_COLORS.primary }}>
                            <Zap size={12} />
                            <span>Quick Launch</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
