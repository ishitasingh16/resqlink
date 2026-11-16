import React, { useState } from 'react';
import { calculatePriority } from '../algorithms/priority';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import {
  AlertTriangle,
  Send,
  MapPin,
  Users,
  Package,
  Layers,
  Sparkles,
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

// Quick demo coordinate presets for easy testing
const LOCATION_PRESETS = [
  { name: 'Central Emergency Clinic', lat: 13.0827, lon: 80.2707 },
  { name: 'Riverside Community Shelter', lat: 13.0520, lon: 80.2510 },
  { name: 'Isolated Flooded Ward', lat: 13.0600, lon: 80.2300 },
  { name: 'North District Relief Point', lat: 13.0950, lon: 80.2850 }
];

export default function RequestForm({ onSuccess, onCancel }) {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    resource_type: 'Medicines',
    quantity: 50,
    urgency: 4,
    people_affected: 60,
    description: '',
    latitude: 13.0827,
    longitude: 80.2707,
    requester_name: currentUser?.name || 'Care & Hope Foundation'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Live priority preview
  const livePriority = calculatePriority(formData.urgency, formData.people_affected);

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

    // Validation
    if (!formData.title.trim()) {
      setError('Please provide a title for the emergency request.');
      return;
    }
    if (Number(formData.quantity) <= 0) {
      setError('Quantity required must be greater than zero.');
      return;
    }
    if (Number(formData.people_affected) < 0) {
      setError('People affected cannot be negative.');
      return;
    }
    if (isNaN(Number(formData.latitude)) || isNaN(Number(formData.longitude))) {
      setError('Please provide valid latitude and longitude coordinates.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestService.createRequest({
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        urgency: parseInt(formData.urgency, 10),
        people_affected: parseInt(formData.people_affected, 10),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit emergency request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resq-card p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Submit Emergency Relief Request</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit critical supply demands for automated urgency triage and resource matching.
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
          <span>Emergency request successfully recorded and prioritized!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title & Requester */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Emergency Antibiotics & First Aid Rations for Ward 4"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Requesting Organization
            </label>
            <input
              type="text"
              name="requester_name"
              value={formData.requester_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Resource Type & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Resource Type <span className="text-red-500">*</span>
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
              Quantity Required <span className="text-red-500">*</span>
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

        {/* Urgency & People Affected with Live Priority Preview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Priority Engine Parameters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Calculated Score:</span>
              <span className="text-sm font-black text-slate-900">{livePriority.score}</span>
              <StatusBadge status={livePriority.category} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Urgency Level: {formData.urgency}/5</span>
                <span className="text-slate-500">(1 = Low, 5 = Critical Life Threat)</span>
              </div>
              <input
                type="range"
                name="urgency"
                min="1"
                max="5"
                step="1"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 - Minimal</span>
                <span>3 - High</span>
                <span>5 - Critical</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                People Affected (Estimated)
              </label>
              <input
                type="number"
                name="people_affected"
                min="0"
                value={formData.people_affected}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-slate-400">
                Formula: (urgency × 20) + (min(people, 100) × 0.5)
              </p>
            </div>
          </div>
        </div>

        {/* Location & Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Location Coordinates (Lat, Long)</span>
            </label>
            <div className="text-[11px] text-slate-500">
              Quick presets:
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {LOCATION_PRESETS.map((p) => (
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
              placeholder="Latitude (e.g. 13.0827)"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              step="any"
              name="longitude"
              required
              placeholder="Longitude (e.g. 80.2707)"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Emergency Description & Incident Notes
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context regarding road access, ground situation, storage conditions, or immediate triage notes..."
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
            className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Logging Request...' : 'Submit Emergency Request'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
