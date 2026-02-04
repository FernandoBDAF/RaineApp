import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { BEFORE_MOTHERHOOD_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { GridCard } from "../../components/profile-setup/GridCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

const MAX_SELECTIONS = 3;

export default function BeforeMotherhoodScreen() {
  const router = useRouter();
  const { beforeMotherhood, setBeforeMotherhood, setCurrentStep } = useProfileSetupStore();
  const canContinue = beforeMotherhood.length > 0;

  const toggleOption = (id: (typeof BEFORE_MOTHERHOOD_OPTIONS)[number]["id"]) => {
    const exists = beforeMotherhood.includes(id);
    if (!exists && beforeMotherhood.length >= MAX_SELECTIONS) {
      return;
    }
    const next = exists
      ? beforeMotherhood.filter((item) => item !== id)
      : [...beforeMotherhood, id];
    setBeforeMotherhood(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(7);
    router.push("/(profile-setup)/perfect-weekend");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="Before motherhood, your life revolved around..."
        subheadline="SELECT UP TO 3"
      />
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row flex-wrap gap-3">
          {BEFORE_MOTHERHOOD_OPTIONS.map((option) => (
            <View key={option.id} className="w-[48%]">
              <GridCard
                title={option.title}
                description={option.description}
                selected={beforeMotherhood.includes(option.id)}
                onPress={() => toggleOption(option.id)}
              />
            </View>
          ))}
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
