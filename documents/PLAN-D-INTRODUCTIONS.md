# Plan D: Introductions Feature
## Social Discovery & 1:1 Connections

**Scope:** RaineApp frontend — Introductions tab + profile detail + pending + chat redesign  
**Duration:** 3-4 days  
**Dependencies:** Plan B (Foundation) must be complete  
**Parallel With:** Plans C (Drops) and E (Communities)  
**Feeds Into:** Plan F (Home Dashboard uses "Moms Like You" carousel)

---

## Context

Introductions is the social discovery engine. It surfaces recommended profiles based on shared attributes, allows users to save profiles or say hi to start 1:1 conversations. Once connected, the conversation lives as a private chat thread.

**Source:** [Introductions PRD](./3-INTRODUCTIONS-PRD.md) for complete spec with screenshots

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | MatchProfileCard component | `src/components/introductions/MatchProfileCard.tsx` | 2h |
| 2 | PendingBanner component | `src/components/introductions/PendingBanner.tsx` | 1.5h |
| 3 | ConversationRow component | `src/components/introductions/ConversationRow.tsx` | 1h |
| 4 | SavedConnectionCard component | `src/components/introductions/SavedConnectionCard.tsx` | 2h |
| 5 | MomsLikeYouCarousel component | `src/components/introductions/MomsLikeYouCarousel.tsx` | 1h |
| 6 | Introductions tab screen | `src/app/(tabs)/introductions.tsx` | 4h |
| 7 | Profile detail screen | `src/app/introduction/[userId].tsx` | 3h |
| 8 | Pending requests screen | `src/app/introduction/pending.tsx` | 3h |
| 9 | Chat screen redesign | `src/app/chat/[id].tsx` | 1.5h |
| 10 | Introductions service (mock) | `src/services/introductions/index.ts` | 1.5h |
| 11 | Mock introduction data | `src/utils/mockIntroductions.ts` | 1.5h |

**Total:** ~22 hours

---

## Screen Map

```
(tabs)/introductions.tsx              ← INTRODUCTIONS TAB
  ├── Header: "YOUR Introductions"
  ├── PendingBanner: "X NEW MOMS want to say hi" [avatars] [>]
  │   └── Tap → introduction/pending.tsx
  ├── TabSwitcher: ACTIVE (count) / SAVED (count)
  ├── ACTIVE sub-tab:
  │   ├── SearchBar: "SEARCH CONVERSATIONS"
  │   ├── SortPills: RECENT / A-Z
  │   └── ConversationRow list
  │       └── Tap → chat/[id].tsx
  └── SAVED sub-tab:
      ├── SearchBar: "SEARCH SAVED"
      └── SavedConnectionCard list
          ├── SAY HI → introduction/[userId].tsx
          └── UNSAVE → remove

introduction/[userId].tsx             ← PROFILE DETAIL MODAL
  ├── Back arrow
  ├── Large photo
  ├── Name (uppercase)
  ├── Match description (AI-generated)
  ├── Location | Child info
  ├── Tags (coral, dot-separated)
  └── START CONVERSATION button
      └── Creates room → chat/[id].tsx

introduction/pending.tsx              ← PENDING REQUESTS
  └── List of profiles with ACCEPT / DECLINE

chat/[id].tsx                         ← 1:1 CHAT (redesigned header)
  ├── Header: [Avatar] Name [X close]
  ├── Date separator: "TODAY"
  ├── Messages
  └── Input: [📎] [text field] [SEND]
```

---

## Task Details

### Task 1: MatchProfileCard

**File:** `src/components/introductions/MatchProfileCard.tsx`

Vertical card (~160px wide) for horizontal carousel:
- Portrait photo filling card top
- Name overlaid on photo (white, serif)
- Bio text below photo (2 lines, truncated)
- Two buttons: "SAY HI!" (coral outlined) and "SAVE" (gray outlined)

```typescript
interface MatchProfileCardProps {
  profile: MatchProfile;
  onSayHi: () => void;
  onSave: () => void;
}
```

### Task 2: PendingBanner

**File:** `src/components/introductions/PendingBanner.tsx`

Horizontal banner with:
- Text: "X NEW MOMS want to say hi"
- Row of small circular avatars (first 5)
- Chevron ">" for navigation

### Task 3: ConversationRow

**File:** `src/components/introductions/ConversationRow.tsx`

List row for Active conversations:
- Circular avatar (left)
- Name (bold)
- Last message preview (truncated, gray)
- Timestamp: relative (2m ago, 1h ago) or date (11/03/25)

