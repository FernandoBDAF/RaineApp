import React from "react";
import { Pressable, Text, View } from "react-native";

interface GridCardProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export const GridCard: React.FC<GridCardProps> = ({
  title,
  description,
  selected,
  onPress
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[100px] rounded-lg border-2 p-4 ${
        selected ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white"
      }`}
    >
      <View className="flex-1 justify-center">
        <Text className="text-center text-base font-semibold text-slate-800">{title}</Text>
        <Text className="mt-1 text-center text-sm text-slate-500">{description}</Text>
      </View>
    </Pressable>
  );
};
