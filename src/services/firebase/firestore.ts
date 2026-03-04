/**
 * Firestore database instance.
 * Lazy-loaded to prevent crashes when Firebase is not configured.
 */

import firestore from '@react-native-firebase/firestore';

export function getDb() {
  return firestore();
}

// For backward compatibility
export const db = {
  collection: (name: string) => getDb().collection(name)
};
