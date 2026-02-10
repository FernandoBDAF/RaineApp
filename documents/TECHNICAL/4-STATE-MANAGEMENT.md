# State Management

This document describes Raine's client-side state architecture: why Zustand was chosen, the store inventory, MMKV persistence implementation, how to add new stores, the AuthContext exception, and recommended practices.

Cross-references: [Architecture](./1-ARCHITECTURE.md) | [Design Patterns](./3-DESIGN-PATTERNS.md) | [Folder Structure](./2-FOLDER-STRUCTURE.md)

---

## 1. Why Zustand

Zustand provides minimal, boilerplate-light state management suitable for React Native. Rationale:

- **Small API surface:** A single `create()` function with optional middleware covers most use cases. No reducers, action types, or providers required.
- **No provider tree:** Stores are singletons accessed via hooks. Unlike Redux or MobX, no `<Provider>` wrapper is needed at the app root.
- **Selector-based subscriptions:** Components subscribe to specific slices of state. Only re-render when selected values change.
- **Middleware support:** The built-in `persist` middleware integrates with custom storage adapters. Raine uses this with MMKV for synchronous, JSI-backed persistence.
- **TypeScript-friendly:** Store interfaces describe state and actions clearly. No separate action creators or reducers to keep in sync.

Server-side state (caching, invalidation, refetching) is handled by TanStack React Query, not Zustand. Zustand stores hold UI preferences, form/wizard state, and user-local data that should survive app restarts.

---

## 2. Store Inventory

| Name | File | Purpose | Persisted | Key Fields |
|------|------|---------|-----------|------------|
| `useAppStore` | `src/store/appStore.ts` | App-wide UI preferences: active chat room, online status, theme, notifications | Yes | `activeRoomId`, `isOnline`, `theme`, `notificationsEnabled` |
| `useProfileSetupStore` | `src/store/profileSetupStore.ts` | Multi-step profile setup wizard: name, photo, location, children, preferences, bio | Yes | `firstName`, `lastInitial`, `photoURL`, `zipCode`, `children`, `currentStep`, `completed` |
| `useIntroductionsStore` | `src/store/introductionsStore.ts` | Introductions feature: active conversations, saved connections, pending requests, recommendations | Yes | `activeConversations`, `savedConnections`, `pendingRequests`, `recommendedProfiles` |
| `useCommunitiesStore` | `src/store/communitiesStore.ts` | Community memberships, saved posts, user questions | Yes | `joinedCommunities`, `savedPosts`, `userQuestions` |
| `useDropsStore` | `src/store/dropsStore.ts` | Hearted/liked drops for quick access | Yes | `heartedItems` |
| `useActivityStore` | `src/store/activityStore.ts` | Activity badge counts (intro requests, unread messages, saved tips, question responses) | No | `counts` |

---

## 3. MMKV Adapter Implementation

MMKV (react-native-mmkv) provides synchronous, JSI-backed key-value storage. Zustand's `persist` middleware expects a `StateStorage` interface: `getItem`, `setItem`, `removeItem`. The adapter bridges MMKV to that contract.

### 3.1 MMKV Instance

```typescript
// src/cache/mmkv.ts

import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'raine-storage' });

export const storageKeys = {
  authUser: 'auth.user',
  featureFlags: 'feature.flags',
  lastRoomId: 'chat.lastRoomId',
  validatedReferralCode: 'onboarding.referralCode',
  referralValidatedAt: 'onboarding.referralValidatedAt',
} as const;

export function setJson<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function getJson<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
```

The `storage` instance is the single MMKV database. Zustand persist and other consumers share it. Keys like `auth.user` are used outside Zustand; Zustand uses its own keys (e.g. `profile-setup`, `app.store`) under the hood.

### 3.2 Zustand Persist Adapter

```typescript
// src/store/persist.ts

import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '../cache/mmkv';

const mmkvStateStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage);
```

`createJSONStorage` wraps the adapter to serialize/deserialize state as JSON. Each persisted store specifies its `name` in the persist config; that name becomes the MMKV key. Partial persistence is supported via `partialize` to exclude non-serializable or ephemeral fields (e.g. `isOnline` in `appStore`).

---

## 4. How to Create a New Store

Follow these steps when introducing a new Zustand store.

### Step 1: Define the Interface

Declare state shape and actions in a single interface. Use domain types from `src/types/` where applicable.

```typescript
interface MyFeatureStore {
  items: Item[];
  filter: string;

  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  setFilter: (filter: string) => void;
}
```

### Step 2: Create the Store

Use `create<MyFeatureStore>()` with either plain `(set)` or `persist((set), config)`.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './persist';

