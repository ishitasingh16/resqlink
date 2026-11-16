/**
 * ResQLink Emergency Resource and Volunteer Matching Algorithm
 * 
 * B.Tech Academic Project Prototype
 * 
 * Implements a transparent greedy matching process:
 * 1. Filter resources by matching `resource_type`.
 * 2. Filter out depleted, zero-quantity, or 'Unavailable' resources.
 * 3. Calculate distance from each candidate resource to the emergency location via Haversine.
 * 4. Rank eligible resources by proximity (closest first).
 * 5. Determine matching volunteer skill requirements based on the resource type.
 * 6. Filter available volunteers who possess suitable skills or general logistics capabilities.
 * 7. Calculate volunteer distance from the emergency location.
 * 8. Rank eligible volunteers by proximity.
 * 9. Provide full transparent match diagnostics (reasons for inclusions/exclusions).
 */

import { calculateDistance } from './distance.js';

// Mapping of resource types to preferred volunteer skills
export const SKILL_REQUIREMENTS_BY_RESOURCE = {
  'Medicines': ['Medical assistance', 'Transportation'],
  'Medical Equipment': ['Medical assistance', 'Transportation', 'Logistics'],
  'Drinking Water': ['Transportation', 'Logistics', 'General assistance'],
  'Food': ['Food distribution', 'Transportation', 'Logistics'],
  'Shelter': ['Rescue support', 'Logistics', 'General assistance'],
  'Clothing': ['General assistance', 'Logistics', 'Transportation'],
  'Other': ['General assistance', 'Logistics', 'Transportation']
};

/**
 * Checks if a volunteer possesses any of the required skills for a given resource type.
 * 
 * @param {Array<string>} volunteerSkills 
 * @param {string} resourceType 
 * @returns {boolean}
 */
export function hasRelevantSkills(volunteerSkills, resourceType) {
  if (!Array.isArray(volunteerSkills) || volunteerSkills.length === 0) {
    return false;
  }
  const preferred = SKILL_REQUIREMENTS_BY_RESOURCE[resourceType] || ['General assistance'];
  return volunteerSkills.some(skill => preferred.includes(skill));
}

/**
 * Finds and ranks suitable resources and volunteers for a given emergency request.
 * 
 * @param {Object} request - The emergency request object
 * @param {Array<Object>} allResources - List of all resources from DB/store
 * @param {Array<Object>} allVolunteers - List of all volunteers from DB/store
 * @returns {Object} Transparent matching result with recommendations and diagnostic logs
 */
