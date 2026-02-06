# Communities - Product Requirements Document

**Feature:** Communities (Group Discussions for Moms)  
**Date:** February 6, 2026  
**Status:** Design Complete, Implementation Pending  
**Source:** 3 UI screenshots from product owner + verbal description

---

## 1. Feature Overview

**Communities** are curated micro-groups that connect moms with shared contexts - same city, similar-aged children, or common experiences. Unlike Introductions (1:1 connections), Communities are group spaces centered around **threaded discussions** where moms ask questions, share recommendations, and support each other.

The feature spans two areas:
1. **Home Tab** → "Communities" section (vertical list preview, categorized)
2. **Communities Tab** → Full browsing, community detail, and threaded discussions

---

## 2. User Flows

### 2.1 Flow A: Discover Community from Home → Open Detail

```
Home Tab
  └── Scroll to "COMMUNITIES" section
        └── Categorized vertical list:
              ├── "BASED ON YOUR LOCATION" → SF Moms (156 members)
              ├── "BASED ON YOUR CHILD'S BIRTH DATE" → Expecting Moms (145 members)
              └── "BASED ON YOUR EXPERIENCES" → Sensitive Skin Society (12 members)
        └── Tap community card
              └── Community Detail page opens
```

---

### 2.2 Flow B: Community Detail → Join Conversation (Browse Only)

```
Community Detail
  └── View header (hero photo, name badge, description)
  └── View member count + avatar row
  └── View "NOTEWORTHY" posts carousel
  └── Tap "JOIN CONVERSATION" button
        └── Community Timeline opens (browse mode, no post created)
```

---

### 2.3 Flow C: Community Detail → Ask a Question (Creates Post)

```
Community Detail
  └── "ASK THE MOMS WHO GET IT" section
        └── Type question in "What's on your mind?" input
              └── Tap send button (coral arrow)
                    └── Community Timeline opens
                          └── New post created from the question
                          └── Post appears in timeline
```

---

### 2.4 Flow D: Community Timeline → Read & Reply to Posts

```
Community Timeline
  └── Search bar: "SEARCH MESSAGES"
  └── Post list (chronological, newest first):
        ├── Post by Sarah M. (2:34 PM)
        │     "Anyone have recommendations for a pediatric dermatologist?"
        │     ├── Reply link → toggle "Hide 3 replies" / "Show 3 replies"
        │     └── Replies (threaded, indented):
        │           ├── Jessica L. (2:41 PM) - recommendation
        │           ├── Amanda K. (2:45 PM) - follow-up question
        │           └── Sarah M. (2:52 PM) - thank you + follow-up
        ├── Post by Emily R. (3:01 PM)
        │     "Aveeno Baby Eczema Therapy is our go-to!"
        │     └── Reply link
        └── Post by Maria T. (3:15 PM)
              "Quick question - anyone else dealing with eczema and food allergies?"
              ├── Reply link → "Hide 1 reply"
              └── Reply: Jessica L. (3:22 PM)
  └── Bottom input: "Share your thoughts..." + send button
  └── Footer: "Be kind · Be helpful · We're all in this together"
```

---

## 3. Screen-by-Screen Specification

### 3.1 Home → "Communities" Section

**Location:** Home tab, scrollable section below "Moms Like You"

**Layout:**
```
┌─────────────────────────────────────────────┐
│  COMMUNITIES                                │
│  ─────────────── (coral horizontal rule)    │
│                                              │
│  BASED ON YOUR LOCATION                      │
│  ┌─────────────────────────────────────────┐│
│  │ ┌────────────┐  Connect with fellow...  ││
│  │ │            │  San Francisco moms in   ││
│  │ │  [Photo]   │  your city. Share local  ││
│  │ │  LOCATION  │  recommendations,...     ││
│  │ │            │                          ││
│  │ │  SF Moms   │  156 members       >     ││
│  │ └────────────┘                          ││
│  └─────────────────────────────────────────┘│
│                                              │
│  BASED ON YOUR CHILD'S BIRTH DATE           │
│  ┌─────────────────────────────────────────┐│
│  │ ┌────────────┐  Counting down the ...   ││
│  │ │  [Photo]   │  Prep, planning, and     ││
│  │ │   AGE      │  all the pregnancy ...   ││
│  │ │ Expecting  │                          ││
│  │ │   Moms     │  145 members       >     ││
│  │ └────────────┘                          ││
│  └─────────────────────────────────────────┘│
│                                              │
│  BASED ON YOUR EXPERIENCES                  │
│  ┌─────────────────────────────────────────┐│
│  │ ┌────────────┐  Moms managing eczema,   ││
│  │ │  [Photo]   │  flare-ups, allergies,   ││
│  │ │ EXPERIENCE │  skincare routines and   ││
│  │ │ Sensitive  │  everyday soothing ...   ││
│  │ │   Skin     │                          ││
│  │ │ Society    │  12 members        >     ││
│  │ └────────────┘                          ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

**Section Header:**

| Element | Style | Details |
|---------|-------|---------|
| "COMMUNITIES" | Coral, uppercase, serif/display, letter-spaced | Same style as "MOMS LIKE YOU" |
| Coral line | Full-width, below header | Brand accent separator |

**Category Labels:**

| Element | Style | Details |
|---------|-------|---------|
| Text | Gray, uppercase, small, sans-serif, letter-spaced | "BASED ON YOUR LOCATION" |
| Position | Above each community card | Category grouping |

**Community Card (Home Preview):**

```
┌────────────────────────────────────────┐
│ ┌──────────┐                           │
│ │          │  Description text that    │
│ │  Cover   │  wraps to 2-3 lines...   │
│ │  Photo   │                           │
│ │ [BADGE]  │  XX members         >     │
│ │          │                           │
│ │  Name    │                           │
│ └──────────┘                           │
└────────────────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Card | Full-width, horizontal layout (photo left, text right) | Thin border or shadow |
| Cover photo | ~160px width, full card height | Left side, with overlay elements |
| Category badge | Coral background, white uppercase text | Top-left of photo: "LOCATION", "AGE", "EXPERIENCE" |
| Community name | White, serif/italic, bottom-left of photo | Overlaid on photo with shadow |
| Description | Dark gray, regular, 2-3 lines | Right of photo, truncated with "..." |
| Member count | Coral text, small | "156 members", "145 members", "12 members" |
| Chevron | Gray ">" arrow | Right edge, indicates tappable |
| Tap action | Navigate to Community Detail | Full card is tappable |

**Communities Observed:**

