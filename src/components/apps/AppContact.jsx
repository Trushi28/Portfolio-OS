import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Copy, Check, Github, Linkedin, AlertCircle } from 'lucide-react';
import { CYBER_COLORS } from '../three/ThreeBackground';
import { useSettingsStore } from '../../store/settingsStore';

const CONTACT_METHODS = [
    { icon: Mail, label: 'Email', value: 'trushibethu@gmail.com', type: 'email' },
    { icon: Phone, label: 'Phone', value: '+91 9059165740', type: 'phone' },
    { icon: Github, label: 'GitHub', value: 'github.com/yourusername', type: 'link', url: 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/yourprofile', type: 'link', url: 'https://linkedin.com' },
];

const ContactMethod = ({ method }) => {
    const [copied, setCopied] = useState(false);
    const { addNotification } = useSettingsStore();

    const handleCopy = () => {
        navigator.clipboard.writeText(method.value);
        setCopied(true);
        addNotification({
            type: 'success',
            title: 'Copied!',
            message: `${method.label} copied to clipboard`,
            duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClick = () => {
        if (method.type === 'link' && method.url) {
            window.open(method.url, '_blank');
        } else if (method.type === 'email') {
            window.location.href = `mailto:${method.value}`;
        } else if (method.type === 'phone') {
            window.location.href = `tel:${method.value}`;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-cyan-400/50 transition-all"
        >
            <div className="flex items-center gap-3 mb-2">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                        background: `${CYBER_COLORS.primary}20`,
                        border: `1px solid ${CYBER_COLORS.primary}`,
                    }}
                >
                    <method.icon size={20} style={{ color: CYBER_COLORS.primary }} />
                </div>
                <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase">{method.label}</div>
                    <div className="text-sm font-mono text-white">{method.value}</div>
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:border-cyan-400 transition-colors text-xs font-mono"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                    onClick={handleClick}
                    className="flex-1 px-3 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-xs font-mono text-cyan-400"
                >
                    Open
                </button>
            </div>
        </motion.div>
    );
};

export default function AppContact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const { addNotification } = useSettingsStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            addNotification({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fill in all fields',
                duration: 3000,
            });
            return;
        }

        setSending(true);

        // Simulate sending (replace with actual email service like EmailJS)
        setTimeout(() => {
            setSending(false);
            addNotification({
                type: 'success',
                title: 'Message Sent!',
                message: 'Thank you for reaching out. I\'ll get back to you soon!',
                duration: 5000,
            });
            setFormData({ name: '', email: '', message: '' });
        }, 2000);
    };

    return (
        <div className="h-full bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 text-white overflow-y-auto">
            {/* Header */}
            <div className="p-8 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <h1
                    className="text-4xl font-black mb-2"
                    style={{
                        background: `linear-gradient(135deg, ${CYBER_COLORS.primary}, ${CYBER_COLORS.purple})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    GET IN TOUCH
                </h1>
                <p className="text-gray-400">Let's build something amazing together!</p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Methods */}
                <div>
                    <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <MapPin size={20} />
                        CONTACT INFORMATION
                    </h2>
                    <div className="space-y-3">
                        {CONTACT_METHODS.map((method, i) => (
                            <ContactMethod key={i} method={method} />
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Send size={20} />
                        SEND A MESSAGE
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono text-sm resize-none"
                                placeholder="Your message..."
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={sending}
                            className="w-full py-3 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors font-mono font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ color: CYBER_COLORS.primary }}
                        >
                            {sending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                    SENDING...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    SEND MESSAGE
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Note */}
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2 text-xs text-yellow-200">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>This is a demonstration form. To enable actual email sending, integrate with EmailJS or similar service.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
