import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/shell/NavBar';
import Sidebar from '../components/shell/Sidebar';
import { useTheme } from '../context/ThemeContext';

const AppShell = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'transparent' }}>
      {/* Dark mode atmospheric blobs — only shown in dark theme */}
      {isDark && (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(50,80,120,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,110,100,0.14) 0%, transparent 65%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '-5%', left: '35%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(70,55,130,0.12) 0%, transparent 65%)', filter: 'blur(45px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
      )}

      <NavBar />
      <Sidebar />

      <main
        className="mt-[60px] md:ml-[240px] p-4 sm:p-6 md:p-8 min-h-[calc(100vh-60px)] flex flex-col overflow-x-hidden"
        style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
      >
        <div
          key={location.pathname + location.search}
          style={{ animation: 'appShellFadeIn 180ms ease forwards' }}
        >
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes appShellFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AppShell;