| Community | Category | Badge | Members | Description |
|-----------|----------|-------|---------|-------------|
| SF Moms | Location | LOCATION | 156 | "Connect with fellow San Francisco moms in your city. Share local recommendations, meetup spots,..." |
| Expecting Moms | Birth Date | AGE | 145 | "Counting down the weeks together. Prep, planning, and all the pregnancy feels." |
| Sensitive Skin Society | Experiences | EXPERIENCE | 12 | "Moms managing eczema, flare-ups, allergies, skincare routines and everyday soothing solutions" |

**Key Insight:** Communities are **recommended based on user profile data**:
- Location communities match user's `city`/`state`
- Birth date communities match `isExpecting`/`children[].birthYear`
- Experience communities match profile interests and specific situations

---

### 3.2 Community Detail Page

**Trigger:** Tap a community card from Home or Communities tab

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← (back arrow over hero image)             │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │         [Hero Cover Photo]           │   │
│  │           (full width)               │   │
│  │                                      │   │
│  │       ┌──────────────────┐           │   │
│  │       │    SF Moms       │           │   │
│  │       └──────────────────┘           │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Connect with fellow San Francisco moms     │
│  in your city. Share local recommendations, │
│  meetup spots, and navigate city parenting  │
│  together.                                   │
│                                              │
│              156 MEMBERS                     │
│         👩👩👩👩👩  +151 more               │
│                                              │
│  ─── NOTEWORTHY ────                        │
│                                              │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ 👩 Sarah M.      │ │ "The cha...      │  │
│  │                   │ │  now..."          │  │
│  │ "Tubby Todd      │ │                   │  │
│  │  literally saved  │ │                   │  │
│  │  us. Three weeks  │ │                   │  │
│  │  of clear skin    │ │                   │  │
│  │  after months of  │ │                   │  │
│  │  struggle."       │ │                   │  │
│  │                   │ │                   │  │
│  │ ♡ 24  💬 3  ⭐ 12│ │ ♡...              │  │
│  └──────────────────┘ └──────────────────┘  │
│       ← Horizontal scroll →                 │
│                                              │
│  ─── ASK THE MOMS WHO GET IT ───            │
│                                              │
│  Tap into the collective wisdom of          │
│  the moms in this micro-community.          │
│                                              │
│  ┌────────────────────────────┐ ┌───┐       │
│  │  What's on your mind?      │ │ ➤ │       │
│  └────────────────────────────┘ └───┘       │
│  Your question will be shared with the      │
│  group chat                                  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  💬  JOIN CONVERSATION               │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

**Section Breakdown:**

#### Hero Section

| Element | Style | Details |
|---------|-------|---------|
| Hero image | Full-width, ~250px height | Community cover photo with gradient overlay |
| Back arrow | White ← icon, top-left | Over the hero image, returns to previous |
| Community name badge | Coral pill/badge, centered | "SF Moms" in white text on coral background |
| Badge position | Bottom center of hero image | Overlapping hero and content below |

#### Description Section

| Element | Style | Details |
|---------|-------|---------|
| Description | Dark gray, centered, regular, ~14px | Full description (not truncated like Home) |
| Alignment | Center-aligned text | Unlike Home where it's left-aligned |

#### Members Section

| Element | Style | Details |
|---------|-------|---------|
| Count | Coral text, uppercase, letter-spaced, centered | "156 MEMBERS" |
| Avatar row | 5 circular overlapping avatars, left to right | ~32px each, overlap ~8px |
| Overflow | Gray text, after avatars | "+151 more" |
| Tap action | Could navigate to full member list | Not confirmed |

#### Noteworthy Section

| Element | Style | Details |
|---------|-------|---------|
| Section header | Coral text, uppercase, small | "NOTEWORTHY" |
| Layout | Horizontal scroll of post cards | ~2 cards visible |

**Noteworthy Post Card:**

