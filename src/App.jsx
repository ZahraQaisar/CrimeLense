import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import PublicPrediction from './pages/PublicPrediction';
import PublicSafeRoute from './pages/PublicSafeRoute';
import PublicCompare from './pages/PublicCompare';
import Overview from './pages/dashboard/Overview';
import HeatmapPage from './pages/dashboard/Heatmap';
import SafeRoute from './pages/dashboard/SafeRoute';
import RiskPrediction from './pages/dashboard/RiskPrediction';
import Analysis from './pages/dashboard/Analysis';
import Compare from './pages/dashboard/Compare';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import ManageHotspots from './pages/admin/ManageHotspots';
import UserManagement from './pages/admin/UserManagement';
import IncidentLogs from './pages/admin/IncidentLogs';
import SystemSettings from './pages/admin/SystemSettings';
import AccessSelection from './pages/AccessSelection';
import AboutPage from './pages/About';
import { DashboardHome } from './pages/AuthPlaceholders';
import ProtectedRoute from './components/auth/ProtectedRoute';

// New Feature Pages
import CrimeRiskScore from './pages/CrimeRiskScore';
import SafetyRanking from './pages/SafetyRanking';
import TrendExplorer from './pages/TrendExplorer';
import NeighborhoodSummary from './pages/NeighborhoodSummary';
import AIInsights from './pages/AIInsights';
import RiskForecast from './pages/RiskForecast';
import NearbyScanner from './pages/NearbyScanner';
import SafetyTips from './pages/SafetyTips';
import CrimeTimeline from './pages/CrimeTimeline';
import MapLayers from './pages/MapLayers';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />

                {/* Existing public features */}
                <Route path="/prediction" element={<PublicPrediction />} />
                <Route path="/safe-route" element={<PublicSafeRoute />} />
                <Route path="/compare" element={<PublicCompare />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/selection" element={<AccessSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/about" element={<div className="text-white p-10">About Page Placeholder</div>} />

                {/* New User-Side Features */}
                <Route path="/risk-score" element={<CrimeRiskScore />} />
                <Route path="/safety-ranking" element={<SafetyRanking />} />
                <Route path="/trend-explorer" element={<TrendExplorer />} />
                <Route path="/neighborhood-summary" element={<NeighborhoodSummary />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/risk-forecast" element={<RiskForecast />} />
                <Route path="/nearby-scanner" element={<NearbyScanner />} />
                <Route path="/safety-tips" element={<SafetyTips />} />
                <Route path="/crime-timeline" element={<CrimeTimeline />} />
                <Route path="/map-layers" element={<MapLayers />} /> 
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Overview />} />
                <Route path="heatmap" element={<HeatmapPage />} />
                <Route path="safe-route" element={<SafeRoute />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="prediction" element={<RiskPrediction />} />
                <Route path="compare" element={<Compare />} />
                <Route path="profile" element={<div className="text-white">Profile Placeholder</div>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminOverview />} />
                <Route path="hotspots" element={<ManageHotspots />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="logs" element={<IncidentLogs />} />
                <Route path="settings" element={<SystemSettings />} />
            </Route>
        </Routes>
    );
}

export default App;
