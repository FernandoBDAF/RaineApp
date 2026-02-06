import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { Input } from "../../components/ui/Input";

export default function EditProfileScreen() {
  const router = useRouter();

  const storeFirstName = useProfileSetupStore((s) => s.firstName);
  const storeLastInitial = useProfileSetupStore((s) => s.lastInitial);
  const storePhotoURL = useProfileSetupStore((s) => s.photoURL);
  const storeGeneratedBio = useProfileSetupStore((s) => s.generatedBio);

  const setName = useProfileSetupStore((s) => s.setName);
  const setPhoto = useProfileSetupStore((s) => s.setPhoto);
  const setBio = useProfileSetupStore((s) => s.setBio);

  const [firstName, setFirstName] = useState(storeFirstName);
  const [lastInitial, setLastInitial] = useState(storeLastInitial);
  const [bio, setBioText] = useState(storeGeneratedBio);
  const [photoURL] = useState(storePhotoURL);

  const handleSave = () => {
    setName(firstName, lastInitial);
    if (bio !== storeGeneratedBio) {
      setBio(bio, true);
    }
    router.back();
  };

  const handleRegenerateBio = () => {
    // Placeholder: In production this would call the AI bio generator
    const placeholderBios = [
      "A nature-loving mom navigating chaos with coffee and curiosity.",
      "Two kids, one dog, and a dream of sleeping past 7am.",
      "Former globe-trotter turned playground explorer. Still loves a good adventure.",
    ];
    const randomBio =
      placeholderBios[Math.floor(Math.random() * placeholderBios.length)];
    setBioText(randomBio);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-14">
        <Pressable onPress={() => router.back()} className="active:opacity-70">
          <Text className="text-2xl text-slate-700">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-800">
          Edit Profile
        </Text>
        <Pressable onPress={handleSave} className="active:opacity-70">
          <Text className="text-sm font-semibold text-orange-500">Save</Text>
        </Pressable>
      </View>

      {/* Photo */}
      <View className="items-center py-6">
        <Pressable className="active:opacity-80">
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              className="h-36 w-36 rounded-full bg-slate-100"
            />
          ) : (
            <View className="h-36 w-36 items-center justify-center rounded-full bg-slate-100">
              <Text className="text-5xl">👤</Text>
            </View>
          )}
          <View className="absolute bottom-0 right-0 rounded-full bg-orange-500 px-3 py-1.5">
            <Text className="text-[10px] font-bold uppercase text-white">
              Change
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Form Fields */}
      <View className="gap-5 px-6">
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Your first name"
        />
        <Input
          label="Last Initial"
          value={lastInitial}
          onChangeText={(text) => setLastInitial(text.slice(0, 1).toUpperCase())}
          placeholder="e.g. S"
          maxLength={1}
        />

        {/* Bio */}
        <View className="gap-2">
          <Text className="text-sm text-slate-600">Bio</Text>
          <View className="rounded-xl bg-slate-50 p-4">
            <Text className="text-base italic leading-6 text-slate-700">
              {bio ? `"${bio}"` : "No bio yet"}
            </Text>
          </View>
          <Pressable
            onPress={handleRegenerateBio}
            className="mt-1 self-start rounded-full bg-orange-50 px-4 py-2 active:bg-orange-100"
          >
            <Text className="text-xs font-semibold text-orange-500">
              Regenerate Bio
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom spacer */}
      <View className="h-12" />
    </ScrollView>
  );
}
