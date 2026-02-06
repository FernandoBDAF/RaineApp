# Drops - Product Requirements Document

**Feature:** Drops (Curated Product Recommendations)  
**Date:** February 6, 2026  
**Status:** Design Complete, Implementation Pending  
**Source:** 6 UI screenshots from product owner

---

## 1. Feature Overview

**Drops** are editorially curated collections of product recommendations for moms. Each Drop is a themed group (e.g., "Bringing Baby Home", "Jet Set Baby") containing individual product items with descriptions, photos, and external "Shop" links - likely affiliate partner links.

Drops is NOT an article/blog system. It's a **product curation and discovery** feature similar to a shoppable lookbook or gift guide.

The feature spans two areas:
1. **Home Tab** → "Fresh Drop" section (featured Drop preview)
2. **Drops Tab** → Full browsing, category filtering, and saved items (My Hearts)

### Content Structure

```
Drop (Collection)
  ├── "Bringing Baby Home"
  │     ├── Section: "First Night Home"
  │     │     ├── Item: Lou Lou & Company Swaddles
  │     │     └── Item: Kudos Diapers
  │     ├── Section: "Rude Awakenings"
  │     │     ├── Item: Diaper Caddie
  │     │     ├── Item: Cordless Lamp
  │     │     └── Item: Mini Fridge
  │     ├── Section: "That First Outing"
  │     ├── Section: "Feeding, Any & Everywhere"
  │     ├── Section: "Bath-to-Bed (We Hope!)"
  │     └── Section: "The In-Between"
  ├── "Jet Set Baby"
  │     └── ...
  └── "Tiny Foodie"
        └── ...
```

**3-level hierarchy:** Drop → Section → Item

---

## 2. User Flows

### 2.1 Flow A: Home → Fresh Drop Preview → Drop Detail

```
Home Tab
  └── Scroll to "FRESH DROP" section
        └── Featured Drop card ("Bringing Baby Home")
              ├── "SEE ALL >" → Navigates to Drops tab
              └── Tap card → Opens Drop detail
```

### 2.2 Flow B: Drops Tab → Browse → Open Drop

```
Drops Tab
  └── "RAINE DROPS" sub-tab (default)
        └── Search bar + category filters
              └── 2-column grid of Drop covers
                    └── Tap a Drop card
                          └── Drop Table of Contents (sections list)
                                └── Tap a section OR swipe right
                                      └── Section detail (product items)
                                            └── Swipe to continue between sections
```

### 2.3 Flow C: Heart (Save) a Product Item

```
Section Detail (e.g., "First Night Home")
  └── Product Item (e.g., "Cordless Lamp")
        └── Tap ♡ (heart icon)
              └── Item saved to "My Hearts"
              └── Heart icon fills coral
```

### 2.4 Flow D: Shop External Link

```
Section Detail
  └── Product Item
        └── Tap "Shop 🔗" link
              └── Opens external URL in system browser
              └── Affiliate/partner product page
```

### 2.5 Flow E: My Hearts (Saved Items)

```
Drops Tab
  └── "MY HEARTS (1)" sub-tab
        └── List of saved product items
              ├── Item shows: product image, drop name, item name
              ├── "SHOP NOW 🔗" → opens external link
              └── "REMOVE" → removes from My Hearts
```

---

## 3. Screen-by-Screen Specification

### 3.1 Home → "Fresh Drop" Section

**Location:** Home tab, below "Communities" section

