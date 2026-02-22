import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Input } from '../../components/ui/Input';
import { ContinueButton } from '../../components/profile-setup/ContinueButton';
import { SetupHeader } from '../../components/profile-setup/SetupHeader';
import { useAuth } from '../../context/auth/AuthContext';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { getJson, storageKeys } from '../../cache/mmkv';
import type { ReferralCode } from '../../types';
import { getError } from '../../utils/errorsFilters';
import splashImage from '../../../assets/splash-screen.png';

function getValidationError(email: string, password: string, confirmPassword: string) {
  if (!email || !password) {
    return 'Please enter email and password.';
  }
  if (password.length < 6) {
    return 'Password must have at least 6 characters.';
  }
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const resetProfileSetup = useProfileSetupStore((state) => state.reset);
  const setCurrentStep = useProfileSetupStore((state) => state.setCurrentStep);

  useEffect(() => {
    const referral = getJson<ReferralCode>(storageKeys.validatedReferralCode);
    if (!referral?.code) {
      router.replace('/(onboarding)/referral');
    }
  }, [router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const validationError = getValidationError(normalizedEmail, password, confirmPassword);
      if (validationError) {
        setError(validationError);
        return;
      }

      await register(normalizedEmail, password);

      // Reset profile setup and navigate to name step
      resetProfileSetup();
      setCurrentStep(1);
      router.replace('/(profile-setup)/name');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      setError(
        getError[code as keyof typeof getError] ??
          (err as Error)?.message ??
          'Unable to create account.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="items-center justify-center">
        <Image source={splashImage} className="w-52 h-52" resizeMode="contain" />
      </View>
      <SetupHeader
        headline="Create your account"
        subheadline="EMAIL AND PASSWORD"
      />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-4">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="you@email.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            showPasswordToggle
            textContentType="newPassword"
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPasswordToggle
            textContentType="password"
            placeholder="Re-enter your password"
          />
        </View>

        {error ? (
          <Text className="mt-4 text-center text-sm text-red-500">{error}</Text>
        ) : null}

        <View className="mt-6">
          <Text className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/(auth)/login" asChild>
              <Text className="text-blue-600 font-semibold">Sign in with email</Text>
            </Link>
          </Text>
        </View>
      </View>
      <ContinueButton
        label={isSubmitting ? 'Please wait...' : 'CREATE ACCOUNT'}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
}
