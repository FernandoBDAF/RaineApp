import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Community, CommunityPost } from "../../types/community";
import { getCommunityById, getNoteworthyPosts } from "../../services/communities";
import { CommunityHeader } from "../../components/communities/CommunityHeader";
import { NoteworthyPostCard } from "../../components/communities/NoteworthyPostCard";
import { SectionHeader } from "../../components/shared/SectionHeader";

const MEMBER_AVATARS = [
  "https://picsum.photos/seed/mem1/100/100",
  "https://picsum.photos/seed/mem2/100/100",
  "https://picsum.photos/seed/mem3/100/100",
  "https://picsum.photos/seed/mem4/100/100",
  "https://picsum.photos/seed/mem5/100/100",
];

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | undefined>();
  const [noteworthyPosts, setNoteworthyPosts] = useState<CommunityPost[]>([]);
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    if (id) {
      const communityId = Array.isArray(id) ? id[0] : id;
      setCommunity(getCommunityById(communityId));
      setNoteworthyPosts(getNoteworthyPosts(communityId));
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleJoinConversation = () => {
    const communityId = Array.isArray(id) ? id[0] : id;
    router.push(`/community/${communityId}/timeline`);
  };

  const handleSendQuestion = () => {
    if (questionText.trim()) {
      // In a real app, this would create a post
      setQuestionText("");
    }
  };

  if (!community) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-400">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Hero header */}
      <CommunityHeader
        community={community}
        memberAvatars={MEMBER_AVATARS}
        onBack={handleBack}
      />

      {/* Noteworthy posts */}
      {noteworthyPosts.length > 0 && (
        <View>
          <SectionHeader title="NOTEWORTHY" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12 }}
          >
            {noteworthyPosts.map((post) => (
              <NoteworthyPostCard key={post.id} post={post} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Ask the moms */}
      <SectionHeader title="ASK THE MOMS WHO GET IT" />
      <View className="mx-6 mt-3 flex-row items-center rounded-xl border border-slate-200 px-4 py-3">
        <TextInput
          className="flex-1 text-sm text-slate-800"
          placeholder="Ask your question..."
          placeholderTextColor="#94a3b8"
          value={questionText}
          onChangeText={setQuestionText}
          multiline
        />
        <Pressable
          onPress={handleSendQuestion}
          className="ml-3 rounded-full bg-orange-500 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-white">Send</Text>
        </Pressable>
      </View>

      {/* Join conversation button */}
      <View className="px-6 pt-6 pb-12">
        <Pressable
          onPress={handleJoinConversation}
          className="items-center rounded-xl bg-orange-500 py-4"
        >
          <Text className="text-base font-bold tracking-wider text-white">
            JOIN CONVERSATION
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
