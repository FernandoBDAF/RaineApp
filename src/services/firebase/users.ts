import { db, getDb } from './firestore';
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
  const doc = await getUsersCollection().doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  const raw = doc.data();
  const data = { uid, ...(typeof raw === 'object' && raw !== null ? raw : {}) };
  return parseUserProfile(data);
}

export async function getUserProfiles(uids: string[]) {
  if (uids.length === 0) return [];
  const docs = await getUsersCollection().where('uid', 'in', uids).get();
  return docs.docs.map((doc) => doc.data() as UserProfile);
}

/**
 * Waits for the Auth trigger (onUserCreate) to create the user profile in Firestore.
 * The profile is created server-side, so we poll until it appears.
 * Errors are caught gracefully — registration should not fail because of Firestore hiccups,
 * since the Auth user already exists and the trigger will eventually create the profile.
 */
export async function waitForUserProfile(uid: string): Promise<UserProfile | null> {
  return getUserProfile(uid);
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await getUsersCollection().doc(uid).update(data);
}

export async function updateUserFcmToken(uid: string, token: string) {
  await getUsersCollection().doc(uid).update({ fcmToken: token });
}

export async function isReferralCodeTaken(code: string): Promise<boolean> {
  const snapshot = await db.collection('users').where('referralCode', '==', code).limit(1).get();
  return !snapshot.empty;
}
