import '../../global.css';

import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { queryClient } from '../services/queryClient';
import { initRemoteConfig } from '../services/firebase/remoteConfig';
import { configureRevenueCat, identifyUser } from '../services/revenuecat';
import { getInitialNotification, onNotificationOpened } from '../services/firebase/notifications';
import { useProfileSetupStore } from '../store/profileSetupStore';
import { STEP_TO_ROUTE } from '../constants/profile-options';
import { setFirebaseMockMode, isDev } from '../config/environment';

const RootLayoutContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const profileCompleted = useProfileSetupStore((state) => state.completed);
  const currentStep = useProfileSetupStore((state) => state.currentStep);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    initRemoteConfig();
  }, []);

  useEffect(() => {
    configureRevenueCat(user?.uid);
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      identifyUser(user.uid);
    }
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = onNotificationOpened((message) => {
      const roomId = message?.data?.roomId;
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    });

    getInitialNotification().then((message) => {
      const roomId = message?.data?.roomId;
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    SplashScreen.hideAsync();
    setAppReady(true);
  }, [isLoading]);

  useEffect(() => {
    if (!appReady) {
      return;
    }

    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAuthGroup = segments[0] === '(auth)';
    const inProfileSetupGroup = segments[0] === '(profile-setup)';

    if (!isAuthenticated && !inOnboardingGroup && !inAuthGroup) {
      router.replace('/(onboarding)/splash');
      return;
    }

    if (isAuthenticated && !profileCompleted && !inProfileSetupGroup) {
      const route = STEP_TO_ROUTE[currentStep] || '/(profile-setup)/name';
      router.replace(route as any);
      return;
    }

    const segmentsList = segments as string[];
    const inWelcomeScreen = inProfileSetupGroup && segmentsList[1] === 'welcome';

    if (
      isAuthenticated &&
      profileCompleted &&
      (inOnboardingGroup || inAuthGroup || inProfileSetupGroup) &&
      !inWelcomeScreen
    ) {
      router.replace('/(tabs)');
    }
  }, [appReady, currentStep, isAuthenticated, profileCompleted, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(profile-setup)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
};

export default function RootLayout() {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly configured
    const checkFirebase = async () => {
      try {
        // Try to import Firebase app
        const firebase = await import('@react-native-firebase/app');
        const apps = firebase.default.apps;

        if (apps.length === 0) {
          // Firebase not configured, enable mock mode
          if (isDev) {
            console.warn(
              '🔶 Firebase Mock Mode: No Firebase configuration found.\n' +
                '   Add google-services.json (Android) or GoogleService-Info.plist (iOS) for real Firebase.'
            );
          }
          setFirebaseMockMode(true);
        } else {
          setFirebaseMockMode(false);
        }
      } catch (error) {
        // Firebase module failed to load, enable mock mode
        if (isDev) {
          console.warn('🔶 Firebase Mock Mode: Firebase failed to initialize:', error);
        }
        setFirebaseMockMode(true);
      }
      setFirebaseReady(true);
    };

    checkFirebase();
  }, []);

  // Wait for Firebase check before rendering
  if (!firebaseReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
