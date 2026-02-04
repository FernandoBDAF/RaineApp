import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, description, onRetry }) => {
  return (
    <View className="items-center justify-center py-10">
      <Text className="text-lg font-semibold text-red-600">{title}</Text>
      {description ? <Text className="mt-2 text-slate-500">{description}</Text> : null}
      {onRetry ? (
        <View className="mt-4 w-40">
          <Button title="Try again" onPress={onRetry} variant="outline" />
        </View>
      ) : null}
    </View>
  );
};
