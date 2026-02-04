import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Room {
  id: string;
  name: string;
  memberIds: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: FirebaseFirestoreTypes.Timestamp;
  };
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
