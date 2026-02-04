import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'raine-storage' });

export const storageKeys = {
  authUser: 'auth.user',
  featureFlags: 'feature.flags',
  lastRoomId: 'chat.lastRoomId',
  validatedReferralCode: 'onboarding.referralCode',
  referralValidatedAt: 'onboarding.referralValidatedAt'
} as const;

export function setJson<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function getJson<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
