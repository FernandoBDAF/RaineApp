import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { Community } from "../../types/community";

interface CommunityPreviewCardProps {
  community: Community;
  onPress: () => void;
}

export const CommunityPreviewCard: React.FC<CommunityPreviewCardProps> = ({
  community,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-100 bg-white"
      style={{ height: 110 }}
    >
      {/* Cover photo – left side */}
      <View className="relative" style={{ width: 120 }}>
        <Image
          source={{ uri: community.coverPhotoURL }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {/* Badge overlay */}
        <View className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5">
          <Text className="text-[10px] font-bold tracking-wider text-white">
            {community.badge}
          </Text>
        </View>
        {/* Community name overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1.5">
          <Text className="text-xs font-bold text-white" numberOfLines={1}>
            {community.name}
          </Text>
        </View>
      </View>

      {/* Right side */}
      <View className="flex-1 justify-between p-3">
        <Text className="text-xs leading-4 text-slate-600" numberOfLines={3}>
          {community.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-orange-500">
            {community.memberCount} members
          </Text>
          <Text className="text-lg text-slate-300">{">"}</Text>
        </View>
      </View>
    </Pressable>
  );
};
