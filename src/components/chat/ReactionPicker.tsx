import React from 'react';
import { Pressable, Text, View } from 'react-native';

const reactions = ['👍', '❤️', '😂', '🎉', '😮'];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  return (
    <View className="flex-row gap-2 rounded-full bg-slate-100 px-3 py-2">
      {reactions.map((emoji) => (
        <Pressable key={emoji} onPress={() => onSelect(emoji)}>
          <Text className="text-lg">{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
};
