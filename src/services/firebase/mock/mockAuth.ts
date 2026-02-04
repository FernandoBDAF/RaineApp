/**
 * Mock Firebase Auth for UI testing without Firebase configuration.
 */

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthStateListener = (user: MockUser | null) => void;

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// In-memory state
let currentUser: MockUser | null = null;
const listeners: Set<AuthStateListener> = new Set();

// Mock user for testing
const MOCK_USER: MockUser = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://i.pravatar.cc/150?u=test',
  emailVerified: true,
};

function notifyListeners() {
  listeners.forEach((listener) => listener(currentUser));
}

export const mockAuth = {
  onAuthStateChanged(listener: AuthStateListener) {
    listeners.add(listener);
    // Immediately call with current state
    setTimeout(() => listener(currentUser), 100);
    return () => {
      listeners.delete(listener);
    };
  },

  async signInWithEmailAndPassword(email: string, _password: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    currentUser = {
      ...MOCK_USER,
      email,
      displayName: email.split('@')[0],
    };
    notifyListeners();
    
    return { user: currentUser as unknown as FirebaseAuthTypes.User };
  },

  async createUserWithEmailAndPassword(email: string, _password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    currentUser = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      emailVerified: false,
    };
    notifyListeners();
    
    return { user: currentUser as unknown as FirebaseAuthTypes.User };
  },

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    currentUser = null;
    notifyListeners();
  },

  async sendPasswordResetEmail(_email: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log('📧 [Mock] Password reset email sent');
  },

  get currentUser() {
    return currentUser as unknown as FirebaseAuthTypes.User | null;
  },
};

// Helper to set mock user for testing
export function setMockUser(user: MockUser | null) {
  currentUser = user;
  notifyListeners();
}

// Helper to login as mock user instantly
export function loginAsMockUser() {
  currentUser = MOCK_USER;
  notifyListeners();
}