```
┌────────────────────────────┐
│  👩 Sarah M.               │
│                             │
│  "Tubby Todd literally     │
│  saved us. Three weeks of  │
│  clear skin after months   │
│  of struggle."              │
│                             │
│  ♡ 24   💬 3   ⭐ 12      │
└────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Card | ~260px width, rounded corners, light border | Scrollable horizontally |
| Author | Avatar (small circular) + name (bold) | Top of card |
| Quote text | Italic, serif-like, dark text | Body of the card, quoted style |
| Engagement row | Gray icons + counts, bottom | ♡ likes, 💬 comments, ⭐ saves |

**Engagement Icons:**

| Icon | Meaning | Observed Values |
|------|---------|----------------|
| ♡ (heart) | Likes | 24 |
| 💬 (speech bubble with line) | Comments/replies | 3 |
| ⭐ (star/sparkle) | Saves/bookmarks | 12 |

#### Ask the Moms Section

| Element | Style | Details |
|---------|-------|---------|
| Section header | Coral text, uppercase | "ASK THE MOMS WHO GET IT" |
| Subtext | Italic, gray, centered | "Tap into the collective wisdom of the moms in this micro-community." |
| Input | Text field "What's on your mind?" + coral send button (➤) | Inline input, not modal |
| Helper text | Small gray below input | "Your question will be shared with the group chat" |
| Send action | Creates new post in community timeline, opens timeline | Post appears at top of timeline |

#### Join Conversation Button

| Element | Style | Details |
|---------|-------|---------|
| Button | Full-width, coral outlined, rounded | With chat bubble icon (💬) |
| Text | "JOIN CONVERSATION", uppercase, coral, letter-spaced | Same style as Introductions "START CONVERSATION" |
| Action | Opens community timeline in browse mode | No post created |

---

### 3.3 Community Timeline (Group Chat / Discussion Feed)

**Trigger:** Tap "JOIN CONVERSATION" or submit question from Community Detail

**Layout:**
```
┌─────────────────────────────────────────────┐
│  🔍  SEARCH MESSAGES                        │
│  ──────────────────────────────────────────  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ 👩 Sarah M.  2:34 PM           🔖   │   │
│  │                                      │   │
│  │  Anyone have recommendations for a   │   │
│  │  pediatric dermatologist? Emma's     │   │
│  │  flare-ups are getting worse and     │   │
│  │  our current one isn't helping much. │   │
│  │                                      │   │
│  │  ↩ Reply                             │   │
│  │  🔄 Hide 3 replies                  │   │
│  │  ┌────────────────────────────────┐  │   │
│  │  │ 👩 Jessica L.  2:41 PM    🔖  │  │   │
│  │  │ │ Dr. Chen at Bay Area        │  │   │
│  │  │ │ Pediatric Dermatology is    │  │   │
│  │  │ │ amazing! She really takes   │  │   │
│  │  │ │ time to understand each     │  │   │
│  │  │ │ kid's unique triggers.      │  │   │
│  │  ├────────────────────────────────┤  │   │
│  │  │ 👩 Amanda K.  2:45 PM    🔖  │  │   │
│  │  │ │ Second Dr. Chen! Also,      │  │   │
│  │  │ │ have you tried the oatmeal  │  │   │
│  │  │ │ bath routine before bed?    │  │   │
│  │  ├────────────────────────────────┤  │   │
│  │  │ 👩 Sarah M.  2:52 PM    🔖  │  │   │
│  │  │ │ Thank you both! I'll look   │  │   │
│  │  │ │ into Dr. Chen. Amanda - we  │  │   │
│  │  │ │ haven't tried oatmeal       │  │   │
│  │  │ │ baths yet. Any specific     │  │   │
│  │  │ │ brand you recommend?        │  │   │
│  │  └────────────────────────────────┘  │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ 👩 Emily R.  3:01 PM           🔖   │   │
│  │                                      │   │
│  │  Aveeno Baby Eczema Therapy is our   │   │
│  │  go-to! The colloidal oatmeal really │   │
│  │  soothes irritated skin. We do it    │   │
│  │  every other night.                  │   │
│  │                                      │   │
│  │  ↩ Reply                             │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ 👩 Maria T.  3:15 PM           🔖   │   │
│  │                                      │   │
│  │  Quick question - anyone else        │   │
│  │  dealing with eczema and food        │   │
│  │  allergies together? Wondering if    │   │
│  │  there's a connection.               │   │
│  │                                      │   │
│  │  ↩ Reply                             │   │
│  │  🔄 Hide 1 reply                    │   │
│  │  ┌────────────────────────────────┐  │   │
│  │  │ 👩 Jessica L.  3:22 PM   🔖  │  │   │
│  │  │ │ Yes! There's actually a lot  │  │   │
│  │  │ │ of research on the atopic    │  │   │
│  │  │ │ march. Our allergist         │  │   │
│  │  │ │ mentioned dairy can be a     │  │   │
│  │  │ │ trigger.                     │  │   │
│  │  └────────────────────────────────┘  │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ──────────────────────────────────────────  │
│  ┌────────────────────────────────┐ ┌───┐   │
│  │  Share your thoughts...        │ │ ➤ │   │
│  └────────────────────────────────┘ └───┘   │
│                                              │
│  Be kind · Be helpful ·                     │
│  We're all in this together                  │
└─────────────────────────────────────────────┘
```

**Search Bar:**

| Element | Style | Details |
|---------|-------|---------|
| Container | Full-width, rounded, gray border | Fixed top or scrollable |
| Icon | 🔍 magnifying glass | Left side |
| Placeholder | "SEARCH MESSAGES", uppercase | Searches within post text and replies |

**Post (Top-Level):**

| Element | Style | Details |
|---------|-------|---------|
| Container | Full-width, subtle separation between posts | Horizontal line or spacing |
| Avatar | Circular, ~40px | Left-aligned |
| Author name | Bold, black, sans-serif | "Sarah M." (first name + last initial) |
| Timestamp | Gray, small, after name | "2:34 PM" (time format) |
| Bookmark icon | 🔖 outline icon, top-right | Save/bookmark this post |
| Body text | Regular, dark, left-aligned | Full post text, no truncation |
| Left border | Coral/muted pink vertical line | Connects replies visually to parent |
| Reply link | Gray, small, "↩ Reply" | Below post body |
| Toggle replies | Coral text, "Hide X replies" / "Show X replies" | Expand/collapse thread |

**Reply (Threaded, Indented):**

| Element | Style | Details |
|---------|-------|---------|
| Container | Indented ~40px from parent | Nested under parent post |
| Avatar | Smaller circular, ~32px | Left of reply content |
| Author | Bold, black | Name + last initial |
| Timestamp | Gray, small | Time only |
| Bookmark | 🔖 icon, right-aligned | Same as parent post |
| Body text | Regular, dark | Reply text |
| Left border | Coral/muted pink vertical line | Visual thread connector |
| Separation | Light gray horizontal line between replies | Within the thread group |

**Thread Behavior:**

| Behavior | Details |
|----------|---------|
| Default state | Replies collapsed (showing "Show X replies") |
| Toggle text | "Hide X replies" when expanded, "Show X replies" when collapsed |
| Toggle icon | 🔄 coral rotation icon before text |
| Max nesting | 1 level deep (replies to posts only, no reply-to-reply) |
| Order | Chronological within thread (oldest first) |

**Bottom Input:**

| Element | Style | Details |
|---------|-------|---------|
| Input | "Share your thoughts..." placeholder, rounded | Left side |
| Send button | Coral filled, arrow icon (➤) | Right of input |
| Guidelines | Italic, gray, centered below | "Be kind · Be helpful · We're all in this together" |
| Action | Creates new top-level post in timeline | Appears at top of feed |

---

## 4. Data Model

### 4.1 Community

**Collection:** `communities/{communityId}`

```typescript
interface Community {
  id: string;
  name: string;
  description: string;
  coverPhotoURL: string;
  category: CommunityCategory;
  categoryBadge: string;            // "LOCATION", "AGE", "EXPERIENCE"
  memberCount: number;              // Cached, denormalized
  postCount: number;                // Cached
  tags: string[];                   // For matching to user profiles
  location?: {
    city: string;
    state: string;
    county?: string;
  };
  childAgeRange?: {
    minMonths?: number;
    maxMonths?: number;
    expectingOnly?: boolean;
  };
  experienceTags?: string[];        // For experience-based matching
  guidelines?: string;              // "Be kind · Be helpful · We're all in this together"
  createdBy: string;                // Admin user ID
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
}

type CommunityCategory =
  | 'location'
  | 'child_age'
  | 'experience';
```

### 4.2 Community Membership

**Collection:** `communities/{communityId}/members/{userId}`

```typescript
interface CommunityMember {
  joinedAt: Timestamp;
  role: 'admin' | 'member';
  lastVisitedAt?: Timestamp;
  notificationsEnabled: boolean;
}
```

**Inverse Lookup:** `users/{userId}/communityMemberships/{communityId}`

```typescript
interface UserCommunityMembership {
  communityId: string;
  joinedAt: Timestamp;
  communityName: string;            // Cached for display
  communityCoverURL?: string;       // Cached
}
```

### 4.3 Community Post

**Collection:** `communities/{communityId}/posts/{postId}`

```typescript
interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;               // Cached: "Sarah M."
  authorPhotoURL?: string;          // Cached
  body: string;
  likeCount: number;
  commentCount: number;             // Reply count
  saveCount: number;
  isPinned: boolean;                // For "NOTEWORTHY" section
  isNoteworthy: boolean;            // Flagged as noteworthy
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### 4.4 Community Post Reply

**Collection:** `communities/{communityId}/posts/{postId}/replies/{replyId}`

