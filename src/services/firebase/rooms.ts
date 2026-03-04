import firestore from '@react-native-firebase/firestore';
import { getDb } from './firestore';
import type { Room } from '../../types';

// Lazy getter for rooms collection
const getRoomsCollection = () => getDb().collection('rooms');

export function listenToUserRooms(uid: string, callback: (rooms: Room[]) => void) {
  return getRoomsCollection()
    .where('memberIds', 'array-contains', uid)
    .orderBy('lastMessage.timestamp', 'desc')
    .onSnapshot((snapshot: { docs: Array<{ id: string; data: () => unknown }> }) => {
      const rooms = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Room, 'id'>),
        id: doc.id
      }));
      callback(rooms);
    });
}

export async function getRoom(roomId: string) {
  const doc = await getRoomsCollection().doc(roomId).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as Omit<Room, 'id'> | undefined;
  const docId = (doc as { id?: string }).id ?? roomId;
  return { ...data, id: docId } as Room;
}

export async function createRoom(room: Omit<Room, 'id'>) {
  const docRef = await getRoomsCollection().add(room);
  return docRef.id;
}

/**
 * Gets or creates a 1:1 room for two connected users. Returns the room id.
 */
export async function getOrCreateRoomForConnection(uid1: string, uid2: string): Promise<string> {
  const [a, b] = [uid1, uid2].sort((x, y) => x.localeCompare(y));
  const roomId = `conn_${a}_${b}`;

  const existing = await getRoom(roomId);
  if (existing) return roomId;

  const roomData: Omit<Room, 'id'> = {
    name: 'Chat',
    memberIds: [a, b],
    createdAt: firestore.FieldValue.serverTimestamp() as Room['createdAt']
  };
  await getRoomsCollection()
    .doc(roomId)
    .set({ ...roomData, id: roomId });
  return roomId;
}
