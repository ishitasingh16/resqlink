import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ROLES } from '../context/AuthContext';
import {
  LifeBuoy,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Users,
  ArrowRight,
  Database,
  Radio,
  CheckCircle2,
  Info
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Login() {
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRoleKey, setSelectedRoleKey] = useState('ADMIN');
  const isConnected = isSupabaseConfigured();

  const handleSelectAndProceed = (roleKey) => {
    loginAsRole(roleKey);
    if (roleKey === 'NGO') navigate('/ngo');
    else if (roleKey === 'DONOR') navigate('/donor');
    else if (roleKey === 'VOLUNTEER') navigate('/volunteer');
    else navigate('/admin');
  };

  const roleIcons = {
    NGO: Building2,
    DONOR: HeartHandshake,
    VOLUNTEER: Users,
    ADMIN: ShieldCheck
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              ResQ<span className="text-red-500">Link</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Connecting Help. Saving Time.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${
            isConnected
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
          }`}>
            {isConnected ? (
              <>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase PostgreSQL Active</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Demo Storage Ready (Mock Mode)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto my-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
            <span>🎓 B.Tech Final Project Prototype</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-blue-400">Multi-Criteria Emergency Coordination</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Intelligent Emergency Resource Allocation <br className="hidden sm:block" />
            &amp; Volunteer Coordination
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Prioritize crisis requests with real-time urgency scoring, calculate geographical
            distance via Haversine, and coordinate disaster relief with zero delay.
          </p>
        </div>

        {/* Academic Prototype Notice */}
        <div className="mb-8 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-start space-x-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-semibold">Academic Prototype Demonstration: </strong>
            Role selection simulates user authentication to demonstrate workflows for NGOs, donors, volunteers, and administrators. No real passwords or sensitive personal data are stored.
          </div>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.keys(DEMO_ROLES).map((key) => {
            const role = DEMO_ROLES[key];
            const Icon = roleIcons[key] || Users;
            const isSelected = selectedRoleKey === key;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleKey(key)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/40 shadow-xl'
                    : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${role.color}25`, color: role.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{role.id}</h3>
                  <p className="text-xs text-blue-400 font-semibold mb-2">{role.defaultName}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{role.description}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndProceed(key);
                  }}
                  className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <span>Launch as {role.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Primary Proceed Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => handleSelectAndProceed(selectedRoleKey)}
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 transition transform hover:-translate-y-0.5"
          >
            <span>Enter ResQLink as {selectedRoleKey}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
        <p>
          ResQLink Emergency Management System &bull; Designed with React, Supabase PostgreSQL, Leaflet &amp; Tailwind CSS
        </p>
        <p className="text-[11px] text-slate-600">
          Synthetic test coordinates are mapped around coastal emergency response grids for academic demonstration.
        </p>
      </div>

    </div>
  );
}
