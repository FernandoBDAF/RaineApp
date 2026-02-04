import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../ui/Button";

interface PhotoUploadProps {
  uri?: string;
  onPick: (uri: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ uri, onPick }) => {
  const handlePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center gap-4">
      <Pressable
        onPress={handlePick}
        className="h-44 w-44 items-center justify-center rounded-xl border border-dashed border-slate-300"
      >
        {uri ? (
          <Image source={{ uri }} className="h-44 w-44 rounded-xl" />
        ) : (
          <Text className="text-sm text-slate-500">Tap to upload</Text>
        )}
      </Pressable>
      <Button title={uri ? "Change Photo" : "Upload Photo"} onPress={handlePick} />
    </View>
  );
};
