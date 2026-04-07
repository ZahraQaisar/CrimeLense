import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileBottomNav from '../components/common/MobileBottomNav';

const MainLayout = () => {
    return (
        <div className="min-h-screen selection:bg-neon-teal/30 selection:text-neon-teal flex flex-col" style={{ position: 'relative' }}>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
};

export default MainLayout;
