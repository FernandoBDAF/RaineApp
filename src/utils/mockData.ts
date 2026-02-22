import type { Message, Room, UserProfile } from '../types';

// Mock Firestore Timestamp shape for development (has toDate for schema compatibility)
const mockTimestamp = () =>
  ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0
  }) as UserProfile['createdAt'];

const mockUserFields: Omit<UserProfile, 'uid' | 'email' | 'displayName' | 'photoURL' | 'subscriptionStatus' | 'createdAt' | 'lastSeen'> = {
  firstName: '',
  lastInitial: '',
  zipCode: '',
  city: '',
  state: '',
  county: '',
  cityFeel: '',
  childCount: 0,
  isExpecting: false,
  dueDate: null,
  children: [],
  beforeMotherhood: [],
  perfectWeekend: [],
  feelYourself: null,
  hardTruths: [],
  unexpectedJoys: [],
  aesthetic: [],
  momFriendStyle: [],
  whatBroughtYou: null,
  generatedBio: '',
  bioApproved: false,
  profileSetupCompleted: false
};

export const mockUsers: UserProfile[] = [
  {
    uid: 'user_1',
    email: 'rae@example.com',
    displayName: 'Rae',
    photoURL: undefined,
    subscriptionStatus: 'free',
    createdAt: mockTimestamp(),
    lastSeen: mockTimestamp(),
    ...mockUserFields
  },
  {
    uid: 'user_2',
    email: 'noah@example.com',
    displayName: 'Noah',
    photoURL: undefined,
    subscriptionStatus: 'free',
    createdAt: mockTimestamp(),
    lastSeen: mockTimestamp(),
    ...mockUserFields
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
