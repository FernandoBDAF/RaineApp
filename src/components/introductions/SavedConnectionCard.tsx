import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { SavedConnection } from "../../types/introduction";

interface SavedConnectionCardProps {
  connection: SavedConnection;
  onSayHi: () => void;
  onUnsave: () => void;
}

export const SavedConnectionCard: React.FC<SavedConnectionCardProps> = ({
  connection,
  onSayHi,
  onUnsave,
}) => {
  return (
    <View className="mx-6 mb-4 flex-row rounded-xl border border-slate-100 bg-white p-4">
      {/* Square avatar */}
      <Image
        source={{ uri: connection.photoURL }}
        className="h-20 w-20 rounded-xl"
        resizeMode="cover"
      />

      {/* Info */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-slate-800">
          {connection.firstName} {connection.lastInitial}.
        </Text>
        <Text className="text-xs font-semibold text-orange-500">
          {connection.mutualCommunities} mutual communities
        </Text>
        <Text className="mt-1 text-xs text-slate-400" numberOfLines={2}>
          {connection.bio}
        </Text>

        {/* Buttons */}
        <View className="mt-3 flex-row gap-2">
          <Pressable
            onPress={onSayHi}
            className="rounded-full bg-orange-500 px-4 py-1.5"
          >
            <Text className="text-[10px] font-bold tracking-wider text-white">
              SAY HI!
            </Text>
          </Pressable>
          <Pressable
            onPress={onUnsave}
            className="rounded-full border border-slate-300 px-4 py-1.5"
          >
            <Text className="text-[10px] font-bold tracking-wider text-slate-400">
              UNSAVE
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
