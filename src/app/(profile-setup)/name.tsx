import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "../../components/ui/Input";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";

const isLettersOnly = (value: string) => /^[A-Za-z]+$/.test(value);

export default function NameScreen() {
  const router = useRouter();
  const { firstName, lastInitial, setName, setCurrentStep } = useProfileSetupStore();
  const [submitted, setSubmitted] = useState(false);

  const firstNameValid = useMemo(
    () => firstName.length >= 1 && firstName.length <= 50 && isLettersOnly(firstName),
    [firstName]
  );
  const lastInitialValid = useMemo(
    () => lastInitial.length === 1 && isLettersOnly(lastInitial),
    [lastInitial]
  );
  const canContinue = firstNameValid && lastInitialValid;

  const handleContinue = () => {
    setSubmitted(true);
    if (!canContinue) {
      return;
    }
    setCurrentStep(2);
    router.push("/(profile-setup)/photo");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="Let's start with your name" subheadline="FIRST NAME AND LAST NAME INITIAL" />
      <View className="flex-1 px-6 pt-6">
        <View className="gap-4">
          <Input
            label="First Name"
            value={firstName}
            placeholder="First Name"
            autoCapitalize="words"
            onChangeText={(text) => setName(text.replace(/[^A-Za-z]/g, ""), lastInitial)}
            error={submitted && !firstNameValid ? "Please enter your first name" : undefined}
          />
          <Input
            label="Last Initial"
            value={lastInitial}
            placeholder="Last Initial"
            autoCapitalize="characters"
            maxLength={1}
            onChangeText={(text) =>
              setName(firstName, text.replace(/[^A-Za-z]/g, "").toUpperCase())
            }
            error={submitted && !lastInitialValid ? "Please enter your last initial" : undefined}
          />
        </View>
      </View>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}
