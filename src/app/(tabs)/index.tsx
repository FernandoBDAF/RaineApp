import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { listenToUserRooms } from '../../services/firebase/rooms';
import type { Room } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppStore } from '../../store/appStore';

export default function RoomsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const setActiveRoomId = useAppStore((state) => state.setActiveRoomId);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = listenToUserRooms(user.uid, (nextRooms) => {
      setRooms(nextRooms);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const handleOpenRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    router.push(`/room/${roomId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!rooms.length) {
    return <EmptyState title="No rooms yet" description="Start a conversation to see it here." />;
  }

  return (
    <FlatList
      data={rooms}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleOpenRoom(item.id)}
          className="mb-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <Text className="text-lg font-semibold text-slate-800">{item.name}</Text>
          <Text className="mt-1 text-slate-500">
            {item.lastMessage?.text ?? 'No messages yet'}
          </Text>
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
    />
  );
}
