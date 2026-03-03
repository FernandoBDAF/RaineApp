import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ConncetionDetails, Connection } from '../../types/connection';
import { UserProfile } from '../../types/user';
import { getConnectionsByConnectionUserUid, setConnection } from '../firebase/connections';
import { firestore } from '../firebase/firebase';

function appendConnectionDetail(
  existingList: ConncetionDetails[],
  newEntry: ConncetionDetails
): ConncetionDetails[] {
  const exists = existingList.some((d) => d.userConnectedUid === newEntry.userConnectedUid);
  if (exists) return existingList;
  return [...existingList, newEntry];
}

export async function generateConnection(uid: string, profile: UserProfile) {
  const myData = await getConnectionsByConnectionUserUid(uid);
  const theirData = await getConnectionsByConnectionUserUid(profile.uid);

  const now = new Date();
  const myNewEntry: ConncetionDetails = {
    userConnectedUid: profile.uid,
    whoConnected: 'me',
    connectionAcceptedAt: null,
    connectionRejectedAt: null,
    createdAt: now
  };

  const theirNewEntry: ConncetionDetails = {
    userConnectedUid: uid,
    whoConnected: 'them',
    connectionAcceptedAt: null,
    connectionRejectedAt: null,
    createdAt: now
  };

  const myList = appendConnectionDetail(
    myData?.connection?.connectionDetailsList ?? [],
    myNewEntry
  );
  const theirList = appendConnectionDetail(
    theirData?.connection?.connectionDetailsList ?? [],
    theirNewEntry
  );

  const myConnection: Connection = {
    userId: uid,
    connectionDetailsList: myList,
    createdAt:
      myData?.connection?.createdAt ??
      (firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp)
  };

  const theirConnection: Connection = {
    userId: profile.uid,
    connectionDetailsList: theirList,
    createdAt:
      theirData?.connection?.createdAt ??
      (firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp)
  };

  await Promise.all([setConnection(myConnection), setConnection(theirConnection)]);
}
