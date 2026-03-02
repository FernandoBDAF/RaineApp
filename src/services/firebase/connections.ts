import { getDb } from './firestore';
import { Connection } from '../../types/connection';

export const getConnectionsCollection = () => getDb().collection('connections');

export const addConnection = async (connection: Connection) => {
  await getConnectionsCollection().add(connection);
};

export const updateConnection = async (connection: Connection) => {
  await getConnectionsCollection().doc(connection.connectionUserUid).update(connection);
};

export const updateConnectionById = async (docId: string, connection: Connection) => {
  await getConnectionsCollection().doc(docId).update(connection);
};

export const deleteConnection = async (uid: string) => {
  await getConnectionsCollection().doc(uid).delete();
};

export const getConnections = async () => {
  const snapshot = await getConnectionsCollection().get();
  return snapshot.docs.map((doc) => doc.data());
};

export const getConnectionById = async (id: string) => {
  const doc = await getConnectionsCollection().doc(id).get();
  return doc.data() as Connection;
};

export const getConnectionsByConnectionUserUid = async (
  connectionUserUid: string
): Promise<{ connection: Connection; id: string } | null> => {
  const snapshot = await getConnectionsCollection()
    .where('connectionUserUid', '==', connectionUserUid)
    .get();
  const first = snapshot.docs[0];
  if (!first) return null;
  return { connection: first.data() as Connection, id: first.id };
};
