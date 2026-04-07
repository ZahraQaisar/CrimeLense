import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Navigation, BarChart2, Activity, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ToolCard from '../../components/ui/ToolCard';
import AlertItem from '../../components/ui/AlertItem';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const recentAlerts = [
  { level: 'high', title: 'Elevated risk detected in Downtown', meta: 'Downtown · Crime spike +34%', timestamp: '2m ago' },
  { level: 'medium', title: 'Moderate activity in Eastgate', meta: 'Eastgate · 3 incidents logged', timestamp: '18m ago' },
  { level: 'low', title: 'Safe corridor confirmed — Riverside', meta: 'Riverside · All-clear', timestamp: '1h ago' },
  { level: 'medium', title: 'Route delay advisory — Northside', meta: 'Northside · Road closure', timestamp: '2h ago' },
];

const toolCards = [
  { icon: Zap, name: 'Crime Prediction', description: 'Get AI-powered risk scores for any district on any date.', path: '/app/tools?tool=prediction', color: 'var(--danger)' },
  { icon: Navigation, name: 'Safe Route Finder', description: 'Find the safest path between two points in the city.', path: '/app/tools?tool=route', color: 'var(--accent)' },
  { icon: BarChart2, name: 'Compare Areas', description: 'Side-by-side risk comparison across multiple districts.', path: '/app/tools?tool=compare', color: 'var(--info)' },
  { icon: Activity, name: 'Live Risk Map', description: 'Real-time animated risk map of the entire city.', path: '/app/live-map', color: 'var(--warning)' },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      {/* Welcome banner */}
      {showWelcome && (
        <div
          className="w-full rounded-2xl p-6"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--accent-border)',
            boxShadow: '0 0 40px var(--accent-dim)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
                {isAuthenticated && user?.name ? `${getGreeting()}, ${user.name} 👋` : getGreeting()}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                CrimeLense gives you AI-powered urban safety intelligence — predict risks, find safe routes, and compare areas in real time.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                Live · Updated now
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                title="Dismiss"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="High-risk zones today" value="12" trend="+3" color="red" sublabel="Across 5 districts" />
        <StatCard label="Safe routes analyzed" value="847" trend="-2" color="teal" sublabel="Last 24 hours" />
        <StatCard label="Areas monitored" value="36" trend="" color="neutral" sublabel="City-wide coverage" />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Tool cards */}
        <div>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            What do you want to do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toolCards.map((card) => (
              <ToolCard key={card.name} {...card} />
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
            Recent alerts
          </h2>
          <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}>
            {recentAlerts.map((alert, i) => (
              <AlertItem key={i} {...alert} />
            ))}
            <button
              className="mt-3 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              View all alerts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
