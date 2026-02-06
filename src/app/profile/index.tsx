import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../features/auth/AuthContext";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { ProfileTagList } from "../../components/profile/ProfileTagList";

function getChildAge(birthMonth: number, birthYear: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0 && months <= 0) return "Newborn";
  if (years < 1) return `${months}mo`;
  if (years === 1 && months === 0) return "1 year";
  if (months === 0) return `${years} years`;
  return `${years}y ${months}mo`;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const firstName = useProfileSetupStore((s) => s.firstName);
  const lastInitial = useProfileSetupStore((s) => s.lastInitial);
  const photoURL = useProfileSetupStore((s) => s.photoURL);
  const city = useProfileSetupStore((s) => s.city);
  const state = useProfileSetupStore((s) => s.state);
  const generatedBio = useProfileSetupStore((s) => s.generatedBio);
  const children = useProfileSetupStore((s) => s.children);
  const isExpecting = useProfileSetupStore((s) => s.isExpecting);
  const dueDate = useProfileSetupStore((s) => s.dueDate);
  const beforeMotherhood = useProfileSetupStore((s) => s.beforeMotherhood);
  const perfectWeekend = useProfileSetupStore((s) => s.perfectWeekend);
  const aesthetic = useProfileSetupStore((s) => s.aesthetic);
  const momFriendStyle = useProfileSetupStore((s) => s.momFriendStyle);

  const displayName = `${firstName} ${lastInitial}.`;
  const displayPhoto = photoURL || user?.photoURL;

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-14">
        <Pressable onPress={() => router.back()} className="active:opacity-70">
          <Text className="text-2xl text-slate-700">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-800">Profile</Text>
        <Pressable
          onPress={() => router.push("/profile/edit")}
          className="active:opacity-70"
        >
          <Text className="text-sm font-semibold text-orange-500">Edit</Text>
        </Pressable>
      </View>

      {/* Profile Photo */}
      <View className="items-center py-6">
        {displayPhoto ? (
          <Image
            source={{ uri: displayPhoto }}
            className="h-36 w-36 rounded-full bg-slate-100"
          />
        ) : (
          <View className="h-36 w-36 items-center justify-center rounded-full bg-slate-100">
            <Text className="text-5xl">👤</Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text className="text-center text-2xl font-bold text-slate-900">
        {displayName}
      </Text>

      {/* Location */}
      {city && state ? (
        <Text className="mt-1 text-center text-sm text-slate-400">
          {city}, {state}
        </Text>
      ) : null}

      {/* Bio */}
      {generatedBio ? (
        <Text className="mx-6 mt-4 text-center text-base italic leading-6 text-slate-600">
          &ldquo;{generatedBio}&rdquo;
        </Text>
      ) : null}

      {/* Tags */}
      <ProfileTagList
        beforeMotherhood={beforeMotherhood}
        perfectWeekend={perfectWeekend}
        aesthetic={aesthetic}
        momFriendStyle={momFriendStyle}
      />

      {/* Children Section */}
      {children.length > 0 || isExpecting ? (
        <View className="mx-6 mt-4 rounded-2xl bg-slate-50 p-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Children
          </Text>
          {children.map((child, index) => (
            <View key={index} className="flex-row items-center justify-between py-1">
              <Text className="text-base text-slate-700">
                {child.name || `Child ${index + 1}`}
              </Text>
              <Text className="text-sm text-slate-400">
                {getChildAge(child.birthMonth, child.birthYear)}
              </Text>
            </View>
          ))}
          {isExpecting && dueDate ? (
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-base text-slate-700">Baby on the way</Text>
              <Text className="text-sm text-slate-400">
                Due {dueDate.month}/{dueDate.year}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Buttons */}
      <View className="mt-8 gap-3 px-6">
        <Pressable
          onPress={() => router.push("/profile/edit")}
          className="items-center rounded-full bg-slate-100 py-3.5 active:bg-slate-200"
        >
          <Text className="text-sm font-semibold text-slate-700">Settings</Text>
        </Pressable>
        <Pressable
          onPress={handleSignOut}
          className="items-center rounded-full bg-red-50 py-3.5 active:bg-red-100"
        >
          <Text className="text-sm font-semibold text-red-500">Sign Out</Text>
        </Pressable>
      </View>

      {/* Bottom spacer */}
      <View className="h-12" />
    </ScrollView>
  );
}
