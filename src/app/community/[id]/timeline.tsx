import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type {
  CommunityPost as CommunityPostType,
  PostReply,
} from "../../../types/community";
import {
  getCommunityById,
  getCommunityPosts,
  getPostReplies,
} from "../../../services/communities";
import { CommunityPostComponent } from "../../../components/communities/CommunityPost";
import { SearchBar } from "../../../components/shared/SearchBar";

export default function CommunityTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const communityId = Array.isArray(id) ? id[0] : id;

  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [repliesMap, setRepliesMap] = useState<Record<string, PostReply[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [communityName, setCommunityName] = useState("");

  useEffect(() => {
    if (communityId) {
      const community = getCommunityById(communityId);
      if (community) setCommunityName(community.name);

      const communityPosts = getCommunityPosts(communityId);
      setPosts(communityPosts);

      // Build replies map
      const map: Record<string, PostReply[]> = {};
      for (const post of communityPosts) {
        map[post.id] = getPostReplies(post.id);
      }
      setRepliesMap(map);
    }
  }, [communityId]);

  const filteredPosts = searchQuery
    ? posts.filter(
        (p) =>
          p.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would create a new post
      setMessageText("");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-slate-100 px-4 pb-3 pt-14">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-xl text-slate-700">←</Text>
        </Pressable>
        <Text
          className="flex-1 text-lg text-slate-900"
          style={{ fontFamily: "serif" }}
        >
          {communityName}
        </Text>
      </View>

      {/* Search */}
      <SearchBar
        placeholder="SEARCH MESSAGES"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Post list */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CommunityPostComponent
            post={item}
            replies={repliesMap[item.id] ?? []}
            onLike={() => {}}
            onReply={() => {}}
            onBookmark={() => {}}
          />
        )}
        ListFooterComponent={
          <View className="items-center px-6 py-8">
            <Text className="text-center text-xs leading-5 text-slate-400">
              Be kind · Be helpful · We&apos;re all in this together
            </Text>
          </View>
        }
      />

      {/* Bottom input */}
      <View className="flex-row items-center border-t border-slate-100 px-4 pb-8 pt-3">
        <TextInput
          className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800"
          placeholder="Share your thoughts..."
          placeholderTextColor="#94a3b8"
          value={messageText}
          onChangeText={setMessageText}
        />
        <Pressable
          onPress={handleSendMessage}
          className="ml-3 rounded-full bg-orange-500 px-5 py-2.5"
        >
          <Text className="text-sm font-semibold text-white">Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
