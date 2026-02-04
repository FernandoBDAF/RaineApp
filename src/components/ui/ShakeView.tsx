import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface ShakeViewProps {
  trigger: boolean;
  onShakeComplete?: () => void;
  children: React.ReactNode;
}

export const ShakeView: React.FC<ShakeViewProps> = ({ trigger, onShakeComplete, children }) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      const timer = setTimeout(() => {
        onShakeComplete?.();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [trigger, onShakeComplete, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
