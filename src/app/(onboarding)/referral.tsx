import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from '../../components/ui/OtpInput';
import { ShakeView } from '../../components/ui/ShakeView';
import { useReferralCode } from '../../hooks/useReferralCode';
import { ReferralCode } from '../../types/referral';
import { validateReferralCode } from '../../services/referral';
import { setJson } from '../../cache/mmkv';
import { storageKeys } from '../../cache/mmkv';

const REQUEST_INVITE_EMAIL =
  'mailto:access@raineapp.com?subject=Request%20for%20Raine%20Invite&body=Hi%20Raine%20Team%2C%0A%0AI%27d%20love%20to%20join%20Raine!%0A%0AName%3A%0AEmail%3A%0ALocation%3A%0A%0ALooking%20forward%20to%20connecting!';

const CODE_LENGTH = 7;

export default function ReferralScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);
  const { checkIfReferralCodeExists, loading: isValidating } = useReferralCode();

  const handleCodeComplete = useCallback(
    async (enteredCode: string) => {
      if (isValidating) {
        return;
      }

      setError(null);

      try {
        // const result = await checkIfReferralCodeExists(enteredCode);
        // if (result) {
        //   router.replace('/(auth)/signup');
        // } else {
        //   setError('Invalid code. Please try again');
        //   setShouldShake(true);
        // }
        const result = await validateReferralCode(enteredCode);
        if (result.valid) {
          const referral: ReferralCode = {
            code: enteredCode,
            validatedAt: new Date().toISOString()
          };
          setJson(storageKeys.validatedReferralCode, referral);
          setJson(storageKeys.referralValidatedAt, referral.validatedAt);
          router.replace('/(auth)/signup');
        } else {
          setError(result.error ?? 'Invalid code. Please try again');
          setShouldShake(true);
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setShouldShake(true);
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
      {isValidating && (
        <View style={[StyleSheet.absoluteFillObject, localStyles.spinnerOverlay]}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login')}
        className="absolute left-4 top-10 z-10 h-10 w-10 items-center justify-center"
        accessibilityLabel="Voltar ao login"
      >
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>
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
  },
  spinnerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
