import React, { useEffect, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

interface ToastProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onDismiss: () => void;
  duration?: number;
  onPress?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  title,
  subtitle,
  onDismiss,
  duration = 3000,
  onPress,
}) => {
  const [translateY] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-100);
    }
  }, [visible, duration, onDismiss, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <Pressable
        onPress={onPress ?? onDismiss}
        className="rounded-lg border border-orange-300 bg-white px-4 py-3 shadow-md"
      >
        <Text className="text-sm font-semibold text-slate-900">{title}</Text>
        {subtitle && (
          <Text className="mt-0.5 text-xs text-slate-500">{subtitle}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};
