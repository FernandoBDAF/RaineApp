import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getJson, storageKeys } from '../../cache/mmkv';
import type { ReferralCode } from '../../types';

import splashImage from '../../../assets/splash-screen.png';

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
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={splashImage} className="w-64 h-64" resizeMode="contain" />
    </View>
  );
}
