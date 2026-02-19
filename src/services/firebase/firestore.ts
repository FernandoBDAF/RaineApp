/**
 * Firestore database instance.
 * Lazy-loaded to prevent crashes when Firebase is not configured.
 */

import { isFirebaseMockMode } from '../../config/environment';
import firestore from '@react-native-firebase/firestore';

// Mock Firestore for UI testing
const mockCollection = {
  doc: () => mockDoc,
  add: async () => ({ id: 'mock-doc-' + Date.now() }),
  where: () => mockCollection,
  orderBy: () => mockCollection,
  limit: () => mockCollection,
  onSnapshot: (callback: (snapshot: { docs: never[] }) => void) => {
    callback({ docs: [] });
    return () => {};
  },
  get: async () => ({ docs: [], empty: true }),
};

const mockDoc = {
  get: async () => ({ exists: false, data: () => null }),
  set: async () => {},
  update: async () => {},
  delete: async () => {},
  collection: () => mockCollection,
  onSnapshot: (_callback: (snapshot: { exists: boolean; data: () => unknown }) => void) => () => {},
};

const mockFirestore = () => ({
  collection: () => mockCollection,
});

export function getDb() {
  if (isFirebaseMockMode()) {
    return mockFirestore();
  }
  
  return firestore();
}

// For backward compatibility
export const db = {
  collection: (name: string) => getDb().collection(name),
};
