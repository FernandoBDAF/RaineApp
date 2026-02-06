# Plan B: Foundation & Navigation
## Types, 4-Tab Navigation, Shared Components, Stores

**Scope:** RaineApp frontend only  
**Duration:** 1-2 days  
**Dependencies:** None (start immediately)  
**Parallel With:** Plan A (Backend Integration)  
**Blocks:** Plans C, D, E (all features depend on this)

---

## Context

The current app has 3 tabs (Rooms, Profile, Settings). The vision requires 4 tabs (Home, Introductions, Communities, Drops) with shared UI patterns. This plan establishes the architectural foundation that all feature plans depend on.

**Source:** [Completing the Vision](../systemic_view/4-completing-the-vision.md) sections 2-4, 6-7

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | Shared type definitions | `src/types/shared.ts` | 1h |
| 2 | Introduction types | `src/types/introduction.ts` | 1h |
| 3 | Community types | `src/types/community.ts` | 2h |
| 4 | Drop types | `src/types/drop.ts` | 1h |
| 5 | 4-tab navigation rewrite | `src/app/(tabs)/_layout.tsx` | 2h |
| 6 | Tab placeholder screens | 3 new `.tsx` files | 30m |
| 7 | TabSwitcher component | `src/components/shared/TabSwitcher.tsx` | 1h |
| 8 | SectionHeader component | `src/components/shared/SectionHeader.tsx` | 30m |
| 9 | SearchBar component | `src/components/shared/SearchBar.tsx` | 30m |
| 10 | FilterPills component | `src/components/shared/FilterPills.tsx` | 1h |
| 11 | SortPills component | `src/components/shared/SortPills.tsx` | 30m |
| 12 | Toast component | `src/components/shared/Toast.tsx` | 1h |
| 13 | MemberAvatarRow component | `src/components/shared/MemberAvatarRow.tsx` | 30m |
| 14 | Introductions store | `src/store/introductionsStore.ts` | 1h |
| 15 | Communities store | `src/store/communitiesStore.ts` | 1h |
| 16 | Drops store | `src/store/dropsStore.ts` | 30m |
| 17 | Activity store | `src/store/activityStore.ts` | 30m |
| 18 | Mock data for all features | `src/utils/mockData.ts` (extend) | 2h |
| 19 | Install icon library | `lucide-react-native` | 10m |
| 20 | Move Settings screen | `settings.tsx` → `profile/settings.tsx` | 30m |

**Total:** ~18 hours

---

## Task Details

### Task 1-4: Type Definitions

Create type files for each feature domain:
- `src/types/shared.ts` — ActivityCounts, TimelineItem
- `src/types/introduction.ts` — Introduction, SavedConnection, MatchProfile
- `src/types/community.ts` — Community, CommunityPost, PostReply, CommunityMembership
- `src/types/drop.ts` — Drop, DropSection, DropItem, HeartedItem

**Reference:** Master plan section "Phase 1: 1.1 Type Definitions" for complete interfaces.

### Task 5: Navigation Rewrite

**File:** `src/app/(tabs)/_layout.tsx`

Replace 3-tab layout with 4-tab layout:
- Home (house icon)
- Introductions (users icon, with badge for pending count)
- Communities (message-square icon, with badge for unread)
- Drops (bookmark icon)

Use `lucide-react-native` for consistent icons. Coral (`#E8613C`) for active state.

### Task 6: Tab Placeholder Screens

Create minimal placeholder screens so navigation works:
- `src/app/(tabs)/introductions.tsx` — "Introductions - Coming Soon"
- `src/app/(tabs)/communities.tsx` — "Communities - Coming Soon"
- `src/app/(tabs)/drops.tsx` — "Drops - Coming Soon"

### Tasks 7-13: Shared Components

