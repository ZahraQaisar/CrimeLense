import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PublicHeatmap from './pages/PublicHeatmap';
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
import AccessSelection from './pages/AccessSelection';
import { DashboardHome } from './pages/AuthPlaceholders';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/heatmap" element={<PublicHeatmap />} />
                <Route path="/prediction" element={<PublicPrediction />} />
                <Route path="/safe-route" element={<PublicSafeRoute />} />
                <Route path="/compare" element={<PublicCompare />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/selection" element={<AccessSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<div className="text-white p-10">About Page Placeholder</div>} />
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
                <Route path="users" element={<div className="text-white p-8">User Management Placeholder</div>} />
                <Route path="logs" element={<div className="text-white p-8">Incident Logs Placeholder</div>} />
                <Route path="settings" element={<div className="text-white p-8">Settings Placeholder</div>} />
            </Route>
        </Routes>
    );
}

export default App;
