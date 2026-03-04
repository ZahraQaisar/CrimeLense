import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-deep-navy selection:bg-neon-teal/30 selection:text-neon-teal flex flex-col">
            <Navbar />
            <main className="pt-20 flex-1">
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
            <Footer />
        </div>
    );
};

export default MainLayout;
