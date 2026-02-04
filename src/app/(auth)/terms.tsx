import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold text-slate-900">Terms & Privacy</Text>
      <View className="mt-4 space-y-4">
        <Text className="text-slate-600">
          These are placeholder terms and privacy policy sections. Replace with the finalized
          legal content before launch.
        </Text>
        <Text className="text-slate-600">
          By using Raine, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}
