import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { storage } from '../../cache/mmkv';
import { Button } from '../../components/ui/Button';
import { SocialButton } from '../../components/ui/SocialButton';
import {
  signInWithFacebook,
  signInWithInstagram,
  signInWithLinkedIn
} from '../../services/firebase/socialAuth';
import { useAppStore } from '../../store/appStore';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import type { SocialProvider } from '../../types';

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<SocialProvider | null>(null);

  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);
  const setActiveRoomId = useAppStore((state) => state.setActiveRoomId);
  const setTheme = useAppStore((state) => state.setTheme);
  const resetProfileSetup = useProfileSetupStore((state) => state.reset);
  const handleResetApp = () => {
    Alert.alert(
      'Reset app data?',
      'This clears local cache and profile setup progress on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            storage.clearAll();
            resetProfileSetup();
            setActiveRoomId(null);
            setTheme('system');
            setNotificationsEnabled(true);
          }
        }
      ]
    );
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError(null);
    setLoading(provider);

    try {
      const result =
        provider === 'instagram'
          ? await signInWithInstagram()
          : provider === 'facebook'
            ? await signInWithFacebook()
            : await signInWithLinkedIn();

      if (!result.success) {
        setError(result.error ?? 'Sign in failed');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="mb-2 text-center text-2xl font-bold text-slate-900">Welcome to Raine</Text>
      <Text className="mb-10 text-center text-slate-500">Sign in to continue</Text>

      <View className="space-y-4">
        <SocialButton
          provider="instagram"
          onPress={() => handleSocialLogin('instagram')}
          disabled={!!loading}
        />
        <SocialButton
          provider="facebook"
          onPress={() => handleSocialLogin('facebook')}
          disabled={!!loading}
        />
        <SocialButton
          provider="linkedin"
          onPress={() => handleSocialLogin('linkedin')}
          disabled={!!loading}
        />
      </View>

      <Button title="Reset app data" onPress={handleResetApp} variant="outline" />

      {error ? <Text className="mt-6 text-center text-sm text-red-500">{error}</Text> : null}

      <View className="mt-10 items-center">
        <Text className="text-center text-xs text-slate-400">
          By continuing, you agree to our{' '}
          <Link href="/(auth)/terms" asChild>
            <Text className="text-blue-600">Terms of Service</Text>
          </Link>{' '}
          and{' '}
          <Link href="/(auth)/terms" asChild>
            <Text className="text-blue-600">Privacy Policy</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}
