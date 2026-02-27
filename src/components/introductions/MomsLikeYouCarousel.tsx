import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useMomsLikeYou } from '../../hooks/useMomsLikeYou';
import { MatchProfileCard } from './MatchProfileCard';

interface MomsLikeYouCarouselProps {
  uid: string | undefined;
  onSayHi: (userId: string) => void;
  onSave: (userId: string) => void;
}

export const MomsLikeYouCarousel: React.FC<MomsLikeYouCarouselProps> = ({
  uid,
  onSayHi,
  onSave
}) => {
  const { profiles, isLoading, error } = useMomsLikeYou(uid);

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
    <FlatList
      data={profiles}
      keyExtractor={(item) => item.uid}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      ItemSeparatorComponent={() => <View className="w-4" />}
      renderItem={({ item }) => (
        <MatchProfileCard
          profile={item}
          onSayHi={() => onSayHi(item.uid)}
          onSave={() => onSave(item.uid)}
        />
      )}
    />
  );
};
