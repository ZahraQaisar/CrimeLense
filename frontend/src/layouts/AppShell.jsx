import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/shell/Sidebar';
import OnboardingModal from '../components/common/OnboardingModal';
const AppShell = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'url(/dashboard-bg-v3.png) center/cover no-repeat fixed', backgroundColor: '#020b12' }}>
      {/* Dark mode atmospheric blobs and overlay for the image */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', backgroundColor: 'rgba(2, 8, 18, 0.75)' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 65%)', filter: 'blur(45px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 65%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '-5%', left: '35%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,138,0.18) 0%, transparent 65%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <Sidebar />
      <OnboardingModal />

      <main
        className="md:ml-[240px] p-4 sm:p-6 md:p-8 min-h-screen pt-6 sm:pt-8 md:pt-10 flex flex-col overflow-x-hidden"
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