export const useMyFeatureStore = create<MyFeatureStore>()(
  persist(
    (set) => ({
      items: [],
      filter: '',

      setItems: (items) => set({ items }),
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      setFilter: (filter) => set({ filter }),
    }),
    {
      name: 'my-feature',
      storage: mmkvStorage,
      partialize: (state) => ({ items: state.items, filter: state.filter }), // optional
    }
  )
);
```

### Step 3: Choose Persistence

- **Persist** when state must survive app restart (user preferences, drafts, saved items). Use `persist` with `mmkvStorage` and a unique `name`.
- **Skip persist** when state is ephemeral (e.g. activity counts refreshed from the server on each session).

### Step 4: Add to `hooks.ts` if Shared

If the store should be consumed outside its feature, add a re-export in `src/store/hooks.ts`:

```typescript
export { useMyFeatureStore } from './myFeatureStore';
```

### Step 5: Consume with Selectors

Prefer selecting narrow slices to avoid unnecessary re-renders:

```typescript
// Good: component re-renders only when filter changes
const filter = useMyFeatureStore((state) => state.filter);

// Avoid: component re-renders on any store change
const store = useMyFeatureStore();
```

---

## 5. AuthContext as a Special Case

Authentication state is managed via React Context, not Zustand. This is intentional.

### Rationale

- **Firebase Auth lifecycle:** Firebase Auth emits auth state changes through `onAuthStateChanged`. Subscribing in a provider and pushing updates into React state fits naturally. A Zustand store would add an extra layer without clear benefit.
- **Provider boundary:** Auth gates the entire app (e.g. redirecting unauthenticated users). Wrapping the app in `AuthProvider` establishes a single boundary where auth is guaranteed to be available.
- **Persistence:** Auth state is still persisted via MMKV using `getJson` / `setJson` and `storageKeys.authUser`. The provider initializes `user` from MMKV and keeps it in sync with Firebase.

### Implementation Summary

```typescript
// src/features/auth/AuthContext.tsx

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return getJson<AuthUser>(storageKeys.authUser);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapUser(firebaseUser);
        setUser(mapped);
        setJson(storageKeys.authUser, mapped);
      } else {
        setUser(null);
        setJson(storageKeys.authUser, null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);
  // ...
};
```

Auth is consumed via `useAuth()`, which must be called within `AuthProvider`. Do not duplicate auth state in a Zustand store.

---

## 6. Best Practices

### 6.1 Selectors

Use selector functions so components subscribe only to what they need:

```typescript
// Re-renders when theme changes only
const theme = useAppStore((state) => state.theme);

// Re-renders when activeRoomId changes only
const activeRoomId = useAppStore((state) => state.activeRoomId);
```

Zustand uses strict equality by default. Selecting a primitive or stable reference prevents re-renders when unrelated state changes.

### 6.2 Shallow Comparison

When selecting objects or arrays, use `useShallow` to avoid re-renders from reference changes when content is equivalent:

```typescript
import { useShallow } from 'zustand/react/shallow';

const { theme, notificationsEnabled } = useAppStore(
  useShallow((state) => ({ theme: state.theme, notificationsEnabled: state.notificationsEnabled }))
);
```

Without `useShallow`, the selector returns a new object reference on every store update, causing unnecessary re-renders.

### 6.3 Atomic Updates

Group related state changes in a single `set` call. Use the functional form when the next state depends on the previous:

```typescript
// Atomic: one update, one persist write
addHeartedItem: (item) =>
  set((state) => ({
    heartedItems: [...state.heartedItems, item],
  })),

// Avoid multiple set() calls for related fields
// set({ heartedItems: [...state.heartedItems, item] });
// set({ lastUpdated: Date.now() }); // separate update
```

### 6.4 Persist Partialize

Exclude derived values and non-serializable data from persistence:

```typescript
partialize: (state) => ({
  activeRoomId: state.activeRoomId,
  theme: state.theme,
  notificationsEnabled: state.notificationsEnabled,
  // isOnline omitted: derived from network, not persisted
}),
```

### 6.5 Store Naming

- Store keys: `profile-setup`, `app.store`, `introductions`, `communities`, `drops`. Use kebab-case for consistency.
- Hook names: `useProfileSetupStore`, `useAppStore`, etc. Prefix with `use` for React conventions.

---

## Cross-References

- [Architecture](./1-ARCHITECTURE.md) — High-level architecture, tech stack, layer responsibilities
- [Design Patterns](./3-DESIGN-PATTERNS.md) — Zustand + MMKV persistence, Provider pattern, mock mode
- [Folder Structure](./2-FOLDER-STRUCTURE.md) — Store location, feature organization
