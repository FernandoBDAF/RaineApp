import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { PhotoUpload } from "../../components/profile-setup/PhotoUpload";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { uploadProfilePhoto } from "../../services/profile";
import { useAuth } from "../../features/auth/AuthContext";

export default function PhotoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { photoURL, setPhoto, setCurrentStep } = useProfileSetupStore();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user) {
      return;
    }

    // Photo is optional - skip upload if no photo selected
    if (photoURL) {
      setLoading(true);
      try {
        const manipulated = await ImageManipulator.manipulateAsync(
          photoURL,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        const remoteUrl = await uploadProfilePhoto(user.uid, manipulated.uri);
        setPhoto(remoteUrl);
      } finally {
        setLoading(false);
      }
    }

    setCurrentStep(3);
    router.push("/(profile-setup)/location");
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="We would love to put a face to your name"
        subheadline="OPTIONAL - YOU CAN ADD A PHOTO LATER"
      />
      <View className="flex-1 px-6 pt-10">
        <PhotoUpload uri={photoURL} onPick={setPhoto} />
      </View>
      <ContinueButton
        onPress={handleContinue}
        disabled={loading}
        label={loading ? "UPLOADING..." : "CONTINUE"}
      />
    </View>
  );
}
