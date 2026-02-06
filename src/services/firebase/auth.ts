import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { isFirebaseMockMode, isDev } from '../../config/environment';
import { mockAuth } from './mock/mockAuth';

/**
 * Whether auth operations should use mock auth.
 * In dev mode, social login always uses mock auth, so all auth operations
 * must also use mock to stay consistent.
 */
function useMockAuth(): boolean {
  return isFirebaseMockMode() || isDev;
}

// Lazy load Firebase auth to prevent crashes when not configured
const getAuth = () => {
  if (useMockAuth()) {
    return mockAuth;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const auth = require('@react-native-firebase/auth').default;
  return auth();
};

export const signUp = (email: string, password: string) =>
  getAuth().createUserWithEmailAndPassword(email, password);

export const signIn = (email: string, password: string) =>
  getAuth().signInWithEmailAndPassword(email, password);

export const signOut = () => getAuth().signOut();

export const resetPassword = (email: string) => getAuth().sendPasswordResetEmail(email);

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => getAuth().onAuthStateChanged(callback);