```typescript
interface PostReply {
  id: string;
  authorId: string;
  authorName: string;               // Cached
  authorPhotoURL?: string;          // Cached
  body: string;
  createdAt: Timestamp;
}
```

### 4.5 Post Interactions

**Likes:** `communities/{communityId}/posts/{postId}/likes/{userId}`

```typescript
interface PostLike {
  createdAt: Timestamp;
}
```

**Saves/Bookmarks:** `users/{userId}/savedPosts/{postId}`

```typescript
interface SavedPost {
  postId: string;
  communityId: string;
  savedAt: Timestamp;
}
```

---

## 5. Component Architecture

### 5.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CommunityPreviewCard` | `components/communities/` | Home preview card (photo + description + members) |
| `CategoryLabel` | `components/communities/` | "BASED ON YOUR LOCATION" header |
| `CategoryBadge` | `components/communities/` | Coral badge on photo ("LOCATION", "AGE", "EXPERIENCE") |
| `CommunityHero` | `components/communities/` | Detail page hero (cover photo + name badge) |
| `MemberAvatarRow` | `components/communities/` | Overlapping circular avatars + "+X more" |
| `NotePostCard` | `components/communities/` | Noteworthy post card (quote + engagement counts) |
| `NotePostCarousel` | `components/communities/` | Horizontal scroll of noteworthy cards |
| `AskInput` | `components/communities/` | "What's on your mind?" input with send button |
| `PostItem` | `components/communities/` | Top-level post in timeline (author, body, reply toggle) |
| `ReplyItem` | `components/communities/` | Threaded reply (indented, smaller avatar) |
| `ReplyThread` | `components/communities/` | Collapsible reply thread container |
| `ThreadToggle` | `components/communities/` | "Hide X replies" / "Show X replies" toggle |
| `PostBookmark` | `components/communities/` | 🔖 bookmark icon (toggleable) |
| `EngagementRow` | `components/communities/` | ♡ likes, 💬 comments, ⭐ saves row |
| `TimelineInput` | `components/communities/` | Bottom "Share your thoughts..." input |
| `GuidelinesFooter` | `components/communities/` | "Be kind · Be helpful · We're all in this together" |

### 5.2 New Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Communities List | `(tabs)/communities.tsx` | Browse all communities (categorized) |
| Community Detail | `community/[id].tsx` | Hero, members, noteworthy, ask, join |
| Community Timeline | `community/[id]/timeline.tsx` | Threaded discussion feed |

### 5.3 Reusable from Existing

| Component | Reuse | Modifications |
|-----------|-------|---------------|
| `SearchBar` | From Introductions PRD | Same component, different placeholder |
| `SectionHeader` | From Home | Same style |
| `Avatar` | `components/ui/Avatar.tsx` | Already exists, may need size variants |

---

## 6. Design System Additions

### 6.1 New Visual Elements

**Category Badge:**
```
┌────────────────┐
│   LOCATION     │  Coral background, white uppercase text
└────────────────┘  Small, pill-shaped, positioned top-left of cover photo
```

**Community Name Badge:**
```
┌────────────────────┐
│     SF Moms        │  Coral background, white text, rounded pill
└────────────────────┘  Centered at bottom of hero photo, overlapping
```

**Thread Left Border:**
- Coral/muted pink vertical line (`#E8A090` approx)
- 2px width
- Runs alongside post body and reply thread
- Visual connector for threaded conversation

**Engagement Icons:**

| Icon | Symbol | Color | Usage |
|------|--------|-------|-------|
| Heart | ♡ (outline) / ♥ (filled) | Gray / Coral when liked | Likes |
| Comment | 💬 (speech with line) | Gray | Reply count |
| Star/Sparkle | ⭐ (sparkle) | Gray / Coral when saved | Saves/bookmarks |
| Bookmark | 🔖 | Gray / Coral when saved | Per-post save |

### 6.2 Typographic Additions

| Usage | Style | Example |
|-------|-------|---------|
| Community name (hero badge) | White, medium, regular | "SF Moms" |
| Community name (card overlay) | White, serif/italic, shadowed | "SF Moms", "Expecting Moms" |
| Category badge | White, uppercase, small, bold | "LOCATION", "AGE", "EXPERIENCE" |
| "NOTEWORTHY" | Coral, uppercase, letter-spaced | Section header |
| "ASK THE MOMS WHO GET IT" | Coral, uppercase, letter-spaced | Section header |
| Post body | Regular, dark, ~15px | Discussion text |
| Reply body | Regular, dark, ~14px | Slightly smaller than post |
| Guidelines | Italic, gray, centered | "Be kind · Be helpful · We're all in this together" |

---

## 7. Interaction Details

### 7.1 Thread Collapse/Expand

| State | Display | Toggle Text |
|-------|---------|-------------|
| Collapsed (default) | Only parent post visible | "Show X replies" (coral + 🔄 icon) |
| Expanded | Parent + all replies visible | "Hide X replies" (coral + 🔄 icon) |

**Animation:** Smooth expand/collapse, ~200ms duration

### 7.2 Post Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Reply | Tap "↩ Reply" | Opens reply input (inline or keyboard-attached) |
| Bookmark | Tap 🔖 icon | Toggles saved state, saves to `users/{uid}/savedPosts` |
| Like | Tap ♡ on Noteworthy card | Toggles like, updates count |
| Search | Type in search bar | Filters posts by text content |

### 7.3 Post Creation

| Source | Action | Result |
|--------|--------|--------|
| "What's on your mind?" (detail page) | Type + tap ➤ | Creates post, opens timeline with new post at top |
| "Share your thoughts..." (timeline) | Type + tap ➤ | Creates post, appears at top of feed |
| "↩ Reply" on post | Type reply text | Creates reply under parent post |

---

## 8. Backend Requirements

### 8.1 New Cloud Functions

| Function | Type | Purpose |
|----------|------|---------|
| `getRecommendedCommunities` | Callable | Return communities matching user profile |
| `joinCommunity` | Callable | Add user to community, update counts |
| `leaveCommunity` | Callable | Remove user, update counts |
| `createPost` | Callable | Create post with validation, rate limiting |
| `createReply` | Callable | Create threaded reply with validation |
| `togglePostLike` | Callable | Like/unlike post, update count |
| `togglePostSave` | Callable | Save/unsave post to user's collection |
| `getNoteworthy` | Callable | Return top posts by engagement for a community |

### 8.2 New Triggers

| Trigger | Event | Action |
|---------|-------|--------|
| `onPostCreated` | New post in community | Update community `lastActivityAt`, `postCount` |
| `onReplyCreated` | New reply on post | Update post `commentCount`, notify post author |
| `onMemberJoined` | New member added | Update `memberCount`, notify community admins |

