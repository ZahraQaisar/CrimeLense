import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen" style={{ background: 'transparent' }}>

            <Sidebar />

            <main className="pl-20 md:pl-64 transition-all duration-300 min-h-screen pt-16">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <div
                        key={useLocation().pathname}
                        style={{ animation: 'dashFadeIn 200ms ease forwards' }}
                    >
                        <Outlet />
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes dashFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
