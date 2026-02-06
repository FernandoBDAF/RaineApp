import type { ActivityCounts } from "../../types/shared";

/**
 * Activity aggregation service.
 * Currently returns hardcoded mock counts.
 * Will be wired to real data sources (Firestore, local stores) later.
 */
export function getActivityCounts(): ActivityCounts {
  return {
    introRequests: 2,
    unreadMessages: 4,
    savedTips: 0,
    questionResponses: 2,
  };
}
