import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ContinueButton } from '../../components/profile-setup/ContinueButton';
import { SetupHeader } from '../../components/profile-setup/SetupHeader';
import { OtpInput } from '../../components/ui/OtpInput';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { lookupZipCode } from '../../services/location';

export default function LocationScreen() {
  const router = useRouter();
  const { zipCode, setLocation, setCurrentStep } = useProfileSetupStore();
  const [zipValue, setZipValue] = useState(zipCode);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(() => zipValue.length === 5, [zipValue]);

  const handleLookup = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const result = await lookupZipCode(zipValue);
      if (!result.valid) {
        setError(result.error ?? 'Please enter a valid zip code');
        return;
      }

      // Store the looked-up location regardless of approval
      setLocation(zipValue, result.city ?? '', result.state ?? '', result.county ?? '');

      if (!result.isApproved) {
        router.push('/(profile-setup)/out-of-area');
        return;
      }

      setCurrentStep(4);
      router.push('/(profile-setup)/city-feel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="Where do you call home?"
        subheadline="WE'LL INTRODUCE YOU TO MOMS WORTH KNOWING — WHO HAPPEN TO LIVE NEARBY"
      />
      <View className="flex-1 px-6 pt-6">
        <OtpInput value={zipValue} onChange={setZipValue} length={5} autoFocus />
        {error ? <Text className="mt-3 text-sm text-red-500">{error}</Text> : null}
      </View>
      <ContinueButton
        onPress={handleLookup}
        disabled={!canContinue || loading}
        label={loading ? 'VALIDATING...' : 'CONTINUE'}
      />
    </View>
  );
}
