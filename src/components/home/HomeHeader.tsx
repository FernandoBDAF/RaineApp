import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getAvatarSource } from "../../constants/avatars";

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
        <Image
          source={getAvatarSource(userPhotoURL)}
          className="h-9 w-9 rounded-full bg-slate-200"
        />
      </Pressable>
    </View>
  );
};
