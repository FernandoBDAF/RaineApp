import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { FEEL_YOURSELF_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function FeelYourselfScreen() {
  const router = useRouter();
  const { feelYourself, setFeelYourself, setCurrentStep } = useProfileSetupStore();
  const canContinue = Boolean(feelYourself);

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(9);
    router.push("/(profile-setup)/hard-truth");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="To feel like yourself again, you need..." />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {FEEL_YOURSELF_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={feelYourself === option.id}
              onPress={() => setFeelYourself(option.id)}
            />
          ))}
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
