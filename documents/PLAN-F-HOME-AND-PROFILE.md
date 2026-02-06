# Plan F: Home Dashboard & Profile Redesign
## Central Hub + Public Profile

**Scope:** RaineApp frontend — Home tab rewrite + profile view/edit  
**Duration:** 2-3 days  
**Dependencies:** Plans C, D, E (uses components from all features)  
**Parallel With:** Nothing (this is the composition layer)  
**Final Step:** After this, all UI is complete

---

## Context

The Home dashboard is the central hub that composes previews from all three features (Introductions, Communities, Drops) plus activity counters. It must be built after the feature components exist. The profile redesign replaces the current minimal profile with a full public-facing view.

**Source:** [Completing the Vision](../systemic_view/4-completing-the-vision.md) sections 3-5

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | HomeHeader component | `src/components/home/HomeHeader.tsx` | 1h |
| 2 | ActivityCounter component | `src/components/home/ActivityCounter.tsx` | 1h |
| 3 | ActivityDashboard component | `src/components/home/ActivityDashboard.tsx` | 1h |
| 4 | Home screen (full rewrite) | `src/app/(tabs)/index.tsx` | 4h |
| 5 | Activity service | `src/services/activity/index.ts` | 1h |
| 6 | Full profile view screen | `src/app/profile/index.tsx` | 4h |
| 7 | Edit profile screen | `src/app/profile/edit.tsx` | 3h |
| 8 | ProfileView component | `src/components/profile/ProfileView.tsx` | 2h |
| 9 | ProfileTagList component | `src/components/profile/ProfileTagList.tsx` | 1h |
| 10 | Update root layout for profile routes | `src/app/_layout.tsx` | 30m |

**Total:** ~19 hours

---

## Screen Map

```
(tabs)/index.tsx                       ← HOME DASHBOARD (rewrite)
  ├── HomeHeader (Raine logo + 👤 profile icon)
  ├── ActivityDashboard (4 counters)
  │   ├── Intro Requests → introductions tab
  │   ├── Unread Messages → introductions tab (active)
  │   ├── Saved Tips → community/saved-tips
  │   └── Question Responses → community/questions
  ├── SectionHeader "MOMS LIKE YOU"
  ├── MomsLikeYouCarousel (from Plan D)
  ├── SectionHeader "COMMUNITIES"
  ├── CommunityPreviewList (from Plan E)
  ├── SectionHeader "FRESH DROP" + "SEE ALL"
  └── DropPreviewCard (from Plan C)

profile/index.tsx                      ← FULL PROFILE VIEW
  ├── Header with edit button
  ├── Large profile photo
  ├── Name (firstName + lastInitial.)
  ├── Location (city, state)
  ├── Bio (generated bio)
  ├── Children info
  ├── Profile tags (derived from profile setup)
  ├── Settings button
  └── Sign out button

profile/edit.tsx                       ← EDIT PROFILE
  ├── Reuse profile-setup components
  ├── Photo change
  ├── Name edit
  ├── Bio regenerate
  └── Save button
```

---

## Task Details

### Task 1: HomeHeader

**File:** `src/components/home/HomeHeader.tsx`

```typescript
interface HomeHeaderProps {
  onProfilePress: () => void;
}
```

- Left: "Raine" in script/serif logo font
- Right: circular profile avatar/icon → navigates to profile

### Task 2: ActivityCounter

**File:** `src/components/home/ActivityCounter.tsx`

Single counter widget:
- Large number (serif, 24px)
- Label below (small, gray)
- Tappable → navigates to relevant screen

### Task 3: ActivityDashboard

**File:** `src/components/home/ActivityDashboard.tsx`

Horizontal row of 4 ActivityCounters:

| Counter | Label | Tap Target |
|---------|-------|------------|
| Intro Requests | count from introductionsStore.pendingCount | Introductions tab |
| Unread Messages | count from active conversations | Introductions → Active |
| Saved Tips | count from communitiesStore.savedPosts.length | Saved Tips screen |
| Question Responses | count from communitiesStore.userQuestions with answers | Your Questions screen |

### Task 4: Home Screen

**File:** `src/app/(tabs)/index.tsx`

**Complete rewrite.** This composes components from Plans C, D, E:

```typescript
export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-white">
      <HomeHeader onProfilePress={() => router.push('/profile')} />
      
      <ActivityDashboard />
      
      <SectionHeader title="MOMS LIKE YOU" />
      <MomsLikeYouCarousel />        {/* From Plan D */}
      
      <SectionHeader title="COMMUNITIES" />
      <CommunityPreviewList />        {/* From Plan E */}
      
      <SectionHeader
        title="FRESH DROP"
        actionText="SEE ALL"
        onActionPress={() => router.push('/(tabs)/drops')}
      />
      <DropPreviewCard />             {/* From Plan C */}
    </ScrollView>
  );
}
```

