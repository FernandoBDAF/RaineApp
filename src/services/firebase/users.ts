import { getDb } from './firestore';
import { isFirebaseMockMode } from '../../config/environment';
import type { UserProfile } from '../../types';

// Lazy getter for users collection
const getUsersCollection = () => getDb().collection('users');

export async function getUserProfile(uid: string) {
  if (isFirebaseMockMode()) {
    return null;
  }

  const doc = await getUsersCollection().doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as UserProfile;
}


/**
 * Waits for the Auth trigger (onUserCreate) to create the user profile in Firestore.
 * The profile is created server-side, so we poll until it appears.
 * Errors are caught gracefully — registration should not fail because of Firestore hiccups,
 * since the Auth user already exists and the trigger will eventually create the profile.
 */
export async function waitForUserProfile(uid: string, maxAttempts = 10, delayMs = 500): Promise<UserProfile | null> {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] User profile created:', uid);
    return null;
  }

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const profile = await getUserProfile(uid);
      if (profile) return profile;
    } catch (error) {
      console.warn(`[waitForUserProfile] Attempt ${i + 1}/${maxAttempts} failed:`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.warn('[waitForUserProfile] Profile not found after polling — will be available later via Auth trigger.');
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] User profile updated:', uid, data);
    return;
  }

  await getUsersCollection().doc(uid).update(data);
}

export async function updateUserFcmToken(uid: string, token: string) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] FCM token updated:', uid);
    return;
  }

  await getUsersCollection().doc(uid).update({ fcmToken: token });
}

export function listenToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  if (isFirebaseMockMode()) {
    setTimeout(() => callback(null), 100);
    return () => {};
  }

  return getUsersCollection().doc(uid).onSnapshot((snapshot: { exists: boolean; data: () => unknown }) => {
    if (!snapshot.exists) {
      callback(null);
      return;
    }
    callback(snapshot.data() as UserProfile);
  });
}
