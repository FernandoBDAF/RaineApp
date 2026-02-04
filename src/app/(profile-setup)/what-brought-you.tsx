import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { WHAT_BROUGHT_YOU_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function WhatBroughtYouScreen() {
  const router = useRouter();
  const { whatBroughtYou, setWhatBroughtYou, setCurrentStep } = useProfileSetupStore();
  const canContinue = Boolean(whatBroughtYou);

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(14);
    router.push("/(profile-setup)/bio");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="What brought you to Raine?" />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {WHAT_BROUGHT_YOU_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={whatBroughtYou === option.id}
              onPress={() => setWhatBroughtYou(option.id)}
            />
          ))}
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
