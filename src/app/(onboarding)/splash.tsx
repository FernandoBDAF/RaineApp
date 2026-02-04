import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getJson, storageKeys } from '../../cache/mmkv';
import type { ReferralCode } from '../../types';

const SPLASH_DURATION_MS = 4000;

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const referral = getJson<ReferralCode>(storageKeys.validatedReferralCode);
      if (referral?.code) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(onboarding)/referral');
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-800">
      <Text className="text-5xl font-bold text-white">Raine</Text>
    </View>
  );
}
