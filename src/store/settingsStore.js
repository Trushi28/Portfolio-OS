import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement definitions
export const ACHIEVEMENTS = {
    EXPLORER: {
        id: 'explorer',
        name: 'Explorer',
        description: 'Open 3 different applications',
        icon: '🗺️',
        requirement: 3,
    },
    TERMINAL_MASTER: {
        id: 'terminal_master',
        name: 'Terminal Master',
        description: 'Execute 5 terminal commands',
        icon: '💻',
        requirement: 5,
    },
    SNAKE_CHARMER: {
        id: 'snake_charmer',
        name: 'Snake Charmer',
        description: 'Score 10+ points in Snake game',
        icon: '🐍',
        requirement: 10,
    },
    CURIOUS_CAT: {
        id: 'curious_cat',
        name: 'Curious Cat',
        description: 'Expand all project cards',
        icon: '🔍',
        requirement: 5,
    },
    POWER_USER: {
        id: 'power_user',
        name: 'Power User',
        description: 'Use 3 keyboard shortcuts',
        icon: '⌨️',
        requirement: 3,
    },
    FULL_TOUR: {
        id: 'full_tour',
        name: 'Full Tour',
        description: 'Visit About, Projects, and Contact',
        icon: '🎯',
        requirement: 3,
    },
    NIGHT_OWL: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Visit the portfolio after 10 PM',
        icon: '🦉',
        requirement: 1,
    },
    SPEED_DEMON: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Open an app within 2 seconds of boot',
        icon: '⚡',
        requirement: 1,
    },
};

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            // Audio settings
            volume: 0.5,
            isMuted: false,
            setVolume: (volume) => set({ volume }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

            // Boot settings
            skipBoot: false,
            setSkipBoot: (skip) => set({ skipBoot: skip }),

            // Theme settings
            theme: 'cyber',
            setTheme: (theme) => set({ theme }),

            // Window settings
            minimizedWindows: [],
            addMinimized: (windowId) =>
                set((state) => ({
                    minimizedWindows: [...state.minimizedWindows, windowId],
                })),
            removeMinimized: (windowId) =>
                set((state) => ({
                    minimizedWindows: state.minimizedWindows.filter((id) => id !== windowId),
                })),

            // Performance settings
            performanceMode: false,
            setPerformanceMode: (enabled) => set({ performanceMode: enabled }),

            // Visual Effects
            particlesEnabled: true,
            setParticlesEnabled: (enabled) => set({ particlesEnabled: enabled }),
            matrixRainEnabled: false,
            setMatrixRainEnabled: (enabled) => set({ matrixRainEnabled: enabled }),

            // Notifications
            notifications: [],
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [
                        ...state.notifications,
                        { ...notification, id: Date.now() },
                    ],
                })),
            removeNotification: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                })),

            // === ACHIEVEMENT SYSTEM ===
            achievements: [],
            achievementProgress: {
                appsOpened: [],
                commandsExecuted: 0,
                highScore: 0,
                projectsExpanded: 0,
                shortcutsUsed: 0,
                sectionsVisited: [],
                bootTime: null,
            },

            // Track app opens
            trackAppOpen: (appId) => {
                const state = get();
                const appsOpened = state.achievementProgress.appsOpened;
                if (!appsOpened.includes(appId)) {
                    const newAppsOpened = [...appsOpened, appId];
                    set({
                        achievementProgress: {
                            ...state.achievementProgress,
                            appsOpened: newAppsOpened,
                        },
                    });

                    // Check Explorer achievement
                    if (newAppsOpened.length >= ACHIEVEMENTS.EXPLORER.requirement) {
                        get().unlockAchievement('explorer');
                    }

                    // Track sections for Full Tour
                    if (['about', 'projects', 'contact'].includes(appId)) {
                        const sectionsVisited = state.achievementProgress.sectionsVisited;
                        if (!sectionsVisited.includes(appId)) {
                            const newSections = [...sectionsVisited, appId];
                            set({
                                achievementProgress: {
                                    ...state.achievementProgress,
                                    sectionsVisited: newSections,
                                },
                            });
                            if (newSections.length >= 3) {
                                get().unlockAchievement('full_tour');
                            }
                        }
                    }
                }
            },

            // Track terminal commands
            trackCommand: () => {
                const state = get();
                const newCount = state.achievementProgress.commandsExecuted + 1;
                set({
                    achievementProgress: {
                        ...state.achievementProgress,
                        commandsExecuted: newCount,
                    },
                });
                if (newCount >= ACHIEVEMENTS.TERMINAL_MASTER.requirement) {
                    get().unlockAchievement('terminal_master');
                }
            },

            // Track snake score
            trackSnakeScore: (score) => {
                const state = get();
                if (score >= ACHIEVEMENTS.SNAKE_CHARMER.requirement) {
                    get().unlockAchievement('snake_charmer');
                }
                if (score > state.achievementProgress.highScore) {
                    set({
                        achievementProgress: {
                            ...state.achievementProgress,
                            highScore: score,
                        },
                    });
                }
            },

            // Track keyboard shortcuts
            trackShortcut: () => {
                const state = get();
                const newCount = state.achievementProgress.shortcutsUsed + 1;
                set({
                    achievementProgress: {
                        ...state.achievementProgress,
                        shortcutsUsed: newCount,
                    },
                });
                if (newCount >= ACHIEVEMENTS.POWER_USER.requirement) {
                    get().unlockAchievement('power_user');
                }
            },

            // Unlock achievement
            unlockAchievement: (achievementId) => {
                const state = get();
                if (!state.achievements.includes(achievementId)) {
                    set({ achievements: [...state.achievements, achievementId] });

                    // Show notification
                    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
                    if (achievement) {
                        state.addNotification({
                            type: 'achievement',
                            title: `🏆 Achievement Unlocked!`,
                            message: `${achievement.icon} ${achievement.name}`,
                            duration: 5000,
                        });
                    }
                }
            },

            // Check night owl achievement
            checkNightOwl: () => {
                const hour = new Date().getHours();
                if (hour >= 22 || hour < 5) {
                    get().unlockAchievement('night_owl');
                }
            },

            // Command palette history
            commandPaletteHistory: [],
            addToHistory: (appId) =>
                set((state) => {
                    const filtered = state.commandPaletteHistory.filter(id => id !== appId);
                    return {
                        commandPaletteHistory: [appId, ...filtered].slice(0, 5),
                    };
                }),
        }),
        {
            name: 'nexus-os-settings',
        }
    )
);
