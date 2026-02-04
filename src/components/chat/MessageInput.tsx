import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-center border-t border-slate-200 px-3 py-2">
      <TextInput
        className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-base"
        placeholder="Type a message"
        value={text}
        onChangeText={setText}
      />
      <Pressable onPress={handleSend} className="ml-2 rounded-full bg-blue-600 px-4 py-2">
        <Text className="font-semibold text-white">Send</Text>
      </Pressable>
    </View>
  );
};
