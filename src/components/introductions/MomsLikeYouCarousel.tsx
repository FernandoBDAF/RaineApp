import React from "react";
import { FlatList, View } from "react-native";
import type { MatchProfile } from "../../types/introduction";
import { MatchProfileCard } from "./MatchProfileCard";

interface MomsLikeYouCarouselProps {
  profiles: MatchProfile[];
  onSayHi: (userId: string) => void;
  onSave: (userId: string) => void;
}

export const MomsLikeYouCarousel: React.FC<MomsLikeYouCarouselProps> = ({
  profiles,
  onSayHi,
  onSave,
}) => {
  return (
    <FlatList
      data={profiles}
      keyExtractor={(item) => item.userId}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      ItemSeparatorComponent={() => <View className="w-4" />}
      renderItem={({ item }) => (
        <MatchProfileCard
          profile={item}
          onSayHi={() => onSayHi(item.userId)}
          onSave={() => onSave(item.userId)}
        />
      )}
    />
  );
};
