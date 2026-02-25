import '../../global.css';

import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { STEP_TO_ROUTE } from '../constants/profile-options';
import { AuthProvider, useAuth } from '../context/auth/AuthContext';
import { initRemoteConfig } from '../services/firebase/remoteConfig';
import { getUserProfile } from '../services/firebase/users';
import { queryClient } from '../services/queryClient';
import { useProfileSetupStore } from '../store/profileSetupStore';

// Keep the native splash screen visible until we decide where to navigate.
SplashScreen.preventAutoHideAsync();

const RootLayoutContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const currentStep = useProfileSetupStore((state) => state.currentStep);
  const storeProfileSetupCompletedAt = useProfileSetupStore(
    (state) => state.profileSetupCompletedAt
  );
  const [appReady, setAppReady] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => (user?.uid ? getUserProfile(user.uid) : null),
    enabled: !!user?.uid
  });

  const profileCompleted =
    !!profile?.profileSetupCompletedAt || !!storeProfileSetupCompletedAt;

  useEffect(() => {
    initRemoteConfig();
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
    const nextIsWelcomeScreen = profileCompleted && segmentsList[1] === 'bio';

    if (nextIsWelcomeScreen) {
      router.replace('/welcome/welcome');
      return;
    }

    if (
      isAuthenticated &&
      profileCompleted &&
      (inOnboardingGroup || inAuthGroup || inProfileSetupGroup)
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
