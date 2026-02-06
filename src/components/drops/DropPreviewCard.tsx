import React from "react";
import { Pressable, Text, View } from "react-native";
import type { Drop } from "../../types/drop";

interface DropPreviewCardProps {
  drop: Drop;
  onPress: () => void;
}

export const DropPreviewCard: React.FC<DropPreviewCardProps> = ({
  drop,
  onPress,
}) => {
  const totalItems = drop.sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  );

  return (
    <Pressable onPress={onPress} className="mx-6 overflow-hidden rounded-2xl">
      {/* Main coral/red area */}
      <View className="items-center justify-center bg-[#E8401C] px-6 py-10">
        <Text className="mb-2 text-xs font-bold tracking-[4px] text-white uppercase">
          {drop.category}
        </Text>
        <Text
          className="text-center text-3xl text-white"
          style={{ fontFamily: "serif", fontStyle: "italic" }}
        >
          {drop.title}
        </Text>
      </View>

      {/* Subtitle bar */}
      <View className="flex-row items-center justify-between bg-white px-5 py-4">
        <View className="mr-3 flex-1">
          <Text className="text-sm text-slate-700" numberOfLines={1}>
            {drop.subtitle}
          </Text>
          <Text className="mt-0.5 text-xs text-slate-400">
            {totalItems} curated items
          </Text>
        </View>
        <Text className="text-lg text-slate-400">›</Text>
      </View>
    </Pressable>
  );
};
