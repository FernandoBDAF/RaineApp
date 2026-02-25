import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Garante que o app Firebase está inicializado antes de usar qualquer serviço
const ensureFirebaseInitialized = () => {
  if (firebase.apps.length === 0) {
    throw new Error(
      '[Firebase] No app initialized. Make sure GoogleService-Info.plist is correctly bundled.'
    );
  }
};

export const signUp = (email: string, password: string) => {
  ensureFirebaseInitialized();
  return auth().createUserWithEmailAndPassword(email, password);
};

export const signIn = (email: string, password: string) => {
  ensureFirebaseInitialized();
  return auth().signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
  ensureFirebaseInitialized();
  return auth().signOut();
};

export const resetPassword = (email: string) => {
  ensureFirebaseInitialized();
  return auth().sendPasswordResetEmail(email);
};

export const onAuthStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) => {
  ensureFirebaseInitialized();
  return auth().onAuthStateChanged(callback);
};

export const getFirebaseApp = () => {
  if (firebase.apps.length === 0) return null;
  return firebase.app();
};
