import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PendingBannerProps {
  count: number;
  avatars: string[];
  onPress: () => void;
}

export const PendingBanner: React.FC<PendingBannerProps> = ({
  count,
  avatars,
  onPress,
}) => {
  const visibleAvatars = avatars.slice(0, 5);

  return (
    <Pressable
      onPress={onPress}
      className="mx-6 mt-4 flex-row items-center rounded-xl bg-orange-50 px-4 py-3"
    >
      {/* Overlapping avatars */}
      <View className="flex-row">
        {visibleAvatars.map((uri, index) => (
          <View
            key={`pending-avatar-${index}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginLeft: index === 0 ? 0 : -8,
              zIndex: 5 - index,
            }}
            className="border-2 border-white overflow-hidden"
          >
            <Image
              source={{ uri }}
              style={{ width: 28, height: 28, borderRadius: 14 }}
            />
          </View>
        ))}
      </View>

      {/* Text */}
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-slate-800">
          {count} NEW MOMS{" "}
          <Text className="font-normal text-slate-600">want to say hi</Text>
        </Text>
      </View>

      {/* Chevron */}
      <Text className="text-lg text-slate-400">{">"}</Text>
    </Pressable>
  );
};
