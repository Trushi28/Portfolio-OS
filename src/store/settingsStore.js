import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
    persist(
        (set) => ({
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
        }),
        {
            name: 'nexus-os-settings',
        }
    )
);
