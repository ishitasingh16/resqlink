import React, { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  PlusCircle,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const RESOURCE_TYPES = [
  'Food',
  'Drinking Water',
  'Medicines',
  'Clothing',
  'Shelter',
  'Medical Equipment',
  'Other'
];

const DEPOT_PRESETS = [
  { name: 'Central Depot (Apex)', lat: 13.0550, lon: 80.2550 },
  { name: 'North Outer Ring Warehouse', lat: 13.1800, lon: 80.3100 },
  { name: 'Pharma Cold Storage', lat: 13.0800, lon: 80.2650 },
  { name: 'Community Kitchen Hub', lat: 13.0630, lon: 80.2350 }
];

export default function ResourceForm({ onSuccess, onCancel }) {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    resource_name: '',
    resource_type: 'Drinking Water',
    quantity: 100,
    donor_name: currentUser?.name || 'Apex Logistics Ltd',
    latitude: 13.0550,
    longitude: 80.2550,
    description: '',
    status: 'Available'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      latitude: preset.lat,
      longitude: preset.lon
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.resource_name.trim()) {
      setError('Please provide a name for the donated resource.');
      return;
    }
    if (Number(formData.quantity) <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    if (isNaN(Number(formData.latitude)) || isNaN(Number(formData.longitude))) {
      setError('Please provide valid latitude and longitude depot coordinates.');
      return;
    }

    try {
      setIsSubmitting(true);
      await resourceService.createResource({
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to register donated resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resq-card p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Register Donated Relief Inventory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            List emergency supplies available for immediate dispatch to crisis areas.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <strong>Validation Error: </strong> {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Resource successfully added to the emergency pool!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name & Donor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Resource Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="resource_name"
              required
              value={formData.resource_name}
              onChange={handleChange}
              placeholder="e.g. Bottled Drinking Water 20L Cans or Trauma Dressing Kits"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Donor / Organization
            </label>
            <input
              type="text"
              name="donor_name"
              value={formData.donor_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Type & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Resource Category <span className="text-red-500">*</span>
            </label>
            <select
              name="resource_type"
              value={formData.resource_type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Available Units / Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Location & Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Storage Depot Coordinates (Lat, Long)</span>
            </label>
            <div className="text-[11px] text-slate-500">
              Quick presets:
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {DEPOT_PRESETS.map((p) => (
              <button
                type="button"
                key={p.name}
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              name="latitude"
              required
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              step="any"
              name="longitude"
              required
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Storage & Packaging Notes
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Packaging specifications, shelf-life, batch numbers, refrigeration needs, or loading dock accessibility..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Registering...' : 'Add Resource to Pool'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
