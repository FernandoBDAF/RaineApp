import React from "react";
import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
}) => {
  return (
    <View className="px-6 pt-6 pb-2">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
          {title}
        </Text>
        {actionText && onActionPress && (
          <Pressable onPress={onActionPress}>
            <Text className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
              {actionText} {">"}
            </Text>
          </Pressable>
        )}
      </View>
      <View className="h-px bg-orange-500" />
    </View>
  );
};
