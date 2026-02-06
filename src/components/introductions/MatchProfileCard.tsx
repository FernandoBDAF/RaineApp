import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { MatchProfile } from "../../types/introduction";

interface MatchProfileCardProps {
  profile: MatchProfile;
  onSayHi: () => void;
  onSave: () => void;
}

export const MatchProfileCard: React.FC<MatchProfileCardProps> = ({
  profile,
  onSayHi,
  onSave,
}) => {
  return (
    <View className="w-40">
      {/* Photo with name overlay */}
      <View className="relative">
        <Image
          source={{ uri: profile.photoURL }}
          className="h-[200px] w-full rounded-lg"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/30 px-2 pb-2 pt-1">
          <Text
            className="text-base font-bold text-white"
            style={{ fontFamily: "serif" }}
          >
            {profile.firstName} {profile.lastInitial}.
          </Text>
        </View>
      </View>

      {/* Match description */}
      <Text
        className="mt-2 text-xs leading-4 text-slate-500"
        numberOfLines={2}
      >
        {profile.matchDescription}
      </Text>

      {/* Buttons */}
      <View className="mt-2 flex-row gap-2">
        <Pressable
          onPress={onSayHi}
          className="flex-1 items-center rounded-full border border-orange-500 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-orange-500">
            SAY HI!
          </Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          className="flex-1 items-center rounded-full border border-slate-300 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-slate-400">
            SAVE
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
