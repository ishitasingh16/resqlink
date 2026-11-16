import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RequestForm from './components/RequestForm';
import ResourceForm from './components/ResourceForm';

// Pages
import Login from './pages/Login';
import NGODashboard from './pages/NGODashboard';
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Requests from './pages/Requests';
import Resources from './pages/Resources';
import Volunteers from './pages/Volunteers';
import Allocations from './pages/Allocations';
import MapPage from './pages/MapPage';

// Layout wrapper for authenticated dashboards
function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isConnected = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Demo Mode Notice Top Banner if Supabase is unconfigured */}
      {!isConnected && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center space-x-2 border-b border-amber-600">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
          <span>
            <strong>ResQLink Academic Demo Mode:</strong> Running with local mock database. Provide Supabase credentials in <code>.env</code> to connect live PostgreSQL.
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

// Protected Route Guard
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Root redirect based on active role
  const getDefaultRedirect = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'NGO') return '/ngo';
    if (currentUser.role === 'Donor') return '/donor';
    if (currentUser.role === 'Volunteer') return '/volunteer';
    return '/admin';
  };

  return (
    <Routes>
      {/* Public Login */}
      <Route path="/login" element={<Login />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

      {/* Role Dashboards */}
      <Route
        path="/ngo"
        element={
          <RequireAuth>
            <NGODashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/donor"
        element={
          <RequireAuth>
            <DonorDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/volunteer"
        element={
          <RequireAuth>
            <VolunteerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />

      {/* Core Resources & Workflow Pages */}
      <Route
        path="/requests"
        element={
          <RequireAuth>
            <Requests />
          </RequireAuth>
        }
      />
      <Route
        path="/requests/new"
        element={
          <RequireAuth>
            <div className="max-w-3xl mx-auto py-4">
              <RequestForm
                onSuccess={() => navigate('/requests')}
                onCancel={() => navigate('/requests')}
              />
            </div>
          </RequireAuth>
        }
      />
      <Route
        path="/resources"
        element={
          <RequireAuth>
            <Resources />
          </RequireAuth>
        }
      />
      <Route
        path="/resources/new"
        element={
          <RequireAuth>
            <div className="max-w-3xl mx-auto py-4">
              <ResourceForm
                onSuccess={() => navigate('/resources')}
                onCancel={() => navigate('/resources')}
              />
            </div>
          </RequireAuth>
        }
      />
      <Route
        path="/volunteers"
        element={
          <RequireAuth>
            <Volunteers />
          </RequireAuth>
        }
      />
      <Route
        path="/allocations"
        element={
          <RequireAuth>
            <Allocations />
          </RequireAuth>
        }
      />
      <Route
        path="/map"
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
