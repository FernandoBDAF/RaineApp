import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "./persist";
import type { HeartedItem } from "../types/drop";

interface DropsStore {
  heartedItems: HeartedItem[];

  setHeartedItems: (items: HeartedItem[]) => void;
  addHeartedItem: (item: HeartedItem) => void;
  removeHeartedItem: (itemId: string) => void;
  isHearted: (itemId: string) => boolean;
}

export const useDropsStore = create<DropsStore>()(
  persist(
    (set, get) => ({
      heartedItems: [],

      setHeartedItems: (heartedItems) => set({ heartedItems }),
      addHeartedItem: (item) =>
        set((state) => ({
          heartedItems: [...state.heartedItems, item],
        })),
      removeHeartedItem: (itemId) =>
        set((state) => ({
          heartedItems: state.heartedItems.filter((i) => i.itemId !== itemId),
        })),
      isHearted: (itemId) => get().heartedItems.some((i) => i.itemId === itemId),
    }),
    {
      name: "drops",
      storage: mmkvStorage,
    }
  )
);
