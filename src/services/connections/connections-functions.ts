import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ConncetionDetails, Connection, WHO_CONNECTED_VALUES } from '../../types/connection';
import { firestore } from '../firebase/firebase';
import { addConnection } from '../firebase/connections';
import { UserProfile } from '../../types/user';

export async function generateConnection(uid: string, profile: UserProfile) {
  const mineConnection: Connection = {
    connectionUserUid: uid,
    connectionDetailsList: [
      {
        userConnectedUid: profile.uid,
        whoConnected: WHO_CONNECTED_VALUES.me,
        connectionAcceptedAt: null,
        connectionRejectedAt: null
      } as ConncetionDetails
    ] as ConncetionDetails[],
    createdAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp
  };

  const theirConnection: Connection = {
    connectionUserUid: profile.uid,
    connectionDetailsList: [
      {
        userConnectedUid: uid,
        whoConnected: WHO_CONNECTED_VALUES.them,
        connectionAcceptedAt: null,
        connectionRejectedAt: null
      } as ConncetionDetails
    ] as ConncetionDetails[],
    createdAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp
  };
  await addConnection(mineConnection);
  await addConnection(theirConnection);
}
