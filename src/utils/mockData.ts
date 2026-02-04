import type { Message, Room, UserProfile } from '../types';

export const mockUsers: UserProfile[] = [
  {
    uid: 'user_1',
    email: 'rae@example.com',
    displayName: 'Rae',
    photoURL: undefined,
    subscriptionStatus: 'free',
    createdAt: new Date() as any,
    lastSeen: new Date() as any
  },
  {
    uid: 'user_2',
    email: 'noah@example.com',
    displayName: 'Noah',
    photoURL: undefined,
    subscriptionStatus: 'free',
    createdAt: new Date() as any,
    lastSeen: new Date() as any
  }
];

export const mockRooms: Room[] = [
  {
    id: 'room_1',
    name: 'Raine Team',
    memberIds: ['user_1', 'user_2'],
    lastMessage: {
      text: 'Welcome to Raine!',
      senderId: 'user_1',
      timestamp: new Date() as any
    },
    createdAt: new Date() as any
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    roomId: 'room_1',
    senderId: 'user_1',
    text: 'Welcome to Raine!',
    timestamp: new Date() as any,
    reactions: {
      '👍': ['user_2']
    }
  }
];
