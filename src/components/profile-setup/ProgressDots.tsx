import React from "react";
import { View } from "react-native";
import { TOTAL_STEPS } from "../../constants/profile-options";

interface ProgressDotsProps {
  currentStep: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ currentStep }) => {
  return (
    <View className="flex-row justify-center gap-1 py-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full ${
            index < currentStep ? "bg-orange-500" : "bg-slate-200"
          }`}
        />
      ))}
    </View>
  );
};
