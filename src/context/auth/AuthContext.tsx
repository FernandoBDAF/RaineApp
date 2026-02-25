import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../../services/firebase/firebase';
import { getJson, setJson, storageKeys } from '../../cache/mmkv';
import { resetPassword, signIn, signOut, signUp } from '../../services/firebase/auth';
import { getUserProfile, waitForUserProfile } from '../../services/firebase/users';
import { useProfileSetupStore } from '../../store/profileSetupStore';

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
  const syncFromUserProfile = useProfileSetupStore((s) => s.syncFromUserProfile);
  const resetProfileSetup = useProfileSetupStore((s) => s.reset);

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
    // Usa a instância do Firebase já inicializada
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const mapped = mapUser(firebaseUser);
          setUser(mapped);
          setJson(storageKeys.authUser, mapped);

          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            syncFromUserProfile(profile);
          } else {
            const setPhoto = useProfileSetupStore.getState().setPhoto;
            if (firebaseUser.photoURL) {
              setPhoto(firebaseUser.photoURL);
            }
          }
        } else {
          setUser(null);
          setJson(storageKeys.authUser, null);
          resetProfileSetup();
        }
      } catch (error) {
        console.error('[AuthContext] Error in onAuthStateChanged:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [syncFromUserProfile, resetProfileSetup]);

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
        await waitForUserProfile(credential.user.uid).catch((err) => {
          console.warn('[register] Could not confirm profile creation:', err);
        });
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