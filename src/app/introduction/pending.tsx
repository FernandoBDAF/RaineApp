import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Timestamp } from '@react-native-firebase/firestore';
import { getAvatarSource } from '../../constants/avatars';
import { useAuth } from '../../context/auth/AuthContext';
import { useConnectionsWithProfiles } from '../../hooks/useConnectionsWithProfiles';
import { updateConnectionById } from '../../services/firebase/connections';
import type { ConncetionDetails } from '../../types/connection';
import type { UserProfile } from '../../types/user';

export interface PendingItem {
  detail: ConncetionDetails;
  profile: UserProfile;
}

export default function PendingIntroductionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;
  const { connection, connectionDocId, profileMapByUid, isLoading, isProfilesLoading, refetch } =
    useConnectionsWithProfiles(uid);

  const [acceptingUid, setAcceptingUid] = useState<string | null>(null);
  const [decliningUid, setDecliningUid] = useState<string | null>(null);

  const pendingItems = useMemo((): PendingItem[] => {
    const list =
      connection?.connectionDetailsList?.filter(
        (d) =>
          d.whoConnected === 'them' &&
          d.connectionAcceptedAt == null &&
          d.connectionRejectedAt == null
      ) ?? [];
    return list
      .map((detail) => ({
        detail,
        profile: profileMapByUid[detail.userConnectedUid]
      }))
      .filter((item): item is PendingItem => item.profile != null);
  }, [connection?.connectionDetailsList, profileMapByUid]);

  const handleAccept = useCallback(
    async (item: PendingItem) => {
      if (!connection || !connectionDocId) return;
      const targetUid = item.detail.userConnectedUid;
      setAcceptingUid(targetUid);
      try {
        const updatedList: ConncetionDetails[] = (connection.connectionDetailsList ?? []).map(
          (d) =>
            d.userConnectedUid === targetUid
              ? { ...d, connectionAcceptedAt: Timestamp.now() }
              : d
        );
        await updateConnectionById(connectionDocId, {
          ...connection,
          connectionDetailsList: updatedList
        });
        await refetch();
      } finally {
        setAcceptingUid(null);
      }
    },
    [connection, connectionDocId, refetch]
  );

  const handleDecline = useCallback(
    async (item: PendingItem) => {
      if (!connection || !connectionDocId) return;
      const targetUid = item.detail.userConnectedUid;
      setDecliningUid(targetUid);
      try {
        const updatedList: ConncetionDetails[] = (connection.connectionDetailsList ?? []).map(
          (d) =>
            d.userConnectedUid === targetUid
              ? { ...d, connectionRejectedAt: Timestamp.now() }
              : d
        );
        await updateConnectionById(connectionDocId, {
          ...connection,
          connectionDetailsList: updatedList
        });
        await refetch();
      } finally {
        setDecliningUid(null);
      }
    },
    [connection, connectionDocId, refetch]
  );

  const renderItem = useCallback(
    ({ item }: { item: PendingItem }) => {
      const { profile } = item;
      const displayName = [profile.firstName, profile.lastInitial].filter(Boolean).join(' ');
      const subtitle = profile.generatedBio || profile.displayName || '';
      const isAccepting = acceptingUid === item.detail.userConnectedUid;
      const isDeclining = decliningUid === item.detail.userConnectedUid;
      const isThisLoading = isAccepting || isDeclining;

      return (
        <View className="mx-6 mb-4 flex-row rounded-xl border border-slate-100 bg-white p-4">
          <Image
            source={getAvatarSource(profile.photoURL || undefined)}
            className="h-14 w-14 rounded-full bg-slate-100"
            resizeMode="cover"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-slate-800">
              {displayName || 'Mãe'}
              {profile.lastInitial ? '.' : ''}
            </Text>
            {subtitle ? (
              <Text className="mt-1 text-xs text-slate-400" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}

            <View className="mt-3 flex-row gap-2">
              <Pressable
                disabled={isThisLoading}
                onPress={() => handleAccept(item)}
                className="min-w-[80] rounded-full bg-orange-500 px-4 py-1.5"
              >
                {isAccepting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-[10px] font-bold tracking-wider text-white">ACEITAR</Text>
                )}
              </Pressable>
              <Pressable
                disabled={isThisLoading}
                onPress={() => handleDecline(item)}
                className="min-w-[80] rounded-full border border-slate-300 px-4 py-1.5"
              >
                {isDeclining ? (
                  <ActivityIndicator size="small" color="#94a3b8" />
                ) : (
                  <Text className="text-[10px] font-bold tracking-wider text-slate-400">
                    RECUSAR
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [handleAccept, handleDecline, acceptingUid, decliningUid]
  );

  const loading = isLoading || (pendingItems.length === 0 && isProfilesLoading);

  return (
    <View className="flex-1 bg-white pt-16">
      <View className="flex-row items-center px-6 pb-4">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-lg text-slate-700">←</Text>
        </Pressable>
        <Text className="text-xl font-bold text-slate-900" style={{ fontFamily: 'serif' }}>
          Pedidos de conexão
        </Text>
      </View>

      <View className="mx-6 h-px bg-orange-500" />

      {loading && pendingItems.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" className="text-orange-500" />
        </View>
      ) : (
        <FlatList
          data={pendingItems}
          keyExtractor={(item) => item.detail.userConnectedUid}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-slate-400">Nenhum pedido de conexão pendente</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
