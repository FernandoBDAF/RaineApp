import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { addToWaitlist } from '../../services/profile';

import splashImage from '../../../assets/splash-screen.png';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COUNTIES = [
  'San Francisco County',
  'Marin County',
  'Alameda & Contra Costa Counties',
  'San Mateo County'
];

export default function OutOfAreaScreen() {
  const router = useRouter();
  const { zipCode, city, state, county } = useProfileSetupStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleJoinWaitlist = async () => {
    setError(undefined);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await addToWaitlist({
        email,
        zipCode,
        city,
        state,
        county
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryDifferent = () => {
    router.replace('/(profile-setup)/location');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center px-8 py-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image source={splashImage} className="mb-6 h-48 w-48" resizeMode="contain" />

        {/* Heading */}
        <Text className="mb-4 text-center text-2xl font-bold text-slate-900">
          We&apos;re not in your area yet
        </Text>

        {/* Description */}
        <Text className="mb-4 text-center text-base text-slate-500">
          Raine is currently available in the San Francisco Bay Area, including:
        </Text>

        {/* County list */}
        <View className="mb-6 items-center">
          {COUNTIES.map((name) => (
            <Text key={name} className="text-center text-sm font-semibold text-slate-700">
              {name}
            </Text>
          ))}
        </View>

        {/* Waitlist prompt */}
        {submitted ? (
          <View className="mb-6 rounded-lg bg-green-50 px-4 py-3">
            <Text className="text-center text-sm text-green-700">
              Thanks! We&apos;ll email you when Raine launches in your area.
            </Text>
          </View>
        ) : (
          <>
            <Text className="mb-6 text-center text-sm text-slate-400">
              We&apos;re expanding soon! Join our waitlist to be notified when we arrive in your
              area.
            </Text>

            {/* Email input */}
            <View className="mb-4 w-full">
              <Input
                value={email}
                placeholder="name@domain.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                error={error}
              />
            </View>

            {/* Join button */}
            <Pressable
              onPress={handleJoinWaitlist}
              disabled={loading}
              className={`mb-4 w-full rounded-lg py-4 ${loading ? 'bg-orange-300' : 'bg-orange-500'}`}
            >
              <Text className="text-center text-sm font-semibold uppercase tracking-widest text-white">
                {loading ? 'Submitting...' : 'Join the waitlist'}
              </Text>
            </Pressable>
          </>
        )}

        {/* Try different zip */}
        <Pressable onPress={handleTryDifferent}>
          <Text className="text-sm font-semibold text-orange-500 underline">
            Try a different zip code
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