### 8.3 Firestore Indexes Needed

| Collection | Fields | Purpose |
|-----------|--------|---------|
| `communities` | `category` + `memberCount` (desc) | Browse by category sorted by popularity |
| `posts` | `isNoteworthy` + `likeCount` (desc) | Noteworthy section ranking |
| `posts` | `createdAt` (desc) | Timeline chronological order |
| `replies` | `createdAt` (asc) | Thread chronological order |

### 8.4 Security Rules

```javascript
match /communities/{communityId} {
  allow read: if isAuthenticated();
  allow write: if false; // Admin-managed

  match /members/{userId} {
    allow read: if isAuthenticated();
    allow create: if isOwner(userId);   // Self-join
    allow delete: if isOwner(userId);   // Self-leave
  }

  match /posts/{postId} {
    allow read: if isAuthenticated() && isCommunityMember(communityId);
    allow create: if isAuthenticated() && isCommunityMember(communityId);
    allow update: if isPostAuthor(postId); // Edit own posts

    match /replies/{replyId} {
      allow read: if isAuthenticated() && isCommunityMember(communityId);
      allow create: if isAuthenticated() && isCommunityMember(communityId);
    }

    match /likes/{userId} {
      allow read, write: if isOwner(userId) && isCommunityMember(communityId);
    }
  }
}
```

---

## 9. Differences from Existing Chat System

| Aspect | Introductions Chat (1:1) | Communities (Group Discussion) |
|--------|-------------------------|-------------------------------|
| Structure | Flat message list | Threaded posts with replies |
| Participants | 2 users only | Unlimited members |
| Message type | Simple text + timestamp | Post with author info, bookmarks, engagement |
| Replies | N/A (flat) | Collapsible threaded replies |
| Discovery | Recommended profiles | Categorized by location/age/experience |
| Engagement | None | Likes, comments, saves, bookmarks |
| Moderation | N/A | Guidelines footer, potentially flagging |
| Search | Search conversations | Search within posts |

**Key Architectural Insight:** Communities is NOT a chat system - it's a **threaded discussion forum**. It requires a completely different data model, UI, and interaction pattern from the existing room-based chat.

---

## 10. Open Questions

1. **Community creation:** Are communities only admin-created or can users propose/create?
2. **Auto-join:** Are users auto-joined to matching communities, or must they explicitly join?
3. **Notifications:** What triggers community push notifications? All posts? Only replies to your posts? Mentions?
4. **Image posts:** Can posts include images/photos, or text-only?
5. **Post editing:** Can users edit their posts after publishing?
6. **Post deletion:** Can users delete their own posts?
7. **Member limit:** Is there a maximum community size?
8. **Noteworthy selection:** How are noteworthy posts selected? Manually by admin? Algorithmically by engagement?
9. **Moderation:** Is there a report mechanism for posts/replies?
10. **Private communities:** Are all communities public, or can some be invite-only?

---

## 11. Implementation Priority

### MVP
1. Communities list (categorized, from Home and Communities tab)
2. Community detail page (hero, description, members, join button)
3. Community timeline (posts, replies, thread toggle)
4. Post creation (top-level)
5. Reply creation (one level deep)
6. Join/leave community

### Post-MVP
7. Noteworthy section on detail page
8. Post likes and saves/bookmarks
9. Search within community posts
10. Push notifications for community activity
11. "Ask the Moms" quick input on detail page
12. Member list view

---

## 12. Communities Tab - Full Screen Specification (Addendum)

**Source:** 6 additional screenshots from product owner  
**Added:** February 6, 2026

The Communities tab is the third bottom tab. It is a **full management hub** with two sub-tabs (Joined / Explore), user activity tracking, a cross-community activity feed, and sub-screens for Saved Tips and Your Questions.

---

### 12.1 Communities Tab - Joined Sub-Tab

