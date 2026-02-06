import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface HomeHeaderProps {
  onProfilePress: () => void;
  userPhotoURL?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onProfilePress,
  userPhotoURL,
}) => {
  return (
    <View className="flex-row items-center justify-between px-6 pb-3 pt-14">
      <Text className="text-2xl italic text-slate-900" style={{ fontFamily: "serif" }}>
        Raine
      </Text>
      <Pressable onPress={onProfilePress} className="active:opacity-70">
        {userPhotoURL ? (
          <Image
            source={{ uri: userPhotoURL }}
            className="h-9 w-9 rounded-full bg-slate-200"
          />
        ) : (
          <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-200">
            <Text className="text-sm text-slate-500">👤</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};
