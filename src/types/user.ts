import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscriptionStatus: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
}
