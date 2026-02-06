import React, { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Community } from "../../types/community";
import { useCommunitiesStore } from "../../store/communitiesStore";
import { getCommunities } from "../../services/communities";
import { TabSwitcher } from "../../components/shared/TabSwitcher";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterPills } from "../../components/shared/FilterPills";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { CommunityCard } from "../../components/communities/CommunityCard";

const TABS = [
  { id: "joined", label: "JOINED" },
  { id: "explore", label: "EXPLORE" },
];

const FILTER_OPTIONS = ["TOPIC", "STAGE", "SIZE"];

export default function CommunitiesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("joined");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const { joinedCommunities, savedPosts, userQuestions } = useCommunitiesStore();

  useEffect(() => {
    const data = getCommunities();
    setCommunities(data);

    // Auto-join all communities for mock purposes if none joined
    if (joinedCommunities.length === 0) {
      const { setJoinedCommunities } = useCommunitiesStore.getState();
      setJoinedCommunities(
        data.map((c) => ({
          communityId: c.id,
          name: c.name,
          coverPhotoURL: c.coverPhotoURL,
          joinedAt: new Date(),
          notificationsEnabled: true,
        }))
      );
    }
  }, [joinedCommunities.length]);

  const handleCommunityPress = (id: string) => {
    router.push(`/community/${id}`);
  };

  // Get joined community details
  const joinedIds = new Set(joinedCommunities.map((jc) => jc.communityId));
  const joinedCommunityDetails = communities.filter((c) => joinedIds.has(c.id));

  // Filter communities for Explore tab
  const filteredCommunities = communities.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const renderJoinedTab = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Community grid */}
      <View className="px-4 pt-4">
        <View className="flex-row flex-wrap">
          {joinedCommunityDetails.map((community) => (
            <View key={community.id} className="w-1/2">
              <CommunityCard
                community={community}
                onPress={() => handleCommunityPress(community.id)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Your Activity */}
      <SectionHeader title="YOUR ACTIVITY" />
      <View className="px-6 pt-2 pb-4">
        <View className="flex-row">
          <View className="mr-4 flex-1 rounded-xl border border-slate-100 bg-white p-4">
            <Text className="text-2xl font-bold text-orange-500">
              {savedPosts.length}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">Saved Tips</Text>
          </View>
          <View className="flex-1 rounded-xl border border-slate-100 bg-white p-4">
            <Text className="text-2xl font-bold text-orange-500">
              {userQuestions.length}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">Your Questions</Text>
          </View>
        </View>
      </View>

      {/* Latest Activity */}
      <SectionHeader title="LATEST ACTIVITY" />
      <View className="px-6 pt-2 pb-8">
        {communities.slice(0, 3).map((c) => (
          <Pressable
            key={c.id}
            onPress={() => handleCommunityPress(c.id)}
            className="mb-3 rounded-xl border border-slate-100 bg-white p-4"
          >
            <Text className="text-xs font-semibold text-orange-500">
              {c.name}
            </Text>
            <Text className="mt-1 text-sm text-slate-600">
              {c.postCount} posts · Last active{" "}
              {formatRelativeTime(c.lastActivityAt)}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  const renderExploreTab = () => (
    <View className="flex-1">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-sm leading-5 text-slate-500">
          Discover communities of moms who get it. Find your people based on
          where you live, your child&apos;s age, or shared experiences.
        </Text>
      </View>

      <SearchBar
        placeholder="SEARCH COMMUNITIES"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FilterPills
        filters={FILTER_OPTIONS}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <FlatList
        data={filteredCommunities}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 }}
        columnWrapperStyle={{ gap: 0 }}
        renderItem={({ item }) => (
          <View className="w-1/2">
            <CommunityCard
              community={item}
              onPress={() => handleCommunityPress(item.id)}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white pt-16">
      {/* Header */}
      <View className="px-6">
        <Text className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
          YOUR
        </Text>
        <Text
          className="text-3xl text-slate-900"
          style={{ fontFamily: "serif" }}
        >
          Communities
        </Text>
        <View className="mt-2 h-px bg-orange-500" />
      </View>

      {/* Tabs */}
      <View className="mt-4">
        <TabSwitcher
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Content */}
      {activeTab === "joined" ? renderJoinedTab() : renderExploreTab()}
    </View>
  );
}

function formatRelativeTime(date: Date): string {
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
