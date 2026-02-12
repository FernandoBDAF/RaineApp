# Component Library

This document inventories all React components under `src/components/`, documents design tokens from the PRD design system, NativeWind conventions, base and shared component specifications, and composition patterns.

---

## 1. Component Inventory by Folder

### 1.1 `ui/` — Base primitives and generic UI

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| Avatar | `Avatar.tsx` | Circular image or initials fallback for users | `uri`, `name`, `size` |
| Button | `Button.tsx` | Primary action button with variants | `title`, `onPress`, `variant`, `disabled` |
| Card | `Card.tsx` | White container with padding and shadow | `children`, `className`, ViewProps |
| CodeInput | `CodeInput.tsx` | Single-field code entry (invite, referral) | `value`, `onChange`, `onComplete`, `error`, `maxLength` |
| EmptyState | `EmptyState.tsx` | Centered empty list/state message | `title`, `description` |
| ErrorState | `ErrorState.tsx` | Error message with optional retry button | `title`, `description`, `onRetry` |
| Input | `Input.tsx` | Text input with label and error display | `label`, `error`, TextInputProps |
| LoadingSpinner | `LoadingSpinner.tsx` | Centered activity indicator | (none) |
| OtpInput | `OtpInput.tsx` | Multi-cell OTP/verification input | `value`, `onChange`, `onComplete`, `length`, `keyboardType`, `autoFocus`, `variant`, `isUpperCase` |
| ShakeView | `ShakeView.tsx` | Animated container for validation shake | `trigger`, `onShakeComplete`, `children` |
| SocialButton | `SocialButton.tsx` | OAuth provider button (Instagram, Facebook, LinkedIn) | `provider`, `onPress`, `disabled` |

### 1.2 `shared/` — Cross-feature components

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| FilterPills | `FilterPills.tsx` | Horizontal filter pills (single selection) | `filters`, `selected`, `onSelect` |
| MemberAvatarRow | `MemberAvatarRow.tsx` | Overlapping avatar stack with "+N more" | `avatars`, `totalCount`, `maxVisible`, `size` |
| SearchBar | `SearchBar.tsx` | Search input with placeholder | `placeholder`, `value`, `onChangeText` |
| SectionHeader | `SectionHeader.tsx` | Uppercase section title with optional action | `title`, `actionText`, `onActionPress` |
| SortPills | `SortPills.tsx` | Recent / A-Z sort toggle pills | `selected`, `onSelect` |
| TabSwitcher | `TabSwitcher.tsx` | Tab bar with optional counts | `tabs`, `activeTab`, `onTabChange` |
| Toast | `Toast.tsx` | Animated toast notification | `visible`, `title`, `subtitle`, `onDismiss`, `duration`, `onPress` |

### 1.3 `chat/` — Chat UI

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| MessageBubble | `MessageBubble.tsx` | Single message bubble with reactions | `message`, `isOwn` |
| MessageInput | `MessageInput.tsx` | Text input with send button | `onSend` |
| MessageList | `MessageList.tsx` | Inverted FlatList of messages | `messages`, `currentUserId`, `onLoadMore` |
| ReactionPicker | `ReactionPicker.tsx` | Emoji reaction selector (fixed set) | `onSelect` |

### 1.4 `communities/` — Community feature

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| CommunityCard | `CommunityCard.tsx` | Grid card with cover and name overlay | `community`, `onPress` |
| CommunityHeader | `CommunityHeader.tsx` | Community detail header with cover, badge, members | `community`, `memberAvatars`, `onBack` |
| CommunityPost | `CommunityPost.tsx` | Single post with body, actions, replies | `post`, `replies`, `onLike`, `onReply`, `onBookmark` |
| CommunityPreviewCard | `CommunityPreviewCard.tsx` | Horizontal preview with badge and description | `community`, `onPress` |
| CommunityPreviewList | `CommunityPreviewList.tsx` | List grouped by category with preview cards | `communities`, `onCommunityPress` |
| NoteworthyPostCard | `NoteworthyPostCard.tsx` | Highlighted/featured post card (fixed width) | `post` |
| PostReply | `PostReply.tsx` | Single threaded reply with like | `reply`, `onLike` |

### 1.5 `drops/` — Drops feature

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| DropCoverCard | `DropCoverCard.tsx` | Drop cover with title in coral serif | `drop`, `onPress` |
| DropItemCard | `DropItemCard.tsx` | Single product with heart and shop actions | `item`, `dropId`, `dropTitle`, `sectionId`, `isHearted`, `onHeart`, `onShop` |
| DropPreviewCard | `DropPreviewCard.tsx` | Home preview with coral-dark bg | `drop`, `onPress` |
| MyHeartsList | `MyHeartsList.tsx` | List of hearted items from drops store | (none, uses store) |

