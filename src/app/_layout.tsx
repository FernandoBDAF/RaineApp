import '../../global.css';

import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { isDev, setFirebaseMockMode } from '../config/environment';
import { STEP_TO_ROUTE } from '../constants/profile-options';
import { AuthProvider, useAuth } from '../context/auth/AuthContext';
import { initRemoteConfig } from '../services/firebase/remoteConfig';
import { getUserProfile } from '../services/firebase/users';
import { queryClient } from '../services/queryClient';
import { useProfileSetupStore } from '../store/profileSetupStore';
import { getAuth } from '@react-native-firebase/auth';

// Keep the native splash screen visible until we decide where to navigate.
// This MUST run at module level (before any component renders) to avoid a flash.
SplashScreen.preventAutoHideAsync();

const RootLayoutContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const auth = getAuth();
  const router = useRouter();
  const segments = useSegments();
  const currentStep = useProfileSetupStore((state) => state.currentStep);
  // const profileCompleted = useProfileSetupStore((state) => state.profileSetupCompletedAt);
  const [appReady, setAppReady] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => (user?.uid ? getUserProfile(user.uid) : null),
    enabled: !!user?.uid
  });

  const profileCompleted = !!profile?.profileSetupCompletedAt;

  useEffect(() => {
    initRemoteConfig();
  }, []);

  // useEffect(() => {
  //   configureRevenueCat(user?.uid);
  // }, [user?.uid]);

  // useEffect(() => {
  //   if (user?.uid) {
  //     identifyUser(user.uid);
  //   }
  // }, [user?.uid]);

  // useEffect(() => {
  //   const unsubscribe = onNotificationOpened((message) => {
  //     const roomId = message?.data?.roomId;
  //     if (roomId) {
  //       router.push(`/room/${roomId}`);
  //     }
  //   });

  //   getInitialNotification().then((message) => {
  //     const roomId = message?.data?.roomId;
  //     if (roomId) {
  //       router.push(`/room/${roomId}`);
  //     }
  //   });

  //   return unsubscribe;
  // }, [router]);

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

    // If the user is not authenticated and not in the onboarding or auth group, redirect to the onboarding splash screen
    if (!isAuthenticated && !inOnboardingGroup && !inAuthGroup) {
      router.replace('/(onboarding)/splash');
      return;
    }

    // If the user is authenticated and not in the profile setup group, redirect to the profile setup step
    if (isAuthenticated && !profileCompleted && !inProfileSetupGroup) {
      const route = STEP_TO_ROUTE[currentStep] || '/(profile-setup)/name';
      router.replace(route as any);
      return;
    }

    const segmentsList = segments as string[];
    const nextIsWelcomeScreen = profileCompleted && segmentsList[1] === 'bio';

    // If the user is authenticated and the next screen is the welcome screen, redirect to the welcome screen
    if (nextIsWelcomeScreen) {
      router.replace('/welcome/welcome');
      return;
    }

    // If the user is authenticated and the next screen is not the welcome screen, redirect to the main tabs
    if (
      isAuthenticated &&
      profileCompleted &&
      (inOnboardingGroup || inAuthGroup || inProfileSetupGroup)
    ) {
      router.replace('/(tabs)');
    }
  }, [
    appReady,
    currentStep,
    isAuthenticated,
    profileCompleted,
    router,
    segments,
    auth.currentUser?.isAnonymous
  ]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(profile-setup)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="drop/[id]" />
      <Stack.Screen name="introduction/[userId]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="introduction/pending" />
      <Stack.Screen name="community/[id]" />
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
