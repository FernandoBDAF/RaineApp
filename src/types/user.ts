import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscriptionStatus: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
  firstName: string;
  lastInitial: string;
  zipCode: string;
  city: string;
  state: string;
  county: string;
  cityFeel: string;
  childCount: number;
  isExpecting: boolean;
  dueDate: null,
  children: [],
  beforeMotherhood: [],
  perfectWeekend: [],
  feelYourself: null,
  hardTruths: [],
  unexpectedJoys: [],
  aesthetic: [],
  momFriendStyle: [],
  whatBroughtYou: null,
  generatedBio: "",
  bioApproved: false,
  profileSetupCompleted: false
}
