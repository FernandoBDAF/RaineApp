import React from "react";
import { Modal, Text, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface OutOfAreaModalProps {
  visible: boolean;
  city?: string;
  email: string;
  error?: string;
  loading?: boolean;
  onEmailChange: (email: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const OutOfAreaModal: React.FC<OutOfAreaModalProps> = ({
  visible,
  city,
  email,
  error,
  loading = false,
  onEmailChange,
  onClose,
  onSubmit
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-xl bg-white p-6">
          <Text className="text-lg font-semibold text-slate-900">
            Raine is currently only available in the San Francisco Bay Area
          </Text>
          <Text className="mt-2 text-sm text-slate-600">
            We're excited to expand soon and would love to let you know when we launch in your
            area.
          </Text>

          <View className="mt-4">
            <Input
              value={email}
              placeholder="name@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
              onChangeText={onEmailChange}
            />
          </View>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Button title="Cancel" variant="outline" onPress={onClose} />
            </View>
            <View className="flex-1">
              <Button
                title={loading ? "Submitting..." : "Notify Me"}
                onPress={onSubmit}
                disabled={loading}
              />
            </View>
          </View>

          {city ? (
            <Text className="mt-4 text-xs text-slate-500">
              Thanks! We'll email you when Raine launches in {city}.
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
