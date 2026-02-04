import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CodeInput } from '../../components/ui/CodeInput';
import { ShakeView } from '../../components/ui/ShakeView';
import { validateReferralCode } from '../../services/referral';
import { setJson, storageKeys } from '../../cache/mmkv';
import type { ReferralCode } from '../../types';

const REQUEST_INVITE_EMAIL =
  'mailto:access@raineapp.com?subject=Request%20for%20Raine%20Invite&body=Hi%20Raine%20Team%2C%0A%0AI%27d%20love%20to%20join%20Raine!%0A%0AName%3A%0AEmail%3A%0ALocation%3A%0A%0ALooking%20forward%20to%20connecting!';

export default function ReferralScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const handleCodeComplete = useCallback(
    async (enteredCode: string) => {
      if (isValidating) {
        return;
      }

      setIsValidating(true);
      setError(null);

      try {
        const result = await validateReferralCode(enteredCode);
        if (result.valid) {
          const referral: ReferralCode = {
            code: enteredCode,
            validatedAt: new Date().toISOString()
          };
          setJson(storageKeys.validatedReferralCode, referral);
          setJson(storageKeys.referralValidatedAt, referral.validatedAt);
          router.replace('/(auth)/login');
        } else {
          setError(result.error ?? 'Invalid code. Please try again');
          setShouldShake(true);
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setShouldShake(true);
      } finally {
        setIsValidating(false);
      }
    },
    [isValidating, router]
  );

  const handleShakeComplete = () => {
    setShouldShake(false);
    setCode('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-2xl font-bold text-slate-900">Raine is invite only</Text>
        <Text className="mb-10 text-center text-slate-500">
          Enter your invite code to continue
        </Text>

        <ShakeView trigger={shouldShake} onShakeComplete={handleShakeComplete}>
          <CodeInput value={code} onChange={setCode} onComplete={handleCodeComplete} error={error ?? undefined} />
        </ShakeView>

        <Pressable onPress={() => Linking.openURL(REQUEST_INVITE_EMAIL)} className="mt-10">
          <Text className="text-blue-600">Don&apos;t have a code? Request an invite</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
