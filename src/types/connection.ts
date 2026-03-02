import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type WhoConnected = 'me' | 'them';

export const WHO_CONNECTED_VALUES: Record<WhoConnected, string> = {
  me: 'me',
  them: 'them'
};

export interface ConncetionDetails {
  userConnectedUid: string;
  whoConnected: WhoConnected;
  connectionAcceptedAt: FirebaseFirestoreTypes.Timestamp | null;
  connectionRejectedAt: FirebaseFirestoreTypes.Timestamp | null;
}

export interface Connection {
  connectionUserUid: string;
  connectionDetailsList: ConncetionDetails[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