**Layout:**
```
┌─────────────────────────────────────────────┐
│  FRESH DROP                    SEE ALL >    │
│  ─────────────── (coral line)               │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │     (solid coral/red background)     │   │
│  │                                      │   │
│  │  NEWBORN                             │   │
│  │  Bringing Baby Home                  │   │
│  │  (large, white, serif/italic)        │   │
│  │                                      │   │
│  ├──────────────────────────────────────┤   │
│  │  You don't need much – just the      │   │
│  │  right things        2 items   >     │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

**Specifications:**

| Element | Style | Details |
|---------|-------|---------|
| Section header | "FRESH DROP", coral, uppercase, serif, letter-spaced | Left-aligned |
| "SEE ALL >" | Coral, uppercase, small, right-aligned | Navigates to Drops tab |
| Coral line | Full-width below header | Brand accent |
| Card background | Solid bold coral/red (#E8401C approx) | Full-width, prominent |
| Category label | Light/white, small, uppercase | "NEWBORN" on top of the colored area |
| Drop title | White, large, serif/italic | "Bringing Baby Home" |
| Subtitle bar | White background, below colored area | Description + item count |
| Description | Dark, regular | "You don't need much – just the right things" |
| Item count | Coral text | "2 items" (note: this shows a subset, full Drop has more) |
| Chevron | Coral ">" | Indicates tappable |
| Tap action | Opens Drop detail (table of contents) | Full card is tappable |

---

### 3.2 Drops Tab - Raine Drops Sub-Tab

**Location:** Fourth bottom tab ("Drops")

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Raine (logo)                          👤   │
│                                              │
│  YOUR                                        │
│  Drops                                       │
│  ─────────────── (coral line)               │
│                                              │
│  [RAINE DROPS]    MY HEARTS                 │
│  ─────────────                               │
│                                              │
│  🔍 SEARCH DROPS                            │
│                                              │
│  [NEWBORN] [TODDLER] [FEEDING] [WELL...]   │
│                                              │
│  ┌────────────┐ ┌────────────┐              │
│  │            │ │            │              │
│  │   (pink    │ │  (yellow   │              │
│  │    bg)     │ │    bg)     │              │
│  │            │ │            │              │
│  │ THE DROP   │ │ THE DROP   │              │
│  │     X      │ │     X      │              │
│  │ BRINGING   │ │  JET SET   │              │
│  │ BABY HOME  │ │   BABY     │              │
│  │        ♡   │ │            │              │
│  └────────────┘ └────────────┘              │
│                                              │
│  ┌────────────┐                              │
│  │            │                              │
│  │   (blue    │                              │
│  │    bg)     │                              │
│  │ THE DROP   │                              │
│  │     X      │                              │
│  │   TINY     │                              │
│  │  FOODIE    │                              │
│  └────────────┘                              │
│                                              │
│  🏠 Home  👥 Intros  💬 Comm  📄 Drops      │
└─────────────────────────────────────────────┘
```

**Page Header:**

| Element | Style | Details |
|---------|-------|---------|
| "YOUR" | Coral, uppercase, small | Label above title |
| "Drops" | Large, serif, black | Page title |
| Coral line | Full-width | Brand accent |
| Tab switcher | "RAINE DROPS" (active, coral underline) / "MY HEARTS" (inactive) | Two sub-tabs |

**Search & Filters:**

| Element | Style | Details |
|---------|-------|---------|
| Search bar | "SEARCH DROPS", uppercase placeholder, full-width | Filters drops by name |
| Category pills | Horizontal scroll, gray outlined pills | "NEWBORN", "TODDLER", "FEEDING", "WELL..." (truncated) |
| Category behavior | Tap to filter grid | Single-select or multi-select filter |

**Category Filters Observed:**
- NEWBORN
- TODDLER
- FEEDING
- WELL... (truncated, likely "WELLNESS")
- (potentially more off-screen)

**Drop Cover Card:**

```
┌────────────────────────┐
│                         │
│   (solid color bg)     │
│   pink / yellow / blue │
│                         │
│     THE DROP            │
│        X                │
│                         │
│   DROP TITLE            │
│   (serif, coral text)  │
│                    ♡    │
└────────────────────────┘
```

