import React from 'react';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <View className="items-center justify-center py-10">
      <Text className="text-lg font-semibold text-slate-700">{title}</Text>
      {description ? <Text className="mt-2 text-slate-500">{description}</Text> : null}
    </View>
  );
};
