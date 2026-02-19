import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getJson, setJson, storageKeys } from '../../cache/mmkv';
import { isFirebaseMockMode } from '../../config/environment';
import { waitForUserProfile } from '../../services/firebase/users';
import {
  onAuthStateChanged,
  resetPassword,
  signIn,
  signOut,
  signUp
} from '../../services/firebase/auth';

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
  const isAuthenticated = !!user;

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
      isAuthenticated,
      login: async (email, password) => {
        await signIn(email, password);
      },
      register: async (email, password) => {        
        const credential = await signUp(email, password);        

        if (!isFirebaseMockMode()) {
          // Best-effort wait for the Auth trigger to create the Firestore profile.
          // If Firestore is unavailable, registration still succeeds — the profile
          // will be created when the trigger eventually runs.
          await waitForUserProfile(credential.user.uid).catch((err) => {
            console.warn('[register] Could not confirm profile creation:', err);
          });
        }

        // Firebase signs users in automatically after signUp.
        // Sign out to keep the user on the login flow after registration.
        await signOut();
      },
      logout: async () => {
        await signOut();
      },
      reset: async (email) => {
        await resetPassword(email);
      }
    }),
    [user, isLoading, isAuthenticated]
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
