import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { PERFECT_WEEKEND_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { GridCard } from "../../components/profile-setup/GridCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

const MAX_SELECTIONS = 3;

export default function PerfectWeekendScreen() {
  const router = useRouter();
  const { perfectWeekend, setPerfectWeekend, setCurrentStep } = useProfileSetupStore();
  const canContinue = perfectWeekend.length > 0;

  const toggleOption = (id: (typeof PERFECT_WEEKEND_OPTIONS)[number]["id"]) => {
    const exists = perfectWeekend.includes(id);
    if (!exists && perfectWeekend.length >= MAX_SELECTIONS) {
      return;
    }
    const next = exists ? perfectWeekend.filter((item) => item !== id) : [...perfectWeekend, id];
    setPerfectWeekend(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(8);
    router.push("/(profile-setup)/feel-yourself");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="The perfect weekend meant..." subheadline="SELECT UP TO 3" />
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row flex-wrap gap-3">
          {PERFECT_WEEKEND_OPTIONS.map((option) => (
            <View key={option.id} className="w-[48%]">
              <GridCard
                title={option.title}
                description={option.description}
                selected={perfectWeekend.includes(option.id)}
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