**This is the default view when tapping the Communities bottom tab.**

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Raine (logo)                          👤   │
│                                              │
│  YOUR                                        │
│  Communities                                 │
│  ─────────────── (coral line)               │
│                                              │
│  [JOINED]    EXPLORE                        │
│  ────────                                    │
│                                              │
│  YOUR COMMUNITIES                           │
│  ┌────────────┐ ┌────────────┐              │
│  │  LOCATION  │ │    AGE     │              │
│  │  SF Moms   │ │ Expecting  │              │
│  │ 156 MEMBER │ │   Moms     │              │
│  └────────────┘ │ 145 MEMBER │              │
│  ┌────────────┐ └────────────┘              │
│  │ EXPERIENCE │                              │
│  │ Sensitive  │                              │
│  │   Skin     │                              │
│  │ Society    │                              │
│  │ 12 MEMBERS │                              │
│  └────────────┘                              │
│                                              │
│  ─── YOUR ACTIVITY ────                     │
│                                              │
│  ┌──────────────┐ ┌──────────────────────┐  │
│  │ 🔖           │ │ ❓            2      │  │
│  │ Saved Tips   │ │ Your Questions       │  │
│  │ YOUR         │ │ 2 NEW ANSWERS        │  │
│  │ COLLECTION   │ │                      │  │
│  │ View all →   │ │ View all →           │  │
│  └──────────────┘ └──────────────────────┘  │
│                                              │
│  ─── LATEST ACTIVITY ───          ALL ˅     │
│                                              │
│  [🖼] SF MOMS · 23m ago              >      │
│       'Has anyone tried this?...'           │
│       💬 7 new messages · Isabella C.       │
│                                              │
│  [🖼] SF MOMS · 1h ago               >      │
│       'Just wanted to share what worked!'   │
│       🔥 Hot topic · Sophia L.              │
│                                              │
│  [🖼] EXPECTING MOMS · 2h ago        >      │
│       2 new moms joined this week           │
│       🔥 Hot topic                          │
│                                              │
│  [🖼] EXPECTING MOMS · 3h ago        >      │
│       'Our routine that finally worked'     │
│       👥 New members · Emma W.              │
│                                              │
│  [🖼] SENSITIVE SKIN SOCIETY · 4h ago >      │
│       'How do you all navigate this?'       │
│       👥 New members · Brooke C.            │
│                                              │
│  [🖼] SENSITIVE SKIN SOCIETY · 5h ago >      │
│       'Sharing my experience with this...'  │
│       🔀 22 replies · Amanda K.             │
│                                              │
│  🏠 Home  👥 Intros  💬 Comm  📄 Drops      │
└─────────────────────────────────────────────┘
```

#### Your Communities Grid

| Element | Style | Details |
|---------|-------|---------|
| Section header | Gray, uppercase, small, letter-spaced | "YOUR COMMUNITIES" |
| Layout | 2-column grid | Masonry-like, cards fill space |
| Card | Cover photo with category badge + name + member count | Same style as Home community cards but square/compact |
| Category badge | Coral pill, white text | "LOCATION", "AGE", "EXPERIENCE" on top-left of photo |
| Name | White, serif/italic, overlaid on photo | Bottom of photo with shadow |
| Member count | White, small, overlaid on photo | Below name, e.g. "156 MEMBERS" |
| Tap action | Navigate to Community Detail page | Same detail page as from Home |

#### Your Activity Section

| Element | Style | Details |
|---------|-------|---------|
| Section header | Gray, uppercase, letter-spaced | "YOUR ACTIVITY" |
| Layout | Two side-by-side cards | Equal width |
| Progress bars | Coral thin lines at top of each card | Visual accent |

**Saved Tips Card:**

| Element | Style | Details |
|---------|-------|---------|
| Icon | 🔖 Bookmark, coral | Top-left |
| Title | "Saved Tips", bold, black | Main label |
| Subtitle | "YOUR COLLECTION", gray, uppercase, small | Below title |
| Link | "View all →", coral italic | Tappable, opens Saved Tips screen |

**Your Questions Card:**

| Element | Style | Details |
|---------|-------|---------|
| Icon | ❓ Question circle, coral | Top-left |
| Badge | "2" (coral number, top-right) | Count of new answers |
| Title | "Your Questions", bold, black | Main label |
| Subtitle | "2 NEW ANSWERS", gray, uppercase, small | Below title |
| Link | "View all →", coral italic | Tappable, opens Questions screen |

#### Latest Activity Feed

| Element | Style | Details |
|---------|-------|---------|
| Section header | "LATEST ACTIVITY", gray uppercase | With "ALL ˅" dropdown filter on right |
| Filter dropdown | "ALL ˅" | Filters by community (All, SF Moms, etc.) |

**Activity Row:**

| Element | Style | Details |
|---------|-------|---------|
| Community avatar | Square, small (~48px), rounded corners | Community cover photo thumbnail |
| Community name | Coral, uppercase, bold, small | "SF MOMS", "EXPECTING MOMS", "SENSITIVE SKIN SOCIETY" |
| Timestamp | Gray, after community name | "· 23m ago", "· 1h ago", "· 2h ago" |
| Post preview | Dark, quoted italic | "'Has anyone tried this? Looking for recommendations...'" |
| Activity indicator | Coral text, small, with icon | Various types (see below) |
| Author | Gray, after indicator | "· Isabella C.", "· Sophia L." |
| Chevron | Coral ">" arrow, right-aligned | Navigate to post/thread |
| Separator | Light gray horizontal line | Between rows |

**Activity Indicator Types:**

| Icon | Text | Meaning |
|------|------|---------|
| 💬 | "7 new messages" | New replies on a post |
| 🔥 (🔀 trending) | "Hot topic" | Trending/active discussion |
| 👥 | "New members" | New members joined community |
| 🔀 (arrows) | "22 replies" | High reply count on post |

---

### 12.2 Communities Tab - Explore Sub-Tab

**Trigger:** Tap "EXPLORE" on the Communities tab switcher

**Layout:**
```
┌─────────────────────────────────────────────┐
│  YOUR                                        │
│  Communities                                 │
│  ─────────────── (coral line)               │
│                                              │
│  JOINED    [EXPLORE]                        │
│            ─────────                         │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ JUST BROWSING                        │   │
│  │ You can join up to 2 topic-based     │   │
│  │ communities at a time.               │   │
│  │ We limit the number to encourage     │   │
│  │ meaningful engagement.               │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  🔍 SEARCH COMMUNITIES                      │
│                                              │
│  [Topic ˅]  [Stage ˅]  [Size ˅]            │
│                                              │
│  8 communities found                         │
│                                              │
│  ┌────────────┐ ┌────────────┐              │
│  │ Twin Mama  │ │  Career    │              │
│  │  Tribe     │ │ Comeback   │              │
│  │ 8 members  │ │ 45 members │              │
│  ├────────────┤ ├────────────┤              │
│  │ For moms   │ │ Returning  │              │
│  │ navigating │ │ to work    │              │
│  │ the chaos  │ │ after mat  │              │
│  │ of twins...│ │ leave? ... │              │
│  │ LEARN MORE │ │ LEARN MORE │              │
│  └────────────┘ └────────────┘              │
│                                              │
│  ┌────────────┐ ┌────────────┐              │
│  │ Eco Parents│ │ First-Time │              │
│  │ 18 members │ │   Moms     │              │
│  │            │ │ 9 members  │              │
│  │ Sustainable│ │ No question│              │
│  │ parenting  │ │ is too     │              │
│  │ tips, eco  │ │ small...   │              │
│  │ LEARN MORE │ │ LEARN MORE │              │
│  └────────────┘ └────────────┘              │
│                                              │
│  ┌────────────┐ ┌────────────┐              │
│  │ Solo       │ │ NICU       │              │
│  │ Parents    │ │ Graduate   │              │
│  │ United     │ │ Families   │              │
│  │ LEARN MORE │ │ LEARN MORE │              │
│  └────────────┘ └────────────┘              │
│                                              │
│  ┌────────────┐ ┌────────────┐              │
│  │ Attachment │ │ Fussy      │              │
│  │ Parenting  │ │ Families   │              │
│  │ 5 members  │ │ 9 members  │              │
│  │ LEARN MORE │ │ LEARN MORE │              │
│  └────────────┘ └────────────┘              │
└─────────────────────────────────────────────┘
```

#### Info Banner

| Element | Style | Details |
|---------|-------|---------|
| Container | Light peach/salmon background, rounded | Informational card |
| Badge | "JUST BROWSING" coral pill, top-right of banner | Label |
| Text line 1 | Dark, regular | "You can join up to 2 topic-based communities at a time." |
| Text line 2 | Coral, italic | "We limit the number to encourage meaningful engagement." |

**Key Business Rule:** Users can join **up to 2 topic-based communities** at a time. This is a deliberate constraint to encourage quality engagement over quantity.

#### Search & Filters

| Element | Style | Details |
|---------|-------|---------|
| Search bar | Full-width, rounded, gray border | "SEARCH COMMUNITIES" uppercase placeholder |
| Filter pills | Gray outlined dropdowns, inline | "Topic ˅", "Stage ˅", "Size ˅" |
| Results count | Gray text, below filters | "8 communities found" |

**Filter Options (Inferred):**

| Filter | Likely Options |
|--------|---------------|
| Topic | All, Parenting, Career, Health, Lifestyle, etc. |
| Stage | All, Expecting, Newborn, Toddler, Preschool, etc. |
| Size | All, Small (<20), Medium (20-100), Large (100+) |

#### Explore Community Card

```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │                  │  │
│  │   Cover Photo    │  │
│  │   Community Name │  │
│  │   XX members     │  │
│  └──────────────────┘  │
│                         │
│  Description text       │
│  that wraps to          │
│  2-3 lines...           │
│                         │
│  LEARN MORE             │
└────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Card | Half-width (2-column grid), vertical layout | Photo on top, text below |
| Cover photo | Full card width, ~120px height | Community cover photo |
| Name | White, serif/italic, overlaid on photo | Bottom of photo |
| Member count | White, small, on photo | Below name (coral text with 👥 icon) |
| Description | Dark gray, regular, 2-3 lines | Below photo, truncated |
| "LEARN MORE" | Coral, uppercase, letter-spaced | Tappable link at bottom |

