import React from "react";
import { Image, Text, View } from "react-native";

interface MemberAvatarRowProps {
  avatars: string[];
  totalCount: number;
  maxVisible?: number;
  size?: number;
}

export const MemberAvatarRow: React.FC<MemberAvatarRowProps> = ({
  avatars,
  totalCount,
  maxVisible = 5,
  size = 32,
}) => {
  const visible = avatars.slice(0, maxVisible);
  const remaining = totalCount - visible.length;

  return (
    <View className="flex-row items-center">
      <View className="flex-row">
        {visible.map((uri, index) => (
          <View
            key={`avatar-${index}`}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: index === 0 ? 0 : -(size * 0.25),
              zIndex: maxVisible - index,
            }}
            className="border-2 border-white overflow-hidden"
          >
            <Image
              source={{ uri }}
              style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }}
            />
          </View>
        ))}
      </View>
      {remaining > 0 && (
        <Text className="ml-2 text-xs text-slate-500">+{remaining} more</Text>
      )}
    </View>
  );
};
