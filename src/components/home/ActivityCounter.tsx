import React from "react";
import { Pressable, Text } from "react-native";

interface ActivityCounterProps {
  label: string;
  count: number;
  onPress: () => void;
}

export const ActivityCounter: React.FC<ActivityCounterProps> = ({
  label,
  count,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center rounded-xl bg-slate-50 px-2 py-3 active:bg-slate-100"
    >
      <Text
        className="text-2xl text-slate-900"
        style={{ fontFamily: "serif" }}
      >
        {count}
      </Text>
      <Text className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </Text>
    </Pressable>
  );
};
