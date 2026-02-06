import React from "react";
import { Pressable, Text, View } from "react-native";
import type { Drop } from "../../types/drop";

interface DropCoverCardProps {
  drop: Drop;
  onPress: () => void;
}

export const DropCoverCard: React.FC<DropCoverCardProps> = ({
  drop,
  onPress,
}) => {
  const totalItems = drop.sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  );

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl"
      style={{ flex: 0.5 }}
    >
      <View
        className="items-center justify-center px-4 py-8"
        style={{ backgroundColor: drop.coverColor }}
      >
        <Text className="text-xs font-bold tracking-[4px] text-white uppercase">
          THE DROP
        </Text>
        <Text className="my-2 text-sm text-white/70">✕</Text>
        <Text
          className="text-center text-lg text-[#E8613C]"
          style={{ fontFamily: "serif", fontStyle: "italic" }}
        >
          {drop.title}
        </Text>
        <Text className="mt-2 text-[10px] tracking-wider text-white/80 uppercase">
          {totalItems} items
        </Text>
      </View>
    </Pressable>
  );
};
