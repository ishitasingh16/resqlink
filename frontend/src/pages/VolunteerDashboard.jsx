import React, { useState, useEffect } from 'react';
import { volunteerService } from '../services/volunteerService';
import { allocationService } from '../services/allocationService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { formatDistance } from '../algorithms/distance';
import {
  Users,
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  Phone,
  Shield,
  Check,
  X,
  Package,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { currentUser } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vols, allocs] = await Promise.all([
        volunteerService.getVolunteers(),
        allocationService.getAllocations()
      ]);
      setVolunteers(vols);
      setAllocations(allocs);

      // Match current volunteer by name or default to first volunteer
      const myVol = vols.find(
        (v) => v.name.toLowerCase() === (currentUser?.name || '').toLowerCase()
      ) || vols[0];

      setCurrentVolunteer(myVol);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Handle availability toggle
  const handleToggleAvailability = async () => {
    if (!currentVolunteer) return;
    try {
      setActionLoading(true);
      const updated = await volunteerService.updateAvailability(
        currentVolunteer.id,
        !currentVolunteer.available
      );
      setCurrentVolunteer(updated);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle accept proposed task
  const handleAcceptTask = async (allocationId) => {
    try {
      setActionLoading(true);
      await allocationService.approveAllocation(allocationId);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle decline proposed task
  const handleDeclineTask = async (allocationId) => {
    try {
      setActionLoading(true);
      await allocationService.rejectAllocation(allocationId);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle mark task completed
  const handleCompleteTask = async (allocationId) => {
    try {
      setActionLoading(true);
      await allocationService.completeAllocation(allocationId);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter tasks for this volunteer
  const myTasks = currentVolunteer
    ? allocations.filter((a) => a.volunteer_id === currentVolunteer.id)
    : [];

  const completedTasksCount = myTasks.filter((t) => t.status === 'Completed').length;
  const activeTasksCount = myTasks.filter((t) => t.status === 'Approved' || t.status === 'In Transit').length;
  const proposedTasksCount = myTasks.filter((t) => t.status === 'Proposed').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Volunteer Field Operations Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{currentVolunteer?.name || 'Dr. Priya Sharma'}</strong> &bull; Emergency Response Squad
          </p>
        </div>

        {currentVolunteer && (
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-600">Duty Status:</span>
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleToggleAvailability}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                currentVolunteer.available
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentVolunteer.available ? 'bg-white' : 'bg-slate-400'}`}></span>
              <span>{currentVolunteer.available ? 'Ready on Duty (Available)' : 'Off Duty / Busy'}</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Connecting to volunteer grid..." />
      ) : (
        <>
          {/* Volunteer Profile & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            {currentVolunteer && (
              <div className="resq-card p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {currentVolunteer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{currentVolunteer.name}</h3>
                      <p className="text-[11px] text-slate-400">Emergency Field Responder</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentVolunteer.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentVolunteer.available ? 'Available' : 'Occupied'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact (Demo):</span>
                    </span>
                    <span className="font-semibold text-slate-800">{currentVolunteer.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <Car className="w-3.5 h-3.5" />
                      <span>Transport Vehicle:</span>
                    </span>
                    <span className={`font-semibold ${currentVolunteer.has_vehicle ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentVolunteer.has_vehicle ? 'Equipped (Vehicle Ready)' : 'On Foot / No Vehicle'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Base Coordinates:</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-700">
                      {currentVolunteer.latitude?.toFixed(4)}, {currentVolunteer.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Verified Emergency Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentVolunteer.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stat Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Assigned Tasks"
                value={activeTasksCount}
                subtext="Currently executing"
                icon={Play}
                color="blue"
              />
              <StatCard
                title="Proposed Assignments"
                value={proposedTasksCount}
                subtext="Awaiting response"
                icon={Clock}
                color="orange"
              />
              <StatCard
                title="Completed Missions"
                value={completedTasksCount}
                subtext="Relief delivered"
                icon={CheckCircle2}
                color="green"
              />
            </div>

          </div>

          {/* Assigned Relief Tasks */}
          <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                My Emergency Assignments &amp; Deployments ({myTasks.length})
              </h3>
              <span className="text-xs text-slate-500">Direct Field Coordination</span>
            </div>

            {myTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-1">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">No active tasks assigned currently.</p>
                <p className="text-slate-400">
                  Switch to the Admin role to trigger automated matching and dispatch allocations.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myTasks.map((task) => {
                  const req = task.request;
                  const res = task.resource;

                  return (
                    <div key={task.id} className="p-5 hover:bg-slate-50/50 transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {req ? req.title : `Request #${task.request_id?.slice(0, 8)}`}
                            </h4>
                            <StatusBadge status={task.status} />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Requester: <strong>{req?.requester_name || 'Emergency NGO'}</strong> &bull; Priority Score: {req?.priority_score}
                          </p>
                        </div>

                        {/* Status-specific Volunteer Actions */}
                        <div className="flex items-center space-x-2">
                          {task.status === 'Proposed' && (
                            <>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleAcceptTask(task.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Task</span>
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleDeclineTask(task.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          {task.status === 'Approved' && (
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleCompleteTask(task.id)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Mission Completed</span>
                            </button>
                          )}

                          {task.status === 'Completed' && (
                            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                              Mission Fulfilled
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cargo and Distance Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Cargo Supply</span>
                          <span className="font-semibold text-slate-800">
                            {res?.resource_name || 'Supplies'} ({task.quantity} units)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Depot Distance</span>
                          <span className="font-semibold text-slate-800">
                            {formatDistance(task.resource_distance_km)} to emergency site
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Distance</span>
                          <span className="font-semibold text-slate-800">
                            {formatDistance(task.volunteer_distance_km)} to site
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
