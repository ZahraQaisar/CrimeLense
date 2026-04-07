import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/shell/NavBar';
import Sidebar from '../components/shell/Sidebar';
import GlobalBackground from '../components/common/GlobalBackground';

const AppShell = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <GlobalBackground />
      <NavBar />
      <Sidebar />
      <main
        style={{
          marginTop: 60,
          marginLeft: 240,
          minHeight: 'calc(100vh - 60px)',
          padding: '28px 32px',
          background: 'var(--bg)',
          overflowY: 'auto',
        }}
      >
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
