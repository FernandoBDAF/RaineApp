# Plan C: Drops Feature
## Curated Product Recommendations

**Scope:** RaineApp frontend — Drops tab + Drop viewer + My Hearts  
**Duration:** 2-3 days  
**Dependencies:** Plan B (Foundation) must be complete  
**Parallel With:** Plans D (Introductions) and E (Communities)  
**Feeds Into:** Plan F (Home Dashboard uses Fresh Drop preview)

---

## Context

Drops are editorially curated product collections for moms. Each Drop is a themed group (e.g., "Bringing Baby Home") containing sections with product items. Users can heart (save) items and shop via external links. This is the simplest of the three main features, making it a good first implementation.

**Source:** [Drops PRD](./3-DROPS-PRD.md) for complete spec with screenshots

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | DropCoverCard component | `src/components/drops/DropCoverCard.tsx` | 2h |
| 2 | DropPreviewCard component (Home) | `src/components/drops/DropPreviewCard.tsx` | 1.5h |
| 3 | DropTableOfContents component | `src/components/drops/DropTableOfContents.tsx` | 2h |
| 4 | DropSection component | `src/components/drops/DropSection.tsx` | 2h |
| 5 | DropItemCard component | `src/components/drops/DropItemCard.tsx` | 2h |
| 6 | MyHeartsList component | `src/components/drops/MyHeartsList.tsx` | 2h |
| 7 | Drops tab screen | `src/app/(tabs)/drops.tsx` | 3h |
| 8 | Drop viewer screen | `src/app/drop/[id].tsx` | 4h |
| 9 | Drops service (mock) | `src/services/drops/index.ts` | 1h |
| 10 | Mock drop data | `src/utils/mockDrops.ts` | 1.5h |

**Total:** ~21 hours

---

## Screen Map

```
(tabs)/drops.tsx                    ← DROPS TAB
  ├── Sub-tab: RAINE DROPS
  │   ├── SearchBar
  │   ├── FilterPills (NEWBORN, TODDLER, FEEDING, WELLNESS...)
  │   └── 2-column grid of DropCoverCard
  │       └── Tap → drop/[id].tsx
  └── Sub-tab: MY HEARTS (count)
      └── MyHeartsList
          ├── Item → SHOP NOW (external link)
          └── Item → REMOVE

drop/[id].tsx                       ← DROP VIEWER
  ├── DropTableOfContents (section list)
  │   └── Tap section OR swipe right →
  └── DropSection (paginated, swipeable)
      └── DropItemCard
          ├── ♡ Heart → save to My Hearts
          └── Shop 🔗 → external browser
```

---

## Task Details

### Task 1: DropCoverCard

**File:** `src/components/drops/DropCoverCard.tsx`

Half-width card for 2-column grid. Solid pastel background, "THE DROP X" branding, drop title in coral serif.

```typescript
interface DropCoverCardProps {
  drop: Drop;
  onPress: () => void;
}
```

**Visual:** See [Drops PRD](./3-DROPS-PRD.md) section 3.2 for exact layout.

### Task 2: DropPreviewCard (for Home)

**File:** `src/components/drops/DropPreviewCard.tsx`

Large card used on Home tab "FRESH DROP" section. Solid coral background, category label, title, subtitle bar with item count.

### Task 3: DropTableOfContents

**File:** `src/components/drops/DropTableOfContents.tsx`

Full-screen view listing section names. "THE DROP" branding, "Inside This Drop..." header, tappable section list. Footer hint: "Tap a section or tap right edge to continue →"

### Task 4: DropSection

**File:** `src/components/drops/DropSection.tsx`

Scrollable list of DropItemCards within a section. Section title header, item count.

### Task 5: DropItemCard

**File:** `src/components/drops/DropItemCard.tsx`

Product card with photo, product name, description, heart toggle, "Shop 🔗" link.

```typescript
interface DropItemCardProps {
  item: DropItem;
  isHearted: boolean;
  onHeart: () => void;
  onShop: () => void;
}
```

Heart toggles coral fill. Shop opens external URL via `Linking.openURL()`.

### Task 6: MyHeartsList

**File:** `src/components/drops/MyHeartsList.tsx`

List of hearted items showing product image, drop name, item name, SHOP NOW button, REMOVE button.

### Task 7: Drops Tab Screen

**File:** `src/app/(tabs)/drops.tsx`

Replace placeholder with full implementation:
- Page header: "YOUR Drops" (coral/serif)
- TabSwitcher: RAINE DROPS / MY HEARTS (count)
- SearchBar
- FilterPills for categories
- 2-column FlatList of DropCoverCards

### Task 8: Drop Viewer Screen

**File:** `src/app/drop/[id].tsx`

Paginated viewer:
1. First page = Table of Contents
2. Subsequent pages = sections with items
3. Navigation: ← back, ✕ close, swipe left/right

Use horizontal FlatList or pager for swipe-between-sections behavior.

### Task 9: Drops Service

**File:** `src/services/drops/index.ts`

```typescript
export async function getDrops(): Promise<Drop[]> { ... }
export async function getDropById(id: string): Promise<Drop> { ... }
export async function heartItem(item: HeartedItem): Promise<void> { ... }
export async function unheartItem(itemId: string): Promise<void> { ... }
export async function getHeartedItems(): Promise<HeartedItem[]> { ... }
```

All mock for now; uses dropsStore.

### Task 10: Mock Data

**File:** `src/utils/mockDrops.ts`

3 complete mock drops:
- "Bringing Baby Home" (6 sections, 12 items) — pink background
- "Jet Set Baby" (4 sections, 8 items) — yellow background
- "Tiny Foodie" (3 sections, 6 items) — blue-gray background

Each item needs: productName, description, photoURL (use placeholder), shopURL, brand.

---

## File Structure

```
src/
├── components/
│   └── drops/                    ← NEW FOLDER
│       ├── DropCoverCard.tsx
│       ├── DropPreviewCard.tsx
│       ├── DropTableOfContents.tsx
│       ├── DropSection.tsx
│       ├── DropItemCard.tsx
│       └── MyHeartsList.tsx
├── app/
│   ├── (tabs)/
│   │   └── drops.tsx             ← REPLACE placeholder
│   └── drop/
│       └── [id].tsx              ← NEW
├── services/
│   └── drops/
│       └── index.ts              ← NEW
└── utils/
    └── mockDrops.ts              ← NEW
```

---

## Verification Checklist

- [ ] Drops tab shows 2-column grid of 3 drop covers
- [ ] Tapping a drop opens the table of contents
- [ ] Tapping a section shows product items
- [ ] Swiping left/right navigates between sections
- [ ] Tapping ♡ fills heart coral and adds to My Hearts
- [ ] My Hearts tab shows hearted items with count
- [ ] SHOP NOW opens external URL
- [ ] REMOVE removes item from My Hearts
- [ ] Search filters drops by name
- [ ] Category filters work
- [ ] Back/close navigation works correctly
- [ ] `yarn type-check` passes
