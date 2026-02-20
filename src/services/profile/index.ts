import type { ProfileSetupData } from '../../types/profile-setup';
import { isFirebaseMockMode, isDev } from '../../config/environment';

/**
 * Whether Firestore operations should be skipped.
 * True when Firebase mock mode is on OR when running in dev mode
 * (dev mode uses mock auth, so the user has no real Firestore permissions).
 */
function shouldSkipFirestore(): boolean {
  return isFirebaseMockMode();
}

export async function saveProfileSetup(uid: string, data: ProfileSetupData): Promise<void> {
  if (shouldSkipFirestore()) {
    if (isDev) console.log('🔶 [Mock] saveProfileSetup skipped');
    return;
  }
  const firestore = require('@react-native-firebase/firestore').default;
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      ...data,
      profileSetupCompleted: true,
      profileSetupCompletedAt: firestore.FieldValue.serverTimestamp()
    });
}

export async function uploadProfilePhoto(uid: string, uri: string): Promise<string> {
  if (shouldSkipFirestore()) {
    return uri;
  }
  const storage = require('@react-native-firebase/storage').default;
  const reference = storage().ref(`users/${uid}/profile.jpg`);
  await reference.putFile(uri);
  return reference.getDownloadURL();
}

export async function addToWaitlist(data: {
  email: string;
  zipCode: string;
  city: string;
  state: string;
  county: string;
}): Promise<void> {
  if (shouldSkipFirestore()) {
    if (isDev) console.log('🔶 [Mock] addToWaitlist skipped');
    return;
  }
  const firestore = require('@react-native-firebase/firestore').default;
  await firestore()
    .collection('waitlist')
    .add({
      ...data,
      source: 'onboarding',
      createdAt: firestore.FieldValue.serverTimestamp()
    });
}
