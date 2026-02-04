import React, { useMemo, useRef } from "react";
import { TextInput, View } from "react-native";

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({ value, onChange }) => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const digits = useMemo(() => {
    const padded = value.padEnd(5, " ");
    return padded.split("").slice(0, 5);
  }, [value]);

  const handleChange = (index: number, text: string) => {
    const sanitized = text.replace(/\D/g, "");
    const nextDigits = [...digits];
    nextDigits[index] = sanitized ? sanitized[0] : " ";
    const nextValue = nextDigits.join("").replace(/\s/g, "");
    onChange(nextValue);

    if (sanitized && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between gap-2">
      {digits.map((digit, index) => (
        <TextInput
          key={`zip-${index}`}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          value={digit.trim()}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          className="h-14 w-14 rounded-lg border border-slate-300 text-center text-lg text-slate-900"
        />
      ))}
    </View>
  );
};
