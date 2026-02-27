import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { ActivityDashboard } from '../../components/home/ActivityDashboard';
import { HomeHeader } from '../../components/home/HomeHeader';
import MomsLikeYouPlaceholder from '../../components/home/MomsLikeYouPlaceholder';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { useAuth } from '../../context/auth/AuthContext';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useActivityStore } from '../../store/activityStore';
import { useMomsLikeYouStore } from '../../store/momsLikeYouStore';
import { useProfileSetupStore } from '../../store/profileSetupStore';

// ---------------------------------------------------------------------------
// Placeholder components for features being built in parallel
// ---------------------------------------------------------------------------

interface MockCommunity {
  id: string;
  name: string;
  photo: string;
  members: number;
}

const MOCK_COMMUNITIES: MockCommunity[] = [
  { id: '1', name: 'First-Time Moms', photo: 'https://i.pravatar.cc/120?img=20', members: 128 },
  { id: '2', name: 'Working Moms Club', photo: 'https://i.pravatar.cc/120?img=30', members: 89 },
  { id: '3', name: 'Outdoorsy Families', photo: 'https://i.pravatar.cc/120?img=40', members: 54 }
];

function CommunityPreviewPlaceholder() {
  return (
    <View className="gap-3 px-6">
      {MOCK_COMMUNITIES.map((community) => (
        <Pressable
          key={community.id}
          className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm active:bg-slate-50"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2
          }}
        >
          <Image
            source={{ uri: community.photo }}
            className="mr-4 h-14 w-14 rounded-xl bg-slate-100"
          />
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-800">{community.name}</Text>
            <Text className="mt-0.5 text-xs text-slate-400">{community.members} members</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function DropPreviewPlaceholder() {
  return (
    <Pressable className="mx-6 rounded-2xl bg-orange-500 p-6 active:bg-orange-600">
      <Text className="text-xs font-bold uppercase tracking-widest text-white/70">This Week</Text>
      <Text className="mt-2 text-xl font-bold text-white">Bringing Baby Home</Text>
      <Text className="mt-1 text-sm text-white/80">
        Tips, tricks, and real talk from moms who've been there.
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Home Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const router = useRouter();
  const photoURL = useProfileSetupStore((state) => state.photoURL);
  const { user } = useAuth();
  const uid = user?.uid;
  const { isEnabled: isMomsLikeYouEnabled } = useFeatureFlag('momsLikeYouEnabled');
  const setCounts = useActivityStore((state) => state.setCounts);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    setCounts({
      introRequests: 2,
      unreadMessages: 4,
      savedTips: 0,
      questionResponses: 2
    });
  }, [setCounts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fetchRandomUsers = useMomsLikeYouStore((s) => s.fetchRandomUsers);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadData();
    if (uid) await fetchRandomUsers(uid);
    setRefreshing(false);
  }, [loadData, uid, fetchRandomUsers]);

  return (
    <View className="flex-1 bg-white">
      <HomeHeader
        userPhotoURL={photoURL ?? undefined}
        onProfilePress={() => router.push('/profile')}
      />
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        <ActivityDashboard />

        <SectionHeader title="MOMS LIKE YOU" />
        {isMomsLikeYouEnabled && <MomsLikeYouPlaceholder uid={uid ?? ''} />}

        <SectionHeader title="COMMUNITIES" />
        <CommunityPreviewPlaceholder />

        <SectionHeader
          title="FRESH DROP"
          actionText="SEE ALL"
          onActionPress={() => router.push('/(tabs)/drops')}
        />
        <DropPreviewPlaceholder />

        {/* Bottom spacer for tab bar */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
