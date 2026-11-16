import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { resourceService } from '../services/resourceService';
import { volunteerService } from '../services/volunteerService';
import MapView from '../components/MapView';
import LoadingState from '../components/LoadingState';
import {
  MapPin,
  Layers,
  Filter,
  AlertTriangle,
  Package,
  Users,
  Compass,
  Crosshair
} from 'lucide-react';

export default function MapPage() {
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layer Visibility
  const [showRequests, setShowRequests] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);

  // Selected for distance line
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

  const loadMapData = async () => {
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

      // Pre-select first critical request and nearest resource for instant visual demonstration
      if (reqs.length > 0) setSelectedRequestId(reqs[0].id);
      if (res.length > 0) setSelectedResourceId(res[0].id);
      if (vols.length > 0) setSelectedVolunteerId(vols[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  const highlightedRes = resources.find((r) => r.id === selectedResourceId) || null;
  const highlightedVol = volunteers.find((v) => v.id === selectedVolunteerId) || null;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Compass className="w-6 h-6 text-blue-600" />
            <span>Regional GIS Emergency Situation Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time geospatial visualization of disaster triage zones, depots, and responder teams
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRequests(!showRequests)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              showRequests
                ? 'bg-red-50 text-red-700 border-red-200 shadow-xs'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Requests ({requests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResources(!showResources)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              showResources
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Resources ({resources.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              showVolunteers
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Volunteers ({volunteers.length})</span>
          </button>
        </div>
      </div>

      {/* Distance Inspection & Route Vector Control Bar */}
      <div className="resq-card p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Crosshair className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-bold">Inspect Distance Vector:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Target Request Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">Request:</span>
            <select
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
              className="p-1.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 max-w-xs"
            >
              <option value="">None</option>
              {requests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.resource_type})
                </option>
              ))}
            </select>
          </div>

          {/* Target Resource Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">Resource:</span>
            <select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
              className="p-1.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 max-w-xs"
            >
              <option value="">None</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.resource_name} ({res.quantity} units)
                </option>
              ))}
            </select>
          </div>

          {/* Target Volunteer Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">Volunteer:</span>
            <select
              value={selectedVolunteerId}
              onChange={(e) => setSelectedVolunteerId(e.target.value)}
              className="p-1.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 max-w-xs"
            >
              <option value="">None</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.has_vehicle ? 'Vehicle' : 'No Vehicle'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map View */}
      {loading ? (
        <LoadingState message="Rendering OpenStreetMap relief grid..." />
      ) : (
        <MapView
          requests={showRequests ? requests : []}
          resources={showResources ? resources : []}
          volunteers={showVolunteers ? volunteers : []}
          selectedRequestId={selectedRequestId}
          highlightedResource={highlightedRes}
          highlightedVolunteer={highlightedVol}
          height="620px"
          center={[13.0650, 80.2500]}
          zoom={12}
        />
      )}

      {/* Instructions / Notes */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Geospatial Routing Model:</p>
        <p>
          Markers display accurate synthetic coordinates centered across the relief grid.
          The green dashed line depicts the Haversine distance vector to the nearest resource depot, while the blue line displays the responder deployment vector.
          Click any pin on the map to inspect full triage, stock or volunteer credentials.
        </p>
      </div>

    </div>
  );
}
