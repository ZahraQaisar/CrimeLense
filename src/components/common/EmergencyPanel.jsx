import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Phone, UserCheck, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EmergencyPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    
    // Fallback emergency contact if none set in profile
    const emergencyContact = user?.emergencyContact || '1234567890';

    const handleImSafe = () => {
        // Native SMS intent
        const message = encodeURIComponent("I am safe. Sent via CrimeLense.");
        window.open(`sms:${emergencyContact}?body=${message}`, '_blank');
    };

    const handleShareLocation = () => {
        if (navigator.share) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                    navigator.share({
                        title: 'My Location (CrimeLense)',
                        text: 'This is my current location.',
                        url: mapLink
                    }).catch(console.error);
                },
                (error) => {
                    alert('Unable to retrieve your location for sharing.');
                }
            );
        } else {
            alert('Native sharing is not supported on this browser/device.');
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-16 h-16 bg-danger rounded-full shadow-[0_0_20px_rgba(255,77,77,0.5)] flex items-center justify-center text-white z-40"
                aria-label="Emergency Panel"
            >
                <ShieldAlert size={32} />
            </motion.button>

            {/* Slide-up Panel Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    >
                        {/* Slide-up Panel Content */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full sm:max-w-md bg-deep-navy border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-danger/10 rounded-xl border border-danger/20 text-danger">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Emergency Assistance</h2>
                                    <p className="text-gray-400 text-sm">Quick access to helplines and safety tools</p>
                                </div>
                            </div>

                            {/* Helplines Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <a href="tel:101" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <Phone size={24} className="text-neon-teal mb-2" />
                                    <span className="text-white font-bold text-sm">Police</span>
                                    <span className="text-gray-400 text-xs">101</span>
                                </a>
                                <a href="tel:999" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <Phone size={24} className="text-danger mb-2" />
                                    <span className="text-white font-bold text-sm">Medical</span>
                                    <span className="text-gray-400 text-xs">999 / 112</span>
                                </a>
                                <a href="tel:08002000247" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <Phone size={24} className="text-[#EC4899] mb-2" />
                                    <span className="text-white font-bold text-sm text-center">Women's Help</span>
                                    <span className="text-gray-400 text-xs">0800 2000 247</span>
                                </a>
                                <a href="tel:112" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <Phone size={24} className="text-warning mb-2" />
                                    <span className="text-white font-bold text-sm text-center">Rescue/Disaster</span>
                                    <span className="text-gray-400 text-xs">112</span>
                                </a>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleImSafe}
                                    className="w-full py-3.5 px-4 bg-safe border border-safe/50 text-deep-navy font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-safe/90 transition-all shadow-[0_0_15px_rgba(20,241,217,0.3)]"
                                >
                                    <UserCheck size={20} />
                                    "I'm Safe" SMS
                                </button>
                                <button
                                    onClick={handleShareLocation}
                                    className="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                                >
                                    <MapPin size={20} className="text-gray-400" />
                                    Share My Location
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmergencyPanel;
