/**
 * ResQLink Geographical Distance Calculator
 * 
 * Uses the Haversine formula to compute great-circle distance between two 
 * latitude/longitude points on Earth in kilometers.
 * 
 * Formula:
 *   a = sin²(Δlat/2) + cos(lat1) ⋅ cos(lat2) ⋅ sin²(Δlon/2)
 *   c = 2 ⋅ atan2( √a, √(1−a) )
 *   d = R ⋅ c
 * 
 * where R is Earth's mean radius (≈ 6371.0 km).
 */

const EARTH_RADIUS_KM = 6371.0088;

/**
 * Converts degrees to radians.
 * @param {number} deg
 * @returns {number}
 */
function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Validates whether latitude and longitude are within standard geographical bounds.
 * Latitude: -90 to 90, Longitude: -180 to 180
 * 
 * @param {number} lat 
 * @param {number} lon 
 * @returns {boolean}
 */
export function isValidCoordinate(lat, lon) {
  const nLat = Number(lat);
  const nLon = Number(lon);
  if (isNaN(nLat) || isNaN(nLon)) return false;
  if (nLat < -90 || nLat > 90) return false;
  if (nLon < -180 || nLon > 180) return false;
  return true;
}

/**
 * Calculates geographical distance between two sets of coordinates using the Haversine formula.
 * Gracefully handles missing or invalid inputs by returning null.
 * 
 * @param {number|string} lat1 - Latitude of point 1
 * @param {number|string} lon1 - Longitude of point 1
 * @param {number|string} lat2 - Latitude of point 2
 * @param {number|string} lon2 - Longitude of point 2
 * @returns {number|null} Distance in kilometers rounded to 2 decimal places, or null if invalid.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return null;
  }

  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  // If points are identical
  if (nLat1 === nLat2 && nLon1 === nLon2) {
    return 0;
  }

  const dLat = toRadians(nLat2 - nLat1);
  const dLon = toRadians(nLon2 - nLon1);

  const radLat1 = toRadians(nLat1);
  const radLat2 = toRadians(nLat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 100) / 100;
}

/**
 * Friendly formatter for distance display in UI.
 * e.g. 0.45 km -> "450 m", 4.2 km -> "4.2 km"
 * 
 * @param {number|null} km
 * @returns {string}
 */
export function formatDistance(km) {
  if (km === null || km === undefined || isNaN(km)) {
    return 'Distance unavailable';
  }
  const numeric = Number(km);
  if (numeric < 1) {
    return `${Math.round(numeric * 1000)} m`;
  }
  return `${numeric.toFixed(1)} km`;
}
