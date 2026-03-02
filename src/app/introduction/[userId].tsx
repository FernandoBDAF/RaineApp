import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { getAvatarSource } from '../../constants/avatars';
import { generateConnection } from '../../services/connections/connections-functions';
import { getUserProfile } from '../../services/firebase/users';
import { useProfileSetupStore } from '../../store/profileSetupStore';

const LOADER_COLOR = '#f97316';

export default function ProfileDetailScreen() {
  const uid = useProfileSetupStore((state) => state.uid);
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [photoLoaded, setPhotoLoaded] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId)
  });

  // Reset ao trocar de usuário; se não houver photoURL, considerar carregada
  useEffect(() => {
    setPhotoLoaded(false);
  }, [userId]);

  useEffect(() => {
    if (profile && !profile.photoURL) {
      setPhotoLoaded(true);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={LOADER_COLOR} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-400">Profile not found</Text>
      </View>
    );
  }

  const handleStartConversation = async () => {
    await generateConnection(uid, profile);
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 top-16 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80"
      >
        <Text className="text-lg text-slate-700">←</Text>
      </Pressable>

      {/* Photo */}
      <View className="items-center pt-20 px-6">
        <View className="relative h-[250px] w-[250px] items-center justify-center rounded-2xl bg-slate-100">
          <Image
            source={getAvatarSource(profile?.photoURL)}
            className="h-[250px] w-[250px] rounded-2xl"
            resizeMode="cover"
            onLoad={() => setPhotoLoaded(true)}
          />
          {!photoLoaded && (
            <View className="absolute inset-0 items-center justify-center rounded-2xl bg-slate-100">
              <ActivityIndicator size="large" color={LOADER_COLOR} />
            </View>
          )}
        </View>
      </View>

      {/* Name */}
      <Text
        className="mt-6 text-center text-2xl font-bold uppercase tracking-wider text-slate-900"
        style={{ fontFamily: 'serif' }}
      >
        {profile.firstName} {profile.lastInitial}.
      </Text>

      {/* Match description */}
      {/* <Text className="mx-8 mt-2 text-center text-sm italic text-slate-400">
        {profile.matchDescription}
      </Text> */}

      {/* Location | Children */}
      <View className="mx-6 mt-6 flex-row items-center justify-center">
        <View className="flex-1 items-center">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Location
          </Text>
          <Text className="mt-1 text-sm font-medium text-slate-700">
            {profile.city}, {profile.state}
          </Text>
        </View>

        <View className="h-10 w-px bg-slate-200" />
      </View>

      {/* Tags */}
      <View className="mx-6 mt-6 items-center">
        <Text className="text-sm text-orange-500">
          {profile.aesthetic.map((a: any) => a.replace('_', ' ')).join('  ·  ')}
        </Text>
      </View>

      {/* Bio */}
      <View className="mx-6 mt-6">
        <Text className="text-sm leading-5 text-slate-600">{profile.generatedBio}</Text>
      </View>

      {/* Start Conversation button */}
      <View className="mx-6 mt-8">
        {/* <Pressable
          onPress={() => router.push(`/room/new-${profile.uid}` as never)}
          className="flex-row items-center justify-center rounded-full border-2 border-orange-500 py-3"
        >
          <Text className="mr-2 text-base">💬</Text>
          <Text className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Start Conversation
          </Text>
        </Pressable> */}
        <Pressable
          onPress={handleStartConversation}
          className="flex-row items-center justify-center rounded-full border-2 border-orange-500 py-3"
        >
          <Text className="mr-2 text-base">💬</Text>
          <Text className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Start Conversation
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
