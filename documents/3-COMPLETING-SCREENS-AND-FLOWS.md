# Completing Screens and Flows
## A Study on Bridging the Vision Gap in RaineApp

**Date:** February 6, 2026  
**Status:** Analysis - Awaiting Additional Screens from Product Owner

---

## 1. The Vision Gap

### What We Built

The current RaineApp has been built around a **chat-centric model**:

```
┌─────────────────────────────────┐
│           Current App           │
├─────────────────────────────────┤
│  (auth)  → Login (social)       │
│  (onboarding) → Splash/Referral │
│  (profile-setup) → 14 screens  │
│  (tabs)                         │
│    ├── Rooms (chat list)        │
│    ├── Profile (edit name)      │
│    └── Settings (account mgmt) │
│  room/[id] → Chat thread       │
│  subscription → RevenueCat      │
└─────────────────────────────────┘
```

**3 tabs.** The main experience after login is a flat list of chat rooms.

### What We Need

Based on the Home screen screenshot provided, the app is a **social platform for mothers** with a rich, content-driven experience:

```
┌─────────────────────────────────────────────────┐
│                  Intended App                    │
├─────────────────────────────────────────────────┤
│  (auth)  → Login (social)                       │
│  (onboarding) → Splash/Referral                 │
│  (profile-setup) → 14 screens                   │
│  (tabs)                                          │
│    ├── Home (dashboard)             ← NEW        │
│    ├── Introductions (connections)  ← NEW        │
│    ├── Communities (groups)         ← NEW        │
│    └── Drops (articles/content)    ← NEW        │
│  room/[id] → Chat thread (keep)                 │
│  subscription → RevenueCat (keep)               │
│  profile → Full profile view       ← REDESIGN   │
│  settings → Account management     ← MOVE       │
└─────────────────────────────────────────────────┘
```

**4 tabs.** The main experience is a rich dashboard with social discovery, communities, and curated content.

---

## 2. Analysis of the Home Screen Screenshot

Based on the provided screenshot, the Home tab contains these sections (top to bottom):

### 2.1 Header Bar
- App logo ("Raine" in script font)
- Profile/avatar icon (top right) → likely navigates to profile or settings

### 2.2 Activity Dashboard
Four counters in a horizontal row:
- **Intro Requests** (2) → connections pending
- **Unread Messages** (4) → unread chat messages
- **Saved Tips** (0) → saved articles from Drops
- **Question Responses** (2) → community Q&A replies

This is a notification hub showing aggregated activity across all sections.

### 2.3 "Moms Like You" Section
- **Horizontal scroll** of profile cards (showing "Amanda" and another mom)
- Each card shows:
  - Profile photo (large, prominent)
  - Name
  - Short bio/tagline ("Shares your Montessori philosophy and navigating toddler food allergies")
  - Two action buttons: **"SAY HI"** and **"SAVE"**
- This is the **Introductions/matching** preview

**Backend Implication:** Requires a matching/recommendation engine based on profile data (location, children ages, interests, aesthetic, etc.)

### 2.4 "Communities" Section
- Vertical list of community cards grouped by category
- Categories observed:
  - "BASED ON YOUR LOCATION" → "SF Moms" (43 members)
  - "BASED ON YOUR CHILD'S BIRTH DATE" → "Expecting Moms" (42 members)
  - "BASED ON YOUR EXPERIENCES" → "Sensitive Skin Society" (8 members)
- Each card shows:
  - Community photo (background image)
  - Community name
  - Description snippet
  - Member count
  - Arrow/chevron for navigation

**Backend Implication:** Requires a `communities` collection with categorization, membership tracking, and recommendation based on user profile data.

### 2.5 "Fresh Drop" Section
- Content/article preview section
- Headline: "PARENTING"
- Article title: "Bringing Baby Home"
- Subtitle: "You don't need much - just the right things"
- "SEE ALL" link → navigates to full Drops list
- "4 items" indicator

**Backend Implication:** Requires a `drops` (articles/content) collection with categories, content management, favorites/saves functionality.

### 2.6 Bottom Tab Bar
Four tabs with icons:
- **Home** (house icon) - currently active
- **Introductions** (handshake/people icon)
- **Communities** (group icon)
- **Drops** (document/card icon)

---

## 3. Gap Analysis: Current vs Intended

### 3.1 What Exists and Can Be Reused

