# Plan E: Communities Feature
## Group Discussions for Moms

**Scope:** RaineApp frontend — Communities tab + community detail + timeline + posts  
**Duration:** 4-5 days  
**Dependencies:** Plan B (Foundation) must be complete  
**Parallel With:** Plans C (Drops) and D (Introductions)  
**Feeds Into:** Plan F (Home Dashboard uses Communities preview)

---

## Context

Communities are curated micro-groups connecting moms with shared contexts — same city, similar-aged children, or common experiences. Unlike Introductions (1:1), Communities are group spaces centered around threaded discussions. This is the most complex feature.

**Source:** [Communities PRD](./3-COMMUNITIES-PRD.md) for complete spec with screenshots

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | CommunityPreviewCard (Home) | `src/components/communities/CommunityPreviewCard.tsx` | 2h |
| 2 | CommunityCard (grid) | `src/components/communities/CommunityCard.tsx` | 2h |
| 3 | CommunityHeader (detail) | `src/components/communities/CommunityHeader.tsx` | 3h |
| 4 | NoteworthyCarousel | `src/components/communities/NoteworthyCarousel.tsx` | 2h |
| 5 | NoteworthyPostCard | `src/components/communities/NoteworthyPostCard.tsx` | 1.5h |
| 6 | AskQuestionInput | `src/components/communities/AskQuestionInput.tsx` | 1.5h |
| 7 | CommunityPost | `src/components/communities/CommunityPost.tsx` | 3h |
| 8 | PostReply | `src/components/communities/PostReply.tsx` | 2h |
| 9 | JoinedCommunitiesGrid | `src/components/communities/JoinedCommunitiesGrid.tsx` | 1h |
| 10 | ActivityFeedRow | `src/components/communities/ActivityFeedRow.tsx` | 1.5h |
| 11 | JoinModal | `src/components/communities/JoinModal.tsx` | 1.5h |
| 12 | CommunityPreviewList (Home) | `src/components/communities/CommunityPreviewList.tsx` | 1h |
| 13 | Communities tab screen | `src/app/(tabs)/communities.tsx` | 5h |
| 14 | Community detail screen | `src/app/community/[id].tsx` | 4h |
| 15 | Community timeline screen | `src/app/community/[id]/timeline.tsx` | 6h |
| 16 | Saved Tips screen | `src/app/community/saved-tips.tsx` | 2h |
| 17 | Your Questions screen | `src/app/community/questions.tsx` | 2h |
| 18 | Communities service (mock) | `src/services/communities/index.ts` | 2h |
| 19 | Mock community data | `src/utils/mockCommunities.ts` | 2h |

**Total:** ~44 hours

---

## Screen Map

```
(tabs)/communities.tsx                   ← COMMUNITIES TAB
  ├── Header: "YOUR Communities"
  ├── TabSwitcher: JOINED / EXPLORE
  ├── JOINED sub-tab:
  │   ├── Your Communities grid (2 cols)
  │   │   └── Tap → community/[id].tsx
  │   ├── Your Activity row
  │   │   ├── Saved Tips (count) → community/saved-tips.tsx
  │   │   └── Your Questions (count) → community/questions.tsx
  │   └── Latest Activity feed
  │       └── Tap row → community/[id]/timeline.tsx
  └── EXPLORE sub-tab:
      ├── Info banner: "You can join up to 2 topic communities"
      ├── SearchBar + FilterPills (Topic, Stage, Size)
      └── Community grid
          └── LEARN MORE → JoinModal → Join

community/[id].tsx                       ← COMMUNITY DETAIL
  ├── Hero image with badge and name
  ├── Description (centered)
  ├── Member count + avatar row
  ├── NOTEWORTHY carousel
  ├── ASK THE MOMS section (input + send)
  │   └── Submit → creates post in timeline
  └── JOIN CONVERSATION button
      └── → community/[id]/timeline.tsx

community/[id]/timeline.tsx              ← COMMUNITY TIMELINE
  ├── SearchBar: "SEARCH MESSAGES"
  ├── Post list (chronological)
  │   ├── CommunityPost (body, like, reply, bookmark)
  │   │   ├── "Show X replies" toggle
  │   │   └── PostReply (indented, threaded)
  │   └── ...
  ├── Bottom input: "Share your thoughts..."
  └── Footer: "Be kind · Be helpful · We're all in this together"

community/saved-tips.tsx                 ← SAVED TIPS
  └── List of bookmarked posts

community/questions.tsx                  ← YOUR QUESTIONS
  └── List of user's questions with answer counts
```

---

## Task Details

### Task 1: CommunityPreviewCard (Home use)

**File:** `src/components/communities/CommunityPreviewCard.tsx`

Horizontal card (photo left, text right):
- Cover photo (~160px width) with category badge overlay and name overlay
- Description (2-3 lines, truncated)
- Member count in coral
- Chevron ">" indicating tappable

Category badges: "LOCATION" / "AGE" / "EXPERIENCE" on coral background.

### Task 2: CommunityCard (Grid)

**File:** `src/components/communities/CommunityCard.tsx`

Half-width card for 2-column grid in Joined tab:
- Square cover photo
- Community name below
- Member count

### Task 3: CommunityHeader

**File:** `src/components/communities/CommunityHeader.tsx`

Full-width hero for community detail:
- Hero image (~250px height) with gradient overlay
- ← back arrow (white, top-left)
- Community name badge (coral pill, centered, bottom of hero)
- Description below (centered, dark gray)
- Member count + MemberAvatarRow

### Task 4-5: Noteworthy Section

**NoteworthyCarousel:** Horizontal scroll of NoteworthyPostCard.

