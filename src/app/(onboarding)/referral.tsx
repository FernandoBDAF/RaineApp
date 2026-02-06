import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setJson, storageKeys } from '../../cache/mmkv';
import { OtpInput } from '../../components/ui/OtpInput';
import { ShakeView } from '../../components/ui/ShakeView';
import { validateReferralCode } from '../../services/referral';
import type { ReferralCode } from '../../types';

const REQUEST_INVITE_EMAIL =
  'mailto:access@raineapp.com?subject=Request%20for%20Raine%20Invite&body=Hi%20Raine%20Team%2C%0A%0AI%27d%20love%20to%20join%20Raine!%0A%0AName%3A%0AEmail%3A%0ALocation%3A%0A%0ALooking%20forward%20to%20connecting!';

const CODE_LENGTH = 7;

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
    <SafeAreaView className="flex-1 bg-orange-500">
      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={localStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Top section — titles */}
            <View className="flex-1 items-center justify-center px-8">
              <Text className="mb-6 text-center text-lg font-bold uppercase tracking-[4px] text-white">
                Raine is invite only.
              </Text>
              <Text className="text-center text-2xl italic text-white" style={localStyles.serif}>
                No strangers.
              </Text>
              <Text className="text-center text-2xl italic text-white" style={localStyles.serif}>
                Just friends of friends.
              </Text>
            </View>

            {/* Bottom section — input & link */}
            <View className="items-center px-8 pb-8">
              <ShakeView trigger={shouldShake} onShakeComplete={handleShakeComplete}>
                <OtpInput
                  value={code}
                  onChange={setCode}
                  onComplete={handleCodeComplete}
                  length={CODE_LENGTH}
                  keyboardType="default"
                  autoFocus
                  variant="dark"
                  isUpperCase={true}
                />
              </ShakeView>

              {error ? (
                <Text className="mt-4 text-center text-sm text-white/80">{error}</Text>
              ) : null}

              <View className="mt-8 items-center">
                <Text className="text-sm text-white/70">Don&apos;t have a code?</Text>
                <Pressable onPress={() => Linking.openURL(REQUEST_INVITE_EMAIL)} className="mt-1">
                  <Text className="text-sm font-semibold text-white underline">
                    Request an invite
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  serif: {
    fontFamily: 'serif'
  }
});
