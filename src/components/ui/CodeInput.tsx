import React, { useEffect, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (code: string) => void;
  error?: string;
  maxLength?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  maxLength = 7
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value.length === maxLength) {
      onComplete(value);
    }
  }, [value, maxLength, onComplete]);

  const handleChange = (text: string) => {
    const sanitized = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (sanitized.length <= maxLength) {
      onChange(sanitized);
    }
  };

  return (
    <View className="items-center">
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        maxLength={maxLength}
        autoCapitalize="characters"
        autoCorrect={false}
        className={`w-64 rounded-lg border-2 px-4 py-4 text-center text-2xl font-bold tracking-widest ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        placeholder="XXXXXXX"
        placeholderTextColor="#CBD5E1"
      />
      {error ? <Text className="mt-3 text-center text-sm text-red-500">{error}</Text> : null}
    </View>
  );
};
