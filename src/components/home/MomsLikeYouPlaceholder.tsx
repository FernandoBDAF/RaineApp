import { ScrollView, View, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import { useMomsLikeYou } from '../../hooks/useMomsLikeYou';

interface MomsLikeYouPlaceholderProps {
  uid: string;
}
export default function MomsLikeYouPlaceholder({ uid }: Readonly<MomsLikeYouPlaceholderProps>) {
  const { profiles, isLoading, error } = useMomsLikeYou(uid);
  const displayProfiles = profiles.slice(0, 3);

  if (isLoading) {
    return (
      <View className="mt-5">
        <ActivityIndicator size="large" className="text-orange-500" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-5 items-center justify-center">
        <Text className="text-lg text-red-600">Error: {error?.message}</Text>
      </View>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-6 gap-4 pb-2"
    >
      {displayProfiles.map((mom) => (
        <View
          key={mom.uid}
          className="w-40 items-center rounded-2xl bg-white p-4 shadow-sm"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2
          }}
        >
          <Image
            source={{ uri: mom.photoURL }}
            className="mb-3 h-20 w-20 rounded-full bg-slate-100"
          />
          <Text className="mb-2 text-sm font-semibold text-slate-800">
            {mom.firstName + ' ' + mom.lastInitial}
          </Text>
          <Pressable className="rounded-full bg-orange-500 px-5 py-1.5 active:bg-orange-600">
            <Text className="text-xs font-bold uppercase tracking-wider text-white">Say Hi</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
