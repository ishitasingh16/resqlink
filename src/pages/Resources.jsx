import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import ResourceForm from '../components/ResourceForm';
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Check,
  X
} from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editQty, setEditQty] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

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

  const handleToggleStatus = async (resource) => {
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

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.resource_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.donor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.resource_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || res.resource_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Emergency Relief Inventory Pool</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centrally cataloged emergency supplies, medical items, and relief provisions
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

      {/* Filter Bar */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resource title, category, or donor..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Partially Allocated">Partially Allocated</option>
            <option value="Depleted">Depleted</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Food">Food</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Medicines">Medicines</option>
            <option value="Shelter">Shelter</option>
            <option value="Clothing">Clothing</option>
            <option value="Medical Equipment">Medical Equipment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="resq-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            Cataloged Resources ({filteredResources.length})
          </span>
          <span className="text-xs text-slate-400">Inventory Status</span>
        </div>

        {loading ? (
          <LoadingState message="Loading resource pool..." />
        ) : filteredResources.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No resources match the selected search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Resource Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Donor / Organization</th>
                  <th className="px-4 py-3">Stock Units</th>
                  <th className="px-4 py-3">Coordinates</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((res) => {
                  const isEditingThis = editingResource === res.id;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-bold text-slate-900 truncate">{res.resource_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{res.description}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                        {res.resource_type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                        {res.donor_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                        {isEditingThis ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              value={editQty}
                              onChange={(e) => setEditQty(e.target.value)}
                              className="w-16 px-1.5 py-1 text-xs border border-blue-500 rounded outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveQuantity(res.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingResource(null)}
                              className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{res.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingResource(res.id);
                                setEditQty(res.quantity);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600"
                              title="Edit Quantity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {res.latitude?.toFixed(4)}, {res.longitude?.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={res.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(res)}
                          className={`text-xs font-semibold px-2 py-1 rounded transition ${
                            res.status === 'Unavailable'
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                          }`}
                        >
                          {res.status === 'Unavailable' ? 'Activate' : 'Disable'}
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

      {/* Add Modal */}
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
