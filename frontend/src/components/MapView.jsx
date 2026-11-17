import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from './StatusBadge';
import { calculateDistance, formatDistance } from '../algorithms/distance';
import { MapPin, AlertTriangle, Package, User, Crosshair, Navigation } from 'lucide-react';

// Custom colored SVG pin markers using L.divIcon
const createCustomIcon = (bgColor, iconType, label = '') => {
  let innerSvg = '';
  if (iconType === 'request') {
    innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (iconType === 'resource') {
    innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
  } else {
    // volunteer
    innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          background-color: ${bgColor};
          width: 34px;
          height: 34px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            ${innerSvg}
          </div>
        </div>
        ${label ? `<span style="background: rgba(15,23,42,0.85); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 4px; margin-top: 3px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${label}</span>` : ''}
      </div>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
};

const REQUEST_ICON = createCustomIcon('#dc2626', 'request');
const CRITICAL_REQUEST_ICON = createCustomIcon('#991b1b', 'request', 'CRITICAL');
const RESOURCE_ICON = createCustomIcon('#059669', 'resource');
const VOLUNTEER_ICON = createCustomIcon('#2563eb', 'volunteer');

export default function MapView({
  requests = [],
  resources = [],
  volunteers = [],
  selectedRequestId = null,
  highlightedResource = null,
  highlightedVolunteer = null,
  height = '580px',
  center = [13.0600, 80.2500],
  zoom = 12
}) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  // If selectedRequestId is passed via props, resolve it
  const activeRequest = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId)
    : selectedRequest;

  // Polyline coordinates for distance demonstration
  let resourceLine = null;
  let volunteerLine = null;
  let distToResource = null;
  let distToVolunteer = null;

  if (activeRequest && highlightedResource) {
    resourceLine = [
      [activeRequest.latitude, activeRequest.longitude],
      [highlightedResource.latitude, highlightedResource.longitude]
    ];
    distToResource = calculateDistance(
      activeRequest.latitude,
      activeRequest.longitude,
      highlightedResource.latitude,
      highlightedResource.longitude
    );
  }

  if (activeRequest && highlightedVolunteer) {
    volunteerLine = [
      [activeRequest.latitude, activeRequest.longitude],
      [highlightedVolunteer.latitude, highlightedVolunteer.longitude]
    ];
    distToVolunteer = calculateDistance(
      activeRequest.latitude,
      activeRequest.longitude,
      highlightedVolunteer.latitude,
      highlightedVolunteer.longitude
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      
      {/* Distance Overlay Banner if pair highlighted */}
      {activeRequest && (highlightedResource || highlightedVolunteer) && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-300">Selected Target: </span>
              <span className="font-bold text-white">{activeRequest.title}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {highlightedResource && (
              <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resource: <strong>{formatDistance(distToResource)}</strong> away</span>
              </div>
            )}
            {highlightedVolunteer && (
              <div className="flex items-center space-x-1.5 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Volunteer: <strong>{formatDistance(distToVolunteer)}</strong> away</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Emergency Requests Markers */}
        {requests.map((req) => {
          if (!req.latitude || !req.longitude) return null;
          const isCritical = req.priority_category === 'Critical';
          const icon = isCritical ? CRITICAL_REQUEST_ICON : REQUEST_ICON;

          return (
            <Marker
              key={req.id}
              position={[req.latitude, req.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => setSelectedRequest(req)
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 max-w-xs text-xs">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-slate-900 truncate">{req.title}</span>
                    <StatusBadge status={req.priority_category} />
                  </div>
                  <p className="text-slate-600 line-clamp-2">{req.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded">
                    <div><strong>Type:</strong> {req.resource_type}</div>
                    <div><strong>Qty Needed:</strong> {req.quantity}</div>
                    <div><strong>Urgency:</strong> Level {req.urgency}/5</div>
                    <div><strong>People:</strong> {req.people_affected}</div>
                    <div><strong>Score:</strong> {req.priority_score}</div>
                    <div><strong>Status:</strong> {req.status}</div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Org: {req.requester_name} &bull; Coordinates: {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 2. Resources Markers */}
        {resources.map((res) => {
          if (!res.latitude || !res.longitude) return null;
          return (
            <Marker
              key={res.id}
              position={[res.latitude, res.longitude]}
              icon={RESOURCE_ICON}
            >
              <Popup>
                <div className="p-1 space-y-1.5 max-w-xs text-xs">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-slate-900 truncate">{res.resource_name}</span>
                    <StatusBadge status={res.status} />
                  </div>
                  <p className="text-slate-600 text-[11px]">{res.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded">
                    <div><strong>Type:</strong> {res.resource_type}</div>
                    <div><strong>Available:</strong> {res.quantity} units</div>
                    <div><strong>Donor:</strong> {res.donor_name}</div>
                    <div><strong>Status:</strong> {res.status}</div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Warehouse Coordinates: {res.latitude.toFixed(4)}, {res.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Volunteers Markers */}
        {volunteers.map((vol) => {
          if (!vol.latitude || !vol.longitude) return null;
          return (
            <Marker
              key={vol.id}
              position={[vol.latitude, vol.longitude]}
              icon={VOLUNTEER_ICON}
            >
              <Popup>
                <div className="p-1 space-y-1.5 max-w-xs text-xs">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-slate-900">{vol.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      vol.available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {vol.available ? 'Ready on Duty' : 'Assigned / Busy'}
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1 bg-slate-50 p-1.5 rounded">
                    <div><strong>Skills:</strong> {vol.skills?.join(', ') || 'General'}</div>
                    <div><strong>Vehicle:</strong> {vol.has_vehicle ? 'Available (Yes)' : 'None'}</div>
                    <div><strong>Contact:</strong> {vol.phone}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Geodesic Allocation Vectors */}
        {resourceLine && (
          <Polyline
            positions={resourceLine}
            pathOptions={{ color: '#059669', weight: 3, dashArray: '6, 8', opacity: 0.9 }}
          />
        )}
        {volunteerLine && (
          <Polyline
            positions={volunteerLine}
            pathOptions={{ color: '#2563eb', weight: 3, dashArray: '4, 6', opacity: 0.9 }}
          />
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-md border border-slate-200 text-xs space-y-2">
        <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
          Map Legend
        </p>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-200"></span>
          <span className="text-slate-600 text-[11px]">Emergency Request (Urgent / Pending)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
          <span className="text-slate-600 text-[11px]">Available Resource Depot</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200"></span>
          <span className="text-slate-600 text-[11px]">Volunteer Station / Location</span>
        </div>
      </div>
    </div>
  );
}
