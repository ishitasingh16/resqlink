import React, { useState, useEffect } from 'react';
import { allocationService } from '../services/allocationService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { formatDistance } from '../algorithms/distance';
import {
  GitMerge,
  CheckCircle2,
  Clock,
  Check,
  X,
  Package,
  User,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllocations = async () => {
    try {
      setLoading(true);
      const data = await allocationService.getAllocations();
      setAllocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this allocation? Resource stock will be decremented and the volunteer will be marked busy.')) {
      return;
    }
    try {
      setActionLoading(true);
      await allocationService.approveAllocation(id);
      loadAllocations();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this proposed allocation?')) {
      return;
    }
    try {
      setActionLoading(true);
      await allocationService.rejectAllocation(id);
      loadAllocations();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this allocation mission as Completed? The volunteer will be released for new assignments.')) {
      return;
    }
    try {
      setActionLoading(true);
      await allocationService.completeAllocation(id);
      loadAllocations();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAllocations = allocations.filter((a) => {
    const matchesSearch =
      (a.request?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.resource?.resource_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.volunteer?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-purple-600" />
            <span>Emergency Resource Allocations Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparent algorithmic matching, proximity calculations, and atomic approval workflows
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Atomic Multi-Table Integrity</span>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search allocations by request, resource or volunteer..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Allocation Statuses</option>
            <option value="Proposed">Proposed (Awaiting HQ)</option>
            <option value="Approved">Approved / Active</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            Recorded Allocations ({filteredAllocations.length})
          </span>
          <span className="text-xs text-slate-400">
            Greedy Distance Proximity Optimization
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading allocations pipeline..." />
        ) : filteredAllocations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No allocations found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAllocations.map((alloc) => {
              const req = alloc.request;
              const res = alloc.resource;
              const vol = alloc.volunteer;

              return (
                <div key={alloc.id} className="p-5 hover:bg-slate-50/50 transition space-y-3">
                  
                  {/* Top Bar: Target & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">
                          {req ? req.title : `Request #${alloc.request_id?.slice(0, 8)}`}
                        </span>
                        <StatusBadge status={alloc.status} />
                        {req && <StatusBadge status={req.priority_category} />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requester: <strong>{req?.requester_name || 'Emergency Org'}</strong> &bull; Created: {new Date(alloc.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex items-center space-x-2">
                      {alloc.status === 'Proposed' && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(alloc.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve &amp; Dispatch</span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleReject(alloc.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {alloc.status === 'Approved' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleComplete(alloc.id)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Mission Completed</span>
                        </button>
                      )}

                      {alloc.status === 'Completed' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Delivered &amp; Closed
                        </span>
                      )}

                      {alloc.status === 'Rejected' && (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                          Rejected by Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Matching Triple Grid: Resource | Volunteer | Proximity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    
                    {/* Resource Block */}
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center space-x-1">
                        <Package className="w-3 h-3 text-emerald-600" />
                        <span>Matched Resource</span>
                      </span>
                      <p className="font-bold text-slate-900">{res?.resource_name || 'Supplies'}</p>
                      <p className="text-slate-500 text-[11px]">
                        Allocated: <strong>{alloc.quantity} units</strong> &bull; Donor: {res?.donor_name}
                      </p>
                    </div>

                    {/* Volunteer Block */}
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center space-x-1">
                        <User className="w-3 h-3 text-blue-600" />
                        <span>Assigned Volunteer</span>
                      </span>
                      <p className="font-bold text-slate-900">{vol?.name || 'Unassigned / Direct Dispatch'}</p>
                      <p className="text-slate-500 text-[11px]">
                        Skills: {vol?.skills?.join(', ') || 'N/A'} {vol?.has_vehicle ? '(Vehicle)' : ''}
                      </p>
                    </div>

                    {/* Distance & Routing Block */}
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Haversine Distance Breakdown
                      </span>
                      <p className="text-slate-700">
                        Resource to Site: <strong>{formatDistance(alloc.resource_distance_km)}</strong>
                      </p>
                      <p className="text-slate-700">
                        Volunteer to Site: <strong>{formatDistance(alloc.volunteer_distance_km)}</strong>
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
