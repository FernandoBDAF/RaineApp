import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { UNEXPECTED_JOY_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function UnexpectedJoysScreen() {
  const router = useRouter();
  const { unexpectedJoys, setUnexpectedJoys, setCurrentStep } = useProfileSetupStore();
  const canContinue = unexpectedJoys.length > 0;

  const toggleOption = (id: (typeof UNEXPECTED_JOY_OPTIONS)[number]["id"]) => {
    const exists = unexpectedJoys.includes(id);
    const next = exists ? unexpectedJoys.filter((item) => item !== id) : [...unexpectedJoys, id];
    setUnexpectedJoys(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(11);
    router.push("/(profile-setup)/aesthetic");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="The unexpected joys of motherhood that have surprised you most?"
        subheadline="SELECT ALL THAT APPLY"
      />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {UNEXPECTED_JOY_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={unexpectedJoys.includes(option.id)}
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
