import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { PostReply as PostReplyType } from "../../types/community";

interface PostReplyProps {
  reply: PostReplyType;
  onLike: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const PostReplyComponent: React.FC<PostReplyProps> = ({ reply, onLike }) => {
  return (
    <View className="ml-8 flex-row py-3 pr-4">
      <Image
        source={{ uri: reply.authorAvatar }}
        className="h-8 w-8 rounded-full"
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="text-sm font-semibold text-slate-800">
            {reply.authorName}
          </Text>
          <Text className="ml-2 text-xs text-slate-400">
            {formatTimeAgo(reply.timestamp)}
          </Text>
        </View>
        <Text className="mt-1 text-sm leading-5 text-slate-700">
          {reply.body}
        </Text>
        <Pressable onPress={onLike} className="mt-2 flex-row items-center">
          <Text className="text-xs text-slate-400">
            {reply.liked ? "♥" : "♡"} {reply.likeCount}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
