import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useIntroductionsStore } from "../../store/introductionsStore";
import {
  getMatchProfiles,
  getActiveConversations,
  getSavedConnections,
  getPendingRequests,
  getPendingProfiles,
  getLastMessage,
} from "../../services/introductions";
import { TabSwitcher } from "../../components/shared/TabSwitcher";
import { SearchBar } from "../../components/shared/SearchBar";
import { SortPills } from "../../components/shared/SortPills";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { MomsLikeYouCarousel } from "../../components/introductions/MomsLikeYouCarousel";
import { PendingBanner } from "../../components/introductions/PendingBanner";
import { ConversationRow } from "../../components/introductions/ConversationRow";
import { SavedConnectionCard } from "../../components/introductions/SavedConnectionCard";
import type { Introduction, SavedConnection } from "../../types/introduction";

type SortOption = "recent" | "a-z";

export default function IntroductionsScreen() {
  const router = useRouter();
  const {
    activeConversations,
    savedConnections,
    pendingRequests,
    recommendedProfiles,
    setActiveConversations,
    setSavedConnections,
    setPendingRequests,
    setRecommendedProfiles,
    removeSavedConnection,
  } = useIntroductionsStore();

  const [activeTab, setActiveTab] = useState("active");
  const [searchActive, setSearchActive] = useState("");
  const [searchSaved, setSearchSaved] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  // Load mock data on mount
  useEffect(() => {
    setRecommendedProfiles(getMatchProfiles());
    setActiveConversations(getActiveConversations());
    setSavedConnections(getSavedConnections());
    setPendingRequests(getPendingRequests());
  }, [setRecommendedProfiles, setActiveConversations, setSavedConnections, setPendingRequests]);

  // Build profile lookup from all profiles
  const pendingProfiles = getPendingProfiles();
  const allProfiles = [...recommendedProfiles, ...pendingProfiles];
  const profileMap = Object.fromEntries(allProfiles.map((p) => [p.userId, p]));

  // Pending avatars
  const pendingAvatars = pendingRequests
    .map((r) => profileMap[r.fromUserId]?.photoURL)
    .filter(Boolean) as string[];

  // Filter & sort active conversations
  const filteredActive = activeConversations
    .filter((intro) => {
      if (!searchActive) return true;
      const otherUserId = intro.fromUserId === "me" ? intro.toUserId : intro.fromUserId;
      const profile = profileMap[otherUserId];
      return profile?.firstName.toLowerCase().includes(searchActive.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === "a-z") {
        const nameA = profileMap[a.fromUserId === "me" ? a.toUserId : a.fromUserId]?.firstName ?? "";
        const nameB = profileMap[b.fromUserId === "me" ? b.toUserId : b.fromUserId]?.firstName ?? "";
        return nameA.localeCompare(nameB);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Filter saved connections
  const filteredSaved = savedConnections.filter((conn) => {
    if (!searchSaved) return true;
    return conn.firstName.toLowerCase().includes(searchSaved.toLowerCase());
  });

  const handleSayHi = useCallback(
    (userId: string) => {
      router.push(`/introduction/${userId}` as never);
    },
    [router]
  );

  const handleSave = useCallback(
    (userId: string) => {
      const profile = profileMap[userId];
      if (!profile) return;
      const { addSavedConnection } = useIntroductionsStore.getState();
      addSavedConnection({
        userId: profile.userId,
        firstName: profile.firstName,
        lastInitial: profile.lastInitial,
        photoURL: profile.photoURL,
        bio: profile.bio,
        mutualCommunities: 0,
        matchDescription: profile.matchDescription,
        savedAt: new Date(),
      });
    },
    [profileMap]
  );

  const handleConversationPress = useCallback(
    (intro: Introduction) => {
      if (intro.roomId) {
        router.push(`/room/${intro.roomId}` as never);
      }
    },
    [router]
  );

  const handleUnsave = useCallback(
    (userId: string) => {
      removeSavedConnection(userId);
    },
    [removeSavedConnection]
  );

  const tabs = [
    { id: "active", label: "Active", count: activeConversations.length },
    { id: "saved", label: "Saved", count: savedConnections.length },
  ];

  const renderActiveItem = useCallback(
    ({ item }: { item: Introduction }) => {
      const otherUserId = item.fromUserId === "me" ? item.toUserId : item.fromUserId;
      const profile = profileMap[otherUserId];
      const lastMsg = item.roomId ? getLastMessage(item.roomId) : undefined;
      if (!profile) return null;
      return (
        <ConversationRow
          name={`${profile.firstName} ${profile.lastInitial}.`}
          avatar={profile.photoURL}
          lastMessage={lastMsg?.text ?? item.matchDescription}
          timestamp={lastMsg?.timestamp ?? new Date(item.createdAt)}
          onPress={() => handleConversationPress(item)}
        />
      );
    },
    [profileMap, handleConversationPress]
  );

  const renderSavedItem = useCallback(
    ({ item }: { item: SavedConnection }) => (
      <SavedConnectionCard
        connection={item}
        onSayHi={() => handleSayHi(item.userId)}
        onUnsave={() => handleUnsave(item.userId)}
      />
    ),
    [handleSayHi, handleUnsave]
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
          Introductions
        </Text>
        <View className="mt-2 h-px bg-orange-500" />
      </View>

      {/* Pending Banner */}
      {pendingRequests.length > 0 && (
        <PendingBanner
          count={pendingRequests.length}
          avatars={pendingAvatars}
          onPress={() => router.push("/introduction/pending" as never)}
        />
      )}

      {/* Moms Like You carousel */}
      {recommendedProfiles.length > 0 && (
        <View className="mt-4">
          <SectionHeader title="MOMS LIKE YOU" />
          <View className="mt-2">
            <MomsLikeYouCarousel
              profiles={recommendedProfiles}
              onSayHi={handleSayHi}
              onSave={handleSave}
            />
          </View>
        </View>
      )}

      {/* Tab Switcher */}
      <View className="mt-4">
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Tab content */}
      {activeTab === "active" ? (
        <View className="flex-1">
          <SearchBar
            placeholder="SEARCH CONVERSATIONS"
            value={searchActive}
            onChangeText={setSearchActive}
          />
          <SortPills selected={sortOption} onSelect={setSortOption} />
          <FlatList
            data={filteredActive}
            keyExtractor={(item) => item.id}
            renderItem={renderActiveItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
      ) : (
        <View className="flex-1">
          <SearchBar
            placeholder="SEARCH SAVED"
            value={searchSaved}
            onChangeText={setSearchSaved}
          />
          <FlatList
            data={filteredSaved}
            keyExtractor={(item) => item.userId}
            renderItem={renderSavedItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          />
        </View>
      )}
    </View>
  );
}
