import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Target, ArrowRight, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

const quizQuestions = [
    {
        question: "What should you do if you feel you are being followed?",
        options: [
            "Confront the person directly",
            "Go home immediately",
            "Change your pace and cross the street, heading to a populated area",
            "Run as fast as you can without looking back"
        ],
        correct: 2,
        feedback: "Always head toward well-lit, populated areas like stores or cafes rather than going home or confronting them."
    },
    {
        question: "Which type of area generally has lower crime rates at night?",
        options: [
            "Industrial parks with no foot traffic",
            "Well-lit commercial streets with active businesses",
            "Large empty parking lots",
            "Narrow residential alleyways"
        ],
        correct: 1,
        feedback: "Active businesses and good lighting provide natural surveillance, deterring criminal activity."
    },
    {
        question: "What is the safest way to carry valuables in a crowded market?",
        options: [
            "In a loose shoulder bag",
            "In your back pocket for easy access",
            "In your hand so you can see them",
            "In a cross-body bag zipped shut at your front"
        ],
        correct: 3,
        feedback: "A cross-body bag at your front is the hardest for pickpockets to access without your notice."
    },
    {
        question: "If you must use your smartphone while walking at night, what is the best practice?",
        options: [
            "Use both hands and focus entirely on the screen",
            "Wear noise-canceling headphones to avoid distractions",
            "Stop walking, stand with your back to a wall, and look up frequently",
            "Hold it out in front of you so the screen lights up your path"
        ],
        correct: 2,
        feedback: "Stopping with your back to a wall protects your blind spot, and looking up keeps you aware of your surroundings."
    },
    {
        question: "When returning to your parked car, what is the first thing you should do?",
        options: [
            "Look under the car and check the back seat before unlocking",
            "Unlock it from far away so the lights come on",
            "Check your phone for messages before getting in",
            "Stand by the trunk to organize your bags"
        ],
        correct: 0,
        feedback: "Always visually clear the immediate area and interior of your car before you unlock the doors."
    }
];

const SafetyQuiz = () => {
    const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleStart = () => {
        setCurrentStep(0);
        setScore(0);
        setSelectedOption(null);
        setShowFeedback(false);
    };

    const handleSelectOption = (index) => {
        if (showFeedback) return;
        setSelectedOption(index);
        setShowFeedback(true);
        if (index === quizQuestions[currentStep].correct) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentStep < quizQuestions.length) {
            setCurrentStep((prev) => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        }
    };

    const renderIntro = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto py-10">
            <div className="w-20 h-20 bg-neon-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-teal/30 shadow-[0_0_30px_rgba(20,241,217,0.2)]">
                <Target size={40} className="text-neon-teal" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Test Your <span className="text-neon-teal">Safety Awareness</span></h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Personal safety is an active skill. Take this quick 5-question awareness quiz to test your street smarts and learn best practices.
            </p>
            <button onClick={handleStart} className="px-8 py-4 bg-neon-teal text-deep-navy font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] hover:bg-neon-teal/90 transition-all flex items-center gap-2 mx-auto">
                Start Quiz <ArrowRight size={20} />
            </button>
        </motion.div>
    );

    const renderQuestion = () => {
        const question = quizQuestions[currentStep];
        const isAnswered = showFeedback;

        return (
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                    <span className="text-neon-teal font-bold uppercase tracking-wider text-sm">Question {currentStep + 1} of {quizQuestions.length}</span>
                    <div className="flex gap-2">
                        {quizQuestions.map((_, i) => (
                            <div key={i} className={`w-8 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-neon-teal shadow-[0_0_10px_rgba(20,241,217,0.5)]' : i < currentStep ? 'bg-neon-teal/40' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {/* Question */}
                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{question.question}</h2>
                    <div className="space-y-4">
                        {question.options.map((opt, i) => {
                            let optionClass = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white";
                            let icon = null;

                            if (isAnswered) {
                                if (i === question.correct) {
                                    optionClass = "bg-safe/20 border-safe text-white shadow-[0_0_15px_rgba(20,241,217,0.2)]";
                                    icon = <CheckCircle size={20} className="text-safe" />;
                                } else if (i === selectedOption) {
                                    optionClass = "bg-danger/20 border-danger text-white";
                                    icon = <XCircle size={20} className="text-danger" />;
                                } else {
                                    optionClass = "bg-white/5 border-white/10 text-gray-500 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelectOption(i)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center justify-between group ${optionClass}`}
                                >
                                    <span className="font-medium text-lg pr-4">{opt}</span>
                                    {icon && <span className="shrink-0">{icon}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback & Next Button */}
                <AnimatePresence>
                    {isAnswered && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8">
                            <div className={`p-6 rounded-2xl border ${selectedOption === question.correct ? 'bg-safe/10 border-safe/30' : 'bg-danger/10 border-danger/30'} flex flex-col md:flex-row items-center gap-6`}>
                                <div className="flex-1">
                                    <h4 className={`font-bold mb-2 ${selectedOption === question.correct ? 'text-safe' : 'text-danger'}`}>
                                        {selectedOption === question.correct ? 'Correct! Well done.' : 'Incorrect.'}
                                    </h4>
                                    <p className="text-gray-300">{question.feedback}</p>
                                </div>
                                <button onClick={handleNext} className="w-full md:w-auto px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10 shrink-0">
                                    {currentStep === quizQuestions.length - 1 ? 'See Results' : 'Next Question'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const renderResults = () => {
        const isHigh = score >= 4;
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center">
                <div className="glass-panel p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                    {/* Background glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] -z-10 ${isHigh ? 'bg-save/20' : 'bg-warning/20'}`} />

                    <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl ${isHigh ? 'bg-safe/20 text-safe border-4 border-safe/50 shadow-safe/30' : 'bg-warning/20 text-warning border-4 border-warning/50 shadow-warning/30'}`}>
                        {isHigh ? <Award size={50} /> : <ShieldCheck size={50} />}
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
                    <p className="text-xl text-gray-400 mb-8">You scored <span className={`font-bold text-3xl ${isHigh ? 'text-safe' : 'text-warning'}`}>{score}</span> out of 5</p>

                    <div className={`p-6 rounded-2xl border ${isHigh ? 'bg-safe/10 border-safe/20' : 'bg-warning/10 border-warning/20'} mb-10 text-left`}>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            {isHigh ? <><CheckCircle size={18} className="text-safe" /> You're Safety-Aware!</> : <><Target size={18} className="text-warning" /> Room for Improvement</>}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {isHigh
                                ? "Great job! You have a solid grasp of personal safety best practices. Remember to always trust your gut feeling and share these tips with someone you care about."
                                : "You missed a few key concepts. Awareness is the first step to protection. Check out our Safety Tips section to brush up on essential street smarts."
                            }
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleStart} className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                            <RotateCcw size={18} /> Retake Quiz
                        </button>
                        {isHigh && (
                            <button className="px-6 py-3 bg-neon-teal text-deep-navy font-bold rounded-xl hover:bg-neon-teal/90 shadow-[0_0_15px_rgba(20,241,217,0.3)] transition-all">
                                Claim "Safety Aware" Badge
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8">
            <AnimatePresence mode="wait">
                {currentStep === -1 && renderIntro()}
                {currentStep >= 0 && currentStep < quizQuestions.length && renderQuestion()}
                {currentStep === quizQuestions.length && renderResults()}
            </AnimatePresence>
        </div>
    );
};

export default SafetyQuiz;
