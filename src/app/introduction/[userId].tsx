import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { getUserProfile } from '../../services/firebase/users';

export default function ProfileDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId)
  });

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-400">Profile not found</Text>
      </View>
    );
  }

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
        <Image
          source={{ uri: profile.photoURL }}
          className="h-[250px] w-[250px] rounded-2xl"
          resizeMode="cover"
        />
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
        <Pressable
          onPress={() => router.push(`/room/new-${profile.uid}` as never)}
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
