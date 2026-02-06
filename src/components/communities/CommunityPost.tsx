import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import type { CommunityPost as CommunityPostType, PostReply } from "../../types/community";
import { PostReplyComponent } from "./PostReply";

interface CommunityPostProps {
  post: CommunityPostType;
  replies: PostReply[];
  onLike: () => void;
  onReply: (text: string) => void;
  onBookmark: () => void;
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

export const CommunityPostComponent: React.FC<CommunityPostProps> = ({
  post,
  replies,
  onLike,
  onReply,
  onBookmark,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    const trimmed = replyText.trim();
    if (trimmed) {
      onReply(trimmed);
      setReplyText("");
    }
  };

  return (
    <View className="border-b border-slate-100 px-6 py-4">
      {/* Author row */}
      <View className="flex-row items-center">
        <Image
          source={{ uri: post.authorAvatar }}
          className="h-10 w-10 rounded-full"
        />
        <View className="ml-3">
          <Text className="text-sm font-semibold text-slate-800">
            {post.authorName}
          </Text>
          <Text className="text-xs text-slate-400">
            {formatTimeAgo(post.timestamp)}
          </Text>
        </View>
      </View>

      {/* Body */}
      <Text className="mt-3 text-sm leading-5 text-slate-700">{post.body}</Text>

      {/* Action bar */}
      <View className="mt-3 flex-row items-center">
        <Pressable onPress={onLike} className="mr-5 flex-row items-center">
          <Text className="text-sm text-slate-500">
            {post.liked ? "♥" : "♡"} {post.likeCount}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowReplies(!showReplies)}
          className="mr-5 flex-row items-center"
        >
          <Text className="text-sm text-slate-500">💬 {post.replyCount}</Text>
        </Pressable>
        <Pressable onPress={onBookmark} className="flex-row items-center">
          <Text className="text-sm text-slate-500">
            {post.bookmarked ? "🔖" : "🔖"} Save
          </Text>
        </Pressable>
      </View>

      {/* Toggle replies */}
      {replies.length > 0 && (
        <Pressable onPress={() => setShowReplies(!showReplies)} className="mt-2">
          <Text className="text-xs font-semibold text-orange-500">
            {showReplies
              ? `Hide ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`
              : `Show ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
          </Text>
        </Pressable>
      )}

      {/* Replies */}
      {showReplies && (
        <View className="mt-2">
          {replies.map((reply) => (
            <PostReplyComponent
              key={reply.id}
              reply={reply}
              onLike={() => {}}
            />
          ))}
          {/* Inline reply input */}
          <View className="ml-8 mt-2 flex-row items-center rounded-lg border border-slate-200 px-3 py-2">
            <TextInput
              className="flex-1 text-sm text-slate-800"
              placeholder="Write a reply..."
              placeholderTextColor="#94a3b8"
              value={replyText}
              onChangeText={setReplyText}
            />
            <Pressable onPress={handleSendReply}>
              <Text className="ml-2 text-sm font-semibold text-orange-500">Send</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
