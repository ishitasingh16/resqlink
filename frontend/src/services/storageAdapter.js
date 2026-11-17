/**
 * ResQLink Storage Adapter
 * 
 * Provides local state persistence when Supabase credentials are not provided,
 * allowing full demo functionality (CRUD, status changes, matching, atomic allocation)
 * right in the browser.
 */

import {
  INITIAL_REQUESTS,
  INITIAL_RESOURCES,
  INITIAL_VOLUNTEERS,
  INITIAL_ALLOCATIONS
} from './mockData.js';

const STORAGE_KEYS = {
  REQUESTS: 'resqlink_requests_v1',
  RESOURCES: 'resqlink_resources_v1',
  VOLUNTEERS: 'resqlink_volunteers_v1',
  ALLOCATIONS: 'resqlink_allocations_v1'
};

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const localStore = {
  getRequests: () => getLocalData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS),
  setRequests: (data) => setLocalData(STORAGE_KEYS.REQUESTS, data),

  getResources: () => getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES),
  setResources: (data) => setLocalData(STORAGE_KEYS.RESOURCES, data),

  getVolunteers: () => getLocalData(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS),
  setVolunteers: (data) => setLocalData(STORAGE_KEYS.VOLUNTEERS, data),

  getAllocations: () => getLocalData(STORAGE_KEYS.ALLOCATIONS, INITIAL_ALLOCATIONS),
  setAllocations: (data) => setLocalData(STORAGE_KEYS.ALLOCATIONS, data),

  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
    localStorage.setItem(STORAGE_KEYS.ALLOCATIONS, JSON.stringify(INITIAL_ALLOCATIONS));
  }
};
