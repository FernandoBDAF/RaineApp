import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native';

interface OtpInputProps {
  /** Current value (string of digits/characters) */
  value: string;
  /** Called with the updated value string */
  onChange: (value: string) => void;
  /** Called when all cells are filled */
  onComplete?: (value: string) => void;
  /** Number of cells to render */
  length: number;
  /** Keyboard type — defaults to "number-pad" */
  keyboardType?: 'number-pad' | 'default';
  /** Auto-focus the first cell on mount */
  autoFocus?: boolean;
  /** Visual variant — "light" (default) for white bg, "dark" for colored bg */
  variant?: 'light' | 'dark';
  isUpperCase?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onComplete,
  length,
  keyboardType = 'number-pad',
  autoFocus = false,
  variant = 'light',
  isUpperCase = false
}) => {
  const inputRef = useRef<TextInput>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value.length === length && prevValueRef.current.length !== length) {
      onComplete?.(value);
    }
    prevValueRef.current = value;
  }, [value, length, onComplete]);

  const handleChange = (text: string) => {
    const formatted = isUpperCase ? text.toUpperCase() : text;
    const sanitized =
      keyboardType === 'number-pad' ? formatted.replace(/\D/g, '') : formatted.replace(/\s/g, '');

    const clamped = sanitized.slice(0, length);
    onChange(clamped);
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const chars = value.padEnd(length, ' ').split('').slice(0, length);
  const focusedIndex = Math.min(value.length, length - 1);

  const isDark = variant === 'dark';

  return (
    <View>
      {/* Hidden input that handles all keyboard interaction */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType={keyboardType}
        maxLength={length}
        autoFocus={autoFocus}
        autoCapitalize="characters"
        caretHidden
        style={styles.hiddenInput}
      />

      {/* Visual cells */}
      <Pressable onPress={handlePress} className="flex-row justify-center gap-3">
        {chars.map((char, index) => {
          const isFocused = index === focusedIndex;
          const isFilled = Boolean(char.trim());

          const cellClass = isDark
            ? `h-14 w-10 items-center justify-center border-b-2 ${
                isFilled ? 'border-white' : isFocused ? 'border-white/80' : 'border-white/40'
              }`
            : `h-14 w-14 items-center justify-center rounded-xl border-2 ${
                isFilled
                  ? 'border-orange-500 bg-orange-50'
                  : isFocused
                    ? 'border-orange-300 bg-white'
                    : 'border-slate-200 bg-white'
              }`;

          const textClass = isDark
            ? 'text-xl font-bold text-white'
            : 'text-xl font-semibold text-slate-900';

          return (
            <View key={`otp-cell-${index}`} className={cellClass}>
              <Text className={textClass}>{char.trim()}</Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0
  }
});
