import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';

import splashImage from '../../../assets/splash-screen.png';

const SPLASH_DURATION_MS = 4000;

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={splashImage} className="w-64 h-64" resizeMode="contain" />
    </View>
  );
}
