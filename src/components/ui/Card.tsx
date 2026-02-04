import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card: React.FC<ViewProps> = ({ children, className, ...props }) => {
  return (
    <View className={`rounded-lg bg-white p-4 shadow-sm ${className ?? ''}`} {...props}>
      {children}
    </View>
  );
};