### Task 4: SavedConnectionCard

**File:** `src/components/introductions/SavedConnectionCard.tsx`

Larger card for Saved tab:
- Square avatar (rounded corners)
- Full name
- Mutual communities count (coral text)
- Bio/match description
- Two buttons: "SAY HI!" (coral) and "UNSAVE" (gray)

### Task 5: MomsLikeYouCarousel

**File:** `src/components/introductions/MomsLikeYouCarousel.tsx`

Horizontal FlatList of MatchProfileCards. Shows 2 cards visible with peek of next. Used on Home tab.

### Task 6: Introductions Tab

**File:** `src/app/(tabs)/introductions.tsx`

Replace placeholder. Full implementation with:
- Page header: "YOUR Introductions"
- PendingBanner (if count > 0)
- TabSwitcher: ACTIVE / SAVED with counts
- Active: SearchBar + SortPills + ConversationRow FlatList
- Saved: SearchBar + SavedConnectionCard FlatList

### Task 7: Profile Detail

**File:** `src/app/introduction/[userId].tsx`

Full-screen modal:
- ← back arrow
- Centered large photo
- Name in uppercase serif
- Match description (italic)
- Location | Child info (two-column)
- Tags as coral dot-separated text
- "START CONVERSATION" full-width button

**Tag derivation:** Map profile enums to human-readable strings.

### Task 8: Pending Requests

**File:** `src/app/introduction/pending.tsx`

List of profiles that sent intro requests:
- Profile card with photo, name, match description
- ACCEPT button → creates room, moves to Active
- DECLINE button → removes request

### Task 9: Chat Redesign

**File:** `src/app/chat/[id].tsx`

Create new or modify existing `room/[id].tsx`:
- Header: circular avatar + name + X close button (not back arrow)
- "TODAY" date separator
- Empty conversation state
- Reuse existing MessageBubble, MessageInput, MessageList

### Task 10: Introductions Service

**File:** `src/services/introductions/index.ts`

```typescript
export async function getMatchProfiles(): Promise<MatchProfile[]> { ... }
export async function getActiveConversations(): Promise<Introduction[]> { ... }
export async function getSavedConnections(): Promise<SavedConnection[]> { ... }
export async function getPendingRequests(): Promise<Introduction[]> { ... }
export async function sayHi(userId: string): Promise<Introduction> { ... }
export async function saveConnection(userId: string): Promise<void> { ... }
export async function unsaveConnection(userId: string): Promise<void> { ... }
export async function acceptIntroRequest(introId: string): Promise<string> { ... }
export async function declineIntroRequest(introId: string): Promise<void> { ... }
```

All mock for now; uses introductionsStore.

### Task 11: Mock Data

**File:** `src/utils/mockIntroductions.ts`

- 5 match profiles with photos, bios, children, tags
- 5 active conversations with last messages
- 4 saved connections with mutual communities
- 3 pending intro requests

---

## File Structure

```
src/
├── components/
│   └── introductions/              ← NEW FOLDER
│       ├── MatchProfileCard.tsx
│       ├── PendingBanner.tsx
│       ├── ConversationRow.tsx
│       ├── SavedConnectionCard.tsx
│       └── MomsLikeYouCarousel.tsx
├── app/
│   ├── (tabs)/
│   │   └── introductions.tsx       ← REPLACE placeholder
│   ├── introduction/               ← NEW FOLDER
│   │   ├── [userId].tsx
│   │   └── pending.tsx
│   └── chat/
│       └── [id].tsx                ← NEW (or modify room/[id].tsx)
├── services/
│   └── introductions/
│       └── index.ts                ← NEW
└── utils/
    └── mockIntroductions.ts        ← NEW
```

---

## Verification Checklist

- [ ] Introductions tab shows Active/Saved tabs
- [ ] Active tab lists mock conversations with avatars and timestamps
- [ ] Saved tab shows profile cards with SAY HI and UNSAVE
- [ ] Tapping SAY HI opens profile detail modal
- [ ] Profile detail shows photo, name, bio, location, tags
- [ ] START CONVERSATION opens chat screen
- [ ] Chat screen has redesigned header (avatar + name + X)
- [ ] Pending banner shows count and avatar row
- [ ] Tapping pending banner opens pending requests screen
- [ ] ACCEPT/DECLINE buttons work
- [ ] SAVE on a profile card shows Toast notification
- [ ] Search filters conversations by name
- [ ] Sort toggles between Recent and A-Z
- [ ] `yarn type-check` passes
