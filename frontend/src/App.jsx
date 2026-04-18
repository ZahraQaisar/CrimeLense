import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AppShell from './layouts/AppShell';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public (landing/marketing) pages
import LandingPage from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AboutPage from './pages/About';
import PublicHeatmap from './pages/PublicHeatmap';
import CrimeRiskScore from './pages/CrimeRiskScore';
import TrendExplorer from './pages/TrendExplorer';
import NeighborhoodSummary from './pages/NeighborhoodSummary';
import AIInsights from './pages/AIInsights';
import NearbyScanner from './pages/NearbyScanner';
import AwarenessHub from './pages/AwarenessHub';
import CrimeTimeline from './pages/CrimeTimeline';
import SafetyQuiz from './pages/SafetyQuiz';
import CommunityFeed from './pages/CommunityFeed';

// New app shell pages
import Dashboard from './pages/app/Dashboard';
import LiveMap from './pages/app/LiveMap';
import Settings from './pages/app/Settings';
import HelpSupport from './pages/app/HelpSupport';
import SafeRoutePage from './pages/app/SafeRoutePage';
import CompareAreasPage from './pages/app/CompareAreasPage';
import MyRoutesPage from './pages/app/MyRoutesPage';
import RiskPredictPage from './pages/app/RiskPredictPage';

// Dashboard (protected) pages
import Overview from './pages/dashboard/Overview';
import HeatmapPage from './pages/dashboard/Heatmap';
import SafeRoute from './pages/dashboard/SafeRoute';
import RiskPrediction from './pages/dashboard/RiskPrediction';
import Analysis from './pages/dashboard/Analysis';
import Compare from './pages/dashboard/Compare';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview';
import ManageHotspots from './pages/admin/ManageHotspots';
import UserManagement from './pages/admin/UserManagement';
import IncidentLogs from './pages/admin/IncidentLogs';
import SystemSettings from './pages/admin/SystemSettings';
import AIInsightsPanel from './pages/admin/AIInsightsPanel';

function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
}

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ── New App Shell (user-facing SaaS dashboard) ───────────── */}
                <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="live-map" element={<LiveMap />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<HelpSupport />} />
                    <Route path="community-feed" element={<CommunityFeed />} />
                    <Route path="safe-route" element={<SafeRoutePage />} />
                    <Route path="compare" element={<CompareAreasPage />} />
                    <Route path="my-routes" element={<MyRoutesPage />} />
                    <Route path="predict" element={<RiskPredictPage />} />
                </Route>

                {/* ── Public / Marketing Routes ─────────────────────────────── */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* Extended feature pages */}
                    <Route path="/risk-score" element={<CrimeRiskScore />} />
                    <Route path="/trend-explorer" element={<TrendExplorer />} />
                    <Route path="/neighborhood-summary" element={<NeighborhoodSummary />} />
                    <Route path="/ai-insights" element={<AIInsights />} />
                    <Route path="/nearby-scanner" element={<NearbyScanner />} />
                    <Route path="/awareness" element={<AwarenessHub />} />
                    <Route path="/crime-timeline" element={<CrimeTimeline />} />
                    <Route path="/safety-quiz" element={<SafetyQuiz />} />
                    <Route path="/my-routes" element={<Navigate to="/app/my-routes" replace />} />
                    {/* Redirects */}
                    <Route path="/risk-forecast" element={<Navigate to="/" replace />} />
                    <Route path="/safety-ranking" element={<Navigate to="/" replace />} />
                    <Route path="/map-layers" element={<Navigate to="/" replace />} />
                    <Route path="/safety-tips" element={<Navigate to="/awareness" replace />} />
                </Route>

                {/* ── Protected Dashboard ───────────────────────────────────── */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                    <Route index element={<Overview />} />
                    <Route path="heatmap" element={<HeatmapPage />} />
                    <Route path="safe-route" element={<SafeRoute />} />
                    <Route path="analysis" element={<Analysis />} />
                    <Route path="prediction" element={<Navigate to="/app/predict" replace />} />
                    <Route path="compare" element={<Navigate to="/app/compare" replace />} />
                    <Route path="profile" element={<div className="text-white">Profile Placeholder</div>} />
                </Route>

                {/* ── Admin ────────────────────────────────────────────────── */}
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>
                }>
                    <Route index element={<AdminOverview />} />
                    <Route path="hotspots" element={<ManageHotspots />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="logs" element={<IncidentLogs />} />
                    <Route path="ai-insights" element={<AIInsightsPanel />} />
                    <Route path="settings" element={<SystemSettings />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
