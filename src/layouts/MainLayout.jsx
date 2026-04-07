import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileBottomNav from '../components/common/MobileBottomNav';
import PageTransition from '../components/common/PageTransition';

const MainLayout = () => {
    return (
        <div className="min-h-screen selection:bg-neon-teal/30 selection:text-neon-teal flex flex-col" style={{ position: 'relative' }}>
            <Navbar />
            <main className="flex-1 flex flex-col">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
};

export default MainLayout;
