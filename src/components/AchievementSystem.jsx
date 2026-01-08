import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { CYBER_COLORS } from './three/ThreeBackground';
import { useSettingsStore, ACHIEVEMENTS } from '../store/settingsStore';

export default function AchievementSystem({ isOpen, onClose }) {
    const { achievements, achievementProgress } = useSettingsStore();

    const unlockedCount = achievements.length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    const progress = (unlockedCount / totalCount) * 100;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg mx-4 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: `0 0 60px ${CYBER_COLORS.purple}30` }}
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 to-purple-500/10">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={18} className="text-gray-400" />
                        </button>

                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center bg-yellow-500/20 border-2 border-yellow-400"
                                style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}
                            >
                                <Trophy size={32} className="text-yellow-400" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Achievements</h2>
                                <p className="text-gray-400 text-sm">
                                    {unlockedCount} of {totalCount} unlocked
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.purple})`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievement List */}
                    <div className="max-h-80 overflow-y-auto p-4 space-y-2">
                        {Object.values(ACHIEVEMENTS).map((achievement) => {
                            const isUnlocked = achievements.includes(achievement.id);

                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isUnlocked
                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                            : 'bg-white/5 border-white/10 opacity-60'
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${isUnlocked ? 'bg-yellow-500/20' : 'bg-white/10'
                                            }`}
                                    >
                                        {isUnlocked ? (
                                            achievement.icon
                                        ) : (
                                            <Lock size={20} className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                {achievement.name}
                                            </span>
                                            {isUnlocked && (
                                                <CheckCircle2 size={14} className="text-green-400" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{achievement.description}</p>
                                    </div>
                                    {isUnlocked && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-yellow-400"
                                        >
                                            <Trophy size={16} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="text-xs text-gray-500 uppercase font-mono mb-2">Your Stats</div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-white">{achievementProgress.appsOpened.length}</div>
                                <div className="text-[10px] text-gray-500">Apps Opened</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-white">{achievementProgress.commandsExecuted}</div>
                                <div className="text-[10px] text-gray-500">Commands</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-white">{achievementProgress.highScore}</div>
                                <div className="text-[10px] text-gray-500">Snake High</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Mini badge to show in taskbar
export function AchievementBadge({ onClick }) {
    const { achievements } = useSettingsStore();
    const unlockedCount = achievements.length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
        >
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-xs font-mono text-yellow-400">
                {unlockedCount}/{totalCount}
            </span>
            {unlockedCount > 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                />
            )}
        </motion.button>
    );
}