### 1.6 `home/` — Home tab

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| ActivityCounter | `ActivityCounter.tsx` | Single activity metric with count and label | `label`, `count`, `onPress` |
| ActivityDashboard | `ActivityDashboard.tsx` | Row of activity counters | (none, uses activityStore) |
| HomeHeader | `HomeHeader.tsx` | Home tab header with logo and profile avatar | `onProfilePress`, `userPhotoURL` |

### 1.7 `introductions/` — Introductions feature

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| ConversationRow | `ConversationRow.tsx` | Chat list row with avatar, last message, timestamp | `name`, `avatar`, `lastMessage`, `timestamp`, `onPress` |
| MatchProfileCard | `MatchProfileCard.tsx` | Moms Like You carousel card | `profile`, `onSayHi`, `onSave` |
| MomsLikeYouCarousel | `MomsLikeYouCarousel.tsx` | Horizontal carousel of match cards | `profiles`, `onSayHi`, `onSave` |
| PendingBanner | `PendingBanner.tsx` | Banner for pending intro requests | `count`, `avatars`, `onPress` |
| SavedConnectionCard | `SavedConnectionCard.tsx` | Saved connection with Say Hi / Unsave | `connection`, `onSayHi`, `onUnsave` |

### 1.8 `profile/` — Profile feature

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| ProfileTagList | `ProfileTagList.tsx` | Display of profile tags (before motherhood, aesthetic, etc.) | `beforeMotherhood`, `perfectWeekend`, `aesthetic`, `momFriendStyle` |

### 1.9 `profile-setup/` — Profile wizard

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| ChildForm | `ChildForm.tsx` | Child entry form for profile wizard | Child-specific props |
| ColorGridCard | `ColorGridCard.tsx` | Color picker grid item | `label`, `color`, `selected`, `onPress` |
| ContinueButton | `ContinueButton.tsx` | Wizard step continue button | Button-specific props |
| GridCard | `GridCard.tsx` | Text-based selection card | `title`, `description`, `selected`, `onPress` |
| MonthYearPicker | `MonthYearPicker.tsx` | Month/year selection | Month-year props |
| OutOfAreaModal | `OutOfAreaModal.tsx` | Modal for out-of-area users | Modal props |
| PhotoUpload | `PhotoUpload.tsx` | Photo picker/upload for profile | Photo-specific props |
| ProgressDots | `ProgressDots.tsx` | Wizard step indicators | Step props |
| SelectionCard | `SelectionCard.tsx` | Single- or multi-select card | `label`, `selected`, `onPress`, `showCheckbox` |
| SetupHeader | `SetupHeader.tsx` | Wizard screen header | Header props |

---

## 2. Design Tokens (PRD Design System)

Values from Introductions PRD (Section 6), Communities PRD, Drops PRD, and `4-completing-the-vision.md`.

### 2.1 Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Coral Primary | #E8613C | Primary accent: buttons, headers, links, active tabs, heart icons |
| Coral Dark | #E8401C | Fresh Drop card background, strong accent |
| Black | #1A1A1A | Primary text, Apple-style elements |
| Dark Gray | #666666 | Body text, descriptions |
| Light Gray | #999999 | Timestamps, hints, secondary text |
| Border Gray | #E5E5E5 | Separators, inactive elements, card borders |
| Peach Background | #FDF5F3 | Subtle warm background tint |
| White | #FFFFFF | Card backgrounds, main surfaces |
| Muted Pink (thread) | #E8A090 | Left border for threaded replies (Communities) |

### 2.2 Typography

| Role | Font | Weight | Size | Case |
|------|------|--------|------|------|
| Page title | Serif (Playfair-like) | Regular | ~32px | Normal |
| Section header | Sans-serif | Bold | ~14px | UPPERCASE, letter-spaced |
| Card name (overlay) | Serif | Regular | ~24px | Normal |
| Card name (list) | Sans-serif | Bold | ~16px | Normal |
| Body text | Sans-serif | Regular | ~14px | Normal |
| Button text | Sans-serif | Medium | ~12px | UPPERCASE, letter-spaced |
| Counter number | Serif | Regular/Italic | ~24px | Normal |
| Category label | Sans-serif | Regular | ~11px | UPPERCASE, letter-spaced |
| Timestamp | Sans-serif | Regular | ~12px | Normal |
| Editorial italic | Serif | Italic | ~14px | Normal |

### 2.3 Spacing

| Element | Value |
|---------|-------|
| Screen horizontal padding | 16–24px (e.g. `px-6` = 24px) |
| Card gap | 12–16px |
| Section vertical spacing | 24–32px |
| Card internal padding | 12–16px |
| Button padding | 12px vertical, 24px horizontal |
| List row height | ~72px |
| Avatar (list) | 48px circular |
| Avatar (card overlay) | 64px rounded square |