**Communities Observed in Explore:**

| Community | Members | Description |
|-----------|---------|-------------|
| Twin Mama Tribe | 8 | "For moms navigating the beautiful chaos of raising..." |
| Career Comeback | 45 | "Returning to work after maternity leave? We get it." |
| Eco Parents | 18 | "Sustainable parenting tips, eco-friendly products, and..." |
| First-Time Moms | 9 | "No question is too small. We've all been there." |
| Solo Parents United | — | "Single parenting with strength, grace, and..." |
| NICU Graduate Families | — | "Celebrating every milestone after the NICU journey" |
| Attachment Parenting | 5 | "Gentle parenting, babywearing, and responsiv..." |
| Fussy Families | 9 | "From purees to picky eaters - let's talk food" |

---

### 12.3 Community Join Modal (from Explore)

**Trigger:** Tap "LEARN MORE" on an Explore community card

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                              │
│  ✕ (close)                                   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │       [Large Profile Photo]          │   │
│  │                                      │   │
│  │     ┌──────────────────────┐         │   │
│  │     │  Career Comeback     │         │   │
│  │     │  👥 45 members       │         │   │
│  │     └──────────────────────┘         │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Returning to work after maternity leave?   │
│  We get it.                                  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │         REQUEST TO JOIN              │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Overlay | Semi-transparent dark background over Explore page | Modal dialog |
| Close button | ✕ icon, top-left of modal | Dismisses modal |
| Photo | Large, centered, ~250px width | Community representative photo |
| Name badge | Coral filled pill | "Career Comeback" white text |
| Member count | White text inside badge | "👥 45 members" |
| Description | Dark, centered, regular | Full community description |
| "REQUEST TO JOIN" | Full-width, coral filled button, white text | Primary CTA |

**Key Behavior:**
- Tapping "REQUEST TO JOIN" sends a join request (not instant join)
- This implies communities in Explore have **approval-based membership**
- The "Joined" tab communities may have been auto-joined based on profile data

**Join Model (Inferred):**

| Community Type | Join Mechanism | Example |
|---------------|---------------|---------|
| Location-based | Auto-join on profile setup | SF Moms |
| Age-based | Auto-join on profile setup | Expecting Moms |
| Experience-based | Auto-join on profile setup | Sensitive Skin Society |
| Topic-based (Explore) | Request to join (approval) | Career Comeback, Twin Mama Tribe |

