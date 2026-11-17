import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import RequestForm from '../components/RequestForm';
import LoadingState from '../components/LoadingState';
import {
  AlertCircle,
  Clock,
  Flame,
  CheckCircle2,
  Truck,
  Plus,
  Filter,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function NGODashboard() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Filter calculations
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const criticalRequests = requests.filter((r) => r.priority_category === 'Critical').length;
  const assignedRequests = requests.filter((r) => r.status === 'Assigned' || r.status === 'In Transit').length;
  const completedRequests = requests.filter((r) => r.status === 'Completed').length;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resource_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || r.resource_type === typeFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || String(r.urgency) === urgencyFilter;

    return matchesSearch && matchesStatus && matchesType && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            NGO Relief Operations Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{currentUser?.name || 'Care & Hope Foundation'}</strong> &bull; Submit demands and monitor dispatch
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFormModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Emergency Request</span>
        </button>
      </div>

      {/* Stat Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Requests"
          value={totalRequests}
          subtext="Logged by all NGOs"
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Pending Triage"
          value={pendingRequests}
          subtext="Awaiting allocation"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalRequests}
          subtext="Score ≥ 85 (Urgent)"
          icon={Flame}
          color="red"
        />
        <StatCard
          title="Dispatched / Transit"
          value={assignedRequests}
          subtext="Assigned resources"
          icon={Truck}
          color="purple"
        />
        <StatCard
          title="Completed"
          value={completedRequests}
          subtext="Fulfillments confirmed"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, supply type, or organization..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Resource Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Resource Types</option>
            <option value="Medicines">Medicines</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Food">Food</option>
            <option value="Shelter">Shelter</option>
            <option value="Clothing">Clothing</option>
            <option value="Medical Equipment">Medical Equipment</option>
            <option value="Other">Other</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="5">Urgency 5 (Extreme)</option>
            <option value="4">Urgency 4 (High)</option>
            <option value="3">Urgency 3 (Moderate)</option>
            <option value="2">Urgency 2 (Standard)</option>
            <option value="1">Urgency 1 (Low)</option>
          </select>
        </div>
      </div>

      {/* Requests Management Table */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Emergency Requests Directory ({filteredRequests.length})
          </h3>
          <span className="text-xs text-slate-500">
            Sorted by Priority Score &darr;
          </span>
        </div>

        {loading ? (
          <LoadingState message="Fetching emergency requests..." />
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No emergency requests match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Request Details</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Qty Needed</th>
                  <th className="px-4 py-3">People</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{req.priority_score}</span>
                        <StatusBadge status={req.priority_category} />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{req.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{req.requester_name}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                      {req.resource_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                      {req.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {req.people_affected}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        req.urgency >= 4 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Level {req.urgency}/5
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(req)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Submit New Request */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <RequestForm
              onSuccess={() => {
                setShowFormModal(false);
                loadRequests();
              }}
              onCancel={() => setShowFormModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedRequest.title}</h3>
                <p className="text-xs text-slate-500">Org: {selectedRequest.requester_name}</p>
              </div>
              <StatusBadge status={selectedRequest.priority_category} />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedRequest.description || 'No additional incident notes provided.'}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
              <div><strong>Resource Type:</strong> {selectedRequest.resource_type}</div>
              <div><strong>Required Quantity:</strong> {selectedRequest.quantity}</div>
              <div><strong>Urgency Level:</strong> {selectedRequest.urgency} / 5</div>
              <div><strong>People In Need:</strong> {selectedRequest.people_affected}</div>
              <div><strong>Priority Score:</strong> {selectedRequest.priority_score}</div>
              <div><strong>Current Status:</strong> {selectedRequest.status}</div>
              <div className="col-span-2">
                <strong>Coordinates:</strong> {selectedRequest.latitude}, {selectedRequest.longitude}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
