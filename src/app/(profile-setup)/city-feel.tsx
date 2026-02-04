import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { CITY_FEEL_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function CityFeelScreen() {
  const router = useRouter();
  const { cityFeel, setCityFeel, setCurrentStep } = useProfileSetupStore();
  const canContinue = Boolean(cityFeel);

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(5);
    router.push("/(profile-setup)/children");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="In this city, you feel..." />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {CITY_FEEL_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={cityFeel === option.id}
              onPress={() => setCityFeel(option.id)}
            />
          ))}
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
