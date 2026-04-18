import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Phone, MapPin, CheckCircle, ArrowRight, ShieldCheck, X, List } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AREA_NAMES } from '../../constants/areas';

const AREAS = AREA_NAMES;

const OnboardingModal = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);

    // Preferences state
    const [homeArea, setHomeArea] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [trackedAreas, setTrackedAreas] = useState([]);

    useEffect(() => {
        // Show onboarding if authenticated and hasn't completed it locally
        if (isAuthenticated) {
            const hasOnboarded = localStorage.getItem(`onboarded_${user?.id || 'demo'}`);
            if (!hasOnboarded) {
                // slight delay for smooth entry
                setTimeout(() => setIsOpen(true), 1000);
            }
        }
    }, [isAuthenticated, user]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const toggleTrackedArea = (area) => {
        if (trackedAreas.includes(area)) {
            setTrackedAreas(trackedAreas.filter(a => a !== area));
        } else {
            if (trackedAreas.length < 3) {
                setTrackedAreas([...trackedAreas, area]);
            }
        }
    };

    const handleComplete = () => {
        // Save to local storage (mock backend save)
        localStorage.setItem(`onboarded_${user?.id || 'demo'}`, 'true');
        if (homeArea) {
            localStorage.setItem(`default_area_${user?.id || 'demo'}`, homeArea);
        }
        setIsOpen(false);
        // Dispatch event if we want the rest of the app to react instantly
        window.dispatchEvent(new Event('preferencesUpdated'));
    };

    const renderStepIndicators = () => (
        <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${i === step ? 'bg-neon-teal shadow-[0_0_10px_rgba(20,241,217,0.5)]' : i < step ? 'bg-neon-teal/40' : 'bg-white/10'}`} />
            ))}
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-navy/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg glass-panel rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative"
            >
                {/* Skip button built-in as 'close' but advises against it */}
                <button
                    onClick={() => {
                        if (window.confirm("Skip setup? You can always configure these later in your profile.")) {
                            localStorage.setItem(`onboarded_${user?.id || 'demo'}`, 'true');
                            setIsOpen(false);
                            window.dispatchEvent(new Event('preferencesUpdated'));
                        }
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/5 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-teal/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-neon-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-neon-teal/20 shadow-[0_0_20px_rgba(20,241,217,0.2)]">
                            <ShieldCheck size={24} className="text-neon-teal" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Welcome to CrimeLense</h2>
                        <p className="text-gray-400 text-xs">Let's set up your safety preferences for a personalized experience.</p>
                    </div>

                    {renderStepIndicators()}

                    <div className="min-h-[160px] relative z-20">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: HOME AREA */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-white flex justify-center items-center gap-2 mb-2"><Home size={18} className="text-neon-teal" /> Set Home Area</h3>
                                        <p className="text-gray-400 text-sm">Where do you live or spend most of your time?</p>
                                    </div>
                                    <div className="space-y-2 relative group w-full text-left" tabIndex={0}>
                                        <button
                                            type="button"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white flex items-center justify-between hover:border-neon-teal/50 focus:border-neon-teal/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Home className={homeArea ? "text-neon-teal" : "text-gray-400"} size={18} />
                                                <span className={homeArea ? "text-white font-medium" : "text-gray-400"}>
                                                    {homeArea || "Select your Home Area"}
                                                </span>
                                            </div>
                                            <List className="text-neon-teal" size={18} />
                                        </button>

                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0a101d] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50 overflow-hidden">
                                            <div className="max-h-[160px] overflow-y-auto py-2 flex flex-col" style={{ scrollbarWidth: 'thin' }}>
                                                {AREAS.map(area => (
                                                    <button
                                                        key={area}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setHomeArea(area);
                                                            document.activeElement.blur();
                                                        }}
                                                        className={`text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 ${homeArea === area ? 'text-neon-teal bg-neon-teal/10 font-bold' : 'text-gray-300'}`}
                                                    >
                                                        {area}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: EMERGENCY CONTACT */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-white flex justify-center items-center gap-2 mb-2"><Phone size={18} className="text-neon-teal" /> Emergency Contact</h3>
                                        <p className="text-gray-400 text-sm">Who should we notify if you use the "I'm Safe" SOS feature?</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="Phone Number (e.g. +1 555 1234)"
                                            value={emergencyContact}
                                            onChange={e => setEmergencyContact(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-teal/50 transition-colors"
                                            autoFocus
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                                        Your data is encrypted. We will never share this number.
                                    </p>
                                </motion.div>
                            )}

                            {/* STEP 3: TRACK AREAS */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-white flex justify-center items-center gap-2 mb-2"><MapPin size={18} className="text-neon-teal" /> Track Safety Alerts</h3>
                                        <p className="text-gray-400 text-sm">Select up to 3 areas to receive instant risk alerts.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                                        {AREAS.map(area => (
                                            <button
                                                key={area}
                                                onClick={() => toggleTrackedArea(area)}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${trackedAreas.includes(area)
                                                    ? 'bg-neon-teal/10 border-neon-teal text-white shadow-[0_0_10px_rgba(20,241,217,0.1)]'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {area}
                                                {trackedAreas.includes(area) && <CheckCircle size={16} className="text-neon-teal" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs text-neon-teal font-medium">Selected: {trackedAreas.length} / 3</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                        {step > 1 && (
                            <button onClick={handleBack} className="px-6 py-3 rounded-xl font-bold text-gray-300 hover:bg-white/5 transition-colors">
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 ? !homeArea.trim() : step === 2 ? !emergencyContact.trim() : false}
                                className="flex-1 px-6 py-3 bg-white text-deep-navy font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex-1 px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-neon-teal/90 shadow-[0_0_15px_rgba(20,241,217,0.3)] transition-all"
                            >
                                Complete Setup <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;
