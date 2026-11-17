import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { localStore } from '../services/storageAdapter';
import {
  LayoutDashboard,
  AlertCircle,
  PlusCircle,
  Package,
  Users,
  GitMerge,
  MapPin,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'Admin';

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default academic prototype seed?')) {
      localStore.resetToDefaults();
      window.location.reload();
    }
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* Active Role Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Context
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-slate-900">{role} View</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {currentUser?.name || 'Academic Demo User'}
            </p>
          </div>

          {/* Navigation Sections */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Operations
            </p>

            {/* NGO View Links */}
            {role === 'NGO' && (
              <>
                <NavLink to="/ngo" end className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>NGO Dashboard</span>
                </NavLink>
                <NavLink to="/requests" end className={navItemClass} onClick={onClose}>
                  <AlertCircle className="w-4 h-4" />
                  <span>Emergency Requests</span>
                </NavLink>
                <NavLink to="/requests/new" className={navItemClass} onClick={onClose}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Request</span>
                </NavLink>
                <NavLink to="/map" className={navItemClass} onClick={onClose}>
                  <MapPin className="w-4 h-4" />
                  <span>Live Situation Map</span>
                </NavLink>
              </>
            )}

            {/* Donor View Links */}
            {role === 'Donor' && (
              <>
                <NavLink to="/donor" end className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Donor Dashboard</span>
                </NavLink>
                <NavLink to="/resources" end className={navItemClass} onClick={onClose}>
                  <Package className="w-4 h-4" />
                  <span>My Donated Resources</span>
                </NavLink>
                <NavLink to="/resources/new" className={navItemClass} onClick={onClose}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Resource</span>
                </NavLink>
                <NavLink to="/map" className={navItemClass} onClick={onClose}>
                  <MapPin className="w-4 h-4" />
                  <span>Regional Map</span>
                </NavLink>
              </>
            )}

            {/* Volunteer View Links */}
            {role === 'Volunteer' && (
              <>
                <NavLink to="/volunteer" end className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Volunteer Dashboard</span>
                </NavLink>
                <NavLink to="/volunteers" className={navItemClass} onClick={onClose}>
                  <Users className="w-4 h-4" />
                  <span>Volunteer Roster</span>
                </NavLink>
                <NavLink to="/map" className={navItemClass} onClick={onClose}>
                  <MapPin className="w-4 h-4" />
                  <span>Deployment Map</span>
                </NavLink>
              </>
            )}

            {/* Admin View Links */}
            {role === 'Admin' && (
              <>
                <NavLink to="/admin" end className={navItemClass} onClick={onClose}>
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>HQ Control Center</span>
                </NavLink>
                <NavLink to="/requests" className={navItemClass} onClick={onClose}>
                  <AlertCircle className="w-4 h-4" />
                  <span>Emergency Requests</span>
                </NavLink>
                <NavLink to="/resources" className={navItemClass} onClick={onClose}>
                  <Package className="w-4 h-4" />
                  <span>Donated Resources</span>
                </NavLink>
                <NavLink to="/volunteers" className={navItemClass} onClick={onClose}>
                  <Users className="w-4 h-4" />
                  <span>Volunteer Network</span>
                </NavLink>
                <NavLink to="/allocations" className={navItemClass} onClick={onClose}>
                  <GitMerge className="w-4 h-4" />
                  <span>Smart Allocations</span>
                </NavLink>
                <NavLink to="/map" className={navItemClass} onClick={onClose}>
                  <MapPin className="w-4 h-4" />
                  <span>GIS Relief Map</span>
                </NavLink>
              </>
            )}

          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200 transition"
            title="Reset sample requests, resources and allocations back to seed values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>
          
          <div className="px-2 pt-1 text-center">
            <p className="text-[10px] text-slate-400">
              ResQLink Prototype &bull; B.Tech Final Project
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
