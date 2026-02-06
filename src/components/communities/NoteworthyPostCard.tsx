import React from "react";
import { Image, Text, View } from "react-native";
import type { CommunityPost } from "../../types/community";

interface NoteworthyPostCardProps {
  post: CommunityPost;
}

export const NoteworthyPostCard: React.FC<NoteworthyPostCardProps> = ({ post }) => {
  return (
    <View
      className="mr-3 rounded-xl border border-slate-100 bg-white p-4"
      style={{ width: 200 }}
    >
      {/* Author */}
      <View className="mb-2 flex-row items-center">
        <Image
          source={{ uri: post.authorAvatar }}
          className="h-7 w-7 rounded-full"
        />
        <Text className="ml-2 text-xs font-semibold text-slate-700">
          {post.authorName}
        </Text>
      </View>

      {/* Quoted body */}
      <Text
        className="mb-3 text-xs leading-4 text-slate-600 italic"
        numberOfLines={4}
      >
        &ldquo;{post.body}&rdquo;
      </Text>

      {/* Stats row */}
      <View className="flex-row items-center">
        <Text className="mr-3 text-[10px] text-slate-400">♡ {post.likeCount}</Text>
        <Text className="mr-3 text-[10px] text-slate-400">💬 {post.replyCount}</Text>
        <Text className="text-[10px] text-slate-400">⭐ {post.bookmarkCount}</Text>
      </View>
    </View>
  );
};
