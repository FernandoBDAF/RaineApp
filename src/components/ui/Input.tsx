import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isSecure = showPasswordToggle ? !showPassword : secureTextEntry;

  return (
    <View className="space-y-2">
      {label ? <Text className="text-sm text-slate-600">{label}</Text> : null}
      <View className="relative">
        <TextInput
          className={`rounded-md border px-3 py-3 pr-12 text-base ${
            error ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isSecure}
          {...props}
        />
        {showPasswordToggle ? (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-0 h-full items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={showPassword ? 'Esconder senha' : 'Mostrar senha'}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#64748B"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </View>
  );
};