**Limit:** Up to 2 topic-based communities at a time (location/age/experience don't count toward limit).

---

### 12.4 Saved Tips Screen

**Trigger:** Tap "View all →" on the Saved Tips card in Your Activity section

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← COMMUNITIES                              │
│  🔖 YOUR                                    │
│  Saved Tips                                  │
│  0 tips saved                                │
│                                              │
│  🔍 SEARCH SAVED TIPS                       │
│                                              │
│  [⇅ SORT ˅]          [All Communities ˅]    │
│                                              │
│                                              │
│           ┌─────────┐                        │
│           │   🔖    │                        │
│           │  (pink  │                        │
│           │  circle)│                        │
│           └─────────┘                        │
│                                              │
│      Your tip jar is empty                   │
│                                              │
│    Save helpful advice from community        │
│    chats to revisit anytime                  │
│                                              │
└─────────────────────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Back navigation | "← COMMUNITIES" gray text, top-left | Returns to Communities tab |
| Icon | 🔖 Bookmark, coral | Next to "YOUR" label |
| "YOUR" | Coral, uppercase, small | Label above title |
| Title | "Saved Tips", bold, large, serif | Page title |
| Count | Gray, small | "0 tips saved" |
| Search bar | "SEARCH SAVED TIPS", full-width | Filters saved posts |
| Sort dropdown | "⇅ SORT ˅", gray outlined pill | Sort options (Recent, Oldest, etc.) |
| Community filter | "All Communities ˅", gray outlined pill | Filter by community |
| Background | Light peach/salmon tint | Subtle warm background |

**Empty State:**

| Element | Style | Details |
|---------|-------|---------|
| Icon | 🔖 large bookmark in pink circle | Centered, ~80px |
| Title | "Your tip jar is empty", bold, dark | Below icon |
| Description | Gray, centered, 2 lines | "Save helpful advice from community chats to revisit anytime" |

**When populated (inferred):** List of saved posts from any community, showing community name, post text, author, and save date. Searchable and filterable.

---

### 12.5 Your Questions Screen

**Trigger:** Tap "View all →" on the Your Questions card in Your Activity section

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← COMMUNITIES                              │
│  ❓ YOUR                                    │
│  Questions                                   │
│  2 questions · 2 answers                     │
│                                              │
│  [ACTIVE (2)]  [📁 ARCHIVE (0)]            │
│                                              │
│  🔍 SEARCH QUESTIONS                        │
│                                              │
│  [⇅ SORT ˅]          [All Communities ˅]    │
│                                              │
│  ─────────────────────────────────────────── │
│                                              │
│  SF MOMS                         Feb 6, 2026│
│  │ "example"                                │
│  No answers yet                              │
│                                      Archive │
│                                              │
│  ─────────────────────────────────────────── │
│                                              │
│  SENSITIVE SKIN SOCIETY          Feb 4, 2026│
│  │ "Best fragrance-free laundry detergent   │
│  │  for baby clothes?"                      │
│  💬 2 answers ˅                             │
│                                      Archive │
│                                              │
└─────────────────────────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Back navigation | "← COMMUNITIES" | Returns to Communities tab |
| Icon | ❓ Question circle, coral | Next to "YOUR" label |
| "YOUR" | Coral, uppercase, small | Label |
| Title | "Questions", bold, large, serif | Page title |
| Summary | Gray, small | "2 questions · 2 answers" |
| Tab switcher | Active (coral filled pill) / Archive (gray outlined pill) | "ACTIVE (2)" / "📁 ARCHIVE (0)" |
| Search bar | "SEARCH QUESTIONS" | Filters questions |
| Sort dropdown | "⇅ SORT ˅" | Sort options |
| Community filter | "All Communities ˅" | Filter by community |

**Question Card:**

| Element | Style | Details |
|---------|-------|---------|
| Community name | Coral badge pill, uppercase | "SF MOMS", "SENSITIVE SKIN SOCIETY" |
| Date | Gray, right-aligned | "Feb 6, 2026", "Feb 4, 2026" |
| Left border | Coral vertical line | Visual thread indicator |
| Question text | Dark, italic/quoted | "example", "Best fragrance-free laundry detergent..." |
| Answers | Coral text, expandable | "💬 2 answers ˅" or "No answers yet" (gray) |
| Archive action | Gray text, right-aligned | "📁 Archive" - moves to Archive tab |

**Behavior:**
- "💬 2 answers ˅" is expandable - shows answer previews inline
- "Archive" moves the question from Active to Archive tab
- Questions are created from the "ASK THE MOMS WHO GET IT" input on Community Detail
- Each question appears in the community timeline AND in Your Questions for tracking

---

### 12.6 Updated Data Model Additions

#### Community Join Request

**Collection:** `communities/{communityId}/joinRequests/{userId}`

```typescript
interface CommunityJoinRequest {
  userId: string;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
  respondedBy?: string;       // Admin who approved/declined
}
```

#### Community Types (Refined)

```typescript
interface Community {
  // ... existing fields from Section 4.1 ...

  joinType: CommunityJoinType;
  maxTopicJoins?: number;     // Limit: 2 for topic-based
}

type CommunityJoinType =
  | 'auto'                    // Location/age/experience - auto-joined based on profile
  | 'request';                // Topic-based from Explore - requires approval
```

#### User Question (Cross-Community)

**Collection:** `users/{userId}/questions/{questionId}`

```typescript
interface UserQuestion {
  questionId: string;         // References the post ID
  communityId: string;
  communityName: string;      // Cached
  body: string;               // Question text
  answerCount: number;        // Cached reply count
  status: 'active' | 'archived';
  createdAt: Timestamp;
  lastAnswerAt?: Timestamp;
}
```

#### Activity Feed Item

```typescript
interface CommunityActivityItem {
  communityId: string;
  communityName: string;
  communityPhotoURL: string;
  type: ActivityType;
  preview: string;            // Post text or event description
  authorName?: string;        // "Isabella C."
  metadata: ActivityMetadata;
  timestamp: Timestamp;
  postId?: string;            // Navigate target
}

type ActivityType =
  | 'new_messages'            // 💬 "7 new messages"
  | 'hot_topic'              // 🔥 "Hot topic"
  | 'new_members'            // 👥 "New members"
  | 'replies'                // 🔀 "22 replies"
  | 'new_post';              // Standard new post

interface ActivityMetadata {
  count?: number;             // 7 for "7 new messages"
  relatedUserName?: string;   // "Isabella C."
}
```

---

### 12.7 Additional Components Needed

| Component | Location | Purpose |
|-----------|----------|---------|
| `CommunityGrid` | `components/communities/` | 2-column grid of joined community cards |
| `ActivityCard` | `components/communities/` | Saved Tips / Your Questions card |
| `ActivityFeedItem` | `components/communities/` | Single row in Latest Activity feed |
| `ActivityIndicator` | `components/communities/` | 💬/🔥/👥/🔀 icon + label |
| `CommunityFilter` | `components/communities/` | "ALL ˅" dropdown for community filtering |
| `ExploreCommunityCard` | `components/communities/` | Card with photo, description, "LEARN MORE" |
| `JoinModal` | `components/communities/` | Modal with photo, description, "REQUEST TO JOIN" |
| `InfoBanner` | `components/communities/` | "JUST BROWSING" info card |
| `FilterPills` | `components/ui/` | "Topic ˅", "Stage ˅", "Size ˅" dropdowns |
| `SavedTipsList` | `components/communities/` | Saved tips with search/sort/filter |
| `QuestionCard` | `components/communities/` | Question with community badge, answers, archive |
| `QuestionsList` | `components/communities/` | Active/Archive tabbed question list |
| `EmptyStateBookmark` | `components/ui/` | "Your tip jar is empty" empty state |

### 12.8 Additional Screens Needed

| Screen | Route | Purpose |
|--------|-------|---------|
| Communities Tab (Joined) | `(tabs)/communities.tsx` | Grid + activity + feed |
| Communities Tab (Explore) | Same screen, different sub-tab | Search + filter + browse |
| Saved Tips | `communities/saved-tips.tsx` | Search + filter saved posts |
| Your Questions | `communities/questions.tsx` | Active/Archive questions |

### 12.9 Additional Backend Requirements

| Function | Type | Purpose |
|----------|------|---------|
| `requestToJoinCommunity` | Callable | Submit join request for topic-based community |
| `approveJoinRequest` | Callable | Admin approves member request |
| `getCommunityActivityFeed` | Callable | Aggregated activity across user's communities |
| `archiveQuestion` | Callable | Move question to archive |
| `getExploreCommunities` | Callable | Return discoverable communities with filters |

### 12.10 Business Rules Documented

| Rule | Details |
|------|---------|
| Topic-based community limit | Users can join **up to 2** topic-based communities at a time |
| Auto-join communities | Location/age/experience communities are auto-joined based on profile |
| Join mechanism | Topic-based communities use "REQUEST TO JOIN" (approval needed) |
| Question tracking | Questions asked in community timelines are tracked in "Your Questions" |
| Post bookmarking | Bookmarked posts (🔖) appear in "Saved Tips" |
| Activity feed | Cross-community feed on Joined tab shows latest from all joined communities |
| Activity filtering | "ALL ˅" dropdown filters activity by specific community |

---

## 13. Revised Implementation Priority

### MVP (Updated)
1. Communities tab with Joined/Explore sub-tabs
2. Your Communities grid (joined communities display)
3. Community detail page (hero, members, noteworthy, ask, join)
4. Community timeline (threaded posts with replies)
5. Explore tab with search and filters
6. Join modal with "REQUEST TO JOIN"
7. Post creation and reply
8. Latest Activity feed on Joined tab
9. Join/leave community

### Post-MVP (Updated)
10. Saved Tips screen (bookmarked posts)
11. Your Questions screen (tracked questions with archive)
12. Activity indicators (hot topic, new messages, new members)
13. Sort and filter controls (within Saved Tips, Questions)
14. Push notifications for community activity
15. Community member list view
16. Admin tools for join request approval

---

**Document Version:** 2.0  
**Source Assets:** 9 screenshots total stored in `.cursor/projects/*/assets/`  
**Next:** Awaiting Drops tab screenshots
