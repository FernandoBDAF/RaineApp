# Folder Structure

This document describes the organization of the `src/` directory in RaineApp and the rationale behind each decision.

---

## 1. Overview

Full folder tree of `src/` with annotations:

```
src/
├── app/                          # Screens and navigation (Expo Router)
│   ├── _layout.tsx               # Root layout: providers, auth guard, stack navigation
│   ├── index.tsx                 # Entry redirect (landing/splash)
│   ├── subscription.tsx         # Modal/screen for subscription/paywall
│   │
│   ├── (onboarding)/             # Route group: pre-auth flow (splash, referral)
│   │   ├── _layout.tsx           # Stack, gesture disabled
│   │   ├── splash.tsx
│   │   └── referral.tsx
│   │
│   ├── (auth)/                   # Route group: login, terms
│   │   ├── _layout.tsx           # Stack
│   │   ├── login.tsx
│   │   └── terms.tsx
│   │
│   ├── (profile-setup)/          # Route group: multi-step profile wizard
│   │   ├── _layout.tsx           # Stack with progress dots, back handling
│   │   ├── welcome.tsx
│   │   ├── name.tsx, photo.tsx, location.tsx, bio.tsx, ...
│   │   └── [14 steps total]
│   │
│   ├── (tabs)/                   # Route group: main tab bar
│   │   ├── _layout.tsx           # Tabs layout (Home, Introductions, Communities, Drops)
│   │   ├── index.tsx             # Home tab
│   │   ├── introductions.tsx
│   │   ├── communities.tsx
│   │   ├── drops.tsx
│   │   ├── profile.tsx           # Hidden from tab bar (href: null)
│   │   └── settings.tsx          # Hidden from tab bar (href: null)
│   │
│   ├── profile/                  # Profile stack (nested navigation)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── edit.tsx
│   │
│   ├── community/                # Dynamic route: community detail + timeline
│   │   ├── [id].tsx
│   │   └── [id]/timeline.tsx
│   │
│   ├── drop/                     # Dynamic route: single drop
│   │   └── [id].tsx
│   │
│   ├── introduction/             # Dynamic route: intro modal + pending
│   │   ├── [userId].tsx          # Modal presentation
│   │   └── pending.tsx
│   │
│   └── room/                     # Dynamic route: chat room
│       └── [id].tsx
│
├── components/                   # React components, grouped by feature
│   ├── chat/                     # Chat UI: MessageBubble, MessageInput, MessageList, ReactionPicker
│   ├── communities/              # Community cards, headers, posts, replies
│   ├── drops/                    # Drop cards, covers, previews, hearts
│   ├── home/                     # Home tab: header, activity dashboard, counters
│   ├── introductions/            # Intro flow: conversation row, match cards, pending banner
│   ├── profile/                  # Profile: tag list
│   ├── profile-setup/            # Wizard components: forms, cards, pickers, progress
│   ├── shared/                   # Cross-feature: FilterPills, SearchBar, TabSwitcher, Toast, etc.
│   └── ui/                       # Generic primitives: Button, Input, Card, Avatar, etc.
│
├── config/                       # App configuration
│   └── environment.ts            # Dev/prod flags, Firebase mock mode
│
├── constants/                    # Static data and design tokens
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── profile-options.ts        # STEP_TO_ROUTE, option arrays for profile wizard
│
├── cache/                        # Local storage layer
│   └── mmkv.ts                   # MMKV wrapper
│
├── features/                     # Cross-cutting feature modules (auth, etc.)
│   └── auth/
│       └── AuthContext.tsx       # Auth state, login/logout
│
├── hooks/                        # Shared React hooks
│   ├── useEntitlement.ts         # RevenueCat entitlements
│   └── useFeatureFlag.ts         # Remote config flags
│
├── services/                     # External APIs, Firebase, third-party
│   ├── firebase/                 # Firebase wrappers
│   │   ├── auth.ts, firestore.ts, init.ts
│   │   ├── messages.ts, rooms.ts, users.ts
│   │   ├── notifications.ts, remoteConfig.ts, socialAuth.ts
│   │   └── mock/                 # Mock implementations for dev/testing
│   │       └── mockAuth.ts
│   ├── activity/, bio/, communities/, drops/, introductions/
│   │   └── index.ts              # Domain service modules (often use mock or Firebase)
│   ├── location/                 # Zip code, county lookup
│   ├── profile/, referral/       # Profile/referral domain logic
│   ├── revenuecat/               # Subscription/purchase API
│   └── queryClient.ts            # React Query client
│
├── store/                        # Zustand state stores (one per domain)
│   ├── activityStore.ts
│   ├── appStore.ts
│   ├── communitiesStore.ts
│   ├── dropsStore.ts
│   ├── introductionsStore.ts
│   ├── profileSetupStore.ts
│   ├── hooks.ts                  # Re-exports useAppStore, etc.
│   └── persist.ts                # Persistence config
│
├── types/                        # TypeScript interfaces and types
│   ├── index.ts                  # Barrel: re-exports shared types
│   ├── auth.ts, user.ts, room.ts, message.ts
│   ├── community.ts, drop.ts, introduction.ts
│   ├── profile-setup.ts, referral.ts
│   └── shared.ts
│
└── utils/                        # Pure helpers, mock data
    ├── mockData.ts
    ├── mockCommunities.ts
    ├── mockDrops.ts
    └── mockIntroductions.ts
```

