import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useMomsLikeYou } from '../../hooks/useMomsLikeYou';
import { useConnectionsWithProfiles } from '../../hooks/useConnectionsWithProfiles';
import { MatchProfileCard } from './MatchProfileCard';

interface MomsLikeYouCarouselProps {
  uid: string | undefined;
  onSayHi: (userId: string) => void;
  onSave: (userId: string) => void;
}

export const MomsLikeYouCarousel: React.FC<MomsLikeYouCarouselProps> = ({
  uid,
  onSayHi,
  onSave
}) => {
  const { profiles, isLoading, error } = useMomsLikeYou(uid);
  const { connection } = useConnectionsWithProfiles(uid);

  const requestedByMeUids = useMemo(() => {
    return new Set(
      connection?.connectionDetailsList
        ?.filter((d) => d.whoConnected === 'me')
        .map((d) => d.userConnectedUid) ?? []
    );
  }, [connection?.connectionDetailsList]);

  const requestedByThemNotRejectedUids = useMemo(() => {
    return new Set(
      connection?.connectionDetailsList
        ?.filter(
          (d) =>
            d.whoConnected === 'them' &&
            d.connectionRejectedAt == null
        )
        .map((d) => d.userConnectedUid) ?? []
    );
  }, [connection?.connectionDetailsList]);

  const excludedFromSuggestions = useMemo(() => {
    const set = new Set<string>();
    if (uid) set.add(uid);
    requestedByMeUids.forEach((id) => set.add(id));
    requestedByThemNotRejectedUids.forEach((id) => set.add(id));
    return set;
  }, [uid, requestedByMeUids, requestedByThemNotRejectedUids]);

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

  const otherProfiles = profiles.filter((p) => !excludedFromSuggestions.has(p.uid));

  return (
    <FlatList
      data={otherProfiles}
      keyExtractor={(item) => item.uid}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      ItemSeparatorComponent={() => <View className="w-4" />}
      renderItem={({ item }) => (
        <MatchProfileCard
          profile={item}
          onSayHi={() => onSayHi(item.uid)}
          onSave={() => onSave(item.uid)}
        />
      )}
    />
  );
};
