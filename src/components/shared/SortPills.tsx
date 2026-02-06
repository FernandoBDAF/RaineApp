import React from "react";
import { Pressable, Text, View } from "react-native";

type SortOption = "recent" | "a-z";

interface SortPillsProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

export const SortPills: React.FC<SortPillsProps> = ({ selected, onSelect }) => {
  const options: { id: SortOption; label: string }[] = [
    { id: "recent", label: "RECENT" },
    { id: "a-z", label: "A-Z" },
  ];

  return (
    <View className="flex-row gap-2 px-6 py-2">
      {options.map((opt) => {
        const isActive = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            className={`rounded-full border px-4 py-2 ${
              isActive ? "border-orange-500" : "border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold tracking-wider ${
                isActive ? "text-orange-500" : "text-slate-400"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