| Existing Component | Reuse Potential | Notes |
|-------------------|-----------------|-------|
| `AuthContext.tsx` | ✅ Full reuse | Auth works regardless of tab structure |
| `(auth)/login.tsx` | ✅ Full reuse | Social login unchanged |
| `(onboarding)/` | ✅ Full reuse | Splash + referral unchanged |
| `(profile-setup)/` | ✅ Full reuse | 14-step flow unchanged |
| `room/[id].tsx` | ✅ Full reuse | Chat room works for both Introductions and Communities |
| `subscription.tsx` | ✅ Full reuse | RevenueCat integration unchanged |
| `(tabs)/profile.tsx` | ⚠️ Major redesign | Current is minimal; needs full profile view |
| `(tabs)/settings.tsx` | ⚠️ Relocate | Move to profile → settings sub-screen |
| `(tabs)/index.tsx` | ❌ Replace | Current Rooms list → new Home dashboard |
| `(tabs)/_layout.tsx` | ❌ Rewrite | 3 tabs → 4 tabs with new icons |
| Chat components | ⚠️ Reuse in context | MessageBubble, MessageInput, MessageList work for both 1:1 and group |
| UI components | ✅ Full reuse | Button, Card, Avatar, etc. |
| Firebase services | ⚠️ Extend | Need new services for communities, drops, introductions |
| Zustand stores | ⚠️ Extend | Need new stores for communities, drops |

### 3.2 What's Completely Missing

| Missing Feature | Screens | Components | Services | Types | Backend |
|----------------|---------|------------|----------|-------|---------|
| **Home Dashboard** | 1 screen | ~5 new | 1 aggregation service | Activity types | Activity counters endpoint |
| **Introductions** | 3-5 screens | ~8 new | Matching service | Introduction types | Matching algorithm, intro requests |
| **Communities** | 4-6 screens | ~10 new | Community service | Community types | Communities collection, posts, threads |
| **Drops** | 3-4 screens | ~6 new | Content service | Drop/article types | Content collection, favorites, categories |
| **Profile Redesign** | 2-3 screens | ~4 new | Profile view service | Extended profile | Public profile endpoint |
| **Navigation Redesign** | 1 layout | Tab bar redesign | N/A | N/A | N/A |

**Estimated Total:** ~15-20 new screens, ~33 new components, 5+ new services

---

## 4. Feature Breakdown

### 4.1 Home Tab (Dashboard)

**Purpose:** Central hub showing personalized activity across all features.

**Sections (from screenshot):**

#### Activity Counters
```
┌──────────┬──────────┬──────────┬──────────┐
│  Intro   │  Unread  │  Saved   │ Question │
│ Requests │ Messages │   Tips   │ Responses│
│    2     │    4     │    0     │    2     │
└──────────┴──────────┴──────────┴──────────┘
```

**Data needed:**
- Count of pending intro requests for current user
- Count of unread messages across all rooms/communities
- Count of saved drops/articles
- Count of unread responses to user's community questions

**Screens needed:**
- `(tabs)/index.tsx` → Home dashboard (REWRITE)

**Components needed:**
- `ActivityCounter.tsx` → Single counter pill
- `ActivityDashboard.tsx` → Row of counters
- `MomsLikeYouCarousel.tsx` → Horizontal profile card scroll
- `CommunityPreviewList.tsx` → Vertical community card list
- `FreshDropPreview.tsx` → Content article preview
- `SectionHeader.tsx` → "MOMS LIKE YOU" / "COMMUNITIES" / "FRESH DROP" with optional "SEE ALL"

**New types:**
```typescript
interface ActivityCounts {
  introRequests: number;
  unreadMessages: number;
  savedTips: number;
  questionResponses: number;
}
```

---

#### "Moms Like You" Preview
- Shows 2-3 recommended profiles
- Tappable → navigates to Introductions tab or profile detail
- "SAY HI" → sends intro request
- "SAVE" → saves profile for later

**Information needed from product owner:**
- How are "similar moms" determined? (location? children ages? interests? all?)
- What happens when "SAY HI" is tapped? (instant connection? request flow?)
- What does "SAVE" do? (bookmarks for later? separate list?)
- How many profiles shown on home? (2? 3? scrollable?)

---

#### Communities Preview
- Shows 2-3 recommended communities
- Categorized by: location, child's birth date, experiences
- Tappable → navigates to community detail

**Information needed from product owner:**
- Are communities admin-created or user-created?
- How is membership managed? (open join? request? invite?)
- What content appears inside a community? (posts? threads? chat?)
- Can users create their own communities?

