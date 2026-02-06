import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { Community } from "../../types/community";
import { MemberAvatarRow } from "../shared/MemberAvatarRow";

interface CommunityHeaderProps {
  community: Community;
  memberAvatars: string[];
  onBack: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  community,
  memberAvatars,
  onBack,
}) => {
  return (
    <View>
      {/* Hero image */}
      <View className="relative" style={{ height: 220 }}>
        <Image
          source={{ uri: community.coverPhotoURL }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {/* Back arrow */}
        <Pressable
          onPress={onBack}
          className="absolute left-4 top-14 h-10 w-10 items-center justify-center rounded-full bg-black/30"
        >
          <Text className="text-xl font-bold text-white">←</Text>
        </Pressable>
        {/* Badge with community name */}
        <View className="absolute bottom-[-16px] left-0 right-0 items-center">
          <View className="rounded-full bg-orange-500 px-6 py-2">
            <Text className="text-sm font-bold tracking-wider text-white">
              {community.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Description & members */}
      <View className="items-center px-6 pt-6 pb-4">
        <Text className="mt-2 text-center text-sm leading-5 text-slate-600">
          {community.description}
        </Text>
        <Text className="mt-3 text-sm font-semibold text-orange-500">
          {community.memberCount} members
        </Text>
        <View className="mt-2">
          <MemberAvatarRow
            avatars={memberAvatars}
            totalCount={community.memberCount}
          />
        </View>
      </View>
    </View>
  );
};