### 2.4 Tailwind vs. PRD Alignment

The `tailwind.config.js` extends the default theme only; no custom brand colors are defined. Components therefore:

- Use `orange-500`, `orange-50`, `orange-300` as Coral proxies (Tailwind orange ≈ #F97316; not exact)
- Use `text-[#E8613C]`, `border-[#E8613C]`, `bg-[#E8401C]` for precise brand colors where needed

The `constants/colors.ts` file defines `primary`, `secondary`, `background`, etc., but these differ from the PRD brand palette. For new components, prefer PRD tokens or add them to `tailwind.config.js` theme extension.

---

## 3. NativeWind Conventions

### 3.1 `className` Patterns

- Layout: `flex-row`, `flex-1`, `items-center`, `justify-between`, `gap-2`
- Spacing: `px-6`, `py-4`, `mt-2`, `mb-4`, `space-y-2`
- Typography: `text-sm`, `text-base`, `font-semibold`, `tracking-wider`, `uppercase`
- Borders: `border`, `border-2`, `border-slate-200`, `rounded-lg`, `rounded-full`
- Colors: `text-slate-700`, `bg-white`, `bg-orange-500`, `border-orange-500`
- State: `opacity-50` for disabled, `active:bg-slate-100` for press states

### 3.2 Common Combinations

| Use case | Pattern |
|----------|---------|
| Screen padding | `px-6 py-4` |
| Card container | `rounded-xl bg-white border border-slate-100` |
| Section header | `text-sm font-semibold tracking-widest text-orange-500 uppercase` |
| Pill/button (selected) | `rounded-full border border-orange-500 bg-orange-50` |
| Pill/button (unselected) | `rounded-full border border-slate-200 bg-white` |
| Coral accent text | `text-orange-500` or `text-[#E8613C]` |
| Muted text | `text-slate-400`, `text-slate-500` |

### 3.3 Inline vs. StyleSheet

- Prefer `className` for layout and styling when possible
- Use `style` prop for dynamic values (e.g. `aspectRatio`, `backgroundColor` from props), `transform`, or when NativeWind lacks the utility

---

## 4. Base UI Components Detail

### 4.1 Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | — | Button label |
| onPress | () => void | — | Press handler |
| variant | 'primary' \| 'secondary' \| 'outline' | 'primary' | Visual variant |
| disabled | boolean | false | Disabled state |

Variants: `primary` (blue-600), `secondary` (emerald-600), `outline` (border only). Does not use Coral; consider adding a `coral` variant for brand consistency.

### 4.2 Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Optional label above input |
| error | string | — | Error message below input |
| ...props | TextInputProps | — | Passed to TextInput |

Renders label, bordered TextInput, and error text. Border turns red when `error` is set.

### 4.3 Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| uri | string \| null | — | Image URL; if present, shows image |
| name | string \| null | — | Fallback for initials when no uri |
| size | number | 40 | Diameter in pixels |

Uses `style` for dimensions (NativeWind does not support dynamic size). Fallback: initials from `name`, or "?" if absent.

### 4.4 Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | — | Content |
| className | string | — | Additional NativeWind classes |
| ...props | ViewProps | — | Passed to View |

Base: `rounded-lg bg-white p-4 shadow-sm`. Merges `className` for overrides.

---

## 5. Shared Components Detail

### 5.1 TabSwitcher

| Prop | Type | Description |
|------|------|-------------|
| tabs | Tab[] | `{ id, label, count? }[]` |
| activeTab | string | ID of active tab |
| onTabChange | (tabId: string) => void | Tab selection handler |

Uses `border-b-2 border-orange-500` for active tab. Labels uppercased; count shown as `(N)` when present.

### 5.2 SectionHeader

| Prop | Type | Description |
|------|------|-------------|
| title | string | Uppercase section title |
| actionText | string | Optional "SEE ALL" text |
| onActionPress | () => void | Handler for action |

Title and action in `text-orange-500`. Coral line (`h-px bg-orange-500`) below.

### 5.3 SearchBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | string | "SEARCH" | Placeholder text |
| value | string | — | Controlled value |
| onChangeText | (text: string) => void | — | Change handler |

Rounded bordered container with search icon emoji. `autoCapitalize="none"`, `autoCorrect={false}`.

### 5.4 FilterPills

| Prop | Type | Description |
|------|------|-------------|
| filters | string[] | Options to display |
| selected | string \| null | Selected value; null = none |
| onSelect | (filter: string \| null) => void | Handler; tapping selected deselects |

Horizontal FlatList, `gap: 8`. Selected: `border-orange-500 bg-orange-50`.

### 5.5 SortPills

| Prop | Type | Description |
|------|------|-------------|
| selected | 'recent' \| 'a-z' | Current sort |
| onSelect | (option: 'recent' \| 'a-z') => void | Selection handler |

Fixed options: RECENT, A-Z. Active: `border-orange-500 text-orange-500`.

### 5.6 Toast

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| visible | boolean | — | Show/hide |
| title | string | — | Main text |
| subtitle | string | — | Optional secondary text |
| onDismiss | () => void | — | Called when dismissed |
| duration | number | 3000 | Auto-dismiss ms |
| onPress | () => void | — | Tap handler; defaults to onDismiss |

Spring-in from top, timing-out, then slide up and call onDismiss. Uses `border-orange-300`.

### 5.7 MemberAvatarRow

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| avatars | string[] | — | Avatar image URLs |
| totalCount | number | — | Total (for "+N more") |
| maxVisible | number | 5 | Max avatars shown |
| size | number | 32 | Avatar diameter |

Overlapping avatars with white border. "+{remaining} more" when `totalCount > avatars.length`.

---

## 6. How to Create a New Component

### Step 1: Choose the right folder

- Generic primitive (button, input, card): `ui/`
- Used across multiple features: `shared/`
- Feature-specific: `chat/`, `communities/`, `drops/`, `home/`, `introductions/`, `profile/`, `profile-setup/`

### Step 2: Create the file

Use PascalCase: `ComponentName.tsx`.

### Step 3: Implement with NativeWind

```tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ComponentNameProps {
  title: string;
  onPress?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ title, onPress }) => {
  return (
    <View className="px-6 py-4">
      <Text className="text-sm font-semibold text-slate-800">{title}</Text>
    </View>
  );
};
```

### Step 4: Use design tokens

- Section headers: `text-orange-500` or `text-[#E8613C]`, `tracking-widest`, `uppercase`
- Primary actions: `bg-orange-500` or `bg-[#E8613C]`, `text-white`
- Outlined actions: `border border-orange-500 text-orange-500`
- Screen padding: `px-6` (24px)

### Step 5: Compose from base/shared components

Use `Card`, `Button`, `Avatar`, `SectionHeader`, `Input`, etc. where appropriate.

### Step 6: Export and document

Export as named export. Add the component to this document under the correct folder.

---

## 7. Component Composition Patterns

### 7.1 Card + Pressable

Feature cards often wrap content in `Pressable` with `rounded-xl`, `bg-white`, `border`:

```tsx
<Pressable onPress={onPress} className="rounded-xl border border-slate-100 bg-white p-4">
  {children}
</Pressable>
```

### 7.2 FlatList + Item Component

Lists separate list logic from item UI:

```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} onPress={...} />}
  ItemSeparatorComponent={() => <View className="h-4" />}
  contentContainerStyle={{ paddingHorizontal: 24 }}
/>
```

### 7.3 Section layout

Typical section structure:

```tsx
<View>
  <SectionHeader title="SECTION NAME" actionText="SEE ALL" onActionPress={...} />
  <SearchBar value={query} onChangeText={setQuery} />
  <FilterPills filters={...} selected={...} onSelect={...} />
  <FlatList ... />
</View>
```

### 7.4 Store-coupled components

Components like `ActivityDashboard`, `MyHeartsList` read from Zustand stores directly. Prefer props for testability; use store coupling only when it simplifies parent components.

### 7.5 Form composition

Profile wizard steps compose `Input`, `SelectionCard`, `GridCard`, `PhotoUpload`, `ContinueButton`, and `ProgressDots`. Validation and navigation live in the parent screen.

### 7.6 Empty and error states

Use `EmptyState` or `ErrorState` as list footer or full-screen fallback:

```tsx
{items.length === 0 ? (
  <EmptyState title="No items" description="Add one to get started" />
) : (
  <FlatList data={items} ... />
)}
```

---

## 8. Cross-References

| Topic | Document |
|-------|----------|
| Folder structure rationale | [2-FOLDER-STRUCTURE.md](./2-FOLDER-STRUCTURE.md) |
| Design system source | [3-INTRODUCTIONS-PRD.md](../BUSINESS/3-FEATURE-SPECS/3.3-INTRODUCTIONS.md) §6, [4-completing-the-vision.md](../../systemic_view/4-completing-the-vision.md) §8 |
| NativeWind / styling decision | [6-DECISION-LOG.md](../BUSINESS/6-DECISION-LOG.md) |
| Type definitions | `src/types/` |
| Tailwind config | `tailwind.config.js` |
| Constants | `src/constants/colors.ts`, `spacing.ts`, `typography.ts` |