---

#### Fresh Drop Preview
- Shows latest/featured article
- "SEE ALL" → navigates to Drops tab
- Item count shown

**Information needed from product owner:**
- Who creates drops/articles? (editorial team? users? both?)
- What's the content format? (text? images? video? links?)
- What does "save" do for drops?
- Are drops categorized? (parenting, wellness, products, etc.)
- Is there a comments/discussion section on drops?

---

### 4.2 Introductions Tab

**Purpose:** Social discovery and connection between moms.

**Based on screenshot context (header shows "Intro Requests: 2"):**

**Expected screens (awaiting screenshots):**
- Introduction feed (browse recommended profiles)
- Profile detail (full profile view of another mom)
- Intro request sent/received management
- Active connections (connected moms → 1:1 chat)

**Likely data model:**
```typescript
interface Introduction {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;        // Optional intro message
  createdAt: Timestamp;
  respondedAt?: Timestamp;
  expiresAt: Timestamp;    // Auto-expire after X days
}
```

**Information needed from product owner:**
- What does the Introductions main screen look like?
- Is there a swipe-based UI (like dating apps) or a browse grid?
- Can users send a message with an intro request?
- What happens after both users accept? (auto-create 1:1 chat room?)
- Is there a limit on daily intro requests?
- How does matching work? (algorithm? manual browse? both?)
- Can users filter by criteria? (location, children age, interests)
- Is there a "not interested" / block feature?

---

### 4.3 Communities Tab

**Purpose:** Facebook-like groups with extra features, tailored for moms.

**Based on screenshot context (categories: location, birth date, experiences):**

**Expected screens (awaiting screenshots):**
- Communities list (all communities, categorized)
- Community detail (posts, members, description)
- Community post/thread view
- Create post in community
- Community settings/info
- Community search/discover

**Likely data model:**
```typescript
interface Community {
  id: string;
  name: string;
  description: string;
  photoURL?: string;
  category: CommunityCategory;
  tags: string[];           // For matching (e.g., "expecting", "toddlers")
  memberCount: number;
  postCount: number;
  createdBy: string;        // Admin user ID
  admins: string[];
  isPublic: boolean;        // Open join or approval needed
  location?: {              // For location-based communities
    city?: string;
    state?: string;
    county?: string;
  };
  childAgeRange?: {         // For birth-date-based communities
    minMonths?: number;
    maxMonths?: number;
  };
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
}

type CommunityCategory =
  | 'location'
  | 'child_age'
  | 'experience'
  | 'interest'
  | 'lifestyle';

interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  type: 'text' | 'question' | 'recommendation' | 'event';
  title?: string;
  body: string;
  imageURLs?: string[];
  likeCount: number;
  commentCount: number;
  pinned: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  likeCount: number;
  createdAt: Timestamp;
}
```

**Information needed from product owner:**
- What does the Communities tab look like? (list? grid? categories?)
- What are the "extra features" beyond Facebook groups?
- What post types are supported? (text, photo, question, poll, event?)
- Is there a thread/reply structure (like Reddit) or flat comments?
- Can communities have events? Recommendations? Polls?
- Who moderates communities? (admins? community owners? Raine staff?)
- Is there a community chat (separate from posts)?
- How are communities recommended to users?
- Can users create communities? Or only admin-created?
- Are there private/invite-only communities?
- What's the maximum community size?

---

### 4.4 Drops Tab

**Purpose:** Curated content/articles with save/favorite functionality.

**Based on screenshot context ("PARENTING", "Bringing Baby Home", "4 items"):**

