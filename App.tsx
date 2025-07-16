



import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import { Navbar } from './Navbar';
import { HomePage } from './HomePage';
import AuthPage from './AuthPage';
import { MarketPage } from './MarketPage';
import BettingPage from './BettingPage';
import DashboardPage from './DashboardPage';
import LeaderboardsPage from './LeaderboardsPage';
import AnalyticsPage from './AnalyticsPage';
import AdminPage from './AdminPage';
import PickTeamPage from './PickTeamPage';
import DatabaseSetupPage from './DatabaseSetupPage';
import { EMPTY_TEAM } from './constants';

// Layout for protected routes that require a logged-in user
const ProtectedLayout = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-zinc-900"><div className="text-white">Loading user...</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Players and Managers must have a team to see the dashboard.
  // This check is now safe against a null user.team.
  const safeTeam = user.team ?? EMPTY_TEAM;
  if ((user.role === 'Player' || user.role === 'Manager') && (safeTeam.starters.length + safeTeam.bench.length === 0)) {
     return <Navigate to="/market" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-primary-deep text-light-gray">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <Outlet />
        </main>
    </div>
  );
};

// Layout for the homepage
const PublicHomeLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

// Layout for public pages that need the standard app chrome (background, padding, etc.)
const PublicAppLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background-dark to-primary-deep text-light-gray">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                <Outlet />
            </main>
        </div>
    );
}

// Specific guard for the Admin page
const AdminRouteGuard = () => {
    const { user } = useAppContext();
    return user && user.role === 'Admin' ? <AdminPage /> : <Navigate to="/dashboard" replace />;
}


// Component to handle all application routing logic
const AppRoutes = () => {
    const { user, loading, dbSetupError } = useAppContext();

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-zinc-900"><div className="text-white">Initializing App...</div></div>;
    }
    
    if (dbSetupError) {
        return <DatabaseSetupPage />;
    }

    return (
        <Routes>
            <Route element={<PublicHomeLayout />}>
                <Route path="/" element={<HomePage />} />
            </Route>
            
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

            {/* Publicly accessible routes with the standard app layout */}
            <Route element={<PublicAppLayout />}>
                <Route path="/leaderboards" element={<LeaderboardsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Protected routes that require a logged-in user */}
            <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/betting" element={<BettingPage />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/pick-team" element={<PickTeamPage />} />
                <Route path="/admin" element={<AdminRouteGuard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
