import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View className="space-y-2">
      {label ? <Text className="text-sm text-slate-600">{label}</Text> : null}
      <TextInput
        className={`rounded-md border px-3 py-3 text-base ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </View>
  );
};
