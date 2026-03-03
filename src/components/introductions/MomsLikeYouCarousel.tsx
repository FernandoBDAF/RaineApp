import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Timestamp } from '@react-native-firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { useMomsLikeYou } from '../../hooks/useMomsLikeYou';
import { useConnectionsWithProfiles } from '../../hooks/useConnectionsWithProfiles';
import {
  cancelConnectionRequest,
  getConnectionsByConnectionUserUid,
  updateConnectionById
} from '../../services/firebase/connections';
import { getOrCreateRoomForConnection } from '../../services/firebase/rooms';
import type { ConncetionDetails } from '../../types/connection';
import type { MomsLikeYouPreview } from '../../services/home/home-functions';
import type { ConnectionStatus } from './MatchProfileCard';
import { MatchProfileCard } from './MatchProfileCard';

const ItemSeparator = () => <View className="w-4" />;

interface MomsLikeYouCarouselProps {
  uid: string | undefined;
  onSayHi: (userId: string) => void;
  onSave: (userId: string) => void;
  onNavigateToRoom?: (roomId: string) => void;
}

export const MomsLikeYouCarousel: React.FC<MomsLikeYouCarouselProps> = ({
  uid,
  onSayHi,
  onSave,
  onNavigateToRoom
}) => {
  const queryClient = useQueryClient();
  const [acceptingUid, setAcceptingUid] = useState<string | null>(null);
  const [decliningUid, setDecliningUid] = useState<string | null>(null);
  const { profiles, isLoading, error } = useMomsLikeYou(uid);
  const { connection, connectionDocId, profileMapByUid, refetch } = useConnectionsWithProfiles(uid);

  const connectionStatusByUid = useMemo((): Record<string, ConnectionStatus> => {
    const map: Record<string, ConnectionStatus> = {};
    connection?.connectionDetailsList?.forEach((d) => {
      const otherUid = d.userConnectedUid;
      if (d.connectionAcceptedAt != null) {
        map[otherUid] = 'connected';
      } else if (d.whoConnected === 'me' && d.connectionRejectedAt == null) {
        map[otherUid] = 'pending';
      } else if (
        d.whoConnected === 'them' &&
        d.connectionAcceptedAt == null &&
        d.connectionRejectedAt == null
      ) {
        map[otherUid] = 'pending_incoming';
      } else if (!(otherUid in map)) {
        map[otherUid] = 'none';
      }
    });
    return map;
  }, [connection?.connectionDetailsList]);

  const allProfiles = useMemo((): MomsLikeYouPreview[] => {
    const seen = new Set<string>();
    const result: MomsLikeYouPreview[] = [];
    const add = (p: MomsLikeYouPreview) => {
      if (p.uid === uid || seen.has(p.uid)) return;
      seen.add(p.uid);
      result.push(p);
    };
    profiles.forEach(add);
    connection?.connectionDetailsList?.forEach((d) => {
      const p = profileMapByUid[d.userConnectedUid];
      if (p?.profileSetupCompletedAt) {
        add({
          uid: p.uid,
          firstName: p.firstName,
          lastInitial: p.lastInitial,
          photoURL: p.photoURL
        });
      }
    });
    return result;
  }, [profiles, connection?.connectionDetailsList, profileMapByUid, uid]);

  const handleCancelPending = useCallback(
    (theirUid: string) => {
      if (!uid) return;
      Alert.alert('Cancel connection request', 'Do you want to cancel this connection request?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            (async () => {
              await cancelConnectionRequest(uid, theirUid);
              queryClient.invalidateQueries({ queryKey: ['connections', uid] });
              queryClient.invalidateQueries({ queryKey: ['connections', theirUid] });
              refetch();
            })();
          }
        }
      ]);
    },
    [uid, queryClient, refetch]
  );

  const handleSendMessage = useCallback(
    async (theirUid: string) => {
      if (!uid || !onNavigateToRoom) return;
      const roomId = await getOrCreateRoomForConnection(uid, theirUid);
      onNavigateToRoom(roomId);
    },
    [uid, onNavigateToRoom]
  );

  const handleAccept = useCallback(
    async (theirUid: string) => {
      if (!connection || !connectionDocId || !uid) return;
      setAcceptingUid(theirUid);
      try {
        const acceptedAt = Timestamp.now();
        const updatedList: ConncetionDetails[] = (connection.connectionDetailsList ?? []).map(
          (d) => (d.userConnectedUid === theirUid ? { ...d, connectionAcceptedAt: acceptedAt } : d)
        );
        await updateConnectionById(connectionDocId, {
          ...connection,
          connectionDetailsList: updatedList
        });
        const theirData = await getConnectionsByConnectionUserUid(theirUid);
        if (theirData) {
          const theirUpdatedList: ConncetionDetails[] = (
            theirData.connection.connectionDetailsList ?? []
          ).map((d) =>
            d.userConnectedUid === uid ? { ...d, connectionAcceptedAt: acceptedAt } : d
          );
          await updateConnectionById(theirData.id, {
            ...theirData.connection,
            connectionDetailsList: theirUpdatedList
          });
        }
        queryClient.invalidateQueries({ queryKey: ['connections', uid] });
        queryClient.invalidateQueries({ queryKey: ['connections', theirUid] });
        refetch();
      } finally {
        setAcceptingUid(null);
      }
    },
    [connection, connectionDocId, uid, queryClient, refetch]
  );

  const handleDecline = useCallback(
    async (theirUid: string) => {
      if (!connection || !connectionDocId) return;
      setDecliningUid(theirUid);
      try {
        const updatedList: ConncetionDetails[] = (connection.connectionDetailsList ?? []).map(
          (d) =>
            d.userConnectedUid === theirUid ? { ...d, connectionRejectedAt: Timestamp.now() } : d
        );
        await updateConnectionById(connectionDocId, {
          ...connection,
          connectionDetailsList: updatedList
        });
        queryClient.invalidateQueries({ queryKey: ['connections', uid] });
        queryClient.invalidateQueries({ queryKey: ['connections', theirUid] });
        refetch();
      } finally {
        setDecliningUid(null);
      }
    },
    [connection, connectionDocId, uid, queryClient, refetch]
  );

  if (isLoading) {
    return (
      <View className="mt-5">
        <ActivityIndicator size="large" className="text-orange-500" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-5 items-center justify-center">
        <Text className="text-lg text-red-600">Error: {error?.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allProfiles}
      keyExtractor={(item) => item.uid}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => {
        const status = connectionStatusByUid[item.uid] ?? 'none';
        return (
          <MatchProfileCard
            profile={item}
            connectionStatus={status}
            onSayHi={() => onSayHi(item.uid)}
            onSave={() => onSave(item.uid)}
            onPending={status === 'pending' ? () => handleCancelPending(item.uid) : undefined}
            onSendMessage={status === 'connected' ? () => handleSendMessage(item.uid) : undefined}
            onAccept={status === 'pending_incoming' ? () => handleAccept(item.uid) : undefined}
            onDecline={status === 'pending_incoming' ? () => handleDecline(item.uid) : undefined}
            isAccepting={acceptingUid === item.uid}
            isDeclining={decliningUid === item.uid}
          />
        );
      }}
    />
  );
};
