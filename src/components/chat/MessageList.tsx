import React from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import type { Message } from '../../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onLoadMore?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onLoadMore
}) => {
  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <MessageBubble message={item} isOwn={item.senderId === currentUserId} />
  );

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      inverted
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={<View className="h-6" />}
    />
  );
};
