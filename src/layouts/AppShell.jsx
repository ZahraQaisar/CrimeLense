import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/shell/NavBar';
import Sidebar from '../components/shell/Sidebar';
import GlobalBackground from '../components/common/GlobalBackground';
import PageTransition from '../components/common/PageTransition';

const AppShell = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <GlobalBackground />
      <NavBar />
      <Sidebar />
      <main className="mt-[60px] md:ml-[240px] p-4 sm:p-6 md:p-8 min-h-[calc(100vh-60px)] flex flex-col overflow-x-hidden" style={{ background: 'var(--bg)', zIndex: 10 }}>
        <div
          key={location.pathname + location.search}
          style={{ animation: 'fadeIn 150ms ease forwards' }}
        >
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AppShell;
