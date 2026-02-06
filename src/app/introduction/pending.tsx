import React, { useCallback } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useIntroductionsStore } from "../../store/introductionsStore";
import { getPendingProfiles } from "../../services/introductions";
import type { Introduction, MatchProfile } from "../../types/introduction";

export default function PendingIntroductionsScreen() {
  const router = useRouter();
  const { pendingRequests, removePendingRequest, setActiveConversations, activeConversations } =
    useIntroductionsStore();

  const pendingProfiles = getPendingProfiles();
  const profileMap = Object.fromEntries(
    pendingProfiles.map((p) => [p.userId, p])
  );

  const handleAccept = useCallback(
    (intro: Introduction) => {
      // Move to active with a new roomId
      const accepted: Introduction = {
        ...intro,
        status: "accepted",
        roomId: `room_${intro.id}`,
        respondedAt: new Date(),
      };
      setActiveConversations([...activeConversations, accepted]);
      removePendingRequest(intro.id);
    },
    [activeConversations, setActiveConversations, removePendingRequest]
  );

  const handleDecline = useCallback(
    (introId: string) => {
      removePendingRequest(introId);
    },
    [removePendingRequest]
  );

  const renderItem = useCallback(
    ({ item }: { item: Introduction }) => {
      const profile: MatchProfile | undefined = profileMap[item.fromUserId];
      if (!profile) return null;
      return (
        <View className="mx-6 mb-4 flex-row rounded-xl border border-slate-100 bg-white p-4">
          {/* Avatar */}
          <Image
            source={{ uri: profile.photoURL }}
            className="h-14 w-14 rounded-full"
            resizeMode="cover"
          />

          {/* Info */}
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-slate-800">
              {profile.firstName} {profile.lastInitial}.
            </Text>
            <Text className="mt-1 text-xs text-slate-400" numberOfLines={2}>
              {profile.matchDescription}
            </Text>

            {/* Buttons */}
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={() => handleAccept(item)}
                className="rounded-full bg-orange-500 px-4 py-1.5"
              >
                <Text className="text-[10px] font-bold tracking-wider text-white">
                  ACCEPT
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleDecline(item.id)}
                className="rounded-full border border-slate-300 px-4 py-1.5"
              >
                <Text className="text-[10px] font-bold tracking-wider text-slate-400">
                  DECLINE
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [profileMap, handleAccept, handleDecline]
  );

  return (
    <View className="flex-1 bg-white pt-14">
      {/* Header */}
      <View className="flex-row items-center px-6 pb-4">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-lg text-slate-700">←</Text>
        </Pressable>
        <Text
          className="text-xl font-bold text-slate-900"
          style={{ fontFamily: "serif" }}
        >
          Pending Introductions
        </Text>
      </View>

      <View className="h-px bg-orange-500 mx-6" />

      {/* List */}
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-slate-400">No pending introductions</Text>
          </View>
        }
      />
    </View>
  );
}
