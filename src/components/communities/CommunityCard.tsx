import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { Community } from "../../types/community";

interface CommunityCardProps {
  community: Community;
  onPress: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} className="mb-4 flex-1 mx-1.5">
      <View className="relative overflow-hidden rounded-xl" style={{ aspectRatio: 1 }}>
        <Image
          source={{ uri: community.coverPhotoURL }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {/* Community name overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2">
          <Text className="text-sm font-bold text-white" numberOfLines={2}>
            {community.name}
          </Text>
        </View>
      </View>
      <Text className="mt-1.5 text-center text-xs text-slate-500">
        {community.memberCount} members
      </Text>
    </Pressable>
  );
};
