import { create } from 'zustand';
import type { MomsLikeYouPreview } from '../services/home/home-functions';
import { getRandomUsers } from '../services/home/home-functions';

interface MomsLikeYouStore {
  profiles: MomsLikeYouPreview[];
  isLoading: boolean;
  error: Error | null;

  fetchRandomUsers: (loggedUserId: string) => Promise<void>;
  clear: () => void;
}

export const useMomsLikeYouStore = create<MomsLikeYouStore>()((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,

  fetchRandomUsers: async (loggedUserId: string) => {
    if (!loggedUserId) return;
    set({ isLoading: true, error: null });
    try {
      const profiles = await getRandomUsers({
        loggedUserId,
        limitRandom: 5
      });
      set({ profiles, isLoading: false, error: null });
    } catch (err) {
      set({
        profiles: [],
        isLoading: false,
        error: err instanceof Error ? err : new Error(String(err))
      });
    }
  },

  clear: () => set({ profiles: [], error: null })
}));
