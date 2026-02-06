import React from "react";
import { Text, View } from "react-native";
import type { Community, CommunityCategory } from "../../types/community";
import { CommunityPreviewCard } from "./CommunityPreviewCard";

interface CommunityPreviewListProps {
  communities: Community[];
  onCommunityPress: (id: string) => void;
}

const categoryHeaders: Record<CommunityCategory, string> = {
  location: "BASED ON YOUR LOCATION",
  child_age: "BASED ON YOUR CHILD'S BIRTH DATE",
  experience: "BASED ON YOUR EXPERIENCES",
  topic: "BASED ON YOUR INTERESTS",
  stage: "BASED ON YOUR STAGE",
};

export const CommunityPreviewList: React.FC<CommunityPreviewListProps> = ({
  communities,
  onCommunityPress,
}) => {
  // Group by category
  const grouped = communities.reduce<Record<string, Community[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  return (
    <View className="px-6 pt-4">
      {Object.entries(grouped).map(([category, items]) => (
        <View key={category} className="mb-4">
          <Text className="mb-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            {categoryHeaders[category as CommunityCategory] ?? category.toUpperCase()}
          </Text>
          {items.map((community) => (
            <CommunityPreviewCard
              key={community.id}
              community={community}
              onPress={() => onCommunityPress(community.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
