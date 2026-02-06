import { create } from "zustand";
import type { ActivityCounts } from "../types/shared";

interface ActivityStore {
  counts: ActivityCounts;

  setCounts: (counts: ActivityCounts) => void;
  incrementCount: (key: keyof ActivityCounts) => void;
  decrementCount: (key: keyof ActivityCounts) => void;
}

export const useActivityStore = create<ActivityStore>()((set) => ({
  counts: {
    introRequests: 0,
    unreadMessages: 0,
    savedTips: 0,
    questionResponses: 0,
  },

  setCounts: (counts) => set({ counts }),
  incrementCount: (key) =>
    set((state) => ({
      counts: { ...state.counts, [key]: state.counts[key] + 1 },
    })),
  decrementCount: (key) =>
    set((state) => ({
      counts: { ...state.counts, [key]: Math.max(0, state.counts[key] - 1) },
    })),
}));
