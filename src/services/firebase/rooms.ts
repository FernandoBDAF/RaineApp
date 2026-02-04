import { getDb } from './firestore';
import { isFirebaseMockMode } from '../../config/environment';
import type { Room } from '../../types';

// Lazy getter for rooms collection
const getRoomsCollection = () => getDb().collection('rooms');

export function listenToUserRooms(uid: string, callback: (rooms: Room[]) => void) {
  if (isFirebaseMockMode()) {
    // Return empty rooms in mock mode
    setTimeout(() => callback([]), 100);
    return () => {};
  }

  return getRoomsCollection()
    .where('memberIds', 'array-contains', uid)
    .orderBy('lastMessage.timestamp', 'desc')
    .onSnapshot((snapshot: { docs: Array<{ id: string; data: () => unknown }> }) => {
      const rooms = snapshot.docs.map((doc) => ({ ...(doc.data() as Omit<Room, 'id'>), id: doc.id }));
      callback(rooms);
    });
}

export async function getRoom(roomId: string) {
  if (isFirebaseMockMode()) {
    return null;
  }

  const doc = await getRoomsCollection().doc(roomId).get();
  if (!doc.exists) {
    return null;
  }
  return { ...(doc.data() as Omit<Room, 'id'>), id: doc.id } as Room;
}

export async function createRoom(room: Omit<Room, 'id'>) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Room created:', room.name);
    return 'mock-room-' + Date.now();
  }

  const docRef = await getRoomsCollection().add(room);
  return docRef.id;
}
