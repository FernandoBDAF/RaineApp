import { Stack } from "expo-router";
import { View } from "react-native";
import { ProgressDots } from "../../components/profile-setup/ProgressDots";
import { useProfileSetupStore } from "../../store/profileSetupStore";

export default function ProfileSetupLayout() {
  const currentStep = useProfileSetupStore((state) => state.currentStep);

  return (
    <View className="flex-1 bg-white">
      <ProgressDots currentStep={currentStep} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right"
        }}
      />
    </View>
  );
}
