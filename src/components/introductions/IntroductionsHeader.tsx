import React from 'react';
import { Text, View } from 'react-native';

export const IntroductionsHeader: React.FC = () => {
  return (
    <View className="px-6">
      <Text className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
        YOUR
      </Text>
      <Text className="text-3xl text-slate-900" style={{ fontFamily: 'serif' }}>
        Introductions
      </Text>
      <View className="mt-2 h-px bg-orange-500" />
    </View>
  );
};
