import React from 'react';
import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-blue-600',
  secondary: 'bg-emerald-600',
  outline: 'border border-slate-300'
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-md px-4 py-3 ${variantClass[variant]} ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <Text className={`text-center font-semibold ${variant === 'outline' ? 'text-slate-700' : 'text-white'}`}>
        {title}
      </Text>
    </Pressable>
  );
};