export function findMatchesForRequest(request, allResources = [], allVolunteers = []) {
  if (!request) {
    return {
      success: false,
      recommendedResource: null,
      recommendedVolunteer: null,
      candidateResources: [],
      candidateVolunteers: [],
      allocatedQuantity: 0,
      diagnostics: ['No emergency request provided for matching.']
    };
  }

  const diagnostics = [];
  diagnostics.push(`Evaluating matches for Request #${request.id?.slice(0, 8) || 'N/A'}: "${request.title}" (${request.resource_type}, Qty Needed: ${request.quantity})`);

  // -------------------------------------------------------------
  // STEP 1: Filter & Rank Resources
  // -------------------------------------------------------------
  const candidateResources = [];
  const excludedResources = [];

  for (const res of allResources) {
    // 1. Resource Type Match
    if (res.resource_type !== request.resource_type) {
      continue; // Silently skip unrelated types
    }

    // 2. Status & Quantity Check
    if (res.status === 'Unavailable' || res.status === 'Depleted') {
      excludedResources.push({
        resource: res,
        reason: `Resource status is '${res.status}'`
      });
      continue;
    }

    if (!res.quantity || res.quantity <= 0) {
      excludedResources.push({
        resource: res,
        reason: 'Zero quantity available'
      });
      continue;
    }

    // 3. Distance Calculation
    const distanceKm = calculateDistance(
      request.latitude,
      request.longitude,
      res.latitude,
      res.longitude
    );

    if (distanceKm === null) {
      excludedResources.push({
        resource: res,
        reason: 'Invalid coordinates for distance calculation'
      });
      continue;
    }

    candidateResources.push({
      ...res,
      distanceKm,
      canFullySatisfy: res.quantity >= request.quantity,
      satisfiableQuantity: Math.min(res.quantity, request.quantity)
    });
  }

  // Rank candidate resources: prefer those that fully satisfy, then sort by distance ascending
  candidateResources.sort((a, b) => {
    // If one can fully satisfy and the other cannot, prioritize full satisfaction
    if (a.canFullySatisfy !== b.canFullySatisfy) {
      return a.canFullySatisfy ? -1 : 1;
    }
    // Otherwise closest distance wins
    return a.distanceKm - b.distanceKm;
  });

  const bestResource = candidateResources.length > 0 ? candidateResources[0] : null;

  if (bestResource) {
    diagnostics.push(
      `Found ${candidateResources.length} matching resource(s). Top pick: "${bestResource.resource_name}" by ${bestResource.donor_name} (${bestResource.distanceKm} km away, Qty: ${bestResource.quantity}/${request.quantity})`
    );
  } else {
    diagnostics.push(
      `No available resources found for type "${request.resource_type}". (Checked ${allResources.length} total resources; ${excludedResources.length} had matching type but were depleted or unavailable).`
    );
  }

  // -------------------------------------------------------------
  // STEP 2: Filter & Rank Volunteers
  // -------------------------------------------------------------
  const candidateVolunteers = [];
  const excludedVolunteers = [];

  for (const vol of allVolunteers) {
    // 1. Availability check
    if (!vol.available) {
      excludedVolunteers.push({
        volunteer: vol,
        reason: 'Volunteer currently marked as unavailable/busy'
      });
      continue;
    }

    // 2. Skill check
    const skillsMatch = hasRelevantSkills(vol.skills, request.resource_type);
    if (!skillsMatch) {
      excludedVolunteers.push({
        volunteer: vol,
        reason: `Volunteer lacks preferred skills for ${request.resource_type}`
      });
      continue;
    }

    // 3. Distance Calculation from Volunteer to Emergency Site
    const distanceKm = calculateDistance(
      request.latitude,
      request.longitude,
      vol.latitude,
      vol.longitude
    );

    if (distanceKm === null) {
      excludedVolunteers.push({
        volunteer: vol,
        reason: 'Invalid coordinates'
      });
      continue;
    }

    candidateVolunteers.push({
      ...vol,
      distanceKm
    });
  }

  // Rank volunteers by proximity ascending (with vehicle bonus if distances are close)
  candidateVolunteers.sort((a, b) => {
    // If vehicle availability differs and distance difference is within 2km, prefer vehicle
    const diff = a.distanceKm - b.distanceKm;
    if (Math.abs(diff) < 2.0 && a.has_vehicle !== b.has_vehicle) {
      return a.has_vehicle ? -1 : 1;
    }
    return diff;
  });

  const bestVolunteer = candidateVolunteers.length > 0 ? candidateVolunteers[0] : null;

  if (bestVolunteer) {
    diagnostics.push(
      `Found ${candidateVolunteers.length} available volunteer(s) with matching skills. Top pick: "${bestVolunteer.name}" (${bestVolunteer.distanceKm} km away, Vehicle: ${bestVolunteer.has_vehicle ? 'Yes' : 'No'}, Skills: ${bestVolunteer.skills.join(', ')})`
    );
  } else {
    diagnostics.push(
      `No available volunteers found with matching skills for "${request.resource_type}". (Checked ${allVolunteers.length} volunteers; ${excludedVolunteers.length} were either unavailable or lacked relevant skills).`
    );
  }

  const allocatedQuantity = bestResource
    ? Math.min(bestResource.quantity, request.quantity)
    : 0;

  return {
    success: !!bestResource,
    recommendedResource: bestResource,
    recommendedVolunteer: bestVolunteer,
    candidateResources,
    candidateVolunteers,
    excludedResources,
    excludedVolunteers,
    allocatedQuantity,
    diagnostics
  };
}
