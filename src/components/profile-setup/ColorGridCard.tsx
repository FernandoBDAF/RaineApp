import React from "react";
import { Pressable, Text, View } from "react-native";

interface ColorGridCardProps {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

const getIsLightBackground = (color: string) => {
  const hex = color.replace("#", "");
  if (hex.length !== 6) {
    return true;
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
};

export const ColorGridCard: React.FC<ColorGridCardProps> = ({
  label,
  color,
  selected,
  onPress
}) => {
  const isLightBackground = getIsLightBackground(color);

  return (
    <Pressable
      onPress={onPress}
      style={{ aspectRatio: 1 }}
      className={`w-full rounded-lg overflow-hidden ${
        selected ? "border-4 border-orange-500" : "border-2 border-slate-200"
      }`}
    >
      <View style={{ backgroundColor: color }} className="flex-1 items-center justify-center p-3">
        <Text
          className={`text-center text-sm font-medium ${
            isLightBackground ? "text-slate-800" : "text-white"
          }`}
        >
          {label}
        </Text>
      </View>
      {selected ? (
        <View className="absolute top-2 right-2 h-5 w-5 rounded-full bg-orange-500 items-center justify-center">
          <Text className="text-xs text-white">✓</Text>
        </View>
      ) : null}
    </Pressable>
  );
};