**NoteworthyPostCard:** Card showing author avatar, name, quoted text (italic), engagement stats (♡ likes, 💬 comments, ⭐ saves).

### Task 6: AskQuestionInput

**File:** `src/components/communities/AskQuestionInput.tsx`

Text input with "What's on your mind?" placeholder and coral send button. Submitting creates a new post in the community timeline.

### Task 7: CommunityPost

**File:** `src/components/communities/CommunityPost.tsx`

Full post component:
- Author avatar + name + timestamp
- Post body text
- Action bar: ♡ Like | 💬 Reply | 🔖 Bookmark
- "Show X replies" / "Hide X replies" toggle
- Replies section (list of PostReply, indented)

```typescript
interface CommunityPostProps {
  post: CommunityPost;
  replies: PostReply[];
  onLike: () => void;
  onReply: (text: string) => void;
  onBookmark: () => void;
}
```

### Task 8: PostReply

**File:** `src/components/communities/PostReply.tsx`

Indented reply:
- Author avatar + name + timestamp
- Reply body
- Like button

### Tasks 9-10: Joined Tab Components

**JoinedCommunitiesGrid:** 2-column FlatList of CommunityCard.

**ActivityFeedRow:** List row showing recent community activity (author + action + community name + time).

### Task 11: JoinModal

**File:** `src/components/communities/JoinModal.tsx`

Modal shown when exploring communities:
- Community info summary
- "Join this community?" prompt
- JOIN button (coral) / CANCEL button (gray)

### Task 12: CommunityPreviewList (Home)

**File:** `src/components/communities/CommunityPreviewList.tsx`

Vertical list of CommunityPreviewCards grouped by category. Used on Home tab.

### Task 13: Communities Tab

**File:** `src/app/(tabs)/communities.tsx`

Replace placeholder. Two sub-tabs:
- **Joined:** Your communities grid + activity shortcuts + activity feed
- **Explore:** Info banner + search + filters + community grid + join flow

### Task 14: Community Detail

**File:** `src/app/community/[id].tsx`

CommunityHeader + Noteworthy carousel + Ask question input + JOIN CONVERSATION button.

### Task 15: Community Timeline

**File:** `src/app/community/[id]/timeline.tsx`

Most complex screen:
- Search bar
- Chronological post list with threaded replies
- Reply toggle (show/hide)
- Reply inline form
- Bottom input for new posts
- Footer guidelines text

### Tasks 16-17: Saved Tips & Questions

Simple list screens accessing communitiesStore.

### Task 18: Communities Service

**File:** `src/services/communities/index.ts`

```typescript
export async function getJoinedCommunities(): Promise<Community[]> { ... }
export async function getExploreCommunities(): Promise<Community[]> { ... }
export async function getCommunityById(id: string): Promise<Community> { ... }
export async function getCommunityPosts(communityId: string): Promise<CommunityPost[]> { ... }
export async function getPostReplies(postId: string): Promise<PostReply[]> { ... }
export async function createPost(communityId: string, body: string): Promise<CommunityPost> { ... }
export async function createReply(postId: string, body: string): Promise<PostReply> { ... }
export async function likePost(postId: string): Promise<void> { ... }
export async function bookmarkPost(postId: string): Promise<void> { ... }
export async function joinCommunity(communityId: string): Promise<void> { ... }
export async function getSavedPosts(): Promise<SavedPost[]> { ... }
export async function getUserQuestions(): Promise<UserQuestion[]> { ... }
```

### Task 19: Mock Data

**File:** `src/utils/mockCommunities.ts`

- 3 communities: "SF Moms" (156 members), "Expecting Moms" (145), "Sensitive Skin Society" (12)
- 5-8 posts per community with 2-3 replies each
- 3 noteworthy posts
- 2 saved posts, 2 user questions

---

## File Structure

```
src/
├── components/
│   └── communities/                    ← NEW FOLDER
│       ├── CommunityPreviewCard.tsx
│       ├── CommunityPreviewList.tsx
│       ├── CommunityCard.tsx
│       ├── CommunityHeader.tsx
│       ├── NoteworthyCarousel.tsx
│       ├── NoteworthyPostCard.tsx
│       ├── AskQuestionInput.tsx
│       ├── CommunityPost.tsx
│       ├── PostReply.tsx
│       ├── JoinedCommunitiesGrid.tsx
│       ├── ActivityFeedRow.tsx
│       └── JoinModal.tsx
├── app/
│   ├── (tabs)/
│   │   └── communities.tsx             ← REPLACE placeholder
│   └── community/                      ← NEW FOLDER
│       ├── [id].tsx
│       ├── [id]/
│       │   └── timeline.tsx
│       ├── saved-tips.tsx
│       └── questions.tsx
├── services/
│   └── communities/
│       └── index.ts                    ← NEW
└── utils/
    └── mockCommunities.ts              ← NEW
```

---

## Verification Checklist

- [ ] Communities tab shows Joined/Explore tabs
- [ ] Joined tab shows community grid, activity shortcuts, feed
- [ ] Explore tab shows search, filters, community grid with LEARN MORE
- [ ] LEARN MORE opens JoinModal
- [ ] Tapping community card opens detail page
- [ ] Detail shows hero, members, noteworthy, ask input, join button
- [ ] Typing a question and sending creates post in timeline
- [ ] JOIN CONVERSATION opens timeline
- [ ] Timeline shows posts chronologically
- [ ] "Show/Hide X replies" toggles work
- [ ] Reply inline form submits new reply
- [ ] Like, reply, bookmark buttons respond
- [ ] New post from bottom input appears in list
- [ ] Saved Tips shows bookmarked posts
- [ ] Your Questions shows user's questions with answer counts
- [ ] `yarn type-check` passes
