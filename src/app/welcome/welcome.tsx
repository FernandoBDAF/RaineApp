import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfileSetupStore } from '../../store/profileSetupStore';

const WELCOME_DURATION_MS = 3000;

export default function WelcomeScreen() {
  const router = useRouter();
  const firstName = useProfileSetupStore((state) => state.firstName);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, WELCOME_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-orange-500 px-8">
      <Text className="mb-4 text-center text-4xl text-white" style={styles.serif}>
        {'Welcome,\n'}
        {firstName}
      </Text>
      <Text className="text-center text-base text-white/80">
        Keep going—your tribe is{'\n'}cheering you on.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  serif: {
    fontFamily: 'serif',
    letterSpacing: 4
  }
});
