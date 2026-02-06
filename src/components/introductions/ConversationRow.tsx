import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface ConversationRowProps {
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  onPress: () => void;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);
  return `${month}/${day}/${year}`;
}

export const ConversationRow: React.FC<ConversationRowProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-6 py-3"
    >
      {/* Avatar */}
      <Image
        source={{ uri: avatar }}
        className="h-12 w-12 rounded-full"
        resizeMode="cover"
      />

      {/* Name + message */}
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-sm text-slate-400" numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>

      {/* Timestamp */}
      <Text className="ml-2 text-xs text-slate-400">
        {formatTimestamp(timestamp)}
      </Text>
    </Pressable>
  );
};
