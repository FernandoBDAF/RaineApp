import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { HARD_TRUTH_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function HardTruthScreen() {
  const router = useRouter();
  const { hardTruths, setHardTruths, setCurrentStep } = useProfileSetupStore();
  const canContinue = hardTruths.length > 0;

  const toggleOption = (id: (typeof HARD_TRUTH_OPTIONS)[number]["id"]) => {
    const exists = hardTruths.includes(id);
    const next = exists ? hardTruths.filter((item) => item !== id) : [...hardTruths, id];
    setHardTruths(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(10);
    router.push("/(profile-setup)/unexpected-joys");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="The hard truth about motherhood I wish someone had told me..."
        subheadline="SELECT ALL THAT APPLY"
      />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {HARD_TRUTH_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={hardTruths.includes(option.id)}
              showCheckbox
              onPress={() => toggleOption(option.id)}
            />
          ))}
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
