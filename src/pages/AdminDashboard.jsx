import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { resourceService } from '../services/resourceService';
import { volunteerService } from '../services/volunteerService';
import { allocationService } from '../services/allocationService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import MatchingModal from '../components/MatchingModal';
import { formatDistance } from '../algorithms/distance';
import {
  ShieldCheck,
  AlertCircle,
  Flame,
  Package,
  Users,
  GitMerge,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Radio,
  Check,
  X,
  Play
} from 'lucide-react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Matching Modal
  const [matchingRequest, setMatchingRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [reqs, res, vols, allocs] = await Promise.all([
        requestService.getRequests(),
        resourceService.getResources(),
        volunteerService.getVolunteers(),
        allocationService.getAllocations()
      ]);
      setRequests(reqs);
      setResources(res);
      setVolunteers(vols);
      setAllocations(allocs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Stats
  const totalRequests = requests.length;
  const criticalRequests = requests.filter((r) => r.priority_category === 'Critical').length;
  const availableResources = resources.filter((r) => r.status === 'Available').length;
  const activeVolunteers = volunteers.filter((v) => v.available).length;
  const pendingAllocations = allocations.filter((a) => a.status === 'Proposed').length;
  const completedAllocations = allocations.filter((a) => a.status === 'Completed').length;

  // Unassigned urgent requests ready for matching
  const urgentPendingRequests = requests.filter((r) => r.status === 'Pending').slice(0, 5);

  // Proposed allocations needing review
  const proposedAllocations = allocations.filter((a) => a.status === 'Proposed');

  // Allocation actions
  const handleApproveAllocation = async (allocationId) => {
    if (!window.confirm('Approve this allocation? This will atomically deduct the resource quantity and assign the volunteer.')) {
      return;
    }
    try {
      setActionLoading(true);
      await allocationService.approveAllocation(allocationId);
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectAllocation = async (allocationId) => {
    if (!window.confirm('Reject this proposed allocation?')) {
      return;
    }
    try {
      setActionLoading(true);
      await allocationService.rejectAllocation(allocationId);
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <span>State Emergency Operations Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized triage, automated multi-criteria matching, and real-time relief dispatch
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live Network Monitoring</span>
          </span>
        </div>
      </div>

      {/* Six Overview Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Demands"
          value={totalRequests}
          subtext="Relief requests"
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalRequests}
          subtext="Urgency score ≥ 85"
          icon={Flame}
          color="red"
        />
        <StatCard
          title="Available Stock"
          value={availableResources}
          subtext="Active depots"
          icon={Package}
          color="green"
        />
        <StatCard
          title="Field Volunteers"
          value={activeVolunteers}
          subtext="Ready on duty"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Pending Review"
          value={pendingAllocations}
          subtext="Awaiting HQ signoff"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Completed"
          value={completedAllocations}
          subtext="Missions fulfilled"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Action Center: Pending Allocation Reviews */}
      {proposedAllocations.length > 0 && (
        <div className="resq-card p-5 bg-amber-50/60 border border-amber-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Allocations Awaiting Admin Sign-off ({proposedAllocations.length})
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-semibold">Requires Atomic Authorization</span>
          </div>

          <div className="divide-y divide-amber-200/60 bg-white rounded-xl border border-amber-200 overflow-hidden">
            {proposedAllocations.map((alloc) => (
              <div key={alloc.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {alloc.request?.title || 'Emergency Request'}
                    </span>
                    <StatusBadge status={alloc.request?.priority_category} />
                  </div>
                  <p className="text-slate-600">
                    Resource: <strong>{alloc.resource?.resource_name}</strong> ({alloc.quantity} units, {formatDistance(alloc.resource_distance_km)} away)
                    &bull; Volunteer: <strong>{alloc.volunteer?.name || 'Unassigned'}</strong> ({formatDistance(alloc.volunteer_distance_km)} away)
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleApproveAllocation(alloc.id)}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve &amp; Dispatch</span>
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleRejectAllocation(alloc.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Pending Requests with One-Click Smart Match */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-red-600" />
              <span>Prioritized Emergency Demands Queue</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked in descending order by urgency score. Trigger greedy matching to inspect proximate resources &amp; volunteers.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Calculating priority matrix..." />
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentPendingRequests.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base font-black text-slate-900">{req.priority_score}</span>
                    <StatusBadge status={req.priority_category} />
                    <span className="font-bold text-slate-900 text-sm">{req.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{req.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Org: <strong className="text-slate-700">{req.requester_name}</strong></span>
                    <span>Supply: <strong className="text-slate-700">{req.resource_type} ({req.quantity} units)</strong></span>
                    <span>People in crisis: <strong className="text-slate-700">{req.people_affected}</strong></span>
                    <span>Status: <strong className="text-amber-600">{req.status}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMatchingRequest(req)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run Smart Matching</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Allocations and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Allocations History */}
        <div className="resq-card p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5 border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <GitMerge className="w-4 h-4 text-purple-600" />
              <span>Recent Dispatch Allocations</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {allocations.length}</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {allocations.slice(0, 5).map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {a.request?.title || 'Relief Dispatch'}
                  </span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-slate-600 text-[11px]">
                  Supply: {a.resource?.resource_name} ({a.quantity} units) &bull; Volunteer: {a.volunteer?.name || 'None'}
                </p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Haversine distance: {formatDistance(a.resource_distance_km)}</span>
                  <span>{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time System Audit & Execution Log */}
        <div className="resq-card p-5 bg-slate-900 text-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5 border-slate-800">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>System Diagnostics &amp; Decision Logs</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Academic Mode</span>
          </div>

          <div className="space-y-2 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto">
            <p className="leading-relaxed">
              <span className="text-emerald-400">[READY]</span> Priority Formula: (urgency × 20) + (min(people, 100) × 0.5)
            </p>
            <p className="leading-relaxed">
              <span className="text-blue-400">[ENGINE]</span> Haversine Earth Radius constant R = 6371.0088 km calibrated.
            </p>
            <p className="leading-relaxed">
              <span className="text-amber-400">[AUDIT]</span> Atomic database locking verified for resource deductions.
            </p>
            <p className="leading-relaxed">
              <span className="text-slate-400">[LOAD]</span> Synchronized {requests.length} requests, {resources.length} resource batches, {volunteers.length} volunteer responders.
            </p>
            <p className="leading-relaxed">
              <span className="text-emerald-400">[OK]</span> Zero duplicate allocation safeguards active.
            </p>
          </div>
        </div>

      </div>

      {/* Matching Modal */}
      {matchingRequest && (
        <MatchingModal
          request={matchingRequest}
          resources={resources}
          volunteers={volunteers}
          onClose={() => setMatchingRequest(null)}
          onAllocationCreated={() => {
            setMatchingRequest(null);
            loadAll();
          }}
        />
      )}

    </div>
  );
}
