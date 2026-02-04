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

export async function createUserProfile(uid: string, profile: UserProfile) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] User profile created:', uid);
    return;
  }

  await getUsersCollection().doc(uid).set(profile);
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
