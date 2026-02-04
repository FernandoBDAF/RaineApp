import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ContinueButton } from "../../components/profile-setup/ContinueButton";
import { OutOfAreaModal } from "../../components/profile-setup/OutOfAreaModal";
import { SetupHeader } from "../../components/profile-setup/SetupHeader";
import { ZipCodeInput } from "../../components/profile-setup/ZipCodeInput";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { lookupZipCode } from "../../services/location";
import { addToWaitlist } from "../../services/profile";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LocationScreen() {
  const router = useRouter();
  const { zipCode, setLocation, setCurrentStep } = useProfileSetupStore();
  const [zipValue, setZipValue] = useState(zipCode);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalError, setModalError] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [state, setState] = useState<string | undefined>();
  const [county, setCounty] = useState<string | undefined>();
  const [submittedWaitlist, setSubmittedWaitlist] = useState(false);

  const canContinue = useMemo(() => zipValue.length === 5, [zipValue]);

  const handleLookup = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const result = await lookupZipCode(zipValue);
      if (!result.valid) {
        setError(result.error ?? "Please enter a valid zip code");
        return;
      }
      setCity(result.city);
      setState(result.state);
      setCounty(result.county);

      if (!result.isApproved) {
        setModalVisible(true);
        return;
      }

      setLocation(zipValue, result.city ?? "", result.state ?? "", result.county ?? "");
      setCurrentStep(4);
      router.push("/(profile-setup)/city-feel");
    } finally {
      setLoading(false);
    }
  };

  const handleWaitlistSubmit = async () => {
    setModalError(undefined);
    if (!emailRegex.test(modalEmail)) {
      setModalError("Please enter a valid email");
      return;
    }
    if (!city || !state || !county) {
      setModalError("We couldn't validate this zip code");
      return;
    }
    setLoading(true);
    try {
      await addToWaitlist({
        email: modalEmail,
        zipCode: zipValue,
        city,
        state,
        county
      });
      setSubmittedWaitlist(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader
        headline="Where do you call home?"
        subheadline="WE'LL INTRODUCE YOU TO MOMS WORTH KNOWING — WHO HAPPEN TO LIVE NEARBY"
      />
      <View className="flex-1 px-6 pt-6">
        <ZipCodeInput value={zipValue} onChange={setZipValue} />
        {error ? <Text className="mt-3 text-sm text-red-500">{error}</Text> : null}
      </View>
      <ContinueButton
        onPress={handleLookup}
        disabled={!canContinue || loading}
        label={loading ? "VALIDATING..." : "CONTINUE"}
      />
      <OutOfAreaModal
        visible={modalVisible}
        city={submittedWaitlist ? city : undefined}
        email={modalEmail}
        error={modalError}
        loading={loading}
        onEmailChange={setModalEmail}
        onClose={handleCloseModal}
        onSubmit={handleWaitlistSubmit}
      />
    </View>
  );
}
