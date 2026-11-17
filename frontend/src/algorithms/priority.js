/**
 * ResQLink Emergency Request Priority Scoring Algorithm
 * 
 * B.Tech Academic Project: Intelligent Resource Allocation Prototype
 * 
 * Formula:
 *   priorityScore = (urgency × 20) + (min(peopleAffected, 100) × 0.5)
 * 
 * Breakdown:
 *   - urgency (1 to 5):
 *       Weight = 20 points per urgency unit.
 *       Contributes up to 100 points (5 × 20 = 100).
 *   - peopleAffected:
 *       Capped at 100 to prevent outlier disaster populations from overwhelming the scale.
 *       Weight = 0.5 points per affected person.
 *       Contributes up to 50 points (100 × 0.5 = 50).
 *   - Theoretical Maximum Score = 150.00
 * 
 * Priority Categories:
 *   - Critical: score >= 85 (Immediate life-threatening triage needed)
 *   - High:     score >= 65 (Urgent relief required within hours)
 *   - Medium:   score >= 40 (Standard priority relief within 24 hours)
 *   - Low:      score < 40  (Non-urgent recovery / supplemental supplies)
 */

export const PRIORITY_THRESHOLDS = {
  CRITICAL: 85,
  HIGH: 65,
  MEDIUM: 40
};

/**
 * Calculates priority score and category for an emergency request.
 * 
 * @param {number|string} urgency - Urgency scale from 1 (lowest) to 5 (extreme crisis)
 * @param {number|string} peopleAffected - Estimated number of people in need
 * @returns {{ score: number, category: ('Critical'|'High'|'Medium'|'Low') }}
 */
export function calculatePriority(urgency, peopleAffected) {
  const numericUrgency = Number(urgency) || 1;
  const numericPeople = Number(peopleAffected) || 0;

  // Clamp urgency between 1 and 5
  const clampedUrgency = Math.max(1, Math.min(5, numericUrgency));
  
  // Cap people affected at 100 to maintain balanced weighting
  const cappedPeople = Math.min(Math.max(0, numericPeople), 100);

  // Scoring calculation
  const urgencyComponent = clampedUrgency * 20;
  const peopleComponent = cappedPeople * 0.5;
  const rawScore = urgencyComponent + peopleComponent;
  
  // Round to 2 decimal places
  const score = Math.round(rawScore * 100) / 100;

  // Determine category
  let category = 'Low';
  if (score >= PRIORITY_THRESHOLDS.CRITICAL) {
    category = 'Critical';
  } else if (score >= PRIORITY_THRESHOLDS.HIGH) {
    category = 'High';
  } else if (score >= PRIORITY_THRESHOLDS.MEDIUM) {
    category = 'Medium';
  } else {
    category = 'Low';
  }

  return { score, category };
}

/**
 * Sorts an array of emergency requests by priority score descending.
 * Ties are broken by earlier creation timestamp (FIFO).
 * 
 * @param {Array<Object>} requests
 * @returns {Array<Object>}
 */
export function sortRequestsByPriority(requests) {
  if (!Array.isArray(requests)) return [];
  return [...requests].sort((a, b) => {
    const scoreA = Number(a.priority_score) || 0;
    const scoreB = Number(b.priority_score) || 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
  });
}
