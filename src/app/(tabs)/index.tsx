import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useActivityStore } from "../../store/activityStore";
import { useAuth } from "../../features/auth/AuthContext";
import { HomeHeader } from "../../components/home/HomeHeader";
import { ActivityDashboard } from "../../components/home/ActivityDashboard";
import { SectionHeader } from "../../components/shared/SectionHeader";

// ---------------------------------------------------------------------------
// Placeholder components for features being built in parallel
// ---------------------------------------------------------------------------

interface MockMom {
  id: string;
  name: string;
  photo: string;
}

const MOCK_MOMS: MockMom[] = [
  { id: "1", name: "Sarah L.", photo: "https://i.pravatar.cc/120?img=1" },
  { id: "2", name: "Jessica R.", photo: "https://i.pravatar.cc/120?img=5" },
  { id: "3", name: "Amanda K.", photo: "https://i.pravatar.cc/120?img=9" },
];

function MomsLikeYouPlaceholder() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-6 gap-4 pb-2"
    >
      {MOCK_MOMS.map((mom) => (
        <View
          key={mom.id}
          className="w-40 items-center rounded-2xl bg-white p-4 shadow-sm"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
          <Image
            source={{ uri: mom.photo }}
            className="mb-3 h-20 w-20 rounded-full bg-slate-100"
          />
          <Text className="mb-2 text-sm font-semibold text-slate-800">
            {mom.name}
          </Text>
          <Pressable className="rounded-full bg-orange-500 px-5 py-1.5 active:bg-orange-600">
            <Text className="text-xs font-bold uppercase tracking-wider text-white">
              Say Hi
            </Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

interface MockCommunity {
  id: string;
  name: string;
  photo: string;
  members: number;
}

const MOCK_COMMUNITIES: MockCommunity[] = [
  { id: "1", name: "First-Time Moms", photo: "https://i.pravatar.cc/120?img=20", members: 128 },
  { id: "2", name: "Working Moms Club", photo: "https://i.pravatar.cc/120?img=30", members: 89 },
  { id: "3", name: "Outdoorsy Families", photo: "https://i.pravatar.cc/120?img=40", members: 54 },
];

function CommunityPreviewPlaceholder() {
  return (
    <View className="gap-3 px-6">
      {MOCK_COMMUNITIES.map((community) => (
        <Pressable
          key={community.id}
          className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm active:bg-slate-50"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
          <Image
            source={{ uri: community.photo }}
            className="mr-4 h-14 w-14 rounded-xl bg-slate-100"
          />
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-800">
              {community.name}
            </Text>
            <Text className="mt-0.5 text-xs text-slate-400">
              {community.members} members
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function DropPreviewPlaceholder() {
  return (
    <Pressable className="mx-6 rounded-2xl bg-orange-500 p-6 active:bg-orange-600">
      <Text className="text-xs font-bold uppercase tracking-widest text-white/70">
        This Week
      </Text>
      <Text className="mt-2 text-xl font-bold text-white">
        Bringing Baby Home
      </Text>
      <Text className="mt-1 text-sm text-white/80">
        Tips, tricks, and real talk from moms who've been there.
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Home Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const setCounts = useActivityStore((state) => state.setCounts);

  // Set mock activity counts on mount
  useEffect(() => {
    setCounts({
      introRequests: 2,
      unreadMessages: 4,
      savedTips: 0,
      questionResponses: 2,
    });
  }, [setCounts]);

  return (
    <ScrollView className="flex-1 bg-white">
      <HomeHeader
        userPhotoURL={user?.photoURL ?? undefined}
        onProfilePress={() => router.push("/profile")}
      />

      <ActivityDashboard />

      <SectionHeader title="MOMS LIKE YOU" />
      <MomsLikeYouPlaceholder />

      <SectionHeader title="COMMUNITIES" />
      <CommunityPreviewPlaceholder />

      <SectionHeader
        title="FRESH DROP"
        actionText="SEE ALL"
        onActionPress={() => router.push("/(tabs)/drops")}
      />
      <DropPreviewPlaceholder />

      {/* Bottom spacer for tab bar */}
      <View className="h-8" />
    </ScrollView>
  );
}
