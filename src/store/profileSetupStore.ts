import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "./persist";
import type { Child, ProfileSetupData } from "../types/profile-setup";

interface ProfileSetupStore extends ProfileSetupData {
  setName: (firstName: string, lastInitial: string) => void;
  setPhoto: (photoURL: string) => void;
  setLocation: (zipCode: string, city: string, state: string, county: string) => void;
  setCityFeel: (cityFeel: ProfileSetupData["cityFeel"]) => void;
  setChildren: (
    childCount: number,
    children: Child[],
    isExpecting: boolean,
    dueDate: ProfileSetupData["dueDate"]
  ) => void;
  setBeforeMotherhood: (beforeMotherhood: ProfileSetupData["beforeMotherhood"]) => void;
  setPerfectWeekend: (perfectWeekend: ProfileSetupData["perfectWeekend"]) => void;
  setFeelYourself: (feelYourself: ProfileSetupData["feelYourself"]) => void;
  setHardTruths: (hardTruths: ProfileSetupData["hardTruths"]) => void;
  setUnexpectedJoys: (unexpectedJoys: ProfileSetupData["unexpectedJoys"]) => void;
  setAesthetic: (aesthetic: ProfileSetupData["aesthetic"]) => void;
  setMomFriendStyle: (momFriendStyle: ProfileSetupData["momFriendStyle"]) => void;
  setWhatBroughtYou: (whatBroughtYou: ProfileSetupData["whatBroughtYou"]) => void;
  setBio: (generatedBio: string, bioApproved: boolean) => void;
  setCurrentStep: (currentStep: number) => void;
  completeSetup: () => void;
  reset: () => void;
}

const initialState: ProfileSetupData = {
  firstName: "",
  lastInitial: "",
  photoURL: "",
  zipCode: "",
  city: "",
  state: "",
  county: "",
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
  generatedBio: "",
  bioApproved: false,
  currentStep: 1,
  completed: false
};

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set) => ({
      ...initialState,
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
      completeSetup: () => set({ completed: true }),
      reset: () => set(initialState)
    }),
    {
      name: "profile-setup",
      storage: mmkvStorage
    }
  )
);
