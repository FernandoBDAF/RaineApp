import React from "react";
import { Pressable, Text, View } from "react-native";

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  showCheckbox?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  selected,
  onPress,
  showCheckbox = false
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-lg border-2 px-4 py-4 ${
        selected ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white"
      }`}
    >
      <Text className="flex-1 text-base text-slate-800">{label}</Text>
      {showCheckbox ? (
        <View
          className={`h-5 w-5 rounded border-2 ${
            selected ? "border-orange-500 bg-orange-500" : "border-slate-300"
          }`}
        >
          {selected ? <Text className="text-center text-xs text-white">✓</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
};
