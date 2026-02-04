import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { MOM_FRIEND_STYLE_OPTIONS } from "../../constants/profile-options";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SelectionCard } from "../../components/profile-setup/SelectionCard";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function MomFriendsScreen() {
  const router = useRouter();
  const { momFriendStyle, setMomFriendStyle, setCurrentStep } = useProfileSetupStore();
  const canContinue = momFriendStyle.length > 0;

  const toggleOption = (id: (typeof MOM_FRIEND_STYLE_OPTIONS)[number]["id"]) => {
    const exists = momFriendStyle.includes(id);
    const next = exists ? momFriendStyle.filter((item) => item !== id) : [...momFriendStyle, id];
    setMomFriendStyle(next);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(13);
    router.push("/(profile-setup)/what-brought-you");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="When it comes to making mom friends..." subheadline="SELECT ALL THAT APPLY" />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-3">
          {MOM_FRIEND_STYLE_OPTIONS.map((option) => (
            <SelectionCard
              key={option.id}
              label={option.label}
              selected={momFriendStyle.includes(option.id)}
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
