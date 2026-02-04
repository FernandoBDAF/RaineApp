import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AESTHETIC_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { ColorGridCard } from "../../components/profile-setup/ColorGridCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

const MAX_SELECTIONS = 2;

export default function AestheticScreen() {
  const router = useRouter();
  const { aesthetic, setAesthetic, setCurrentStep } = useProfileSetupStore();
  const canContinue = aesthetic.length > 0;

  const toggleOption = (id: (typeof AESTHETIC_OPTIONS)[number]["id"]) => {
    const exists = aesthetic.includes(id);
    if (!exists && aesthetic.length >= MAX_SELECTIONS) {
      return;
    }
    const next = exists ? aesthetic.filter((item) => item !== id) : [...aesthetic, id];
    setAesthetic(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(12);
    router.push("/(profile-setup)/mom-friends");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="How would you describe your aesthetic?" subheadline="SELECT UP TO 2" />
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row flex-wrap gap-3">
          {AESTHETIC_OPTIONS.map((option) => (
            <View key={option.id} className="w-[48%]">
              <ColorGridCard
                label={option.label}
                color={option.color}
                selected={aesthetic.includes(option.id)}
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
