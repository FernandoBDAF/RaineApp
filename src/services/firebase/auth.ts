import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Lazy load Firebase auth to prevent crashes when not configured
const getAuth = () => {
  const auth = require('@react-native-firebase/auth').default;
  return auth();
};

export const signUp = (email: string, password: string) =>
  getAuth().createUserWithEmailAndPassword(email, password);

export const signIn = (email: string, password: string) =>
  getAuth().signInWithEmailAndPassword(email, password);

export const signOut = () => getAuth().signOut();

export const resetPassword = (email: string) => getAuth().sendPasswordResetEmail(email);

export const onAuthStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) =>
  getAuth().onAuthStateChanged(callback);
