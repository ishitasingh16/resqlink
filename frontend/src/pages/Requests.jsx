import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { resourceService } from '../services/resourceService';
import { volunteerService } from '../services/volunteerService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import RequestForm from '../components/RequestForm';
import MatchingModal from '../components/MatchingModal';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  Sparkles,
  Flame,
  ArrowUpDown
} from 'lucide-react';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [matchingRequest, setMatchingRequest] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const loadAll = async () => {
    try {
      setLoading(true);
      const [reqs, res, vols] = await Promise.all([
        requestService.getRequests(),
        resourceService.getResources(),
        volunteerService.getVolunteers()
      ]);
      setRequests(reqs);
      setResources(res);
      setVolunteers(vols);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resource_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || r.resource_type === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || r.priority_category === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span>Emergency Requests Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized disaster relief requests ranked via multi-criteria urgency algorithm
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Emergency Request</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, organization, or item..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Priority Tiers</option>
            <option value="Critical">Critical (≥ 85)</option>
            <option value="High">High (≥ 65)</option>
            <option value="Medium">Medium (≥ 40)</option>
            <option value="Low">Low (&lt; 40)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Type Filter */}
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
        </div>
      </div>

      {/* Directory Table */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            Displaying {filteredRequests.length} emergency records
          </span>
          <span className="text-[11px] text-slate-400">
            Formula: (urgency × 20) + (min(people, 100) × 0.5)
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading requests..." />
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No emergency requests match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Score &amp; Tier</th>
                  <th className="px-4 py-3">Emergency Request Title</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Resource Type</th>
                  <th className="px-4 py-3">Units Needed</th>
                  <th className="px-4 py-3">People in Need</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Smart Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm">{req.priority_score}</span>
                        <StatusBadge status={req.priority_category} />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{req.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{req.description}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                      {req.requester_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                      {req.resource_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                      {req.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {req.people_affected}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {req.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => setMatchingRequest(req)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition ml-auto shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Smart Match</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Allocated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <RequestForm
              onSuccess={() => {
                setShowAddModal(false);
                loadAll();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

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
