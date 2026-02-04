import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { Message } from '../../types';
import { isFirebaseMockMode } from '../../config/environment';
import { getDb } from './firestore';

// Helper to get firestore instance
const getFirestore = () => {
  if (isFirebaseMockMode()) {
    return getDb();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@react-native-firebase/firestore').default();
};

export function listenToMessages(
  roomId: string,
  limitCount: number,
  callback: (messages: Message[]) => void
) {
  if (isFirebaseMockMode()) {
    // Return empty messages in mock mode
    setTimeout(() => callback([]), 100);
    return () => {};
  }

  return getFirestore()
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(limitCount)
    .onSnapshot((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Message, 'id'>),
        id: doc.id
      }));
      callback(messages);
    });
}

export async function fetchMoreMessages(
  roomId: string,
  cursor: FirebaseFirestoreTypes.Timestamp | null,
  limitCount: number
): Promise<{ messages: Message[]; nextCursor: FirebaseFirestoreTypes.Timestamp | null }> {
  if (isFirebaseMockMode()) {
    return { messages: [], nextCursor: null };
  }

  let query = getFirestore()
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(limitCount);

  if (cursor) {
    query = query.startAfter(cursor);
  }

  const snapshot = await query.get();
  const messages = snapshot.docs.map((doc: FirebaseFirestoreTypes.DocumentSnapshot) => ({
    ...(doc.data() as Omit<Message, 'id'>),
    id: doc.id
  }));

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const nextCursor = lastDoc?.get('timestamp') as FirebaseFirestoreTypes.Timestamp | undefined;
  return {
    messages,
    nextCursor: nextCursor ?? null
  };
}

export async function sendMessage(roomId: string, payload: Omit<Message, 'id'>) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Message sent:', payload.text);
    return 'mock-message-' + Date.now();
  }

  const firestore = getFirestore();
  const messageRef = firestore
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .doc();

  await messageRef.set(payload);
  await firestore
    .collection('rooms')
    .doc(roomId)
    .update({
      lastMessage: {
        text: payload.text,
        senderId: payload.senderId,
        timestamp: payload.timestamp
      }
    });
  return messageRef.id;
}

export async function updateReactions(
  roomId: string,
  messageId: string,
  reactions: Record<string, string[]>
) {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Reactions updated:', reactions);
    return;
  }

  await getFirestore()
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .doc(messageId)
    .update({ reactions });
}
