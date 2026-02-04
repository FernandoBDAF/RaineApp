import React from 'react';
import { Pressable, Text } from 'react-native';
import type { SocialProvider } from '../../types';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  disabled?: boolean;
}

const providerStyles: Record<SocialProvider, { label: string; className: string; style?: any }> =
  {
    instagram: {
      label: 'Continue with Instagram',
      className: 'bg-pink-600'
    },
    facebook: {
      label: 'Continue with Facebook',
      className: 'bg-[#1877F2]'
    },
    linkedin: {
      label: 'Continue with LinkedIn',
      className: 'bg-[#0A66C2]'
    }
  };

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress, disabled }) => {
  const config = providerStyles[provider];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg px-4 py-4 ${config.className} ${disabled ? 'opacity-50' : 'opacity-100'}`}
    >
      <Text className="text-center text-base font-semibold text-white">{config.label}</Text>
    </Pressable>
  );
};
