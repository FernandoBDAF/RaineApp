import React from "react";
import { FlatList, Pressable, Text } from "react-native";

interface FilterPillsProps {
  filters: string[];
  selected: string | null;
  onSelect: (filter: string | null) => void;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  selected,
  onSelect,
}) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={filters}
      keyExtractor={(item) => item}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8, gap: 8 }}
      renderItem={({ item }) => {
        const isSelected = selected === item;
        return (
          <Pressable
            onPress={() => onSelect(isSelected ? null : item)}
            className={`rounded-full border px-4 py-2 ${
              isSelected
                ? "border-orange-500 bg-orange-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-semibold tracking-wider ${
                isSelected ? "text-orange-500" : "text-slate-500"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};
