import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-deep-navy selection:bg-neon-teal/30 selection:text-neon-teal">
            <Navbar />
            <main className="pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={useLocation().pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MainLayout;
