import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ResourceForm from '../components/ResourceForm';
import LoadingState from '../components/LoadingState';
import {
  Package,
  CheckCircle,
  Plus,
  AlertTriangle,
  Edit2,
  EyeOff,
  Check,
  X,
  Search
} from 'lucide-react';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const donorName = currentUser?.name || 'Apex Logistics Ltd';

  // Stats
  const totalResources = resources.length;
  const availableResources = resources.filter((r) => r.status === 'Available').length;
  const allocatedResources = resources.filter((r) => r.status === 'Partially Allocated' || r.status === 'Allocated').length;
  const depletedOrUnavailable = resources.filter((r) => r.status === 'Depleted' || r.status === 'Unavailable').length;

  const filteredResources = resources.filter((r) =>
    r.resource_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.resource_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.donor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAvailability = async (resource) => {
    const newStatus = resource.status === 'Unavailable' ? 'Available' : 'Unavailable';
    try {
      await resourceService.setStatus(resource.id, newStatus);
      loadResources();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveQuantity = async (resourceId) => {
    const num = parseInt(editQty, 10);
    if (isNaN(num) || num < 0) {
      alert('Please enter a valid non-negative number.');
      return;
    }
    try {
      await resourceService.updateResource(resourceId, {
        quantity: num,
        status: num === 0 ? 'Depleted' : 'Available'
      });
      setEditingResource(null);
      loadResources();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Donor Resource Operations Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{donorName}</strong> &bull; Manage emergency inventory &amp; depot availability
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Donated Supplies</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Supplies Listed"
          value={totalResources}
          subtext="Across relief network"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Available for Dispatch"
          value={availableResources}
          subtext="Ready for greedy matching"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Allocated / In Transit"
          value={allocatedResources}
          subtext="Assigned to emergency sites"
          icon={Package}
          color="orange"
        />
        <StatCard
          title="Unavailable / Depleted"
          value={depletedOrUnavailable}
          subtext="Depleted or reserved"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Search and Filter */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by name, donor, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Resource Inventory Table */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Emergency Supplies Pool ({filteredResources.length})
          </h3>
          <span className="text-xs text-slate-500">Live Resource Warehouse</span>
        </div>

        {loading ? (
          <LoadingState message="Fetching donated inventory..." />
        ) : filteredResources.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No donated resources found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Resource Item</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Donor / Depot</th>
                  <th className="px-4 py-3">Quantity Available</th>
                  <th className="px-4 py-3">Depot Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((res) => {
                  const isOwner = res.donor_name.toLowerCase() === donorName.toLowerCase();
                  const isEditingThis = editingResource === res.id;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-bold text-slate-900 truncate">{res.resource_name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{res.description}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                        {res.resource_type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{res.donor_name}</span>
                        {isOwner && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                        {isEditingThis ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              value={editQty}
                              onChange={(e) => setEditQty(e.target.value)}
                              className="w-20 px-2 py-1 text-xs border border-blue-500 rounded outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveQuantity(res.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingResource(null)}
                              className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{res.quantity} units</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingResource(res.id);
                                setEditQty(res.quantity);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600"
                              title="Quick edit inventory quantity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {res.latitude?.toFixed(4)}, {res.longitude?.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={res.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(res)}
                          className={`text-xs font-semibold px-2 py-1 rounded transition ${
                            res.status === 'Unavailable'
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                          }`}
                        >
                          {res.status === 'Unavailable' ? 'Make Available' : 'Mark Unavailable'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <ResourceForm
              onSuccess={() => {
                setShowAddModal(false);
                loadResources();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
