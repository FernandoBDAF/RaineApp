import React from "react";
import { Text, View } from "react-native";

interface SetupHeaderProps {
  headline: string;
  subheadline?: string;
}

export const SetupHeader: React.FC<SetupHeaderProps> = ({ headline, subheadline }) => {
  return (
    <View className="px-6 pt-6">
      <Text className="text-2xl font-serif text-slate-900">{headline}</Text>
      {subheadline ? (
        <Text className="mt-2 text-xs font-semibold uppercase tracking-widest text-orange-500">
          {subheadline}
        </Text>
      ) : null}
    </View>
  );
};
