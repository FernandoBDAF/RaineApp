import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './persist';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppStore {
  activeRoomId: string | null;
  isOnline: boolean;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  setActiveRoomId: (roomId: string | null) => void;
  setOnline: (isOnline: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeRoomId: null,
      isOnline: true,
      theme: 'system',
      notificationsEnabled: true,
      setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
      setOnline: (isOnline) => set({ isOnline }),
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled })
    }),
    {
      name: 'app.store',
      storage: mmkvStorage,
      partialize: (state) => ({
        activeRoomId: state.activeRoomId,
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled
      })
    }
  )
);
