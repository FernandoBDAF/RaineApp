import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useActivityStore } from "../../store/activityStore";
import { ActivityCounter } from "./ActivityCounter";

export const ActivityDashboard: React.FC = () => {
  const router = useRouter();
  const counts = useActivityStore((state) => state.counts);

  return (
    <View className="flex-row gap-2 px-6 py-4">
      <ActivityCounter
        label="Intro Requests"
        count={counts.introRequests}
        onPress={() => router.push("/(tabs)/introductions")}
      />
      <ActivityCounter
        label="Unread Messages"
        count={counts.unreadMessages}
        onPress={() => router.push("/(tabs)/introductions")}
      />
      <ActivityCounter
        label="Saved Tips"
        count={counts.savedTips}
        onPress={() => router.push("/(tabs)/drops")}
      />
      <ActivityCounter
        label="Question Responses"
        count={counts.questionResponses}
        onPress={() => router.push("/(tabs)/communities")}
      />
    </View>
  );
};
