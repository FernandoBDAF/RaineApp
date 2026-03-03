import { getDb } from './firestore';
import type { Connection, ConncetionDetails } from '../../types/connection';

export const getConnectionsCollection = () => getDb().collection('connections');

export const addConnection = async (connection: Connection) => {
  await getConnectionsCollection().add(connection);
};

/**
 * Sets or merges a connection document. Uses doc(userId) as document ID.
 * Merge: true creates the doc if it doesn't exist (e.g. from Auth trigger).
 */
export const setConnection = async (connection: Connection) => {
  await getConnectionsCollection().doc(connection.userId).set(connection, { merge: true });
};

export const updateConnection = async (connection: Connection) => {
  await getConnectionsCollection().doc(connection.userId).update(connection);
};

export const updateConnectionDetailsById = async (
  docId: string,
  connectionDetailsList: ConncetionDetails[]
) => {
  await getConnectionsCollection().doc(docId).update({ connectionDetailsList });
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

/**
 * Gets the connection document for a user. Document ID = userId.
 * Each user has exactly one document in the connections collection.
 */
export const getConnectionsByConnectionUserUid = async (
  uid: string
): Promise<{ connection: Connection; id: string } | null> => {
  const doc = await getConnectionsCollection().doc(uid).get();
  if (!doc.exists) return null;
  const data = doc.data();
  const docId = (doc as { id: string }).id ?? uid;
  return {
    connection: { ...data, userId: data?.userId ?? uid } as Connection,
    id: docId
  };
};

/**
 * Cancels a pending connection request. Removes the connection entry from both
 * users' connection documents. Deletes a document if its list becomes empty.
 */
export const cancelConnectionRequest = async (myUid: string, theirUid: string): Promise<void> => {
  const myData = await getConnectionsByConnectionUserUid(myUid);
  const theirData = await getConnectionsByConnectionUserUid(theirUid);

  const filterOut = (list: ConncetionDetails[], uid: string) =>
    (list ?? []).filter((d) => d.userConnectedUid !== uid);

  if (myData) {
    const updated = filterOut(myData.connection.connectionDetailsList, theirUid);
    if (updated.length === 0) {
      await deleteConnection(myData.id);
    } else {
      await updateConnectionById(myData.id, {
        ...myData.connection,
        connectionDetailsList: updated
      });
    }
  }

  if (theirData) {
    const updated = filterOut(theirData.connection.connectionDetailsList, myUid);
    if (updated.length === 0) {
      await deleteConnection(theirData.id);
    } else {
      await updateConnectionById(theirData.id, {
        ...theirData.connection,
        connectionDetailsList: updated
      });
    }
  }
};