---

## 2. Route Organization

### Route groups (parentheses)

Route groups use parentheses `(name)` so they do not affect the URL. They control layout and navigation flow:

| Group | Purpose | URL examples |
|-------|---------|--------------|
| `(onboarding)` | Pre-auth: splash, referral | `/(onboarding)/splash`, `/(onboarding)/referral` |
| `(auth)` | Login, terms | `/(auth)/login`, `/(auth)/terms` |
| `(profile-setup)` | Multi-step wizard (14 steps) | `/(profile-setup)/name`, `/(profile-setup)/bio` |
| `(tabs)` | Main tab bar | `/(tabs)`, `/(tabs)/communities`, `/(tabs)/drops` |

### Root layout (`app/_layout.tsx`)

The root layout:

- Wraps the app with `QueryClientProvider`, `AuthProvider`
- Initializes Remote Config, RevenueCat, push notifications
- Applies auth guard: unauthenticated users → `/(onboarding)/splash` or `/(auth)/login`
- Applies profile guard: authenticated users without completed profile → `/(profile-setup)/...`
- Renders a `Stack` with screens: `(onboarding)`, `(auth)`, `(profile-setup)`, `(tabs)`, `profile`, `room/[id]`, `drop/[id]`, `introduction/[userId]`, `introduction/pending`, `community/[id]`, `subscription`

### Tab layout (`app/(tabs)/_layout.tsx`)

- Uses Expo Router `Tabs`
- Tab screens: Home (`index`), Introductions, Communities, Drops
- Profile and Settings are present but hidden via `href: null` (for navigation, not tab bar)

### Dynamic routes

| Path | Parameter | Purpose |
|------|-----------|---------|
| `community/[id]` | `id` | Community detail; nested `[id]/timeline.tsx` for posts |
| `drop/[id]` | `id` | Single drop view |
| `introduction/[userId]` | `userId` | Intro modal for a specific user |
| `room/[id]` | `id` | Chat room (opened from push notification or in-app) |

### Layouts per group

- `(auth)`, `(onboarding)`, `profile`: simple `Stack`
- `(profile-setup)`: custom `Stack` with progress dots and step-based back navigation

---

## 3. Component Organization

Components are grouped by **feature** to keep related UI together and avoid a flat `components/` directory.

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `chat/` | Chat/messaging UI | `MessageBubble`, `MessageInput`, `MessageList`, `ReactionPicker` |
| `communities/` | Community feature | `CommunityCard`, `CommunityHeader`, `CommunityPost`, `PostReply` |
| `drops/` | Drops feature | `DropCoverCard`, `DropItemCard`, `MyHeartsList` |
| `home/` | Home tab | `HomeHeader`, `ActivityDashboard`, `ActivityCounter` |
| `introductions/` | Introductions feature | `ConversationRow`, `MatchProfileCard`, `PendingBanner` |
| `profile/` | Profile display | `ProfileTagList` |
| `profile-setup/` | Profile wizard | `ChildForm`, `GridCard`, `PhotoUpload`, `ProgressDots` |
| `shared/` | Cross-feature | `FilterPills`, `SearchBar`, `TabSwitcher`, `Toast` |
| `ui/` | Generic primitives | `Button`, `Input`, `Card`, `Avatar`, `LoadingSpinner` |

**Guidelines:**

- Feature-specific components → `components/<feature>/`
- Used across multiple features → `components/shared/`
- Low-level, reusable primitives → `components/ui/`

---

## 4. Service Organization

The `services/` directory isolates all external communication and domain logic that depends on external systems.

### Structure

