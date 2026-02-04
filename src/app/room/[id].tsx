import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { Message } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';
import { isFirebaseMockMode } from '../../config/environment';
import { listenToMessages, fetchMoreMessages, sendMessage, updateReactions } from '../../services/firebase/messages';
import { MessageList } from '../../components/chat/MessageList';
import { MessageInput } from '../../components/chat/MessageInput';
import { ReactionPicker } from '../../components/chat/ReactionPicker';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useEntitlement } from '../../hooks/useEntitlement';

// Helper to get server timestamp
const getServerTimestamp = () => {
  if (isFirebaseMockMode()) {
    return new Date();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const firestore = require('@react-native-firebase/firestore').default;
  return firestore.FieldValue.serverTimestamp();
};

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = Array.isArray(id) ? id[0] : id;
  const { user } = useAuth();
  const { isEnabled: reactionsEnabled } = useFeatureFlag('chatReactionsEnabled');
  const { isEnabled: subscriptionGatingEnabled } = useFeatureFlag('subscriptionGatingEnabled');
  const { hasAccess } = useEntitlement('premium');

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<Message['timestamp'] | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }
    const unsubscribe = listenToMessages(roomId, 50, (nextMessages) => {
      setMessages(nextMessages);
      const last = nextMessages[nextMessages.length - 1];
      setCursor(last?.timestamp ?? null);
    });
    return unsubscribe;
  }, [roomId]);

  const handleSend = async (text: string) => {
    if (!roomId || !user) {
      return;
    }
    const payload: Omit<Message, 'id'> = {
      roomId,
      senderId: user.uid,
      text,
      timestamp: getServerTimestamp() as Message['timestamp'],
      reactions: {}
    };
    await sendMessage(roomId, payload);
  };

  const handleLoadMore = async () => {
    if (!roomId || isLoadingMore || !cursor) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const { messages: moreMessages, nextCursor } = await fetchMoreMessages(roomId, cursor, 50);
      if (moreMessages.length) {
        setMessages((prev) => [...prev, ...moreMessages]);
        setCursor(nextCursor);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === activeMessageId),
    [messages, activeMessageId]
  );

  const handleSelectReaction = async (emoji: string) => {
    if (!selectedMessage || !user || !roomId) {
      return;
    }
    const reactions = { ...(selectedMessage.reactions ?? {}) };
    const existing = new Set(reactions[emoji] ?? []);
    if (existing.has(user.uid)) {
      existing.delete(user.uid);
    } else {
      existing.add(user.uid);
    }
    reactions[emoji] = Array.from(existing);
    await updateReactions(roomId, selectedMessage.id, reactions);
    setActiveMessageId(null);
  };

  if (!roomId || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Loading room...</Text>
      </View>
    );
  }

  const canReact = reactionsEnabled && (!subscriptionGatingEnabled || hasAccess);

  return (
    <View className="flex-1 bg-white">
      <MessageList
        messages={messages}
        currentUserId={user.uid}
        onLoadMore={handleLoadMore}
      />
      {canReact && selectedMessage ? (
        <View className="absolute bottom-24 left-4 right-4 items-center">
          <ReactionPicker onSelect={handleSelectReaction} />
        </View>
      ) : null}
      <View className="px-4 pb-2">
        {canReact ? (
          <Pressable
            onPress={() => {
              if (messages.length) {
                setActiveMessageId(messages[0].id);
              }
            }}
            className="mb-2 self-start"
          >
            <Text className="text-sm text-blue-600">Add reaction</Text>
          </Pressable>
        ) : null}
        <MessageInput onSend={handleSend} />
      </View>
    </View>
  );
}