| Element | Style | Details |
|---------|-------|---------|
| Card | Half-width (2-column grid), ~180px tall | Solid pastel background color |
| Background color | Unique per Drop | Pink (#F4B4B0), Yellow (#F0D043), Blue-gray (#B0BAC5) |
| "THE DROP" | White/light, uppercase, display font, letter-spaced | Centered branding |
| "X" | White, centered | Separator/brand mark |
| Drop title | Coral, serif/italic, centered | "BRINGING BABY HOME", "JET SET BABY", "TINY FOODIE" |
| Heart icon | ♡ outline, bottom-right | Only visible on some cards (favoriting the entire Drop?) |
| Tap action | Opens Drop Table of Contents | Full card tappable |

**Drops Observed:**

| Drop | Background | Title |
|------|-----------|-------|
| Bringing Baby Home | Pink | BRINGING BABY HOME |
| Jet Set Baby | Yellow | JET SET BABY |
| Tiny Foodie | Blue-gray | TINY FOODIE |

---

### 3.3 Drop Table of Contents

**Trigger:** Tap a Drop cover card

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ←                                    ✕     │
│                                              │
│  THE DROP                                    │
│  ────── (coral line)                        │
│                                              │
│  Inside                                      │
│  This Drop...                               │
│  (large, coral, serif/italic)               │
│                                              │
│  First Night Home                            │
│                                              │
│  Rude Awakenings                             │
│                                              │
│  That First Outing                           │
│                                              │
│  Feeding, Any & Everywhere                  │
│                                              │
│  Bath-to-Bed (We Hope!)                     │
│                                              │
│  The In-Between                              │
│                                              │
│  Tap a section or tap right edge             │
│  to continue →                               │
│  (coral, italic)                             │
│                                              │
└─────────────────────────────────────────────┘
```

**Specifications:**

| Element | Style | Details |
|---------|-------|---------|
| Navigation | ← back arrow (left), ✕ close (right) | ← returns to Drops tab, ✕ closes viewer |
| "THE DROP" | Coral, uppercase, small, letter-spaced | Brand label with coral underline |
| Title | "Inside This Drop...", large, coral, serif/italic | Table of contents header |
| Section list | Dark, regular, ~18px, generous line-height | Vertical list of section names |
| Navigation hint | Coral, italic, centered | "Tap a section or tap right edge to continue →" |

**Sections in "Bringing Baby Home":**
1. First Night Home
2. Rude Awakenings
3. That First Outing
4. Feeding, Any & Everywhere
5. Bath-to-Bed (We Hope!)
6. The In-Between

**Navigation Model:**
- Tap a section name → jumps directly to that section
- Tap right edge of screen → advances to next section (swipe-like pagination)
- This suggests a **horizontal paged view** where sections are full-screen pages

---

### 3.4 Section Detail - Product Items

**Trigger:** Tap a section from Table of Contents, or swipe from previous section

**Layout (Section: "First Night Home"):**
```
┌─────────────────────────────────────────────┐
│  ←                                    ✕     │
│                                              │
│  FIRST NIGHT HOME                           │
│  (bold, coral, uppercase, serif)            │
│  You don't need much – just the right       │
│  things                                      │
│  ─────────────── (coral line)               │
│                                              │
│  ── Lou Lou & Company Swaddles ── ♡ Shop 🔗│
│                                              │
│  [Product     ] The only blanket we ever    │
│  [ Photo      ] used.                       │
│  [            ] Stretchy, breathable,       │
│               generously sized – and        │
│               designed by a NICU nurse.     │
│                                              │
│               In prints that feel fun and   │
│               sophisticated, not babyish.   │
│                                              │
│  ─────────────────────────────────────────  │
│                                              │
│  ── Kudos Diapers ──────────── ♡ Shop 🔗  │
│                                              │
│  The only diaper with 100% cotton           │
│  against your baby's skin.     [Product    ]│
│  DoubleDry™ tech with 2x       [ Photo    ]│
│  absorption layers.             [          ]│
│                                              │
│  Dry – ALL night long.                      │
│                                              │
│            Swipe to continue                 │
│            (coral, italic)                   │
│                                              │
└─────────────────────────────────────────────┘
```

**Section Header:**

| Element | Style | Details |
|---------|-------|---------|
| Navigation | ← back (to TOC) + ✕ close (exit Drop viewer) | Same as TOC |
| Section title | Bold, coral, uppercase, serif | "FIRST NIGHT HOME", "RUDE AWAKENINGS" |
| Subtitle | Gray, italic, regular | "You don't need much – just the right things" |
| Coral line | Below subtitle | Section separator |

**Product Item Card:**

| Element | Style | Details |
|---------|-------|---------|
| Product name | Bold, black, serif, ~16px | "Lou Lou & Company Swaddles", "Kudos Diapers" |
| Heart icon | ♡ outline (gray) / ♥ filled (coral) | Right of product name, saves item |
| "Shop 🔗" | Gray text + external link icon | Right-aligned, opens affiliate URL |
| Product photo | ~80-100px, rounded corners | Either left or right of text (alternating layout) |
| Headline | Bold, black, ~14px | "The only blanket we ever used." |
| Description | Gray, regular, ~13px | Product details, multi-line |
| Editorial note | Gray, italic | "In prints that feel fun and sophisticated, not babyish." |
| Separator | Coral horizontal line | Between items |

**Product Item Layout Alternation:**
Items alternate between:
- Photo LEFT, text RIGHT (Lou Lou Swaddles)
- Text LEFT, photo RIGHT (Kudos Diapers, Diaper Caddie, Mini Fridge)

This creates visual variety and a magazine-like reading experience.

**Section: "Rude Awakenings" Items Observed:**
1. **Diaper Caddie** - "Organization at all hours."
2. **Cordless Lamp** - "Light – where you need it, regardless of an outlet."
3. **Mini Fridge** - "No trips downstairs."

Each item has the same structure: name, heart, shop link, photo, headline, description, editorial note.

**Navigation:**
- "Swipe to continue" (coral, italic) at bottom → advance to next section
- ← arrow returns to Table of Contents
- ✕ exits the entire Drop viewer

---

### 3.5 Drops Tab - My Hearts Sub-Tab

**Trigger:** Tap "MY HEARTS" on Drops tab switcher

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Raine (logo)                          👤   │
│                                              │
│  YOUR                                        │
│  Drops                                       │
│  ─────────────── (coral line)               │
│                                              │
│  RAINE DROPS    [MY HEARTS (1)]             │
│                 ─────────────────            │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Product   ] BRINGING BABY HOME      │   │
│  │ [ Photo    ] Cordless Lamp           │   │
│  │ [          ] SHOP NOW 🔗   REMOVE    │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ─────────────── (coral line separator)     │
│                                              │
│  (empty below - only 1 saved item)          │
│                                              │
└─────────────────────────────────────────────┘
```

**Tab Switcher:**

| Element | Style | Details |
|---------|-------|---------|
| "RAINE DROPS" | Gray text (inactive) | Switch back to browse |
| "MY HEARTS (1)" | Coral text, coral underline (active) | Count in parentheses |

**Saved Item Row:**

| Element | Style | Details |
|---------|-------|---------|
| Product photo | Square, ~64px, left-aligned | Product thumbnail |
| Drop name | Gray, uppercase, small | "BRINGING BABY HOME" (source Drop) |
| Item name | Black, bold, regular | "Cordless Lamp" |
| "SHOP NOW 🔗" | Coral, uppercase, with external link icon | Opens affiliate URL |
| "REMOVE" | Gray, uppercase | Removes from My Hearts |
| Separator | Coral horizontal line | Between items |

---

## 4. Data Model

### 4.1 Drop (Collection)

**Collection:** `drops/{dropId}`

```typescript
interface Drop {
  id: string;
  title: string;                    // "Bringing Baby Home"
  subtitle?: string;                // "You don't need much – just the right things"
  coverColor: string;               // Hex color for cover card: "#F4B4B0"
  category: DropCategory;           // For filtering
  tags: string[];                   // Additional filter tags
  sectionCount: number;             // Cached: number of sections
  itemCount: number;                // Cached: total items across sections
  heartCount: number;               // Cached: total hearts/saves
  isFeatured: boolean;              // Shown on Home "Fresh Drop" section
  published: boolean;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

type DropCategory =
  | 'newborn'
  | 'toddler'
  | 'feeding'
  | 'wellness'
  | 'travel'
  | 'lifestyle'
  | 'gear';
```

### 4.2 Drop Section

**Collection:** `drops/{dropId}/sections/{sectionId}`

```typescript
interface DropSection {
  id: string;
  title: string;                    // "First Night Home"
  subtitle?: string;                // "You don't need much – just the right things"
  order: number;                    // Display order (1, 2, 3...)
  itemCount: number;                // Cached
}
```

### 4.3 Drop Item (Product)

**Collection:** `drops/{dropId}/sections/{sectionId}/items/{itemId}`

```typescript
interface DropItem {
  id: string;
  productName: string;              // "Lou Lou & Company Swaddles"
  headline: string;                 // "The only blanket we ever used."
  description: string;              // Product details
  editorialNote?: string;           // Italic note: "In prints that feel fun..."
  photoURL: string;                 // Product photo
  shopURL: string;                  // Affiliate/external link
  affiliatePartner?: string;        // Partner tracking
  order: number;                    // Display order within section
  heartCount: number;               // Cached saves count
}
```

### 4.4 User Hearted Item

**Collection:** `users/{userId}/heartedItems/{itemId}`

```typescript
interface HeartedItem {
  itemId: string;
  dropId: string;
  sectionId: string;
  dropTitle: string;                // Cached: "Bringing Baby Home"
  productName: string;              // Cached: "Cordless Lamp"
  productPhotoURL: string;          // Cached
  shopURL: string;                  // Cached for quick access
  heartedAt: Timestamp;
}
```

---

## 5. Component Architecture

### 5.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `FreshDropPreview` | `components/drops/` | Home tab "Fresh Drop" card (colored bg + title) |
| `DropCoverCard` | `components/drops/` | Grid card with colored bg + "THE DROP X" branding |
| `DropCategoryFilters` | `components/drops/` | Horizontal scroll of category pills |
| `DropTableOfContents` | `components/drops/` | "Inside This Drop..." section list |
| `DropSectionView` | `components/drops/` | Full section page with product items |
| `DropProductItem` | `components/drops/` | Individual product (photo, name, description, heart, shop) |
| `DropHeartButton` | `components/drops/` | ♡ toggleable heart icon |
| `DropShopLink` | `components/drops/` | "Shop 🔗" / "SHOP NOW 🔗" external link |
| `HeartedItemRow` | `components/drops/` | Saved item in My Hearts list |
| `SwipeHint` | `components/drops/` | "Swipe to continue" coral italic text |
| `DropBranding` | `components/drops/` | "THE DROP X" centered text overlay |

### 5.2 New Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Drops Tab | `(tabs)/drops.tsx` | Raine Drops grid + My Hearts |
| Drop Viewer | `drop/[id].tsx` | Table of Contents + paginated sections |
| Drop Section | `drop/[id]/[sectionId].tsx` | OR embedded in viewer as horizontal pager |

### 5.3 Navigation Model

The Drop viewer uses a **book-like navigation**:

```
[Drops Tab] → [Drop Cover] → [Table of Contents] → [Section 1] → [Section 2] → ... → [Section N]
                                    ↑                    ↑              ↑
                                    │                    │              │
                                    ← back arrow ────────┘              │
                                    ← swipe left ──────────────────────┘
                                                  swipe right → next section
```

**Implementation Options:**
1. **Horizontal FlatList/PagerView** - Sections as pages, swipe between them
2. **React Native Pager** - Native page swiping with TOC as first page
3. **Stack Navigation** - Each section is a screen (less fluid)

**Recommended:** PagerView (e.g., `react-native-pager-view`) for smooth swipe navigation between sections, with TOC as the first page.

---

## 6. Design System Observations

### 6.1 Drop-Specific Typography

| Usage | Style | Example |
|-------|-------|---------|
| "THE DROP" | White/light, uppercase, display font, wide letter-spacing | Cover branding |
| "X" | Same as above, smaller | Brand mark separator |
| Drop title (cover) | Coral, serif/italic | "BRINGING BABY HOME" |
| Section title | Bold, coral, uppercase, serif | "FIRST NIGHT HOME" |
| Section subtitle | Gray, italic | "You don't need much – just the right things" |
| Product name | Bold, black, serif, ~16px | "Lou Lou & Company Swaddles" |
| Product headline | Bold, black, sans-serif, ~14px | "The only blanket we ever used." |
| Product description | Gray, regular, ~13px | Detailed text |
| Editorial note | Gray, italic, ~13px | "In prints that feel fun and sophisticated..." |
| "Swipe to continue" | Coral, italic, centered | Navigation hint |
| "Inside This Drop..." | Large, coral, serif/italic | TOC header |

### 6.2 Drop Cover Colors

Each Drop has a unique **solid pastel background color**:

| Drop | Color | Hex (approx) |
|------|-------|-------------|
| Bringing Baby Home | Pink | #F4B4B0 |
| Jet Set Baby | Yellow | #F0D043 |
| Tiny Foodie | Blue-gray | #B0BAC5 |
| Home Fresh Drop card | Bold red/coral | #E8401C |

These are editorial choices per Drop, stored in the `coverColor` field.

---

## 7. Key Design Patterns

### 7.1 Alternating Item Layout

Product items within a section alternate their photo position:

| Item # | Photo Position | Text Position |
|--------|---------------|---------------|
| 1 | Left | Right |
| 2 | Right | Left |
| 3 | Left | Right |
| ... | Alternating | Alternating |

This creates a magazine-like zigzag reading flow.

### 7.2 Heart/Save Interaction

| Action | Location | Result |
|--------|----------|--------|
| Tap ♡ on product item | Section detail view | Saves item to My Hearts, fills heart coral |
| Tap ♡ on Drop cover | Drops grid | Saves entire Drop (?) - needs clarification |
| "REMOVE" in My Hearts | My Hearts tab | Removes from saved, decrements count |

### 7.3 External Links

| Link Type | Trigger | Behavior |
|-----------|---------|----------|
| "Shop 🔗" | In section detail | Opens `shopURL` in system browser (Safari/Chrome) |
| "SHOP NOW 🔗" | In My Hearts | Same - opens external link |
| "SEE ALL >" | Home Fresh Drop | Navigates to Drops tab (internal) |

**Business Model Implication:** The `shopURL` likely contains affiliate tracking parameters. This is a potential revenue stream for Raine through curated product partnerships.

---

## 8. Backend Requirements

### 8.1 Cloud Functions

| Function | Type | Purpose |
|----------|------|---------|
| `getDrops` | Callable | Return drops list with optional category filter |
| `getDrop` | Callable | Return full drop with sections and items |
| `heartItem` | Callable | Save/unsave item to user's hearts |
| `getHeartedItems` | Callable | Return user's saved items |
| `getFeaturedDrop` | Callable | Return the current featured drop for Home |

### 8.2 Content Management

Drops content is **editorial** (created by Raine staff, not users). This requires either:

1. **Firestore Admin Panel** - Staff directly create/edit documents in Firestore Console
2. **CMS Integration** - External CMS (Contentful, Sanity, Strapi) synced to Firestore
3. **Admin Dashboard** - Custom web app for content management

**Recommended for MVP:** Direct Firestore Console management. Staff creates Drop documents, sections, and items manually. Migrate to CMS when content volume grows.

### 8.3 Firestore Security Rules

```javascript
match /drops/{dropId} {
  // All authenticated users can read drops
  allow read: if isAuthenticated();
  allow write: if false;  // Admin-only (via Firebase Console or admin SDK)

  match /sections/{sectionId} {
    allow read: if isAuthenticated();
    allow write: if false;

    match /items/{itemId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
  }
}

// User's saved items
match /users/{userId}/heartedItems/{itemId} {
  allow read: if isOwner(userId);
  allow create, delete: if isOwner(userId);
}
```

### 8.4 Firestore Indexes

| Collection | Fields | Purpose |
|-----------|--------|---------|
| `drops` | `published` + `publishedAt` (desc) | Browse published drops by recency |
| `drops` | `category` + `published` + `publishedAt` (desc) | Filter by category |
| `drops` | `isFeatured` + `publishedAt` (desc) | Home featured drop |
| `sections` | `order` (asc) | Section ordering within drop |
| `items` | `order` (asc) | Item ordering within section |
| `heartedItems` | `heartedAt` (desc) | My Hearts sorted by recency |

---

## 9. Differences from Other Features

| Aspect | Introductions | Communities | Drops |
|--------|--------------|-------------|-------|
| Content source | Algorithm + users | Users (posts) | Editorial (Raine staff) |
| User interaction | Say Hi, Save, Chat | Post, Reply, Like, Save | Heart, Shop (external) |
| Data ownership | User-generated | User-generated | Platform-curated |
| Monetization | None | None | **Affiliate links** |
| Read/write | Read + Write | Read + Write | **Read-only** (except hearts) |
| Real-time | Yes (chat) | Yes (posts) | **No** (static content) |
| Complexity | High (matching) | High (threads) | **Low** (CMS content) |

**Key Insight:** Drops is the **simplest feature to implement** - it's read-only content with a save/heart mechanism. No real-time features, no user-generated content, no complex queries.

---

## 10. Open Questions

1. **Heart on Drop cover:** Can users heart an entire Drop (seen ♡ on "Bringing Baby Home" cover), or only individual items?
2. **Affiliate tracking:** Are affiliate URLs pre-built or dynamically generated with user tracking?
3. **Content frequency:** How often are new Drops published? Weekly? Monthly?
4. **Content creation:** Who creates Drops? Is there a CMS or manual Firestore entry?
5. **Category management:** Are categories fixed or dynamic?
6. **Personalization:** Are Drops shown based on user profile (e.g., only newborn Drops for expecting moms)?
7. **Notifications:** Do users get notified when a new Drop is published?
8. **Analytics:** Track which items get the most hearts/shops for partner reporting?

---

## 11. Implementation Priority

### MVP
1. Drops tab with Raine Drops grid (static content)
2. Drop viewer: Table of Contents + Section detail with product items
3. Heart/save items
4. My Hearts tab
5. Home "Fresh Drop" preview
6. Category filter pills
7. External "Shop" links

### Post-MVP
8. Search within Drops
9. Personalized Drop recommendations based on profile
10. Analytics tracking for affiliate partners
11. Push notification for new Drops
12. Full CMS integration for content management

---

**Document Version:** 1.0  
**Source Assets:** 6 screenshots stored in `.cursor/projects/*/assets/`  
**Status:** Complete - All 4 feature PRDs now documented (Home, Introductions, Communities, Drops)
