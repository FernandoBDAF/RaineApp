import React from 'react';
import { Text, View } from 'react-native';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <View className={`mb-2 flex ${isOwn ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwn ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <Text className={`${isOwn ? 'text-white' : 'text-slate-800'}`}>{message.text}</Text>
      </View>
      {message.reactions ? (
        <View className="mt-1 flex-row flex-wrap gap-2">
          {Object.entries(message.reactions).map(([emoji, users]) => (
            <Text key={emoji} className="text-xs text-slate-500">
              {emoji} {users.length}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};
