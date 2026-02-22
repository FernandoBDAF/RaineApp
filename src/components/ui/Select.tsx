import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  value,
  options,
  placeholder = "Select...",
  onChange
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? placeholder;

  const handleSelect = (opt: SelectOption) => {
    onChange(opt.value);
    setVisible(false);
  };

  return (
    <View>
      <Pressable
        onPress={() => setVisible(true)}
        className="rounded-md border border-slate-300 bg-white px-3 py-3 active:bg-slate-50"
      >
        <Text
          className={`text-base ${value ? "text-slate-800" : "text-slate-400"}`}
        >
          {selectedLabel}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="max-h-[70%] rounded-t-2xl bg-white"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="border-b border-slate-200 px-4 py-3">
              <Text className="text-center text-sm font-semibold text-slate-600">
                Select an option
              </Text>
            </View>
            <ScrollView className="max-h-64">
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => handleSelect(opt)}
                  className={`border-b border-slate-100 px-4 py-4 active:bg-slate-50 ${
                    opt.value === value ? "bg-orange-50" : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      opt.value === value
                        ? "font-semibold text-orange-600"
                        : "text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
