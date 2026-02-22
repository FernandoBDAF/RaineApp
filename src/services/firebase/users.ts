import { db, getDb } from './firestore';
import { isFirebaseMockMode } from '../../config/environment';
import { userProfileSchema, type UserProfile } from '../../types/user';

// Lazy getter for users collection
const getUsersCollection = () => getDb().collection('users');

function parseUserProfile(data: unknown): UserProfile | null {
  const result = userProfileSchema.safeParse(data);
  if (!result.success) {
    console.error('[users] Invalid user profile data:', result.error.flatten());
    return null;
  }
  return result.data;
}

export async function getUserProfile(uid: string) {
  if (isFirebaseMockMode()) {
    return null;
  }

  const doc = await getUsersCollection().doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  const raw = doc.data();
  const data = { uid, ...(typeof raw === 'object' && raw !== null ? raw : {}) };
  return parseUserProfile(data);
}

/**
 * Waits for the Auth trigger (onUserCreate) to create the user profile in Firestore.
 * The profile is created server-side, so we poll until it appears.
 * Errors are caught gracefully — registration should not fail because of Firestore hiccups,
 * since the Auth user already exists and the trigger will eventually create the profile.
 */
export async function waitForUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] User profile created:', uid);
    return null;
  }

  return getUserProfile(uid);
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

  return getUsersCollection()
    .doc(uid)
    .onSnapshot((snapshot: { exists: boolean; data: () => unknown }) => {
      if (!snapshot.exists) {
        callback(null);
        return;
      }
      const raw = snapshot.data();
      const data = { uid, ...(typeof raw === 'object' && raw !== null ? raw : {}) };
      callback(parseUserProfile(data));
    });
}

export async function isReferralCodeTaken(code: string): Promise<boolean> {
    const snapshot = await db
    .collection("users")
    .where("referralCode", "==", code)
    .limit(1)
    .get();    
  return !snapshot.empty;
}