import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "./persist";
import type { CommunityMembership, SavedPost, UserQuestion } from "../types/community";

interface CommunitiesStore {
  joinedCommunities: CommunityMembership[];
  savedPosts: SavedPost[];
  userQuestions: UserQuestion[];

  setJoinedCommunities: (communities: CommunityMembership[]) => void;
  addJoinedCommunity: (community: CommunityMembership) => void;
  removeJoinedCommunity: (communityId: string) => void;
  addSavedPost: (post: SavedPost) => void;
  removeSavedPost: (postId: string) => void;
  addUserQuestion: (question: UserQuestion) => void;
}

export const useCommunitiesStore = create<CommunitiesStore>()(
  persist(
    (set) => ({
      joinedCommunities: [],
      savedPosts: [],
      userQuestions: [],

      setJoinedCommunities: (joinedCommunities) => set({ joinedCommunities }),
      addJoinedCommunity: (community) =>
        set((state) => ({
          joinedCommunities: [...state.joinedCommunities, community],
        })),
      removeJoinedCommunity: (communityId) =>
        set((state) => ({
          joinedCommunities: state.joinedCommunities.filter(
            (c) => c.communityId !== communityId
          ),
        })),
      addSavedPost: (post) =>
        set((state) => ({
          savedPosts: [...state.savedPosts, post],
        })),
      removeSavedPost: (postId) =>
        set((state) => ({
          savedPosts: state.savedPosts.filter((p) => p.postId !== postId),
        })),
      addUserQuestion: (question) =>
        set((state) => ({
          userQuestions: [...state.userQuestions, question],
        })),
    }),
    {
      name: "communities",
      storage: mmkvStorage,
    }
  )
);
