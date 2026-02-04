import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const LoadingSpinner: React.FC = () => {
  return (
    <View className="items-center justify-center py-6">
      <ActivityIndicator size="large" />
    </View>
  );
};