```
services/
├── firebase/           # Firebase wrappers
│   ├── auth.ts         # Auth functions
│   ├── firestore.ts    # Firestore helpers
│   ├── messages.ts     # Chat messages
│   ├── rooms.ts        # Chat rooms
│   ├── users.ts        # User profiles
│   ├── notifications.ts
│   ├── remoteConfig.ts
│   ├── socialAuth.ts
│   └── mock/           # Mock implementations (mockAuth, etc.)
│
├── activity/           # Activity domain (index.ts)
├── bio/                # Bio domain
├── communities/        # Communities domain (uses mock or Firebase)
├── drops/
├── introductions/
├── location/           # Location/zip lookup
├── profile/
├── referral/
├── revenuecat/         # RevenueCat subscription API
└── queryClient.ts      # React Query setup
```

### Rationale

- **Firebase wrappers**: Centralize Firebase usage; mock mode allows dev without Firebase config
- **Domain services** (`activity/`, `communities/`, etc.): Encapsulate API calls and business logic; can swap implementations (mock vs Firebase)
- **Third-party**: `revenuecat/` for subscriptions; kept separate from Firebase

---

## 5. State Organization

State is organized as **one store per domain** in `store/`:

| Store | Domain |
|-------|--------|
| `appStore` | App-level: theme, global flags |
| `activityStore` | Activity/notifications |
| `communitiesStore` | Communities data |
| `dropsStore` | Drops data |
| `introductionsStore` | Introductions, pending count |
| `profileSetupStore` | Profile wizard: `currentStep`, `completed`, step data |

- `hooks.ts` re-exports store hooks (e.g. `useAppStore`)
- `persist.ts` configures persistence for selected stores

---

## 6. Naming Conventions

| Item | Convention | Examples |
|------|------------|----------|
| Route files | kebab-case | `profile-setup`, `before-motherhood`, `city-feel` |
| Store files | camelCase | `profileSetupStore.ts`, `introductionsStore.ts` |
| Components | PascalCase | `MessageBubble.tsx`, `CommunityCard.tsx` |
| Services | camelCase for files | `queryClient.ts` |
| Types | camelCase | `auth.ts`, `profile-setup.ts` |
| Constants | camelCase or kebab-case | `profile-options.ts` |
| Directories | lowercase, kebab-case or camelCase | `profile-setup/`, `(tabs)/` |

---

## 7. Import Conventions

- **Relative paths**: Imports use `../` or `../../` from `src/` (e.g. `from '../store/profileSetupStore'`, `from '../../types'`).
- **Barrel exports**: `types/index.ts` re-exports shared types. `store/hooks.ts` re-exports store hooks.
- **Direct imports**: Components and services are imported from their full path (e.g. `from '../components/ui/Button'`, `from '../services/communities'`); no component barrel exports.
- **Path style**: Paths are relative to the importing file; no `@/` alias in use.

---

## 8. Decision Tree: Where Does New Code Go?

```
Is it a screen or route?
├── Yes → app/
│         └── Use route group (onboarding), (auth), (profile-setup), (tabs)
│             or dynamic route (community/[id], drop/[id], etc.)
│
Is it a reusable UI component?
├── Yes → components/
│         ├── Used across multiple features? → shared/
│         ├── Generic primitive (button, input, card)? → ui/
│         └── Feature-specific? → <feature>/ (e.g. chat/, communities/, drops/)
│
Does it talk to an external API or Firebase?
├── Yes → services/
│         ├── Firebase-specific? → services/firebase/
│         ├── Need mock for dev? → services/firebase/mock/ or utils/mock*.ts
│         └── Third-party (RevenueCat, etc.)? → services/<vendor>/
│
Is it app or domain state?
├── Yes → store/
│         └── One store per domain (e.g. communitiesStore, introductionsStore)
│
Is it a type or interface?
├── Yes → types/
│         └── Re-export shared types from types/index.ts
│
Is it a hook?
├── Yes → hooks/
│
Is it a constant or config?
├── Yes → constants/ or config/
│
Is it a pure helper or mock data?
├── Yes → utils/
```

---

## Cross-References

- **Route flow and auth**: `app/_layout.tsx`
- **Profile setup steps**: `constants/profile-options.ts` (`STEP_TO_ROUTE`)
- **Tab navigation**: `app/(tabs)/_layout.tsx`
- **Type definitions**: `types/index.ts`
- **Store usage**: `store/hooks.ts`
- **Project docs**: `documents/README.md`
- **Business rules**: `documents/BUSINESS/4-BUSINESS-RULES.md`
- **Implementation status**: `documents/STATUS/CURRENT-STATUS.md`
