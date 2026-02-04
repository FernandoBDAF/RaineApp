import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { shallow } from "zustand/shallow";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { generateBio, regenerateBio } from "../../services/bio";
import { saveProfileSetup } from "../../services/profile";
import { useAuth } from "../../features/auth/AuthContext";

export default function BioScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const payload = useProfileSetupStore((state) => ({
    firstName: state.firstName,
    lastInitial: state.lastInitial,
    photoURL: state.photoURL,
    zipCode: state.zipCode,
    city: state.city,
    state: state.state,
    county: state.county,
    cityFeel: state.cityFeel,
    childCount: state.childCount,
    isExpecting: state.isExpecting,
    dueDate: state.dueDate,
    children: state.children,
    beforeMotherhood: state.beforeMotherhood,
    perfectWeekend: state.perfectWeekend,
    feelYourself: state.feelYourself,
    hardTruths: state.hardTruths,
    unexpectedJoys: state.unexpectedJoys,
    aesthetic: state.aesthetic,
    momFriendStyle: state.momFriendStyle,
    whatBroughtYou: state.whatBroughtYou,
    generatedBio: state.generatedBio,
    bioApproved: state.bioApproved,
    currentStep: state.currentStep,
    completed: state.completed
  }), shallow);
  const setBio = useProfileSetupStore((state) => state.setBio);
  const completeSetup = useProfileSetupStore((state) => state.completeSetup);
  const setCurrentStep = useProfileSetupStore((state) => state.setCurrentStep);
  const generatedBio = payload.generatedBio;

  useEffect(() => {
    setCurrentStep(14);
  }, [setCurrentStep]);

  useEffect(() => {
    if (generatedBio) {
      return;
    }
    const run = async () => {
      setLoading(true);
      try {
        const bio = await generateBio(payload);
        setBio(bio, false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [generatedBio, payload, setBio]);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const bio = await regenerateBio(payload, "Not quite");
      setBio(bio, false);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!user) {
      return;
    }
    setSubmitting(true);
    try {
      setBio(generatedBio, true);
      await saveProfileSetup(user.uid, payload);
      completeSetup();
      router.replace("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="Here's your bio" />
      <View className="flex-1 px-6 pt-6">
        {loading ? (
          <View className="mt-10 items-center">
            <LoadingSpinner />
            <Text className="mt-3 text-sm text-slate-500">Generating your bio...</Text>
          </View>
        ) : (
          <View className="rounded-lg border border-slate-200 p-4">
            <Text className="text-base italic text-slate-700">{generatedBio}</Text>
          </View>
        )}

        <Text className="mt-6 text-sm text-slate-600">Does this sound like you?</Text>
        <View className="mt-3 flex-row gap-3">
          <Pressable
            onPress={handleRegenerate}
            className="flex-1 rounded-lg border border-slate-300 py-3"
            disabled={loading}
          >
            <Text className="text-center text-sm font-semibold text-slate-700">Not quite</Text>
          </Pressable>
          <Pressable
            onPress={handleApprove}
            className="flex-1 rounded-lg bg-orange-500 py-3"
            disabled={submitting || loading}
          >
            <Text className="text-center text-sm font-semibold text-white">That's me!</Text>
          </Pressable>
        </View>
      </View>
      <ContinueButton
        onPress={handleApprove}
        disabled={submitting || loading}
        label={submitting ? "SAVING..." : "COMPLETE"}
      />
    </View>
  );
}