Components used across multiple features:
- **TabSwitcher** — Two-tab toggle (Active/Saved, Joined/Explore, etc.)
- **SectionHeader** — Coral uppercase header with optional "SEE ALL" action
- **SearchBar** — Universal search input with uppercase placeholder
- **FilterPills** — Horizontal scrollable category chips
- **SortPills** — Recent/A-Z sort toggle
- **Toast** — Top notification overlay with auto-dismiss
- **MemberAvatarRow** — Overlapping circular avatars with "+X more"

**Reference:** Master plan section "Phase 1: 1.3 Shared Components" for props and styles.

### Tasks 14-17: Zustand Stores

Create stores with MMKV persistence:
- **introductionsStore** — Active conversations, saved connections, pending requests
- **communitiesStore** — Joined communities, saved posts, user questions
- **dropsStore** — Hearted items
- **activityStore** — Dashboard counter aggregation (memory only)

### Task 18: Mock Data

Extend `src/utils/mockData.ts` with:
- 5 mock match profiles (for "Moms Like You")
- 3 mock communities (location, age, experience)
- 3 mock drops with sections and items
- Mock activity counts

### Task 19: Install Icons

```bash
cd RaineApp
yarn add lucide-react-native
```

### Task 20: Move Settings

Move `src/app/(tabs)/settings.tsx` → `src/app/profile/settings.tsx`

Update any navigation references.

---

## File Structure After Completion

```
src/
├── types/
│   ├── shared.ts          ← NEW
│   ├── introduction.ts    ← NEW
│   ├── community.ts       ← NEW
│   ├── drop.ts            ← NEW
│   └── (existing files)
├── components/
│   └── shared/            ← NEW FOLDER
│       ├── TabSwitcher.tsx
│       ├── SectionHeader.tsx
│       ├── SearchBar.tsx
│       ├── FilterPills.tsx
│       ├── SortPills.tsx
│       ├── Toast.tsx
│       └── MemberAvatarRow.tsx
├── store/
│   ├── introductionsStore.ts  ← NEW
│   ├── communitiesStore.ts    ← NEW
│   ├── dropsStore.ts          ← NEW
│   ├── activityStore.ts       ← NEW
│   └── (existing stores)
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        ← REWRITE (4 tabs)
│   │   ├── index.tsx          ← KEEP (will be rewritten in Plan F)
│   │   ├── introductions.tsx  ← NEW (placeholder)
│   │   ├── communities.tsx    ← NEW (placeholder)
│   │   └── drops.tsx          ← NEW (placeholder)
│   └── profile/
│       └── settings.tsx       ← MOVED from (tabs)
└── utils/
    └── mockData.ts            ← EXTENDED
```

---

## Verification Checklist

- [ ] `yarn type-check` passes with no errors
- [ ] App opens with 4 tabs visible
- [ ] Tapping each tab navigates to the correct placeholder
- [ ] Tab bar shows correct icons and coral active color
- [ ] Settings accessible from profile
- [ ] All shared components render without errors (create a quick test screen)
- [ ] Mock data imports work from `mockData.ts`

---

## Design Tokens (For Reference)

```
Coral Primary: #E8613C
Coral Dark: #E8401C
Black: #1A1A1A
Dark Gray: #666666
Light Gray: #999999
Border Gray: #E5E5E5
Peach Background: #FDF5F3
White: #FFFFFF

Section Header: 14px, uppercase, letter-spaced, coral, sans-serif
Page Title: 32px, serif (Playfair-like)
Button Text: 12px, uppercase, letter-spaced, medium weight
```

---

## What This Unblocks

- **Plan C (Drops):** Uses TabSwitcher, SearchBar, FilterPills, Drop types, dropsStore
- **Plan D (Introductions):** Uses TabSwitcher, SortPills, Toast, Introduction types, introductionsStore
- **Plan E (Communities):** Uses TabSwitcher, SearchBar, FilterPills, MemberAvatarRow, Community types, communitiesStore
- **Plan F (Home):** Uses SectionHeader, all stores, all mock data
