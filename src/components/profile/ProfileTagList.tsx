import React from "react";
import { Text, View } from "react-native";
import type {
  Aesthetic,
  BeforeMotherhood,
  MomFriendStyle,
  PerfectWeekend,
} from "../../types/profile-setup";

interface ProfileTagListProps {
  beforeMotherhood: string[];
  perfectWeekend: string[];
  aesthetic: string[];
  momFriendStyle: string[];
}

const beforeMotherhoodLabels: Record<BeforeMotherhood, string> = {
  travel: "Travel Lover",
  hosting: "Hostess",
  movement: "Active Life",
  nature: "Nature Seeker",
  culture: "Culture Buff",
  career: "Career Driven",
};

const perfectWeekendLabels: Record<PerfectWeekend, string> = {
  adventure: "Adventure Seeker",
  slow_mornings: "Slow Mornings",
  good_company: "Good Company",
  discovery: "Discovery",
  movement: "Movement",
  family: "Family Time",
};

const aestheticLabels: Record<Aesthetic, string> = {
  clean_minimal: "Minimalist",
  natural_textured: "Natural & Textured",
  classic_timeless: "Classic Timeless",
  eclectic_collected: "Eclectic Collected",
  coastal_casual: "Coastal Casual",
  refined_essentials: "Refined Essentials",
};

const momFriendStyleLabels: Record<MomFriendStyle, string> = {
  coffee_dates: "Coffee Dates",
  playdates: "Playdates",
  group_hangouts: "Group Hangouts",
  virtual_chats: "Virtual Chats",
  weekend_family: "Weekend Family",
  workout_buddies: "Workout Buddies",
};

function mapTags(values: string[], labels: Record<string, string>): string[] {
  return values
    .map((v) => labels[v] ?? v)
    .filter(Boolean);
}

export const ProfileTagList: React.FC<ProfileTagListProps> = ({
  beforeMotherhood,
  perfectWeekend,
  aesthetic,
  momFriendStyle,
}) => {
  const allTags = [
    ...mapTags(beforeMotherhood, beforeMotherhoodLabels),
    ...mapTags(perfectWeekend, perfectWeekendLabels),
    ...mapTags(aesthetic, aestheticLabels),
    ...mapTags(momFriendStyle, momFriendStyleLabels),
  ];

  if (allTags.length === 0) return null;

  return (
    <View className="px-6 py-3">
      <Text className="text-center text-sm leading-5 text-orange-500">
        {allTags.join(" · ")}
      </Text>
    </View>
  );
};
