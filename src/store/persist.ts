import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '../cache/mmkv';

const mmkvStateStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  }
};

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage);
