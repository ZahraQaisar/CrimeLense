import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-deep-navy">
            <Sidebar />

            {/* Profile Icon Header */}
            <div className="pl-20 md:pl-64 fixed top-0 right-0 z-40">
                <div className="flex justify-end p-4">
                    <Link
                        to="/dashboard/profile"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-neon-teal/50 group"
                        title="Profile"
                    >
                        <User size={24} className="group-hover:text-neon-teal transition-colors" />
                    </Link>
                </div>
            </div>

            <main className="pl-20 md:pl-64 transition-all duration-300 min-h-screen pt-16">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
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
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
