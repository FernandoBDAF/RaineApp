import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "./persist";
import type { Introduction, SavedConnection, MatchProfile } from "../types/introduction";

interface IntroductionsStore {
  activeConversations: Introduction[];
  savedConnections: SavedConnection[];
  pendingRequests: Introduction[];
  recommendedProfiles: MatchProfile[];

  setActiveConversations: (conversations: Introduction[]) => void;
  setSavedConnections: (connections: SavedConnection[]) => void;
  setPendingRequests: (requests: Introduction[]) => void;
  setRecommendedProfiles: (profiles: MatchProfile[]) => void;
  addSavedConnection: (connection: SavedConnection) => void;
  removeSavedConnection: (userId: string) => void;
  removePendingRequest: (introId: string) => void;
}

export const useIntroductionsStore = create<IntroductionsStore>()(
  persist(
    (set) => ({
      activeConversations: [],
      savedConnections: [],
      pendingRequests: [],
      recommendedProfiles: [],

      setActiveConversations: (activeConversations) => set({ activeConversations }),
      setSavedConnections: (savedConnections) => set({ savedConnections }),
      setPendingRequests: (pendingRequests) => set({ pendingRequests }),
      setRecommendedProfiles: (recommendedProfiles) => set({ recommendedProfiles }),
      addSavedConnection: (connection) =>
        set((state) => ({
          savedConnections: [...state.savedConnections, connection],
        })),
      removeSavedConnection: (userId) =>
        set((state) => ({
          savedConnections: state.savedConnections.filter((c) => c.userId !== userId),
        })),
      removePendingRequest: (introId) =>
        set((state) => ({
          pendingRequests: state.pendingRequests.filter((r) => r.id !== introId),
        })),
    }),
    {
      name: "introductions",
      storage: mmkvStorage,
    }
  )
);
