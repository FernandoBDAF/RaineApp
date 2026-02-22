import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { ContinueButton } from '../../components/profile-setup/ContinueButton';
import { SetupHeader } from '../../components/profile-setup/SetupHeader';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/auth/AuthContext';
import { getError } from '../../utils/errorsFilters';
import splashImage from '../../../assets/splash-screen.png';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password) {
        setError('Please enter email and password.');
        return;
      }

      await login(normalizedEmail, password);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      setError(
        getError[code as keyof typeof getError] ??
          (err as Error)?.message ??
          'Unable to authenticate.'
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
      <SetupHeader headline="Welcome!" subheadline="SIGN IN WITH EMAIL AND PASSWORD" />
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
            textContentType="password"
            placeholder="Enter your password"
          />
        </View>

        {error ? <Text className="mt-4 text-center text-sm text-red-500">{error}</Text> : null}

        <View className="mt-6">
          <Text className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/(onboarding)/referral" asChild>
              <Text className="text-blue-600 font-semibold">Create one quickly</Text>
            </Link>
          </Text>
        </View>

        <View className="mt-8 items-center">
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
      <ContinueButton
        label={isSubmitting ? 'Please wait...' : 'SIGN IN'}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
}
