import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConversationRow } from '../../components/introductions/ConversationRow';
import { IntroductionsHeader } from '../../components/introductions/IntroductionsHeader';
import { MomsLikeYouCarousel } from '../../components/introductions/MomsLikeYouCarousel';
import { PendingBanner } from '../../components/introductions/PendingBanner';
import { SavedConnectionCard } from '../../components/introductions/SavedConnectionCard';
import { SearchBar } from '../../components/shared/SearchBar';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { SortPills } from '../../components/shared/SortPills';
import { TabSwitcher } from '../../components/shared/TabSwitcher';
import {
  getActiveConversations,
  getLastMessage,
  getPendingProfiles,
  getPendingRequests,
  getSavedConnections
} from '../../services/introductions';
import { useAuth } from '../../context/auth/AuthContext';
import { useMomsLikeYouStore } from '../../store/momsLikeYouStore';
import { useIntroductionsStore } from '../../store/introductionsStore';
import type { Introduction, SavedConnection } from '../../types/introduction';

type SortOption = 'recent' | 'a-z';

export default function IntroductionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;
  const {
    activeConversations,
    savedConnections,
    pendingRequests,
    setActiveConversations,
    setSavedConnections,
    setPendingRequests,
    removeSavedConnection
  } = useIntroductionsStore();
  const momsLikeYouProfiles = useMomsLikeYouStore((s) => s.profiles);

  const [activeTab, setActiveTab] = useState('active');
  const [searchActive, setSearchActive] = useState('');
  const [searchSaved, setSearchSaved] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Load mock data on mount
  useEffect(() => {
    setActiveConversations(getActiveConversations());
    setSavedConnections(getSavedConnections());
    setPendingRequests(getPendingRequests());
  }, [setActiveConversations, setSavedConnections, setPendingRequests]);

  // Build profile lookup: moms from store (uid→userId) + pending profiles
  const pendingProfiles = getPendingProfiles();
  const momsAsProfiles = momsLikeYouProfiles.map((p) => ({
    userId: p.uid,
    firstName: p.firstName,
    lastInitial: p.lastInitial,
    photoURL: p.photoURL ?? '',
    bio: '',
    matchDescription: ''
  }));
  const allProfiles = [...momsAsProfiles, ...pendingProfiles];
  const profileMap = Object.fromEntries(allProfiles.map((p) => [p.userId, p]));

  // Pending avatars
  const pendingAvatars = pendingRequests
    .map((r) => profileMap[r.fromUserId]?.photoURL)
    .filter(Boolean) as string[];

  // Filter & sort active conversations
  const filteredActive = activeConversations
    .filter((intro) => {
      if (!searchActive) return true;
      const otherUserId = intro.fromUserId === 'me' ? intro.toUserId : intro.fromUserId;
      const profile = profileMap[otherUserId];
      return profile?.firstName.toLowerCase().includes(searchActive.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === 'a-z') {
        const nameA =
          profileMap[a.fromUserId === 'me' ? a.toUserId : a.fromUserId]?.firstName ?? '';
        const nameB =
          profileMap[b.fromUserId === 'me' ? b.toUserId : b.fromUserId]?.firstName ?? '';
        return nameA.localeCompare(nameB);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Filter saved connections
  const filteredSaved = savedConnections.filter((conn) => {
    if (!searchSaved) return true;
    return conn.firstName.toLowerCase().includes(searchSaved.toLowerCase());
  });

  const handleSayHi = useCallback(
    (userId: string) => {
      router.push(`/introduction/${userId}` as never);
    },
    [router]
  );

  const handleSave = useCallback(
    (userId: string) => {
      const profile = profileMap[userId];
      if (!profile) return;
      const { addSavedConnection } = useIntroductionsStore.getState();
      addSavedConnection({
        userId: profile.userId,
        firstName: profile.firstName,
        lastInitial: profile.lastInitial,
        photoURL: profile.photoURL,
        bio: profile.bio,
        mutualCommunities: 0,
        matchDescription: profile.matchDescription,
        savedAt: new Date()
      });
    },
    [profileMap]
  );

  const handleConversationPress = useCallback(
    (intro: Introduction) => {
      if (intro.roomId) {
        router.push(`/room/${intro.roomId}` as never);
      }
    },
    [router]
  );

  const handleUnsave = useCallback(
    (userId: string) => {
      removeSavedConnection(userId);
    },
    [removeSavedConnection]
  );

  const tabs = [
    { id: 'active', label: 'Active', count: activeConversations.length },
    { id: 'saved', label: 'Saved', count: savedConnections.length }
  ];

  const renderActiveItem = useCallback(
    ({ item }: { item: Introduction }) => {
      const otherUserId = item.fromUserId === 'me' ? item.toUserId : item.fromUserId;
      const profile = profileMap[otherUserId];
      const lastMsg = item.roomId ? getLastMessage(item.roomId) : undefined;
      if (!profile) return null;
      return (
        <ConversationRow
          name={`${profile.firstName} ${profile.lastInitial}.`}
          avatar={profile.photoURL}
          lastMessage={lastMsg?.text ?? item.matchDescription}
          timestamp={lastMsg?.timestamp ?? new Date(item.createdAt)}
          onPress={() => handleConversationPress(item)}
        />
      );
    },
    [profileMap, handleConversationPress]
  );

  const renderSavedItem = useCallback(
    ({ item }: { item: SavedConnection }) => (
      <SavedConnectionCard
        connection={item}
        onSayHi={() => handleSayHi(item.userId)}
        onUnsave={() => handleUnsave(item.userId)}
      />
    ),
    [handleSayHi, handleUnsave]
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <IntroductionsHeader />

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Banner */}
        {pendingRequests.length > 0 && (
          <PendingBanner
            count={pendingRequests.length}
            avatars={pendingAvatars}
            onPress={() => router.push('/introduction/pending' as never)}
          />
        )}

        {/* Moms Like You carousel - shows all 5 from store */}
        {momsLikeYouProfiles.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="MOMS LIKE YOU" />
            <View className="mt-2">
              <MomsLikeYouCarousel
                uid={uid}
                onSayHi={handleSayHi}
                onSave={handleSave}
              />
            </View>
          </View>
        )}

        {/* Tab Switcher */}
        <View className="mt-4">
          <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        {/* Tab content */}
        {activeTab === 'active' ? (
          <View className="mt-4">
            <SearchBar
              placeholder="SEARCH CONVERSATIONS"
              value={searchActive}
              onChangeText={setSearchActive}
            />
            <SortPills selected={sortOption} onSelect={setSortOption} />
            <View className="gap-0">
              {filteredActive.map((item) => {
                const element = renderActiveItem({ item });
                return element ? <View key={item.id}>{element}</View> : null;
              })}
            </View>
          </View>
        ) : (
          <View className="mt-4">
            <SearchBar
              placeholder="SEARCH SAVED"
              value={searchSaved}
              onChangeText={setSearchSaved}
            />
            <View className="mt-2 gap-4">
              {filteredSaved.map((item) => (
                <View key={item.userId}>{renderSavedItem({ item })}</View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
