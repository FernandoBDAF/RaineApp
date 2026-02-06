# RaineApp - Master Implementation Plan
## From Current State to Complete Vision

**Date:** February 3, 2026  
**Current Progress:** 85% of Phase 1 (Foundation)  
**Vision Target:** Full social platform with 4 pillars  
**Estimated Timeline:** 8-10 weeks

**Related Documents:**
- [Communities PRD](./3-COMMUNITIES-PRD.md) - Group discussion feature spec
- [Introductions PRD](./3-INTRODUCTIONS-PRD.md) - 1:1 social discovery spec
- [Drops PRD](./3-DROPS-PRD.md) - Product recommendations spec
- [Integration Analysis](../systemic_view/integration-from-frontend-perspective.md) - Gap analysis
- [Infrastructure Contract](../systemic_view/4-infra-and-data.md) - Data models

---

## Table of Contents

1. [Vision Overview](#1-vision-overview)
2. [Current State vs Target](#2-current-state-vs-target)
3. [Architecture Strategy](#3-architecture-strategy)
4. [Phase 0: Critical Backend Integration](#phase-0-critical-backend-integration-week-0-1)
5. [Phase 1: Foundation & Navigation](#phase-1-foundation--navigation-week-1-2)
6. [Phase 2: Home Dashboard](#phase-2-home-dashboard-week-2-3)
7. [Phase 3: Drops Feature](#phase-3-drops-feature-week-3-4)
8. [Phase 4: Introductions Feature](#phase-4-introductions-feature-week-4-6)
9. [Phase 5: Communities Feature](#phase-5-communities-feature-week-6-9)
10. [Phase 6: Profile Redesign](#phase-6-profile-redesign-week-9-10)
11. [Phase 7: Polish & Launch](#phase-7-polish--launch-week-10)
12. [Implementation Dependencies](#implementation-dependencies)
13. [Risk Management](#risk-management)

---

## 1. Vision Overview

### 1.1 The Four Pillars

```
┌──────────────────────────────────────────────────────────┐
│                    RAINE PLATFORM                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│   │  HOME   │  │ INTROS  │  │  COMM   │  │  DROPS  │   │
│   │ Engage  │  │ Connect │  │ Belong  │  │Discover │   │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                           │
│   Activity      1:1           Group         Product      │
│   Dashboard     Discovery     Discussion   Curation      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

| Pillar | Feature | Purpose | Screens |
|--------|---------|---------|---------|
| **Engage** | Home Dashboard | Central activity hub, recommendations | 1 |
| **Connect** | Introductions | Social discovery, 1:1 connections | 4 |
| **Belong** | Communities | Group discussions, shared experiences | 5 |
| **Discover** | Drops | Curated product recommendations | 3 |

### 1.2 User Journey

```
Day 1: Onboarding
  → Splash (4s) → Referral Code → Social Login → Profile Setup (14 screens)
    → Home Dashboard

Day 2-30: Discovery & Engagement
  Home → Browse "Moms Like You" → SAY HI → 1:1 Chat
  Home → Join Communities → Read/Reply to posts
  Home → Explore Drops → Heart products → Shop

Ongoing: Connection & Growth
  Introductions → Manage active conversations
  Communities → Ask questions, share experiences
  Drops → Save recommendations, discover products
  Profile → Edit, update, manage subscription
```

---

## 2. Current State vs Target

### 2.1 What's Built (Current)

| Component | Status | Notes |
|-----------|--------|-------|
| Onboarding (Splash + Referral) | ✅ 100% | Working |
| Authentication (Social) | ✅ 100% | Mock mode + ready for real |
| Profile Setup (14 screens) | ✅ 95% | Minor validation improvements needed |
| Main App (3 tabs) | ⚠️ 40% | Has Rooms, Profile, Settings but wrong structure |
| Chat (1:1) | ✅ 80% | UI complete, real-time pending |
| Subscriptions | ⚠️ 40% | RevenueCat integrated, needs config |
| Settings | ✅ 100% | With reset button |

### 2.2 What's Needed (Target)

| Component | Status | Priority | Effort |
|-----------|--------|----------|--------|
| **Home Dashboard** | ❌ 0% | P0 | 2-3 days |
| **Introductions Tab** | ❌ 0% | P0 | 3-4 days |
| **Communities Tab** | ❌ 0% | P0 | 4-5 days |
| **Drops Tab** | ❌ 0% | P0 | 2-3 days |
| **4-Tab Navigation** | ❌ 0% | P0 | 1 day |
| **Profile Redesign** | ❌ 0% | P1 | 1-2 days |
| Backend Integration | ⚠️ 45% | P0 | 2-3 days |

**Total New Work:** ~15-20 days frontend + 5-7 days backend

### 2.3 Gap Summary

```
Current App Structure          Target App Structure
┌─────────────────┐           ┌─────────────────────────┐
│ 3 Tabs:         │           │ 4 Tabs:                 │
│ - Rooms (chat)  │  ──────>  │ - Home (dashboard)  ✨  │
│ - Profile       │           │ - Introductions     ✨  │
│ - Settings      │           │ - Communities       ✨  │
└─────────────────┘           │ - Drops             ✨  │
                              │                         │
                              │ Plus:                   │
                              │ - Profile (redesigned)  │
                              │ - Settings (moved)      │
                              └─────────────────────────┘

✨ = New feature
```

---

## 3. Architecture Strategy

### 3.1 Implementation Philosophy

**Principle 1: Mock-First Development**  
Build all UI with mock data first, then connect to real backend. This allows parallel development and early testing.

**Principle 2: Feature Isolation**  
Each pillar (Introductions, Communities, Drops) is self-contained with its own:
- Screen group
- Component folder
- Service module
- Zustand store
- Type definitions

**Principle 3: Reuse Over Rebuild**  
Maximize reuse of existing components:
- Chat UI → reuse for 1:1 intro chats and community discussions
- Profile setup components → reuse in profile editing
- Firebase services → extend, don't replace

**Principle 4: Backend Dependency Management**  
Clear separation between:
- **Phase 0 (Backend Critical):** Must fix backend gaps before frontend can integrate
- **Phase 1-6 (Mock Mode):** Can build with mock data
- **Phase 7 (Integration):** Connect to real backend

---

## Phase 0: Critical Backend Integration (Week 0-1)

**Owner:** Backend Team + Frontend Team (coordination)  
**Duration:** 3-5 days  
**Blocking:** All future work depends on this

### 0.1 Backend Schema Alignment (P0 - CRITICAL)

**Issue:** Backend User type missing 22 profile setup fields.

**Tasks:**

#### Backend Task 0.1.1: Update User Type

**File:** `Raine-bk/functions/src/types/index.ts`

Add all profile setup fields to User interface (see integration analysis document section 8.1 for complete code).

**Key additions:**
- firstName, lastInitial, zipCode, city, state, county
- cityFeel, childCount, isExpecting, dueDate, children[]
- beforeMotherhood[], perfectWeekend[], feelYourself
- hardTruths[], unexpectedJoys[], aesthetic[]
- momFriendStyle[], whatBroughtYou
- generatedBio, bioApproved, profileSetupCompleted, profileSetupCompletedAt
- authProvider, providerUid

**Effort:** 1 hour

#### Backend Task 0.1.2: Update onUserCreate Trigger

**File:** `Raine-bk/functions/src/triggers/auth/onUserCreate.ts`

Initialize all profile fields to empty/default values when user signs up.

**Effort:** 30 minutes

#### Backend Task 0.1.3: Update Firestore Security Rules

**File:** `Raine-bk/firestore/firestore.rules`

Allow authenticated users to write profile setup fields (but not subscription/system fields).

**Effort:** 30 minutes

#### Backend Task 0.1.4: Fix Subscription Enum

Change "free" → "none" in:
- `types/index.ts`
- `triggers/auth/onUserCreate.ts`
- `webhooks/revenuecat.ts`

**Effort:** 15 minutes

#### Backend Task 0.1.5: Fix Storage Rules

**File:** `Raine-bk/storage/storage.rules`

Change 5MB → 10MB, add explicit format validation.

**Effort:** 10 minutes

**Total Backend Critical:** ~3 hours

---

### 0.2 Implement `generateProfileBio` Cloud Function (P0 - CRITICAL)

**Issue:** Frontend calls this function but it doesn't exist.

**Tasks:**

#### Backend Task 0.2.1: Add OpenAI API Key to Secret Manager

```bash
echo -n "sk-your-key" | gcloud secrets create openai-api-key --data-file=-
```

**Effort:** 15 minutes

#### Backend Task 0.2.2: Install OpenAI SDK

```bash
cd Raine-bk/functions
npm install openai
```

**Effort:** 5 minutes

#### Backend Task 0.2.3: Implement Function

**File:** `Raine-bk/functions/src/callable/generateProfileBio.ts`

See integration analysis document section 8.2 for complete implementation.

**Key requirements:**
- OpenAI GPT-4o-mini integration
- Rate limiting (5 calls per user per day)
- Prompt engineering for quality bios
- Error handling with structured logging

**Effort:** 3-4 hours

#### Backend Task 0.2.4: Export Function

**File:** `Raine-bk/functions/src/index.ts`

```typescript
export {generateProfileBio} from "./callable/generateProfileBio";
```

**Effort:** 5 minutes

**Total Bio Function:** ~4 hours

---

### 0.3 Add Supporting Collections (P1 - HIGH)

#### Backend Task 0.3.1: Waitlist Collection

**Schema:**
```typescript
interface WaitlistEntry {
  email: string;
  zipCode: string;
  city: string;
  state: string;
  county: string;
  source: "onboarding" | "landing_page";
  createdAt: Timestamp;
}
```

**Security Rules:**
```javascript
match /waitlist/{entryId} {
  allow create: if request.resource.data.email is string &&
    request.resource.data.email.matches('.*@.*\\..*');
  allow read, update, delete: if false;
}
```

**Effort:** 30 minutes

#### Backend Task 0.3.2: Referral Codes Collection

**Schema:**
```typescript
interface ReferralCode {
  code: string;
  status: "unused" | "used";
  usedBy?: string;
  usedAt?: Timestamp;
  createdAt: Timestamp;
}
```

**Cloud Functions:**
- `validateReferralCode` - Check if code is valid and unused
- `consumeReferralCode` - Mark code as used (post-auth)

See integration analysis section 8.3 for implementation.

**Effort:** 2-3 hours

**Total Supporting:** ~3 hours

---

### 0.4 Deploy Backend Changes

```bash
cd Raine-bk
firebase deploy
```

**Verify:**
```bash
firebase functions:list  # Should show 12 functions now (9 + 3 new)
```

**Effort:** 15 minutes

---

### 0.5 Frontend: Add Firebase Config & Rebuild

#### Frontend Task 0.5.1: Add Config Files

1. Download from Firebase Console:
   - `google-services.json`
   - `GoogleService-Info.plist`

2. Place in `RaineApp/` root

**Effort:** 15 minutes (human task)

#### Frontend Task 0.5.2: Rebuild Dev Client

```bash
cd RaineApp
eas build --profile development --platform all
```

Wait ~20 minutes for build.

#### Frontend Task 0.5.3: Update Referral Service

**File:** `RaineApp/src/services/referral/index.ts`

Replace stub with real Cloud Function calls.

**Effort:** 30 minutes

---

**Phase 0 Total Effort:**
- Backend: ~10 hours
- Frontend: ~1 hour + build time
- **Can be parallelized with Phase 1 mock work**

---

## Phase 1: Foundation & Navigation (Week 1-2)

**Goal:** Establish architecture for 4-pillar app  
**Dependencies:** None (can start immediately)  
**Outcome:** New navigation, type definitions, shared components, stores

### 1.1 Type Definitions (Day 1)

**Priority:** P0 - Everything depends on types

#### Task 1.1.1: Create Shared Types

**File:** `src/types/shared.ts`

```typescript
// Activity Dashboard
export interface ActivityCounts {
  introRequests: number;
  unreadMessages: number;
  savedTips: number;
  questionResponses: number;
}

// Common types
export interface TimelineItem {
  id: string;
  type: 'intro' | 'community_post' | 'message';
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Timestamp;
  preview: string;
  unread: boolean;
}
```

**Effort:** 1 hour

#### Task 1.1.2: Create Introduction Types

**File:** `src/types/introduction.ts`

```typescript
export interface Introduction {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  roomId?: string;
  mutualCommunities: number;
  matchDescription: string;
  createdAt: Timestamp;
  respondedAt?: Timestamp;
  expiresAt: Timestamp;
}

export interface SavedConnection {
  userId: string;
  firstName: string;
  photoURL: string;
  bio: string;
  mutualCommunities: number;
  matchDescription: string;
  savedAt: Timestamp;
}

export interface MatchProfile {
  userId: string;
  firstName: string;
  lastInitial: string;
  photoURL: string;
  city: string;
  state: string;
  children: Array<{ name: string; age: string }>;
  tags: string[];
  matchDescription: string;
  matchScore: number;
}
```

**Effort:** 1 hour

#### Task 1.1.3: Create Community Types

**File:** `src/types/community.ts`

```typescript
export interface Community {
  id: string;
  name: string;
  description: string;
  coverPhotoURL: string;
  category: CommunityCategory;
  badge: 'LOCATION' | 'AGE' | 'EXPERIENCE' | 'TOPIC' | 'STAGE';
  memberCount: number;
  postCount: number;
  lastActivityAt: Timestamp;
  tags: string[];
  isPublic: boolean;
  maxMembers?: number;
}

export type CommunityCategory = 'location' | 'child_age' | 'experience' | 'topic' | 'stage';

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  timestamp: Timestamp;
  likeCount: number;
  replyCount: number;
  bookmarkCount: number;
  pinned: boolean;
  notable: boolean;
}

export interface PostReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  timestamp: Timestamp;
  likeCount: number;
}

export interface CommunityMembership {
  communityId: string;
  name: string;
  coverPhotoURL: string;
  joinedAt: Timestamp;
  lastRead?: Timestamp;
  notificationsEnabled: boolean;
}
```

**Effort:** 2 hours

#### Task 1.1.4: Create Drop Types

**File:** `src/types/drop.ts`

```typescript
export interface Drop {
  id: string;
  title: string;
  subtitle: string;
  category: DropCategory;
  coverColor: string;
  sections: DropSection[];
  createdAt: Timestamp;
  publishedAt: Timestamp;
}

export type DropCategory = 'NEWBORN' | 'TODDLER' | 'FEEDING' | 'WELLNESS' | 'LIFESTYLE' | 'GEAR';

export interface DropSection {
  id: string;
  title: string;
  items: DropItem[];
}

export interface DropItem {
  id: string;
  productName: string;
  description: string;
  photoURL: string;
  shopURL: string;
  priceRange?: string;
  brand?: string;
}

export interface HeartedItem {
  itemId: string;
  dropId: string;
  dropTitle: string;
  sectionId: string;
  productName: string;
  photoURL: string;
  shopURL: string;
  heartedAt: Timestamp;
}
```

**Effort:** 1 hour

**Total Types:** ~5 hours

---

### 1.2 Navigation Rewrite (Day 1-2)

#### Task 1.2.1: Update Tab Layout

**File:** `src/app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router';
import { Home, Users, MessageSquare, Bookmark } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E8613C',  // Coral
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          borderTopColor: '#E5E5E5',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="introductions"
        options={{
          title: 'Introductions',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          tabBarBadge: pendingIntroCount > 0 ? pendingIntroCount : undefined,
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
          tabBarBadge: unreadCommunityCount > 0 ? unreadCommunityCount : undefined,
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

**Dependencies:**
- Install `lucide-react-native` for icons

**Effort:** 2 hours

#### Task 1.2.2: Create New Tab Screen Placeholders

Create placeholder files:
- `src/app/(tabs)/introductions.tsx`
- `src/app/(tabs)/communities.tsx`
- `src/app/(tabs)/drops.tsx`

Each with simple "Coming Soon" UI initially.

**Effort:** 30 minutes

#### Task 1.2.3: Move Settings

Move `src/app/(tabs)/settings.tsx` → `src/app/profile/settings.tsx`

**Effort:** 30 minutes

---

### 1.3 Shared Components (Day 2-3)

#### Task 1.3.1: TabSwitcher Component

**File:** `src/components/shared/TabSwitcher.tsx`

```typescript
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({tabs, activeTab, onTabChange}) => {
  return (
    <View className="flex-row border-b border-slate-200">
      {tabs.map(tab => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className={`flex-1 pb-2 ${activeTab === tab.id ? 'border-b-2 border-orange-500' : ''}`}
        >
          <Text className={`text-center font-semibold ${activeTab === tab.id ? 'text-orange-500' : 'text-slate-500'}`}>
            {tab.label.toUpperCase()}
            {tab.count !== undefined && ` (${tab.count})`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
```

**Effort:** 1 hour

#### Task 1.3.2: SectionHeader Component

**File:** `src/components/shared/SectionHeader.tsx`

```typescript
interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress
}) => {
  return (
    <View className="px-6 py-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
          {title}
        </Text>
        {actionText && onActionPress && (
          <Pressable onPress={onActionPress}>
            <Text className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
              {actionText}
            </Text>
          </Pressable>
        )}
      </View>
      <View className="h-px bg-orange-500" />
    </View>
  );
};
```

**Effort:** 30 minutes

#### Task 1.3.3: SearchBar Component

**File:** `src/components/shared/SearchBar.tsx`

Universal search input with placeholder text.

**Effort:** 30 minutes

#### Task 1.3.4: FilterPills Component

**File:** `src/components/shared/FilterPills.tsx`

Horizontal scrollable filter chips.

**Effort:** 1 hour

#### Task 1.3.5: SortPills Component

**File:** `src/components/shared/SortPills.tsx`

Recent/A-Z toggle pills.

**Effort:** 30 minutes

#### Task 1.3.6: Toast Component

**File:** `src/components/shared/Toast.tsx`

Top notification overlay with auto-dismiss.

**Effort:** 1 hour

**Total Shared Components:** ~5 hours

---

### 1.4 State Stores (Day 3)

#### Task 1.4.1: Introductions Store

**File:** `src/store/introductionsStore.ts`

```typescript
interface IntroductionsStore {
  activeConversations: Introduction[];
  savedConnections: SavedConnection[];
  pendingRequests: Introduction[];
  pendingCount: number;
  
  setActiveConversations: (conversations: Introduction[]) => void;
  setSavedConnections: (connections: SavedConnection[]) => void;
  setPendingRequests: (requests: Introduction[]) => void;
  addSavedConnection: (connection: SavedConnection) => void;
  removeSavedConnection: (userId: string) => void;
}
```

**Effort:** 1 hour

#### Task 1.4.2: Communities Store

**File:** `src/store/communitiesStore.ts`

```typescript
interface CommunitiesStore {
  joinedCommunities: CommunityMembership[];
  savedPosts: SavedPost[];
  userQuestions: UserQuestion[];
  
  setJoinedCommunities: (communities: CommunityMembership[]) => void;
  addJoinedCommunity: (community: CommunityMembership) => void;
  removeJoinedCommunity: (communityId: string) => void;
  addSavedPost: (post: SavedPost) => void;
  removeSavedPost: (postId: string) => void;
}
```

**Effort:** 1 hour

#### Task 1.4.3: Drops Store

**File:** `src/store/dropsStore.ts`

```typescript
interface DropsStore {
  heartedItems: HeartedItem[];
  
  setHeartedItems: (items: HeartedItem[]) => void;
  addHeartedItem: (item: HeartedItem) => void;
  removeHeartedItem: (itemId: string) => void;
}
```

**Effort:** 30 minutes

#### Task 1.4.4: Activity Store

**File:** `src/store/activityStore.ts`

```typescript
interface ActivityStore {
  counts: ActivityCounts;
  
  setCounts: (counts: ActivityCounts) => void;
  incrementCount: (key: keyof ActivityCounts) => void;
  decrementCount: (key: keyof ActivityCounts) => void;
}
```

**Effort:** 30 minutes

**Total Stores:** ~3 hours

---

**Phase 1 Total:** ~13 hours (can be parallelized with Phase 0)

---

## Phase 2: Home Dashboard (Week 2-3)

**Goal:** Build central hub with all sections  
**Dependencies:** Shared components from Phase 1  
**Outcome:** Functional Home tab with mock data

### 2.1 Activity Dashboard (Day 4)

#### Task 2.1.1: ActivityCounter Component

**File:** `src/components/home/ActivityCounter.tsx`

```typescript
interface ActivityCounterProps {
  label: string;
  count: number;
  onPress: () => void;
}

export const ActivityCounter: React.FC<ActivityCounterProps> = ({
  label,
  count,
  onPress
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-1 items-center py-4 border border-slate-200 rounded-lg"
    >
      <Text className="text-2xl text-slate-900 font-serif">
        {count}
      </Text>
      <Text className="text-xs text-slate-500 text-center mt-1">
        {label}
      </Text>
    </Pressable>
  );
};
```

**Effort:** 1 hour

#### Task 2.1.2: ActivityDashboard Component

**File:** `src/components/home/ActivityDashboard.tsx`

Horizontal row of 4 counters with tap navigation.

**Effort:** 1 hour

---

### 2.2 "Moms Like You" Section (Day 4-5)

#### Task 2.2.1: MatchProfileCard Component

**File:** `src/components/introductions/MatchProfileCard.tsx`

```typescript
interface MatchProfileCardProps {
  profile: MatchProfile;
  onSayHi: () => void;
  onSave: () => void;
}

// Vertical card with photo, name overlay, bio, two buttons
```

**Effort:** 2 hours

#### Task 2.2.2: MomsLikeYouCarousel Component

**File:** `src/components/home/MomsLikeYouCarousel.tsx`

Horizontal FlatList of match profile cards.

**Effort:** 1 hour

---

### 2.3 Communities Preview Section (Day 5)

#### Task 2.3.1: CommunityPreviewCard Component

**File:** `src/components/communities/CommunityPreviewCard.tsx`

Horizontal card with cover photo, badge, name overlay, description.

**Effort:** 2 hours

#### Task 2.3.2: CommunityPreviewList Component

**File:** `src/components/home/CommunityPreviewList.tsx`

Vertical list with categorized sections.

**Effort:** 1 hour

---

### 2.4 Fresh Drop Preview Section (Day 5)

#### Task 2.4.1: DropPreviewCard Component

**File:** `src/components/drops/DropPreviewCard.tsx`

Large card with solid background, category, title, subtitle.

**Effort:** 1.5 hours

---

### 2.5 Home Screen Assembly (Day 6)

#### Task 2.5.1: Implement Home Screen

**File:** `src/app/(tabs)/index.tsx`

```typescript
export default function HomeScreen() {
  const router = useRouter();
  const activityCounts = useActivityStore(state => state.counts);
  
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header with logo + profile icon */}
      <HomeHeader />
      
      {/* Activity Dashboard */}
      <ActivityDashboard counts={activityCounts} />
      
      {/* Moms Like You */}
      <SectionHeader title="MOMS LIKE YOU" />
      <MomsLikeYouCarousel profiles={mockProfiles} />
      
      {/* Communities */}
      <SectionHeader title="COMMUNITIES" />
      <CommunityPreviewList communities={mockCommunities} />
      
      {/* Fresh Drop */}
      <SectionHeader title="FRESH DROP" actionText="SEE ALL" />
      <DropPreviewCard drop={mockFeaturedDrop} />
    </ScrollView>
  );
}
```

**Effort:** 3 hours

#### Task 2.5.2: Mock Data

**File:** `src/utils/mockData.ts`

Add mock data for profiles, communities, drops, activity counts.

**Effort:** 2 hours

---

**Phase 2 Total:** ~15 hours (~2-3 days)

---

## Phase 3: Drops Feature (Week 3-4)

**Goal:** Simplest feature - product curation  
**Dependencies:** Drop types, shared components  
**Outcome:** Fully functional Drops with mock content

### 3.1 Drops Tab Main Screen (Day 7)

#### Task 3.1.1: DropCoverCard Component

**File:** `src/components/drops/DropCoverCard.tsx`

Card with solid pastel background, "THE DROP X" branding, title.

**Effort:** 2 hours

#### Task 3.1.2: Drops Tab

**File:** `src/app/(tabs)/drops.tsx`

```typescript
export default function DropsScreen() {
  const [activeTab, setActiveTab] = useState<'raine-drops' | 'my-hearts'>('raine-drops');
  const [selectedCategory, setSelectedCategory] = useState<DropCategory | null>(null);
  
  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-6">
        <Text className="text-xs text-orange-500 font-semibold tracking-widest">YOUR</Text>
        <Text className="text-3xl text-slate-900 font-serif">Drops</Text>
      </View>
      
      <TabSwitcher
        tabs={[
          { id: 'raine-drops', label: 'RAINE DROPS' },
          { id: 'my-hearts', label: 'MY HEARTS', count: heartedItems.length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === 'raine-drops' && (
        <>
          <SearchBar placeholder="SEARCH DROPS" />
          <FilterPills
            filters={['NEWBORN', 'TODDLER', 'FEEDING', 'WELLNESS', 'LIFESTYLE', 'GEAR']}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <FlatList
            data={filteredDrops}
            numColumns={2}
            renderItem={({item}) => <DropCoverCard drop={item} />}
          />
        </>
      )}
      
      {activeTab === 'my-hearts' && <MyHeartsList />}
    </View>
  );
}
```

**Effort:** 3 hours

---

### 3.2 Drop Viewer (Day 8-9)

#### Task 3.2.1: DropTableOfContents Component

**File:** `src/components/drops/DropTableOfContents.tsx`

Vertical list of section names with tap navigation.

**Effort:** 2 hours

#### Task 3.2.2: DropSection Component

**File:** `src/components/drops/DropSection.tsx`

Section title + list of product items.

**Effort:** 2 hours

#### Task 3.2.3: DropItemCard Component

**File:** `src/components/drops/DropItemCard.tsx`

Product card with photo, name, description, heart button, shop link.

**Effort:** 2 hours

#### Task 3.2.4: Drop Viewer Screen

**File:** `src/app/drop/[id].tsx`

Paginated swipeable viewer (TOC → Section → Section → ...).

**Effort:** 4 hours

---

### 3.3 My Hearts List (Day 9)

#### Task 3.3.1: MyHeartsList Component

**File:** `src/components/drops/MyHeartsList.tsx`

List of hearted items with SHOP NOW / REMOVE buttons.

**Effort:** 2 hours

---

**Phase 3 Total:** ~18 hours (~3 days)

---

## Phase 4: Introductions Feature (Week 4-6)

**Goal:** Social discovery and 1:1 connections  
**Dependencies:** Introduction types, match profiles, chat reuse  
**Outcome:** Full intro flow with saved connections

### 4.1 Introductions Tab (Day 10-11)

#### Task 4.1.1: PendingBanner Component

**File:** `src/components/introductions/PendingBanner.tsx`

Banner with avatar row showing pending intro requests.

**Effort:** 1.5 hours

#### Task 4.1.2: ConversationRow Component

**File:** `src/components/introductions/ConversationRow.tsx`

List row with avatar, name, last message preview, timestamp.

**Effort:** 1 hour

#### Task 4.1.3: SavedConnectionCard Component

**File:** `src/components/introductions/SavedConnectionCard.tsx`

Card with avatar, name, mutual communities, bio, SAY HI/UNSAVE buttons.

**Effort:** 2 hours

#### Task 4.1.4: Introductions Tab Screen

**File:** `src/app/(tabs)/introductions.tsx`

Two sub-tabs (Active/Saved) with search/sort/list.

**Effort:** 4 hours

---

### 4.2 Profile Detail Modal (Day 12)

#### Task 4.2.1: Profile Detail Screen

**File:** `src/app/introduction/[userId].tsx`

Full-screen modal showing target user's profile with START CONVERSATION button.

**Effort:** 3 hours

---

### 4.3 Pending Requests Screen (Day 12)

#### Task 4.3.1: Pending Requests Screen

**File:** `src/app/introduction/pending.tsx`

List of intro requests with ACCEPT/DECLINE buttons.

**Effort:** 3 hours

---

### 4.4 Chat Redesign (Day 13)

#### Task 4.4.1: Update Chat Header

**File:** `src/app/chat/[id].tsx`

Change header to show avatar + name + X close button (not back arrow).

**Effort:** 1 hour

---

**Phase 4 Total:** ~16 hours (~3 days)

---

## Phase 5: Communities Feature (Week 6-9)

**Goal:** Group discussions with threaded posts  
**Dependencies:** Community types, post/reply components  
**Outcome:** Full community experience

### 5.1 Communities Tab (Day 14-15)

#### Task 5.1.1: CommunityCard Component (Grid)

**File:** `src/components/communities/CommunityCard.tsx`

Grid card with cover photo, name, member count.

**Effort:** 2 hours

#### Task 5.1.2: JoinedCommunitiesGrid Component

**File:** `src/components/communities/JoinedCommunitiesGrid.tsx`

2-column grid of joined communities.

**Effort:** 1 hour

#### Task 5.1.3: ActivityFeedRow Component

**File:** `src/components/communities/ActivityFeedRow.tsx`

List row showing recent community activity.

**Effort:** 1.5 hours

#### Task 5.1.4: Communities Tab Screen

**File:** `src/app/(tabs)/communities.tsx`

Two sub-tabs (Joined/Explore) with search/filters.

**Effort:** 5 hours

---

### 5.2 Community Detail (Day 16-17)

#### Task 5.2.1: CommunityHeader Component

**File:** `src/components/communities/CommunityHeader.tsx`

Hero image with badge, name, description, member count with avatars.

**Effort:** 3 hours

#### Task 5.2.2: NoteworthyCarousel Component

**File:** `src/components/communities/NoteworthyCarousel.tsx`

Horizontal scroll of highlighted posts.

**Effort:** 2 hours

#### Task 5.2.3: AskQuestionInput Component

**File:** `src/components/communities/AskQuestionInput.tsx`

Text input with send button, creates post on submit.

**Effort:** 2 hours

#### Task 5.2.4: Community Detail Screen

**File:** `src/app/community/[id].tsx`

Complete community detail page.

**Effort:** 4 hours

---

### 5.3 Community Timeline (Day 18-20)

#### Task 5.3.1: CommunityPost Component

**File:** `src/components/communities/CommunityPost.tsx`

Post with author, timestamp, body, like/reply/bookmark buttons.

**Effort:** 3 hours

#### Task 5.3.2: PostReply Component

**File:** `src/components/communities/PostReply.tsx`

Threaded reply (indented, smaller).

**Effort:** 2 hours

#### Task 5.3.3: Community Timeline Screen

**File:** `src/app/community/[id]/timeline.tsx`

Scrollable feed of posts with toggle replies, reply form.

**Effort:** 6 hours

---

### 5.4 Supporting Screens (Day 21)

#### Task 5.4.1: Saved Tips Screen

**File:** `src/app/community/saved-tips.tsx`

List of bookmarked posts across all communities.

**Effort:** 2 hours

#### Task 5.4.2: Your Questions Screen

**File:** `src/app/community/questions.tsx`

List of user's community questions with answer counts.

**Effort:** 2 hours

---

**Phase 5 Total:** ~33 hours (~5 days)

---

## Phase 6: Profile Redesign (Week 9-10)

**Goal:** Rich public profile view  
**Dependencies:** Profile data from setup  
**Outcome:** Full profile + edit + settings

### 6.1 Profile View Screen (Day 22)

#### Task 6.1.1: Profile View Screen

**File:** `src/app/profile/index.tsx`

Public-facing profile view with photo, bio, location, children, tags.

**Effort:** 4 hours

---

### 6.2 Edit Profile Screen (Day 23)

#### Task 6.2.1: Edit Profile Screen

**File:** `src/app/profile/edit.tsx`

Reuse profile-setup components for editing.

**Effort:** 3 hours

---

### 6.3 Move Settings (Day 23)

Already done in Phase 1.2.3.

---

**Phase 6 Total:** ~7 hours (~1 day)

---

## Phase 7: Polish & Launch (Week 10)

### 7.1 Backend Services Implementation

All backend work from Phase 0 must be complete and tested.

### 7.2 Firebase Integration

Replace all mock services with real Firebase listeners.

**Effort:** 5-7 days (depends on backend readiness)

### 7.3 Testing & Bug Fixes

**Effort:** 3-5 days

---

## Implementation Dependencies

### Dependency Graph

```
Phase 0 (Backend) ═══════════════════════════════════════════╗
║ - Update User schema                                       ║
║ - Add generateProfileBio                                   ║
║ - Add waitlist/referralCodes                               ║
╚════════════════════════════════════════════════════════════╝
         ║                                                     
         ║ Enables real backend connection                    
         ▼                                                     
Phase 1 (Foundation) ═══════════════════════════════════════╗
║ - Types                                                    ║
║ - Navigation (4 tabs)                                      ║
║ - Shared components                                        ║
║ - Stores                                                   ║
╚════════════════════════════════════════════════════════════╝
         ║                                                     
         ║ Enables all feature work                           
         ║                                                     
    ┌────┼────┬─────────────┬──────────────┐                
    ▼    ▼    ▼             ▼              ▼                
 Phase 2  Phase 3  Phase 4      Phase 5                      
  Home    Drops    Intros       Communities                  
  (mock)  (mock)   (mock)       (mock)                       
    │       │        │              │                        
    └───────┴────────┴──────────────┘                        
                ▼                                             
         Phase 7: Real Integration                           
```

---

## Total Effort Summary

| Phase | Frontend Days | Backend Days | Can Parallelize? |
|-------|--------------|--------------|------------------|
| Phase 0: Backend Critical | 0.5 | 2 | No (blocks everything) |
| Phase 1: Foundation | 2 | 0 | ✅ Yes (with Phase 0) |
| Phase 2: Home | 3 | 1 | ✅ Yes |
| Phase 3: Drops | 3 | 2 | ✅ Yes |
| Phase 4: Introductions | 3 | 3 | ✅ Yes |
| Phase 5: Communities | 5 | 4 | ✅ Yes |
| Phase 6: Profile | 1 | 0 | ✅ Yes |
| Phase 7: Integration | 5 | 2 | No (sequential) |
| **Total** | **22.5 days** | **14 days** | **~8 weeks parallel** |

**With parallelization:** 8-10 weeks calendar time

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Backend delays Phase 0 | High | Critical | Start Phase 1 in parallel with mock data |
| Matching algorithm complexity | Medium | High | Simple criteria matching for MVP, evolve to AI |
| Community moderation | Medium | High | Guidelines + report mechanism + admin tools |
| Scope creep (66 components) | High | High | Strict MVP scope, defer nice-to-haves |
| Performance (real-time at scale) | Low | Medium | Pagination, caching, lazy loading |
| RevenueCat config delays | Medium | Medium | Can launch free, add subscriptions later |

---

## Success Criteria

✅ Launch ready when:

1. **Phase 0 complete:** Backend accepts profile data, bio generates
2. **Phase 1 complete:** Navigation works, no type errors
3. **Phase 2-6 complete:** All 4 pillars functional with mock data
4. **Phase 7 complete:** Real backend connected, tested end-to-end
5. **All critical bugs fixed**
6. **Performance acceptable** (<3s cold start, smooth scrolling)
7. **Security rules deployed**
8. **RevenueCat configured** (can defer to post-launch)

---

## Next Steps

### Immediate (This Week)

**Backend Team:**
1. Fix critical gaps (User schema, generateProfileBio, collections)
2. Deploy to development environment
3. Test with frontend in emulator

**Frontend Team:**
1. Start Phase 1 (types, navigation, shared components)
2. Build Home dashboard with mock data
3. Begin Drops feature

### Short-term (Next 2 Weeks)

1. Complete Drops feature end-to-end
2. Start Introductions feature
3. Backend: Communities infrastructure

### Medium-term (Next 4-6 Weeks)

1. Complete Communities feature
2. Profile redesign
3. Full backend integration
4. Testing & bug fixes

---

---

## Sub-Plans Index

This master plan has been broken into focused implementation plans that can be executed in parallel sessions:

| # | Plan | Scope | Depends On | Effort |
|---|------|-------|------------|--------|
| A | [Backend Integration](./PLAN-A-BACKEND-INTEGRATION.md) | Backend schema, bio function, collections, deploy | Nothing | 2 days |
| B | [Foundation & Navigation](./PLAN-B-FOUNDATION.md) | Types, 4-tab nav, shared components, stores | Nothing | 2 days |
| C | [Drops Feature](./PLAN-C-DROPS.md) | Drops tab, viewer, My Hearts | Plan B | 3 days |
| D | [Introductions Feature](./PLAN-D-INTRODUCTIONS.md) | Intros tab, profile detail, pending, chat | Plan B | 3 days |
| E | [Communities Feature](./PLAN-E-COMMUNITIES.md) | Communities tab, detail, timeline, posts | Plan B | 5 days |
| F | [Home Dashboard & Profile](./PLAN-F-HOME-AND-PROFILE.md) | Home, activity counters, profile redesign | Plans C, D, E | 3 days |

**Parallel execution strategy:**  
- Plans A + B start immediately (no dependencies)
- Plans C, D, E start after B completes (can run in parallel with each other)
- Plan F starts after C, D, E (composes all features into Home)

---

**Document Version:** 1.1  
**Status:** Active - Decomposed into Sub-Plans  
**Owner:** Development Team  
**Review Cadence:** Weekly
