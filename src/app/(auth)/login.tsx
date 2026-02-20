import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/auth/AuthContext';
import { useAppStore } from '../../store/appStore';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { storage } from '../../cache/mmkv';
import { getError } from '../../utils/errorsFilters';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset app data is intentionally disabled for this auth screen.
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

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    resetForm();
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const validationError = getValidationError(mode, normalizedEmail, password, confirmPassword);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (mode === 'register') {
        await register(normalizedEmail, password);
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        Alert.alert('Account created', 'Your account was created successfully. Please sign in.');
        return;
      }

      await login(normalizedEmail, password);
    } catch (err: any) {      
      const code = err?.code as string | undefined;
      setError(getError[code as keyof typeof getError] ?? err?.message ?? 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitButtonTitle = 'Create account';
  if (mode === 'login') {
    submitButtonTitle = 'Sign in';
  }
  if (isSubmitting) {
    submitButtonTitle = 'Please wait...';
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Image
        source={require('../../../assets/splash-screen.png')}
        className="h-48 w-full"
        resizeMode="contain"
      />
      <Text className="mb-2 text-center text-2xl font-bold text-slate-900">Welcome to Raine</Text>
      <Text className="mb-8 text-center text-slate-500">
        {mode === 'login'
          ? 'Sign in with email and password'
          : 'Create your account with email and password'}
      </Text>

      <View className="mb-5 space-y-5">
        <View className="mb-5">
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
        </View>

        <View className="mb-5">
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType={mode === 'login' ? 'password' : 'newPassword'}
            placeholder="Enter your password"
          />
        </View>

        <Text
          className="-mt-1 text-right text-sm text-blue-600"
          onPress={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? 'Hide password' : 'Show password'}
        </Text>

        {mode === 'register' ? (
          <>
            <View className="mb-5">
              <Input
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                textContentType="password"
                placeholder="Re-enter your password"
              />
            </View>
            <Text
              className="-mt-1 text-right text-sm text-blue-600"
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}
            </Text>
          </>
        ) : null}
      </View>

      <Button title={submitButtonTitle} onPress={handleSubmit} disabled={isSubmitting} />

      <Text className="mt-4 text-center text-sm text-slate-500">
        {mode === 'login' ? "Don't have an account yet? " : 'Already have an account? '}
        <Text className="text-blue-600" onPress={toggleMode}>
          {mode === 'login' ? 'Create one quickly' : 'Sign in with email'}
        </Text>
      </Text>

      <View className="mt-4">
        <Button title="Reset app data" onPress={handleResetApp} variant="outline" />
      </View>      

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

function getValidationError(
  mode: 'login' | 'register',
  email: string,
  password: string,
  confirmPassword: string
) {
  if (!email || !password) {
    return 'Please enter email and password.';
  }

  if (mode === 'login') {
    return null;
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
