import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { CYBER_COLORS } from './three/ThreeBackground';

const NotificationIcon = ({ type }) => {
    const icons = {
        success: <CheckCircle2 size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };
    return icons[type] || icons.info;
};

const Notification = ({ notification, onDismiss }) => {
    const { type = 'info', title, message, duration = 5000 } = notification;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => onDismiss(notification.id), duration);
            return () => clearTimeout(timer);
        }
    }, [notification.id, duration, onDismiss]);

    const colors = {
        success: CYBER_COLORS.green,
        error: CYBER_COLORS.accent,
        info: CYBER_COLORS.primary,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className="relative flex items-start gap-3 p-4 rounded-lg backdrop-blur-xl border shadow-2xl min-w-[320px] max-w-[400px]"
            style={{
                background: 'rgba(10, 10, 15, 0.95)',
                borderColor: colors[type],
                boxShadow: `0 0 20px ${colors[type]}40, 0 10px 30px rgba(0,0,0,0.5)`,
            }}
        >
            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-lg opacity-20 blur-xl"
                style={{ background: colors[type] }}
            />

            {/* Icon */}
            <div className="relative flex-shrink-0 mt-0.5" style={{ color: colors[type] }}>
                <NotificationIcon type={type} />
            </div>

            {/* Content */}
            <div className="relative flex-1 min-w-0">
                {title && (
                    <div className="font-bold text-white text-sm mb-1 font-mono">{title}</div>
                )}
                {message && (
                    <div className="text-gray-300 text-xs leading-relaxed">{message}</div>
                )}
            </div>

            {/* Close button */}
            <button
                onClick={() => onDismiss(notification.id)}
                className="relative flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                style={{ color: colors[type] }}
            >
                <X size={16} />
            </button>

            {/* Progress bar */}
            {duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 rounded-full"
                    style={{ background: colors[type] }}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                />
            )}
        </motion.div>
    );
};

export const NotificationSystem = () => {
    const { notifications, removeNotification } = useSettingsStore();

    return (
        <div className="fixed top-12 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <Notification notification={notification} onDismiss={removeNotification} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
