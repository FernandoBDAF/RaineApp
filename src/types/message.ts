import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  reactions?: Record<string, string[]>;
}