**Expected screens (awaiting screenshots):**
- Drops feed (browsable articles, categorized)
- Drop detail (full article view)
- Saved drops (user's favorites)
- Category filter/browse

**Likely data model:**
```typescript
interface Drop {
  id: string;
  title: string;
  subtitle?: string;
  body: string;               // Rich text or markdown
  category: DropCategory;
  tags: string[];
  imageURL?: string;
  authorName?: string;        // Editorial attribution
  readTimeMinutes: number;
  likeCount: number;
  saveCount: number;
  published: boolean;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

type DropCategory =
  | 'parenting'
  | 'wellness'
  | 'lifestyle'
  | 'products'
  | 'relationships'
  | 'career'
  | 'recipes'
  | 'activities';

interface UserSavedDrop {
  dropId: string;
  savedAt: Timestamp;
}
```

**Information needed from product owner:**
- What does the Drops tab look like? (feed? grid? magazine-style?)
- What's the content format? (long-form articles? short tips? both?)
- Who writes the content? (editorial team? community? curated links?)
- Can users comment on drops? Or just save/like?
- Are there different content types? (articles, tips, product recommendations, recipes?)
- Is there a video component?
- How frequently is new content published?
- Is content personalized based on user profile?
- Can users share drops externally?

---

### 4.5 Profile Redesign

**Current state:** Minimal profile screen with display name editing.

**Needed:** Full profile view that serves as:
- The user's public-facing profile (what other moms see)
- Access to settings
- Profile editing
- Subscription status

**Expected sub-screens:**
- Profile view (public view preview)
- Edit profile (modify fields from profile setup)
- Settings (moved from current tab)
- Account management

**Information needed from product owner:**
- What does the public profile look like?
- What information is visible to other moms?
- Can users edit their profile setup answers after initial setup?
- Where does Settings live now? (inside profile? header icon? separate?)

---

### 4.6 Navigation Redesign

**Current:**
```
Tabs: [Rooms] [Profile] [Settings]
```

**Needed (from screenshot):**
```
Tabs: [Home] [Introductions] [Communities] [Drops]
```

Plus access to Profile and Settings via:
- Profile icon in header (top right of Home)
- Or a 5th tab for Profile

**Information needed:**
- Is there a 5th tab for Profile? Or accessed from header icon only?
- What are the exact tab icons?
- Is there a notification badge on tabs? (e.g., red dot on Introductions for pending requests)

---

## 5. What We Can Start Now vs What Needs Clarification

### 5.1 Can Start Immediately (No Screenshots Needed)

| Task | Effort | Dependencies |
|------|--------|-------------|
| Rewrite `(tabs)/_layout.tsx` with 4 tabs | 1 hour | Tab icon assets |
| Create `ActivityDashboard` component | 2 hours | None (mock data) |
| Create `SectionHeader` component | 30 min | None |
| Create `MomsLikeYouCarousel` component shell | 2 hours | None (mock data) |
| Create `CommunityPreviewCard` component | 1 hour | None (mock data) |
| Create `DropPreviewCard` component | 1 hour | None (mock data) |
| Define TypeScript types for all new models | 2 hours | None |
| Create new Zustand stores (communities, drops, introductions) | 3 hours | Type definitions |
| Move Settings from tab to profile sub-screen | 1 hour | None |

### 5.2 Needs Screenshots / Product Clarification

| Screen/Flow | What We Need | Blocks |
|-------------|-------------|--------|
| **Introductions tab** | Full screen screenshot + flow description | Introductions feature |
| **Community detail** | Screenshot of a community page (posts, members) | Communities feature |
| **Community post** | Screenshot of a post with comments | Community interaction |
| **Drop detail** | Screenshot of a full article view | Drops feature |
| **Drops tab** | Screenshot of the drops list/feed | Drops feature |
| **Profile view** | Screenshot of full user profile | Profile redesign |
| **Matching logic** | Description of how "Moms Like You" works | Recommendation engine |
| **Community types** | List of community categories and features | Community data model |
| **Content strategy** | Who creates drops? How often? | Content pipeline |

### 5.3 Needs Backend Before Implementation

| Frontend Feature | Backend Requirement | Effort |
|-----------------|-------------------|--------|
| Activity counters | Aggregation endpoint or real-time listeners | 4 hours |
| "Moms Like You" | Recommendation/matching algorithm | 8+ hours |
| Community membership | `communities` collection + security rules | 4 hours |
| Community posts | `posts` subcollection + CRUD functions | 6 hours |
| Drops/articles | `drops` collection + admin CMS | 4 hours |
| Saved drops | `users/{uid}/savedDrops` subcollection | 2 hours |
| Intro requests | `introductions` collection + notification triggers | 6 hours |
| Unread counts | Counters aggregation (possibly Cloud Function) | 4 hours |

---

## 6. Estimated Scope

### 6.1 New Screens Needed

| Tab | Screen | Priority | Complexity |
|-----|--------|----------|------------|
| **Home** | Dashboard | P0 | High (aggregation, multiple sections) |
| **Introductions** | Feed/Browse | P0 | High (matching, profiles) |
| **Introductions** | Profile Detail | P0 | Medium (display profile data) |
| **Introductions** | Request Management | P1 | Medium (accept/decline/expire) |
| **Introductions** | Connections List | P1 | Low (list of connected moms → chat) |
| **Communities** | Browse/Discover | P0 | Medium (categorized list) |
| **Communities** | Community Detail | P0 | High (posts feed, members, info) |
| **Communities** | Create/View Post | P0 | Medium (form + display) |
| **Communities** | Post Comments | P1 | Medium (threaded comments) |
| **Communities** | Community Info/Settings | P2 | Low |
| **Drops** | Feed/Browse | P0 | Medium (categorized articles) |
| **Drops** | Article Detail | P0 | Medium (rich content display) |
| **Drops** | Saved Articles | P1 | Low (list with unsave) |
| **Profile** | Full Profile View | P0 | Medium (redesign current) |
| **Profile** | Edit Profile | P1 | Medium (reuse profile setup components) |

**Total:** ~15 new screens

### 6.2 Effort Estimates (Frontend Only)

| Phase | Screens | Components | Services/Types | Estimated Time |
|-------|---------|------------|---------------|---------------|
| Navigation + Types | 1 | 0 | 5 files | 1 day |
| Home Dashboard | 1 | 6 | 2 services | 2 days |
| Introductions (basic) | 3 | 8 | 2 services | 3-4 days |
| Communities (basic) | 4 | 10 | 3 services | 4-5 days |
| Drops (basic) | 3 | 6 | 2 services | 2-3 days |
| Profile Redesign | 2 | 4 | 1 service | 1-2 days |
| **Total** | **~15** | **~34** | **~15** | **~14-17 days** |

**Note:** This is frontend-only. Backend work runs in parallel but must be sequenced correctly (types first, then services).

---

## 7. Recommended Approach

### Phase 1: Foundation (Can Start Now)
1. Define all new TypeScript types (Communities, Drops, Introductions, Activity)
2. Rewrite tab navigation (4 tabs + header profile icon)
3. Create shared components (SectionHeader, ActivityDashboard, card templates)
4. Create Zustand stores for new features
5. Create Home dashboard with mock data

### Phase 2: Awaiting Product Input (Need Screenshots)
6. Build Introductions tab (need: matching logic, screen designs)
7. Build Communities tab (need: feature spec, screen designs)
8. Build Drops tab (need: content format, screen designs)
9. Redesign Profile (need: public profile layout)

### Phase 3: Backend Integration
10. Create backend collections, rules, functions
11. Replace mock data with Firebase listeners
12. Implement real-time activity counters
13. Build matching/recommendation engine

---

## 8. Questions for Product Owner

### Critical (Blocks Design)

1. **Introductions:** What does the main Introductions screen look like? Is it a swipe interface, a grid of profiles, or a feed?

2. **Introductions:** When a user taps "SAY HI", what happens? Does it send a connection request? Open a message compose? Directly start a chat?

3. **Communities:** What appears inside a community? Is it a Facebook-like feed of posts? A chat? Both?

4. **Communities:** Are communities created by Raine staff or can users create them?

5. **Drops:** Who creates the content? Is it editorial content managed by Raine, or user-generated?

6. **Drops:** What does a full article page look like? Is it text-only or rich media?

7. **Profile:** How does a user access their profile and settings? Through the header icon? A 5th tab?

### Important (Affects Implementation)

8. **Matching:** How does "Moms Like You" determine similar profiles? Is it algorithmic or simple criteria matching (same city, similar-aged kids)?

9. **Notifications:** Should there be red badge counts on tab icons?

10. **Search:** Is there a global search? Or search within each section?

11. **Moderation:** How is content moderated in Communities? User reports? AI? Staff?

12. **Content management:** Is there a CMS for managing Drops content, or is it managed directly in Firestore?

13. **Offline support:** Should any of these features work offline (e.g., reading saved drops)?

---

## 9. Next Steps

**Immediate (you can do now):**
1. Share screenshots of Introductions, Communities, and Drops screens
2. Answer the critical questions in Section 8
3. Provide any design mockups or wireframes

**After screenshots received (LLM can do):**
1. Create detailed implementation plans per feature
2. Define complete data models
3. Design backend collections and Cloud Functions
4. Begin Phase 1 implementation (types, navigation, shared components)

---

**Document Version:** 1.0  
**Status:** Awaiting product screenshots and clarification  
**Next Action:** Product owner provides screenshots of Introductions, Communities, and Drops tabs
