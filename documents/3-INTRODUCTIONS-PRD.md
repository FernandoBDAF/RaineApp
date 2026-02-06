# Introductions - Product Requirements Document

**Feature:** Introductions (Social Discovery & 1:1 Connections)  
**Date:** February 6, 2026  
**Status:** Design Complete, Implementation Pending  
**Source:** 8 UI screenshots from product owner

---

## 1. Feature Overview

**Introductions** is the social discovery engine of Raine. It surfaces recommended mom profiles based on shared attributes (location, children's ages, interests, parenting philosophy), allows users to **save** profiles for later or **say hi** to start a 1:1 conversation. Once connected, the conversation lives as a private chat thread.

The feature spans two areas:
1. **Home Tab** → "Moms Like You" section (discovery carousel)
2. **Introductions Tab** → Full management of connections (active chats + saved profiles)

---

## 2. User Flows

### 2.1 Flow A: Discover → Save (from Home)

```
Home Tab
  └── "MOMS LIKE YOU" section (horizontal scroll)
        └── Profile Card [Brooke]
              └── Tap "SAVE" button
                    └── Toast appears: "Brooke saved! Find her in your Saved connections"
                          └── Profile moves to Introductions → Saved tab
```

**Interaction Details:**
- Toast appears at top of screen, overlaying content
- Toast has a coral/salmon border (brand color)
- Toast auto-dismisses after ~3 seconds
- The card remains in the carousel (user can still Say Hi later)
- "SAVED TIPS" counter in Activity Dashboard does NOT increment (that's for Drops)

---

### 2.2 Flow B: Discover → Say Hi → Profile → Start Conversation (from Home)

```
Home Tab
  └── "MOMS LIKE YOU" section (horizontal scroll)
        └── Profile Card [Natalie]
              └── Tap "SAY HI!" button
                    └── Profile Detail Modal opens (full screen)
                          │  Shows: Photo, Name, Bio, Location, Child info, Tags
                          └── Tap "START CONVERSATION" button
                                └── 1:1 Chat Screen opens
                                      │  Shows: Header (avatar + name + X close)
                                      │  Shows: "TODAY" date separator
                                      │  Shows: Message input (attachment + text + SEND)
                                      └── Conversation is now "Active" in Introductions tab
```

**Interaction Details:**
- "SAY HI!" button is coral/salmon with white text (primary action)
- Profile Detail is a full-screen modal with back arrow (←) at top-left
- "START CONVERSATION" button is outlined coral with chat icon
- Chat screen has X (close) button at top-right (not back arrow)
- Chat shows "TODAY" as first date separator
- No auto-generated ice-breaker message (empty conversation)

---

### 2.3 Flow C: Manage Active Conversations (Introductions Tab)

```
Introductions Tab
  └── Header: "YOUR Introductions"
  └── Pending Banner: "8 NEW MOMS want to say hi" [avatar row] [>]
  └── Tab Switcher: [ACTIVE (5)] [SAVED (4)]
        └── ACTIVE tab selected
              └── Search bar: "SEARCH CONVERSATIONS"
              └── Sort pills: [RECENT] [A-Z]
              └── Conversation List:
                    ├── Isabella C.  │ "That sounds amazing! When ar..." │ 2m ago
                    ├── Sophia L.    │ "Absolutely! Let's schedule som..."│ 1h ago
                    ├── Isla M.      │ "That sounds amazing! When ar..." │ 3h ago
                    ├── Olivia R.    │ "That sounds amazing! When ar..." │ 11/03/25
                    └── Emma W.      │ "That sounds amazing! When ar..." │ 10/29/25
              └── Tap any row → Opens 1:1 Chat Screen
```

**Interaction Details:**
- "8 NEW MOMS want to say hi" is a tappable banner with small circular avatars
- Tapping ">" on the banner opens the pending requests review
- "ACTIVE (5)" and "SAVED (4)" are tab switches with count in parentheses
- Active tab is underlined with coral color when selected
- Search bar filters the conversation list by name
- Sort pills: "RECENT" (default, coral outlined) and "A-Z" (gray outlined)
- Each row shows: avatar (circular), name (bold), last message preview (truncated), relative timestamp
- Timestamps: relative for recent (2m ago, 1h ago, 3h ago), date format for older (11/03/25)

---

### 2.4 Flow D: Manage Saved Connections (Introductions Tab)

```
Introductions Tab
  └── Tab Switcher: [ACTIVE (5)] [SAVED (4)]
        └── SAVED tab selected
              └── Search bar: "SEARCH SAVED"
              └── Saved Profile Cards:
                    ├── Nicole Wall  │ 2 mutual communities │ Bio │ [SAY HI!] [UNSAVE]
                    ├── Brooke Chen  │ 2 mutual communities │ Bio │ [SAY HI!] [UNSAVE]
                    └── Natalie      │ 1 mutual communities │ Bio │ [SAY HI!] [UNSAVE]
              └── Tap "SAY HI!" → Opens Profile Detail → Start Conversation
              └── Tap "UNSAVE" → Removes from saved list
```

**Interaction Details:**
- Saved cards are larger than active rows (card layout, not list layout)
- Each card shows: avatar (square with rounded corners), full name, mutual community count (coral text), bio/description text, two action buttons
- "mutual communities" text is coral colored (e.g., "2 mutual communities")
- Bio text is the matching reason (e.g., "You both have toddlers and share an interest in mindful parenting.")
- "SAY HI!" button: coral outlined (primary action)
- "UNSAVE" button: gray outlined (secondary action)
- Some "SAY HI!" buttons appear filled coral (suggesting the user already initiated or it's hovered/pressed state)

---

### 2.5 Flow E: Pending Intro Requests

```
Introductions Tab
  └── Pending Banner: "8 NEW MOMS want to say hi" [avatar row] [>]
        └── Tap → Opens Pending Requests Screen (NOT shown in screenshots)
              └── Expected: List of profiles who sent intro requests
              └── Actions: Accept (start conversation) / Decline / Save for later
```

**Note:** This screen was not provided. The pending requests flow needs design clarification.

---

## 3. Screen-by-Screen Specification

### 3.1 Home → "Moms Like You" Section

**Location:** Home tab, scrollable section below Activity Dashboard

**Layout:**
```
┌─────────────────────────────────────────────┐
│  MOMS LIKE YOU                              │
│  ─────────────── (coral horizontal rule)    │
│                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──── │
│  │              │  │              │  │      │
│  │    [Photo]   │  │    [Photo]   │  │      │
│  │   "Amanda"   │  │   "Brooke"   │  │      │
│  │              │  │              │  │      │
│  └──────────────┘  └──────────────┘  └──── │
│  Bio preview text   Bio preview text        │
│  [SAY HI!] [SAVE]  [SAY HI!] [SAVE]       │
└─────────────────────────────────────────────┘
         ← Horizontal scroll →
```

**Profile Card Specifications:**

| Element | Style | Details |
|---------|-------|---------|
| Container | ~160px wide, no border | Cards side by side with ~16px gap |
| Photo | Square/portrait, fills card width | ~160x200px, covers top portion |
| Name | White text, large serif/display font | Overlaid on photo, top-left or centered |
| Bio text | Dark gray, 2 lines, below photo | Truncated with ellipsis if longer |
| "SAY HI!" button | Coral outlined, uppercase, small | Left-aligned button |
| "SAVE" button | Gray outlined, uppercase, small | Right of "SAY HI!" |

**Carousel Behavior:**
- Horizontal scroll, ~2 cards visible at a time
- Cards extend beyond screen edge (peek of next card visible)
- Shows recommended profiles from the matching engine
- Scroll is continuous (not paginated/snapping)

**Bio Text Observed:**
- "Shares your Montessori philosophy and navigating toddler food allergies"
- "Both tech-world moms with toddlers by your side"
- "Fellow new mom exploring babywearing and gentle routines together"
- "tech-world moms navigating deadlines with toddlers by your side"

**Key Insight:** Bio descriptions are generated/written in second person addressing the current user, explaining what they have in common with the recommended mom. This is likely **AI-generated** based on both users' profile data.

---

### 3.2 Save Confirmation Toast

**Trigger:** User taps "SAVE" on a profile card

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Name] saved!                          │
│  Find her in your Saved connections     │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Style |
|---------|-------|
| Position | Top of screen, overlaying content |
| Border | Coral/salmon color, thin |
| Background | White |
| Text line 1 | Bold, black: "{Name} saved!" |
| Text line 2 | Regular, gray: "Find her in your Saved connections" |
| Duration | Auto-dismiss ~3 seconds |
| Animation | Slide down from top, slide up to dismiss |
| Interaction | Tappable (navigates to Introductions → Saved) or dismissible |

---

### 3.3 Profile Detail Modal (Say Hi Confirmation)

**Trigger:** User taps "SAY HI!" on a profile card

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← (back arrow)                         │
│                                          │
│           ┌──────────────┐               │
│           │              │               │
│           │    [Photo]   │               │
│           │              │               │
│           └──────────────┘               │
│                                          │
│           NATALIE                         │
│                                          │
│   Shares your Montessori philosophy      │
│   and navigating toddler food allergies  │
│                                          │
│     San Francisco │ Mom to Emma          │
│                   │ 18 months            │
│                                          │
│  Montessori · Gentle Parenting · Food... │
│                                          │
│   ┌─────────────────────────────────┐    │
│   │  💬  START CONVERSATION         │    │
│   └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Style | Details |
|---------|-------|---------|
| Navigation | ← back arrow, top-left | Returns to previous screen (Home) |
| Photo | Centered, large (~250px width) | Portrait/square, rounded corners |
| Name | Bold, large, uppercase, serif font | Centered, black text |
| Bio | Regular, centered, gray | 2 lines, matching description |
| Location + Child info | Two columns separated by vertical bar | Left: city, Right: child name + age |
| Tags | Coral text, dot-separated | Interests/topics derived from profile |
| "START CONVERSATION" | Full-width button, coral outlined | Chat bubble icon (💬) + uppercase text |
| Background | White, full screen | No scroll needed (content fits) |

**Data Displayed:**

| Field | Source | Example |
|-------|--------|---------|
| Photo | Target user's `photoURL` | Profile photo |
| Name | Target user's `firstName` (uppercase) | "NATALIE" |
| Bio | AI-generated matching description | "Shares your Montessori philosophy..." |
| Location | Target user's `city` | "San Francisco" |
| Child info | Target user's `children[]` | "Mom to Emma 18 months" |
| Tags | Derived from profile setup answers | "Montessori · Gentle Parenting · Food Allergies" |

**Tag Derivation Logic:**
Tags appear to be extracted from:
- `beforeMotherhood` answers
- `perfectWeekend` answers
- `momFriendStyle` answers
- `aesthetic` answers
- Children's specific needs/experiences (food allergies, gentle parenting)

This likely requires a mapping from profile enum values to human-readable tag strings.

---

### 3.4 1:1 Chat Screen

**Trigger:** User taps "START CONVERSATION" from Profile Detail

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Avatar] Brooke                     X  │
│  ─────────────── (coral line)           │
│                                          │
│              TODAY                        │
│                                          │
│                                          │
│        (empty conversation)              │
│                                          │
│                                          │
│                                          │
│  ─────────────────────────────────────── │
│  📎  Type a message...          SEND    │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Style | Details |
|---------|-------|---------|
| Header | Avatar (small, circular) + Name (bold) + X button | Fixed top bar |
| Separator | Coral horizontal line below header | Brand color accent |
| Date separator | "TODAY" centered, light gray, small caps | Groups messages by date |
| Message area | White, scrollable | Empty when conversation starts |
| Input bar | Fixed bottom | Attachment icon (📎), text input, "SEND" button |
| Close button | X icon, top-right | Closes chat, returns to previous screen |

**Differences from existing `room/[id].tsx`:**
- Header shows **avatar + name + X** (current chat has no avatar in header)
- Close button is **X** (not back arrow ←)
- **Coral separator line** below header (brand accent)
- **Date separators** ("TODAY") instead of just message timestamps
- **Attachment icon** (📎) in input bar (current doesn't have this)

**Reuse Opportunity:** The existing `room/[id].tsx` chat screen and components (`MessageBubble`, `MessageInput`, `MessageList`) can be adapted. Main changes:
1. Update header to show avatar + name + close button
2. Add date separators to message list
3. Add attachment icon to input (functionality can be deferred)

---

### 3.5 Introductions Tab - Active Conversations

**Location:** Second bottom tab ("Introductions")

**Layout:**
```
┌─────────────────────────────────────────┐
│  Raine (logo)                     👤    │
│                                          │
│  YOUR                                    │
│  Introductions                           │
│  ─────────────── (coral line)           │
│                                          │
│  8  NEW MOMS          [👩👩👩] +5 more > │
│     want to say hi                       │
│                                          │
│  [ACTIVE (5)]    SAVED (4)              │
│  ────────────                            │
│                                          │
│  🔍 SEARCH CONVERSATIONS                │
│                                          │
│  [RECENT]  [A-Z]                        │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ 👩 Isabella C.          2m ago   │   │
│  │    That sounds amazing! When ar..│   │
│  ├──────────────────────────────────┤   │
│  │ 👩 Sophia L.            1h ago   │   │
│  │    Absolutely! Let's schedule... │   │
│  ├──────────────────────────────────┤   │
│  │ 👩 Isla M.              3h ago   │   │
│  │    That sounds amazing! When ar..│   │
│  ├──────────────────────────────────┤   │
│  │ 👩 Olivia R.          11/03/25   │   │
│  │    That sounds amazing! When ar..│   │
│  ├──────────────────────────────────┤   │
│  │ 👩 Emma W.            10/29/25   │   │
│  │    That sounds amazing! When ar..│   │
│  └──────────────────────────────────┘   │
│                                          │
│  🏠 Home  👥 Intros  💬 Comm  📄 Drops │
└─────────────────────────────────────────┘
```

**Header Section:**

| Element | Style | Details |
|---------|-------|---------|
| App logo | "Raine" script font, centered | Same as Home tab |
| Profile icon | Top-right, person silhouette | Navigate to profile/settings |
| "YOUR" | Small, uppercase, coral text | Label above title |
| "Introductions" | Large, serif font, black | Page title |
| Coral line | Full-width below title | Brand accent separator |

**Pending Intro Requests Banner:**

| Element | Style | Details |
|---------|-------|---------|
| Count | Large number (8), serif, dark red/coral | Left-aligned |
| Label | "NEW MOMS" (uppercase, small, gray) + "want to say hi" (italic) | Right of number |
| Avatar row | 3 small circular avatars | Right side, overlapping slightly |
| "+5 more" | Small text above avatars | Overflow count |
| Chevron | ">" arrow, right-aligned | Tappable, opens pending list |

**Tab Switcher:**

| Element | Style | Details |
|---------|-------|---------|
| Active tab | Coral text, coral underline | "ACTIVE (5)" |
| Inactive tab | Gray text, no underline | "SAVED (4)" |
| Counts | In parentheses | Dynamic counts |

**Search Bar:**

| Element | Style | Details |
|---------|-------|---------|
| Container | Full-width, rounded, light gray border | Below tab switcher |
| Icon | 🔍 magnifying glass, left | Search icon |
| Placeholder | "SEARCH CONVERSATIONS" (uppercase) | Filters list by name |

**Sort Pills:**

| Element | Style | Details |
|---------|-------|---------|
| "RECENT" | Coral outlined pill (active) | Sorts by last message time |
| "A-Z" | Gray outlined pill | Sorts alphabetically by name |

**Conversation Row:**

| Element | Style | Details |
|---------|-------|---------|
| Avatar | Circular, ~48px | Left-aligned |
| Name | Bold, black, first name + last initial | Right of avatar |
| Timestamp | Gray, right-aligned | Relative (2m ago) or date (11/03/25) |
| Last message | Gray, single line, truncated | Below name, max ~30 chars visible |
| Separator | Light gray horizontal line | Between rows |
| Row height | ~72px | Comfortable tap target |
| Tap action | Navigate to 1:1 chat | Opens chat with this user |

**Timestamp Format:**
- < 1 hour: "Xm ago"
- < 24 hours: "Xh ago"
- < 7 days: "Xd ago"
- Older: "MM/DD/YY"

---

### 3.6 Introductions Tab - Saved Connections

**Same screen as 3.5 but with SAVED tab selected:**

**Layout differences from Active tab:**

| Element | Active Tab | Saved Tab |
|---------|-----------|-----------|
| Tab highlight | "ACTIVE (5)" coral | "SAVED (4)" coral |
| Search placeholder | "SEARCH CONVERSATIONS" | "SEARCH SAVED" |
| Sort pills | Present (RECENT, A-Z) | **Not shown** |
| List format | Compact conversation rows | **Full profile cards** |
| Actions per item | Tap → chat | "SAY HI!" + "UNSAVE" buttons |

**Saved Profile Card:**

```
┌─────────────────────────────────────────┐
│  [Avatar]  Nicole Wall                   │
│            2 mutual communities          │
│            You both have toddlers and    │
│            share an interest in mindful  │
│            parenting.                    │
│                                          │
│  [  SAY HI!  ]  [  UNSAVE  ]           │
└─────────────────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Card | Full-width, coral/gray border, rounded | Card layout (not row) |
| Avatar | Square with rounded corners, ~64px | Left-aligned |
| Name | Bold, black, full name | "Nicole Wall", "Brooke Chen" |
| Mutual count | Coral text, small | "2 mutual communities" |
| Description | Gray text, 2-3 lines | AI-generated matching reason |
| "SAY HI!" | Coral outlined button | Primary action → Profile Detail |
| "UNSAVE" | Gray outlined button | Secondary action → removes from saved |
| Spacing | ~16px between cards | Vertical list, scrollable |

**Key Observation:** The "SAY HI!" button on Brooke Chen's card appears to be **filled coral** (not outlined) while others are outlined. This could indicate:
- A hover/pressed state
- That the user already tapped "SAY HI!" for Brooke (intro request sent)
- A design inconsistency

This needs clarification from the design team.

---

## 4. Data Model

### 4.1 Introduction (Connection Request)

**Collection:** `introductions/{introId}`

```typescript
interface Introduction {
  id: string;
  fromUserId: string;          // User who initiated
  toUserId: string;            // User who received
  status: IntroductionStatus;
  createdAt: Timestamp;
  respondedAt?: Timestamp;     // When accepted/declined
  lastMessageAt?: Timestamp;   // For sorting active conversations
  roomId?: string;             // Created when conversation starts
}

type IntroductionStatus =
  | 'pending'      // "Say Hi" sent, awaiting response
  | 'active'       // Conversation started (both users engaged)
  | 'saved'        // User saved profile for later (no request sent yet)
  | 'declined'     // Recipient declined
  | 'expired';     // Auto-expired after X days without response
```

### 4.2 Saved Connection

**Collection:** `users/{userId}/savedConnections/{targetUserId}`

```typescript
interface SavedConnection {
  targetUserId: string;
  savedAt: Timestamp;
  mutualCommunities: number;    // Cached count
  matchDescription: string;     // AI-generated "why you match" text
}
```

### 4.3 Matching Profile (Computed)

**Not stored - computed by recommendation engine:**

```typescript
interface MatchedProfile {
  userId: string;
  firstName: string;
  photoURL: string;
  city: string;
  children: { name: string; ageMonths: number }[];
  matchDescription: string;     // AI-generated: "Shares your Montessori philosophy..."
  matchTags: string[];          // ["Montessori", "Gentle Parenting", "Food Allergies"]
  matchScore: number;           // Internal ranking score (not shown to user)
  mutualCommunities: number;
}
```

### 4.4 Activity Counts (Home Dashboard)

```typescript
interface ActivityCounts {
  introRequests: number;       // Pending intros FROM others TO current user
  unreadMessages: number;      // Unread messages across all active conversations
  savedTips: number;           // Saved drops/articles count
  questionResponses: number;   // Unread community Q&A replies
}
```

---

## 5. Component Architecture

### 5.1 New Components Needed

| Component | Location | Purpose |
|-----------|----------|---------|
| `MomsLikeYouCarousel` | `components/introductions/` | Horizontal scroll of profile cards |
| `MomProfileCard` | `components/introductions/` | Single profile card (photo, name, bio, actions) |
| `MomProfileDetail` | `components/introductions/` | Full profile modal (photo, name, bio, location, child, tags, CTA) |
| `SaveConfirmationToast` | `components/ui/` | Toast notification for save action |
| `IntroRequestBanner` | `components/introductions/` | "8 NEW MOMS want to say hi" banner |
| `TabSwitcher` | `components/ui/` | Generic two-tab switch (Active/Saved) |
| `ConversationRow` | `components/introductions/` | Active conversation list item |
| `SavedConnectionCard` | `components/introductions/` | Saved profile card with actions |
| `SortPills` | `components/ui/` | Sort option pills (Recent, A-Z) |
| `SearchBar` | `components/ui/` | Reusable search input |
| `SectionHeader` | `components/ui/` | "MOMS LIKE YOU" with coral underline |
| `ActivityDashboard` | `components/home/` | Four activity counters |
| `ActivityCounter` | `components/home/` | Single counter (number + label) |
| `ChatHeader` | `components/chat/` | Avatar + Name + Close button (updated header) |
| `DateSeparator` | `components/chat/` | "TODAY" date label in chat |
| `MatchTag` | `components/introductions/` | Coral-colored tag pill |

### 5.2 Modified Components

| Component | Changes |
|-----------|---------|
| `MessageInput` | Add attachment icon (📎) left of text input |
| `MessageList` | Add date separators between message groups |
| `(tabs)/_layout.tsx` | Change from 3 tabs to 4 tabs with new icons/names |

### 5.3 New Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Home Dashboard | `(tabs)/index.tsx` | **REWRITE** - Activity + Moms Like You + Communities + Drops preview |
| Introductions Main | `(tabs)/introductions.tsx` | Active/Saved tab management |
| Profile Detail | `introduction/[userId].tsx` | Full profile modal with "Start Conversation" |
| Pending Requests | `introductions/pending.tsx` | Review incoming intro requests |

---

## 6. Design System Observations

### 6.1 Typography

| Usage | Font | Weight | Size | Color |
|-------|------|--------|------|-------|
| Page title ("Introductions") | Serif (likely Playfair Display or similar) | Regular | ~32px | Black |
| Section header ("MOMS LIKE YOU") | Sans-serif | Bold | ~14px, uppercase, letter-spaced | Coral (#E8613C approx) |
| Card name (overlay on photo) | Serif/Display | Regular | ~24px | White (with shadow) |
| Card name (in list) | Sans-serif | Bold | ~16px | Black |
| Body text / bio | Sans-serif | Regular | ~14px | Dark gray (#666) |
| Button text | Sans-serif | Medium | ~12px, uppercase, letter-spaced | Coral or Gray |
| Counter number | Serif | Regular/Italic | ~24px | Dark red/coral |
| Counter label | Sans-serif | Regular | ~10px, uppercase, letter-spaced | Dark gray |
| Timestamp | Sans-serif | Regular | ~12px | Gray (#999) |
| Mutual communities | Sans-serif | Regular | ~12px | Coral |

### 6.2 Colors

| Name | Hex (approx) | Usage |
|------|-------------|-------|
| Coral/Salmon | #E8613C | Primary accent: buttons, headers, links, active tabs |
| Black | #1A1A1A | Primary text, Apple-style elements |
| Dark Gray | #666666 | Body text, descriptions |
| Light Gray | #999999 | Timestamps, secondary text |
| Border Gray | #E5E5E5 | Card borders, separators, inactive elements |
| White | #FFFFFF | Backgrounds |

### 6.3 Spacing

| Element | Value |
|---------|-------|
| Screen horizontal padding | 16-24px |
| Card gap (horizontal scroll) | 12-16px |
| Section vertical spacing | 24-32px |
| Card internal padding | 12-16px |
| Button padding | 12px vertical, 24px horizontal |
| List row height | ~72px |
| Avatar size (list) | 48px circular |
| Avatar size (card) | 64px rounded square |

---

## 7. Backend Requirements

### 7.1 New Cloud Functions Needed

| Function | Type | Purpose |
|----------|------|---------|
| `getRecommendedProfiles` | Callable | Returns matched profiles for "Moms Like You" |
| `saveConnection` | Callable | Save a profile to user's saved list |
| `unsaveConnection` | Callable | Remove from saved list |
| `sendIntroRequest` | Callable | Initiate "Say Hi" → creates intro + notification |
| `respondToIntro` | Callable | Accept/decline pending intro request |
| `getActivityCounts` | Callable | Return aggregated activity counters |
| `generateMatchDescription` | Internal | AI-generated match reason text |

### 7.2 New Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `introductions/{id}` | Introduction records (pending, active, declined) |
| `users/{uid}/savedConnections/{targetId}` | Saved profiles |
| `users/{uid}/matchCache/{targetId}` | Cached match descriptions + scores |

### 7.3 New Triggers

| Trigger | Event | Action |
|---------|-------|--------|
| `onIntroCreated` | New intro request | Send push notification to recipient |
| `onIntroAccepted` | Intro accepted | Create 1:1 chat room, notify sender |

### 7.4 Matching Algorithm Requirements

The recommendation engine needs to score users based on:

| Factor | Weight | Source |
|--------|--------|--------|
| Same city/area | High | `city`, `state`, `county` |
| Similar children ages | High | `children[].birthMonth/Year` |
| Shared interests | Medium | `beforeMotherhood`, `perfectWeekend` |
| Compatible friend style | Medium | `momFriendStyle` |
| Similar aesthetic | Low | `aesthetic` |
| Same "what brought you" | Medium | `whatBroughtYou` |
| Both expecting | High (if applicable) | `isExpecting`, `dueDate` |

The match description ("Shares your Montessori philosophy and navigating toddler food allergies") needs to be **AI-generated** based on the shared attributes between two profiles.

---

## 8. Open Questions

### From Screenshots (Unresolved)

1. **Pending requests screen:** What does "8 NEW MOMS want to say hi" expand to? Is it a list of profiles with Accept/Decline? A carousel?

2. **Intro without profile detail:** Can a user "SAY HI!" directly from the card (skipping profile detail)? Or does "SAY HI!" always open the profile first?

3. **Filled vs outlined "SAY HI!" button:** On the Saved tab, Brooke Chen's "SAY HI!" appears filled coral while others are outlined. Does this indicate the request was already sent?

4. **Conversation creation:** When "START CONVERSATION" is tapped, is a chat room created immediately? Or only after the first message is sent?

5. **Mutual communities count:** Is this real-time? Cached? How is it computed (both users are members of the same community)?

6. **Match description source:** Are these AI-generated per user pair? Pre-computed? Templated from shared attributes?

7. **Refresh frequency:** How often does the "Moms Like You" carousel refresh? On every Home tab visit? Pull-to-refresh? Background update?

8. **Profile card actions without account:** What happens if an unauthenticated user (should never happen given auth flow) tries to interact?

---

## 9. Implementation Priority

### MVP (Launch)
1. Home → "Moms Like You" carousel with static/simple matching
2. Save + Say Hi flows (complete interaction chain)
3. Introductions tab with Active and Saved views
4. 1:1 chat (adapt existing room/[id].tsx)
5. Activity counters on Home

### Post-MVP
6. AI-generated match descriptions
7. Advanced matching algorithm
8. Pending intro requests management screen
9. Search and sort within Introductions
10. Attachment support in chat

---

**Document Version:** 1.0  
**Source Assets:** 8 screenshots stored in `.cursor/projects/*/assets/`  
**Next:** Awaiting Communities tab and Drops tab screenshots
