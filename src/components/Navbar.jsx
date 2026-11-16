import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ROLES } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  LifeBuoy,
  Bell,
  LogOut,
  ChevronDown,
  Database,
  Radio,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { currentUser, logout, loginAsRole, notifications, notificationCount, dismissNotifications } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = (roleKey) => {
    loginAsRole(roleKey);
    setShowRoleMenu(false);
    // Redirect to respective dashboard
    const target = roleKey === 'NGO' ? '/ngo'
      : roleKey === 'DONOR' ? '/donor'
      : roleKey === 'VOLUNTEER' ? '/volunteer'
      : '/admin';
    navigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    ResQ<span className="text-red-600">Link</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 tracking-wide hidden sm:block">
                  Connecting Help. Saving Time.
                </p>
              </div>
            </div>
          </div>

          {/* Center / Database Badge */}
          <div className="hidden md:flex items-center space-x-2">
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isConnected ? (
                <>
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Live</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Demo Mode (Local Mock)</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Role Switcher, Notifications, User & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Role Switcher */}
            {currentUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                  title="Switch Demo Role"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-bold text-slate-900">{currentUser.role}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Demo Role
                      </p>
                      <p className="text-xs text-slate-500">
                        Test workflows across different user types
                      </p>
                    </div>
                    {Object.keys(DEMO_ROLES).map((key) => {
                      const r = DEMO_ROLES[key];
                      const isCurrent = currentUser.role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleSwitch(key)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                            isCurrent ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{r.title}</p>
                            <p className="text-[10px] text-slate-400">{r.badge}</p>
                          </div>
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {notificationCount > 0 && (
                      <button
                        type="button"
                        onClick={dismissNotifications}
                        className="text-[11px] text-blue-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 text-xs ${n.unread ? 'bg-blue-50/50' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Details & Logout */}
            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden xl:block text-right">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {currentUser.badge}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                  title="Sign out of current role"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
