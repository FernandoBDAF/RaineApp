import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Child, ProfileSetupData } from '../types/profile-setup';
import type { UserProfile } from '../types/user';
import { getUserProfile } from '../services/firebase/users';
import { mmkvStorage } from './persist';

interface ProfileSetupStore extends ProfileSetupData {
  displayName: string;
  setName: (firstName: string, lastInitial: string) => void;
  setDisplayName: (displayName: string) => void;
  setPhoto: (photoURL: string) => void;
  setLocation: (zipCode: string, city: string, state: string, county: string) => void;
  setCityFeel: (cityFeel: ProfileSetupData['cityFeel']) => void;
  setChildren: (
    childCount: number,
    children: Child[],
    isExpecting: boolean,
    dueDate: ProfileSetupData['dueDate']
  ) => void;
  setBeforeMotherhood: (beforeMotherhood: ProfileSetupData['beforeMotherhood']) => void;
  setPerfectWeekend: (perfectWeekend: ProfileSetupData['perfectWeekend']) => void;
  setFeelYourself: (feelYourself: ProfileSetupData['feelYourself']) => void;
  setHardTruths: (hardTruths: ProfileSetupData['hardTruths']) => void;
  setUnexpectedJoys: (unexpectedJoys: ProfileSetupData['unexpectedJoys']) => void;
  setAesthetic: (aesthetic: ProfileSetupData['aesthetic']) => void;
  setMomFriendStyle: (momFriendStyle: ProfileSetupData['momFriendStyle']) => void;
  setWhatBroughtYou: (whatBroughtYou: ProfileSetupData['whatBroughtYou']) => void;
  setBio: (generatedBio: string, bioApproved: boolean) => void;
  setCurrentStep: (currentStep: number) => void;
  decrementStep: () => void;
  completeSetup: (profileSetupCompletedAt: string) => void;
  reset: () => void;
  syncFromUserProfile: (profile: UserProfile) => void;
  syncFromFirestore: (uid: string) => Promise<void>;
}

const initialState: ProfileSetupData & { displayName: string } = {
  uid: '',
  displayName: '',
  firstName: '',
  lastInitial: '',
  photoURL: '',
  zipCode: '',
  city: '',
  state: '',
  county: '',
  cityFeel: null,
  childCount: 0,
  isExpecting: false,
  dueDate: null,
  children: [],
  beforeMotherhood: [],
  perfectWeekend: [],
  feelYourself: null,
  hardTruths: [],
  unexpectedJoys: [],
  aesthetic: [],
  momFriendStyle: [],
  whatBroughtYou: null,
  generatedBio: '',
  bioApproved: false,
  currentStep: 1,
  profileSetupCompletedAt: null
};

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUid: (uid: string) => set({ uid }),
      setDisplayName: (displayName) => set({ displayName }),
      setName: (firstName, lastInitial) => set({ firstName, lastInitial }),
      setPhoto: (photoURL) => set({ photoURL }),
      setLocation: (zipCode, city, state, county) => set({ zipCode, city, state, county }),
      setCityFeel: (cityFeel) => set({ cityFeel }),
      setChildren: (childCount, children, isExpecting, dueDate) =>
        set({ childCount, children, isExpecting, dueDate }),
      setBeforeMotherhood: (beforeMotherhood) => set({ beforeMotherhood }),
      setPerfectWeekend: (perfectWeekend) => set({ perfectWeekend }),
      setFeelYourself: (feelYourself) => set({ feelYourself }),
      setHardTruths: (hardTruths) => set({ hardTruths }),
      setUnexpectedJoys: (unexpectedJoys) => set({ unexpectedJoys }),
      setAesthetic: (aesthetic) => set({ aesthetic }),
      setMomFriendStyle: (momFriendStyle) => set({ momFriendStyle }),
      setWhatBroughtYou: (whatBroughtYou) => set({ whatBroughtYou }),
      setBio: (generatedBio, bioApproved) => set({ generatedBio, bioApproved }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      decrementStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      completeSetup: (profileSetupCompletedAt) => set({ profileSetupCompletedAt }),
      reset: () => set(initialState),
      syncFromUserProfile: (profile) =>
        set({
          uid: profile.uid ?? '',
          displayName: profile.displayName ?? '',
          firstName: profile.firstName ?? '',
          lastInitial: profile.lastInitial ?? '',
          photoURL: profile.photoURL ?? '',
          zipCode: profile.zipCode ?? '',
          city: profile.city ?? '',
          state: profile.state ?? '',
          county: profile.county ?? '',
          cityFeel: (profile.cityFeel as ProfileSetupData['cityFeel']) || null,
          childCount: profile.childCount ?? 0,
          isExpecting: profile.isExpecting ?? false,
          dueDate: profile.dueDate,
          children: (profile.children as Child[]) ?? [],
          beforeMotherhood:
            (profile.beforeMotherhood as ProfileSetupData['beforeMotherhood']) ?? [],
          perfectWeekend: (profile.perfectWeekend as ProfileSetupData['perfectWeekend']) ?? [],
          feelYourself: (profile.feelYourself as ProfileSetupData['feelYourself']) ?? null,
          hardTruths: (profile.hardTruths as ProfileSetupData['hardTruths']) ?? [],
          unexpectedJoys: (profile.unexpectedJoys as ProfileSetupData['unexpectedJoys']) ?? [],
          aesthetic: (profile.aesthetic as ProfileSetupData['aesthetic']) ?? [],
          momFriendStyle: (profile.momFriendStyle as ProfileSetupData['momFriendStyle']) ?? [],
          whatBroughtYou: (profile.whatBroughtYou as ProfileSetupData['whatBroughtYou']) ?? null,
          generatedBio: profile.generatedBio ?? '',
          bioApproved: profile.bioApproved ?? false,
          profileSetupCompletedAt: profile.profileSetupCompletedAt?.toDate().toISOString() ?? null
        }),
      syncFromFirestore: async (uid) => {
        const profile = await getUserProfile(uid);
        if (profile) {
          useProfileSetupStore.getState().syncFromUserProfile(profile);
        }
      }
    }),
    {
      name: 'profile-setup',
      storage: mmkvStorage
    }
  )
);
