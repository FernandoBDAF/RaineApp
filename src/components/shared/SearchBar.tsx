import React from "react";
import { Text, TextInput, View } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "SEARCH",
  value,
  onChangeText,
}) => {
  return (
    <View className="mx-6 mt-4 mb-2 flex-row items-center rounded-lg border border-slate-200 bg-white px-3 py-2">
      <Text className="mr-2 text-slate-400">🔍</Text>
      <TextInput
        className="flex-1 text-sm text-slate-800"
        placeholder={placeholder}
        placeholderTextColor="#999999"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};
