import React, { useState, useEffect } from 'react';
import { volunteerService } from '../services/volunteerService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import {
  Users,
  Search,
  Car,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  Filter
} from 'lucide-react';

const ALL_SKILLS = [
  'Transportation',
  'Medical assistance',
  'Food distribution',
  'Rescue support',
  'Logistics',
  'General assistance'
];

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await volunteerService.getVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleToggleDuty = async (volunteer) => {
    try {
      await volunteerService.updateAvailability(volunteer.id, !volunteer.available);
      loadVolunteers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = skillFilter === 'ALL' || v.skills.includes(skillFilter);

    const matchesVehicle =
      vehicleFilter === 'ALL' ||
      (vehicleFilter === 'YES' && v.has_vehicle) ||
      (vehicleFilter === 'NO' && !v.has_vehicle);

    const matchesAvailability =
      availabilityFilter === 'ALL' ||
      (availabilityFilter === 'AVAILABLE' && v.available) ||
      (availabilityFilter === 'BUSY' && !v.available);

    return matchesSearch && matchesSkill && matchesVehicle && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Volunteer Network Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered relief workers, medical responders, and transportation volunteers
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Active Responders: <strong className="text-blue-600">{volunteers.filter((v) => v.available).length} / {volunteers.length}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name or skill..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Skill Filter */}
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Skills</option>
            {ALL_SKILLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Vehicles</option>
            <option value="YES">Vehicle Equipped</option>
            <option value="NO">No Vehicle</option>
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Duty Statuses</option>
            <option value="AVAILABLE">Ready on Duty</option>
            <option value="BUSY">Assigned / Occupied</option>
          </select>
        </div>
      </div>

      {/* Volunteers Cards Grid */}
      {loading ? (
        <LoadingState message="Fetching volunteer roster..." />
      ) : filteredVolunteers.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
          No volunteers match the current search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVolunteers.map((vol) => (
            <div
              key={vol.id}
              className="resq-card p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {vol.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{vol.name}</h3>
                      <p className="text-[11px] text-slate-400">Emergency Field Volunteer</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    vol.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {vol.available ? 'Ready' : 'Occupied'}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact:</span>
                    </span>
                    <span className="font-mono text-slate-800">{vol.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <Car className="w-3.5 h-3.5" />
                      <span>Vehicle:</span>
                    </span>
                    <span className={`font-semibold ${vol.has_vehicle ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {vol.has_vehicle ? 'Vehicle Available' : 'No Vehicle'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Location:</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-600">
                      {vol.latitude?.toFixed(4)}, {vol.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Registered Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {vol.skills?.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Status: <strong>{vol.available ? 'Available' : 'Assigned'}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleDuty(vol)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                    vol.available
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {vol.available ? 'Set Off-Duty' : 'Set Ready on Duty'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
