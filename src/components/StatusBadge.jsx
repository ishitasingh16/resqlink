import React from 'react';

export default function StatusBadge({ status, type = 'status' }) {
  if (!status) return null;

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  const s = String(status).trim();

  // Priority categories
  if (s === 'Critical') {
    colorClasses = 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400/20';
  } else if (s === 'High') {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-400/20';
  } else if (s === 'Medium') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'Low') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  }
  // Workflow statuses
  else if (s === 'Pending' || s === 'Proposed') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'Approved' || s === 'Available') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'Assigned' || s === 'Partially Allocated') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (s === 'In Transit') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (s === 'Completed') {
    colorClasses = 'bg-green-50 text-green-800 border-green-200';
  } else if (s === 'Rejected' || s === 'Cancelled' || s === 'Unavailable' || s === 'Depleted') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {s}
    </span>
  );
}