**Key:** This screen is primarily a composition of components already built in Plans C, D, E. The new work is the header and activity dashboard.

### Task 5: Activity Service

**File:** `src/services/activity/index.ts`

```typescript
export function getActivityCounts(): ActivityCounts {
  // Aggregate from all stores
  const pendingIntros = useIntroductionsStore.getState().pendingCount;
  const unreadMessages = /* count unread from active conversations */;
  const savedTips = useCommunitiesStore.getState().savedPosts.length;
  const questionResponses = /* count questions with new answers */;
  
  return { introRequests: pendingIntros, unreadMessages, savedTips, questionResponses };
}
```

### Task 6: Full Profile View

**File:** `src/app/profile/index.tsx`

Public-facing profile preview:
- Large profile photo (centered)
- First name + last initial (e.g., "Sarah M.")
- City, State
- Generated bio (italic)
- Children info (names + ages)
- Profile tags (derived from profile setup answers)
- Edit Profile button
- Settings button
- Sign Out button

### Task 7: Edit Profile

**File:** `src/app/profile/edit.tsx`

Reuse components from profile-setup:
- PhotoUpload for changing photo
- Name inputs
- Bio regeneration (call generateBio service)
- Save to Firestore

### Task 8: ProfileView Component

**File:** `src/components/profile/ProfileView.tsx`

Reusable profile display used in:
- Full profile screen (own profile)
- Profile detail modal in Introductions (other user's profile)

### Task 9: ProfileTagList

**File:** `src/components/profile/ProfileTagList.tsx`

Derives human-readable tags from profile setup enum values:

```typescript
// Map enum values to display tags
const TAG_MAP: Record<string, string> = {
  'travel': 'Travel Lover',
  'hosting': 'Entertainer',
  'movement': 'Active Mom',
  'clean_minimal': 'Minimalist',
  'coffee_dates': 'Coffee Dates',
  // ... etc
};
```

Displays as coral, dot-separated text.

### Task 10: Update Root Layout

**File:** `src/app/_layout.tsx`

Add profile route group to Stack:

```typescript
<Stack.Screen name="profile" />
```

---

## File Structure

```
src/
├── components/
│   ├── home/                    ← NEW FOLDER
│   │   ├── HomeHeader.tsx
│   │   ├── ActivityCounter.tsx
│   │   └── ActivityDashboard.tsx
│   └── profile/                 ← NEW FOLDER
│       ├── ProfileView.tsx
│       └── ProfileTagList.tsx
├── app/
│   ├── (tabs)/
│   │   └── index.tsx            ← REWRITE (Home dashboard)
│   └── profile/                 ← NEW FOLDER (or extend existing)
│       ├── index.tsx            ← Full profile view
│       ├── edit.tsx             ← Edit profile
│       └── settings.tsx         ← Moved from (tabs) in Plan B
├── services/
│   └── activity/
│       └── index.ts             ← NEW
└── utils/
    └── mockData.ts              ← EXTEND with activity data
```

---

## Verification Checklist

### Home Dashboard
- [ ] Home tab shows Raine logo and profile icon
- [ ] Activity dashboard shows 4 counters with correct numbers
- [ ] Tapping counter navigates to correct screen
- [ ] "Moms Like You" carousel scrolls horizontally
- [ ] "Communities" section shows categorized cards
- [ ] "Fresh Drop" shows featured drop with "SEE ALL"
- [ ] Tapping "SEE ALL" navigates to Drops tab
- [ ] Tapping profile icon navigates to profile

### Profile
- [ ] Profile view shows photo, name, bio, location, children, tags
- [ ] Edit button opens edit screen
- [ ] Edit screen allows changing photo, name, bio
- [ ] Save persists changes to store (and Firestore when connected)
- [ ] Settings accessible from profile
- [ ] Sign out works

### Integration
- [ ] All navigation flows work end-to-end
- [ ] No dead-end screens (every screen has back/close navigation)
- [ ] `yarn type-check` passes
- [ ] No console errors on any screen

---

## After This Plan

**All UI is complete.** The remaining work is:
- Connect mock services to real Firebase (backend integration)
- Testing & bug fixes
- Performance optimization
- Production deployment

This corresponds to "Phase 7: Integration & Launch" in the Master Plan.
