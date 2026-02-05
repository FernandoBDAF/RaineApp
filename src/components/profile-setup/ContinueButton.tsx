import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  disabled = false,
  label = 'CONTINUE'
}) => {
  return (
    <View className="px-6 pb-8 pt-4 mb-7">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`rounded-lg py-4 ${disabled ? 'bg-slate-200' : 'bg-orange-500'}`}
      >
        <Text
          className={`text-center text-sm font-semibold tracking-widest ${
            disabled ? 'text-slate-400' : 'text-white'
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};
