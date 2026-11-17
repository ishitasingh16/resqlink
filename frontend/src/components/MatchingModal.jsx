import React, { useState } from 'react';
import { findMatchesForRequest } from '../algorithms/allocation';
import { formatDistance } from '../algorithms/distance';
import { allocationService } from '../services/allocationService';
import StatusBadge from './StatusBadge';
import {
  Sparkles,
  GitMerge,
  Package,
  User,
  CheckCircle,
  XCircle,
  Info,
  Car,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function MatchingModal({
  request,
  resources = [],
  volunteers = [],
  onClose,
  onAllocationCreated
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Run the greedy allocation algorithm
  const matchResult = findMatchesForRequest(request, resources, volunteers);
  const {
    recommendedResource,
    recommendedVolunteer,
    candidateResources,
    candidateVolunteers,
    diagnostics
  } = matchResult;

  const [selectedResourceId, setSelectedResourceId] = useState(
    recommendedResource?.id || ''
  );
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(
    recommendedVolunteer?.id || ''
  );

  // Selected records based on user choice or default recommendation
  const chosenResource = candidateResources.find((r) => r.id === selectedResourceId) || recommendedResource;
  const chosenVolunteer = candidateVolunteers.find((v) => v.id === selectedVolunteerId) || recommendedVolunteer;

  const handleProposeAndApprove = async (autoApprove = false) => {
    if (!chosenResource) {
      setError('Cannot proceed without a matching resource.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1. Create proposed allocation
      const proposed = await allocationService.proposeAllocation({
        request_id: request.id,
        resource_id: chosenResource.id,
        volunteer_id: chosenVolunteer ? chosenVolunteer.id : null,
        quantity: Math.min(chosenResource.quantity, request.quantity),
        resource_distance_km: chosenResource.distanceKm,
        volunteer_distance_km: chosenVolunteer ? chosenVolunteer.distanceKm : null
      });

      // 2. If autoApprove is true, execute atomic approval
      if (autoApprove && proposed?.id) {
        await allocationService.approveAllocation(proposed.id);
        setSuccessMsg('Allocation created and approved atomically! Resource and volunteer status updated.');
      } else {
        setSuccessMsg('Allocation proposal recorded. Ready for HQ review.');
      }

      setTimeout(() => {
        if (onAllocationCreated) onAllocationCreated();
      }, 1200);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete allocation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Intelligent Resource & Volunteer Matching</span>
              </h3>
              <p className="text-xs text-slate-300">
                Transparent multi-criteria allocation based on urgency, proximity and skills
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Target Request Overview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Emergency Request
              </span>
              <StatusBadge status={request.priority_category} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{request.title}</h4>
                <p className="text-xs text-slate-500">By {request.requester_name}</p>
              </div>
              <div className="flex items-center space-x-3 text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span>Type: <strong className="text-slate-900">{request.resource_type}</strong></span>
                <span>Qty: <strong className="text-slate-900">{request.quantity}</strong></span>
                <span>Score: <strong className="text-red-600">{request.priority_score}</strong></span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Matching Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Resource Match Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                    <Package className="w-4 h-4" />
                    <span>Recommended Resource</span>
                  </div>
                  {chosenResource && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {formatDistance(chosenResource.distanceKm)} away
                    </span>
                  )}
                </div>

                {chosenResource ? (
                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900">{chosenResource.resource_name}</p>
                    <p className="text-slate-600">Donor: {chosenResource.donor_name}</p>
                    <div className="flex justify-between items-center text-[11px] text-slate-700 pt-1 border-t border-emerald-200/50">
                      <span>Inventory: <strong>{chosenResource.quantity} units</strong></span>
                      <span className={chosenResource.quantity >= request.quantity ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                        {chosenResource.quantity >= request.quantity ? 'Full fulfillment' : 'Partial fulfillment'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg bg-red-50 text-red-700 text-xs space-y-1 border border-red-100">
                    <XCircle className="w-5 h-5 mx-auto text-red-500" />
                    <p className="font-bold">No Matching Resource Available</p>
                    <p className="text-[11px] text-red-600">
                      No active supplies match type "{request.resource_type}".
                    </p>
                  </div>
                )}

                {/* Candidate dropdown if multiple resources */}
                {candidateResources.length > 1 && (
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Alternative Candidate Resources ({candidateResources.length}):
                    </label>
                    <select
                      value={selectedResourceId}
                      onChange={(e) => setSelectedResourceId(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50"
                    >
                      {candidateResources.map((r, i) => (
                        <option key={r.id} value={r.id}>
                          #{i + 1}: {r.resource_name} ({formatDistance(r.distanceKm)}, {r.quantity} available)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Volunteer Match Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-700">
                    <User className="w-4 h-4" />
                    <span>Recommended Volunteer</span>
                  </div>
                  {chosenVolunteer && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {formatDistance(chosenVolunteer.distanceKm)} away
                    </span>
                  )}
                </div>

                {chosenVolunteer ? (
                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{chosenVolunteer.name}</p>
                      {chosenVolunteer.has_vehicle && (
                        <span className="flex items-center space-x-1 text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          <Car className="w-3 h-3" />
                          <span>Vehicle</span>
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">Contact: {chosenVolunteer.phone}</p>
                    <div className="pt-1 border-t border-blue-200/50">
                      <span className="text-[11px] text-slate-500">Skills: </span>
                      <span className="text-[11px] font-medium text-slate-800">
                        {chosenVolunteer.skills?.join(', ') || 'General'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg bg-amber-50 text-amber-800 text-xs space-y-1 border border-amber-100">
                    <Info className="w-5 h-5 mx-auto text-amber-500" />
                    <p className="font-bold">No Matching Volunteer Available</p>
                    <p className="text-[11px] text-amber-700">
                      All volunteers with relevant skills are currently occupied or unavailable.
                    </p>
                  </div>
                )}

                {/* Candidate dropdown if multiple volunteers */}
                {candidateVolunteers.length > 1 && (
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Alternative Available Volunteers ({candidateVolunteers.length}):
                    </label>
                    <select
                      value={selectedVolunteerId}
                      onChange={(e) => setSelectedVolunteerId(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50"
                    >
                      {candidateVolunteers.map((v, i) => (
                        <option key={v.id} value={v.id}>
                          #{i + 1}: {v.name} ({formatDistance(v.distanceKm)}, {v.has_vehicle ? 'Vehicle' : 'No Vehicle'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Transparent Matching Diagnostics / Academic Audit Log */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-400">
                [ALGORITHM EXECUTION LOG]
              </span>
              <span className="text-[10px] text-emerald-400">Haversine Distance Model Active</span>
            </div>
            <div className="space-y-1 text-[11px] max-h-32 overflow-y-auto pt-1">
              {diagnostics.map((d, idx) => (
                <p key={idx} className="leading-relaxed">
                  <span className="text-blue-400">&gt;</span> {d}
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={isSubmitting || !chosenResource}
              onClick={() => handleProposeAndApprove(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition disabled:opacity-40"
            >
              Propose Only
            </button>

            <button
              type="button"
              disabled={isSubmitting || !chosenResource}
              onClick={() => handleProposeAndApprove(true)}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition disabled:opacity-40"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Allocating...' : 'Approve & Dispatch Allocation'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
