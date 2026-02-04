import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getJson, setJson, storageKeys } from '../../cache/mmkv';
import { isFirebaseMockMode } from '../../config/environment';
import { createUserProfile } from '../../services/firebase/users';
import { onAuthStateChanged, resetPassword, signIn, signOut, signUp } from '../../services/firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapUser = (user: FirebaseAuthTypes.User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return getJson<AuthUser>(storageKeys.authUser);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapUser(firebaseUser);
        setUser(mapped);
        setJson(storageKeys.authUser, mapped);
      } else {
        setUser(null);
        setJson(storageKeys.authUser, null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        await signIn(email, password);
      },
      register: async (email, password) => {
        const credential = await signUp(email, password);
        
        if (!isFirebaseMockMode()) {
          // Only create Firestore profile when not in mock mode
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const firestore = require('@react-native-firebase/firestore').default;
          const profile = {
            uid: credential.user.uid,
            email: credential.user.email ?? email,
            displayName: credential.user.displayName ?? 'New User',
            photoURL: credential.user.photoURL ?? undefined,
            subscriptionStatus: 'free',
            createdAt: firestore.FieldValue.serverTimestamp(),
            lastSeen: firestore.FieldValue.serverTimestamp()
          };
          await createUserProfile(credential.user.uid, profile);
        }
      },
      logout: async () => {
        await signOut();
      },
      reset: async (email) => {
        await resetPassword(email);
      }
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
