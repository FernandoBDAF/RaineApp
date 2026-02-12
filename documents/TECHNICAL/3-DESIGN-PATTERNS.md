# Design Patterns

This document catalogs the 8 key design patterns used throughout the Raine codebase. Each pattern addresses a specific architectural concern -- from safely loading native modules to managing navigation state. Adhering to these patterns ensures consistency, testability, and resilience across the application.

Cross-references: [System Invariants](./9-SYSTEM-INVARIANTS.md) | [Architecture](./1-ARCHITECTURE.md)

---

## Table of Contents

1. [Lazy Native Module Loading](#pattern-1-lazy-native-module-loading)
2. [Mock Mode Guard](#pattern-2-mock-mode-guard)
3. [Service Layer Abstraction](#pattern-3-service-layer-abstraction)
4. [Navigation Guards](#pattern-4-navigation-guards)
5. [Zustand + MMKV Persistence](#pattern-5-zustand--mmkv-persistence)
6. [Provider Pattern](#pattern-6-provider-pattern)
7. [Feature Flag Pattern](#pattern-7-feature-flag-pattern)
8. [Deep Linking Pattern](#pattern-8-deep-linking-pattern)

---

### Pattern 1: Lazy Native Module Loading

- **Intent:** Prevent `NativeEventEmitter` crashes that occur when a native module is imported at bundle time before its host runtime is fully initialized. By deferring `require()` to the moment the module is actually needed, the app can safely start even when native modules are unavailable or misconfigured.

- **Implementation:**

```typescript
// src/services/revenuecat/index.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _Purchases: any = null;

function getPurchases() {
  if (!_Purchases) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _Purchases = require('react-native-purchases').default;
  }
  return _Purchases!;
}
```

The same pattern appears in every Firebase service wrapper, where the native module is loaded only when a real (non-mock) call is made:

```typescript
// src/services/firebase/firestore.ts

export function getDb() {
  if (isFirebaseMockMode()) {
    return mockFirestore();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const firestore = require('@react-native-firebase/firestore').default;
  return firestore();
}
```

- **Files:**
  - `src/services/revenuecat/index.ts` -- RevenueCat purchases SDK
  - `src/services/firebase/firestore.ts` -- Firestore database access
  - `src/services/firebase/notifications.ts` -- FCM messaging
  - `src/services/firebase/remoteConfig.ts` -- Remote Config
  - `src/services/firebase/auth.ts` -- Firebase Authentication
  - `src/services/firebase/messages.ts` -- Chat message operations
  - `src/features/auth/AuthContext.tsx` -- Auth state listener

- **When to Apply:** Use this pattern whenever integrating a native module that may not be present in all build configurations (e.g., Expo Go, development builds without native config files, or optional SDKs). Never use top-level `import` for native modules that could crash during bundle evaluation.

- **Pitfalls:**
  - Do **not** use `typeof import(...)` or top-level dynamic `import()` -- Metro can resolve these at bundle time, defeating the purpose.
  - Always cache the loaded module in a module-scoped variable (e.g., `_Purchases`) to avoid calling `require()` on every invocation.
  - Remember that the loaded module reference is `any`-typed; add runtime guards or type assertions where needed rather than trusting the return shape blindly.

---

### Pattern 2: Mock Mode Guard

- **Intent:** Allow the entire application UI to function without a configured Firebase backend. In development (`__DEV__`), mock mode is always enabled because social login uses mock auth and the mock user has no real Firestore or Storage permissions. This keeps the full UI flow working for development and testing without requiring real credentials.

- **Implementation:**

```typescript
// src/config/environment.ts

let _firebaseMockMode = false;

export function setFirebaseMockMode(enabled: boolean) {
  _firebaseMockMode = enabled;
  if ((enabled || isDev) && isDev) {
    console.warn(
      '🔶 Firebase Mock Mode Enabled - Firebase services are mocked for UI testing.\n' +
      'To use real Firebase in production, add google-services.json and configure the Facebook SDK.'
    );
  }
}

/**
 * Returns true when Firebase services should be mocked.
 * Always true in dev mode (mock auth means no real Firestore permissions).
 */
export function isFirebaseMockMode() {
  return _firebaseMockMode || isDev;
}
```

Every service file checks this guard before accessing native Firebase modules:

```typescript
// src/services/firebase/notifications.ts

export async function requestNotificationPermission() {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Notification permission granted');
    return true;
  }
  // ... real Firebase messaging code
}
```

- **Files:**
  - `src/config/environment.ts` -- Defines `isFirebaseMockMode()` and `setFirebaseMockMode()`
  - `src/app/_layout.tsx` -- Calls `setFirebaseMockMode()` at startup after checking `firebase.default.apps`
  - `src/services/firebase/firestore.ts` -- Mock Firestore collections and documents
  - `src/services/firebase/auth.ts` -- Mock authentication
  - `src/services/firebase/notifications.ts` -- Mock FCM messaging
  - `src/services/firebase/remoteConfig.ts` -- Mock Remote Config with local defaults
  - `src/services/firebase/messages.ts` -- Mock chat operations
  - `src/services/firebase/users.ts` -- Mock user queries
  - `src/services/firebase/rooms.ts` -- Mock room operations
  - `src/services/firebase/socialAuth.ts` -- Mock social login
  - `src/services/profile/index.ts` -- Mock profile operations
  - `src/services/bio/index.ts` -- Mock bio generation
  - `src/features/auth/AuthContext.tsx` -- Mock auth state
  - `src/app/room/[id].tsx` -- Room screen mock checks

- **When to Apply:** Every new service that calls a Firebase native module must include a mock mode guard at the top of its public functions. The mock implementation should return a structurally valid response (matching the expected return type) so that callers do not need conditional logic.

- **Pitfalls:**
  - Never skip the mock guard in a new service file -- forgetting it will crash the app in development or any environment without Firebase config.
  - Mock return values must match the real return type signature. A mock that returns `null` where the caller expects `{ docs: [] }` will cascade into runtime errors.
  - Do not check `__DEV__` directly in service files; always use `isFirebaseMockMode()` so that mock mode can also be forced in production builds via `config.firebase.forceMockMode`.

---

### Pattern 3: Service Layer Abstraction

- **Intent:** Encapsulate native SDK access behind thin helper functions (`getDb()`, `getAuth()`, `getMessaging()`) so that the rest of the codebase never imports native modules directly. This centralizes lazy loading, mock mode switching, and module caching in a single location per service.

- **Implementation:**

```typescript
// src/services/firebase/firestore.ts

const mockFirestore = () => ({
  collection: () => mockCollection,
});

export function getDb() {
  if (isFirebaseMockMode()) {
    return mockFirestore();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const firestore = require('@react-native-firebase/firestore').default;
  return firestore();
}

// For backward compatibility
export const db = {
  collection: (name: string) => getDb().collection(name),
};
```

```typescript
// src/services/firebase/notifications.ts

const getMessaging = () => {
  if (isFirebaseMockMode()) {
    return mockMessaging;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messaging = require('@react-native-firebase/messaging').default;
  return messaging();
};
```

- **Files:**
  - `src/services/firebase/firestore.ts` -- `getDb()` for Firestore access
  - `src/services/firebase/auth.ts` -- `getAuth()` for Firebase Auth
  - `src/services/firebase/notifications.ts` -- `getMessaging()` for FCM
  - `src/services/firebase/users.ts` -- Uses `getDb()` for user document queries
  - `src/services/firebase/rooms.ts` -- Uses `getDb()` for room document queries
  - `src/services/firebase/messages.ts` -- Uses `getDb()` for message collections

- **When to Apply:** Any time a new Firebase service or third-party native SDK is integrated, create a dedicated service file with a `get*()` accessor. Feature code (components, hooks, screens) should never call `require()` for native modules directly -- they must go through the service layer.

- **Pitfalls:**
  - Do not export the raw native module instance; always export a function that returns it. This ensures lazy loading and mock mode work correctly.
  - If you add a new method to a mock object, ensure it mirrors the real SDK's return type. Partial mocks lead to subtle bugs in components that work in dev but crash in production.
  - The `db` backward-compatibility export in `firestore.ts` delegates to `getDb()` on each call. Avoid caching `db.collection(...)` references across renders.

---

### Pattern 4: Navigation Guards

- **Intent:** Enforce a strict navigation state machine: unauthenticated users see onboarding/auth screens, authenticated users without a completed profile are directed to the profile setup flow, and fully set-up users land in the main tab navigator. This prevents users from accessing screens they are not authorized for.

- **Implementation:**

```typescript
// src/app/_layout.tsx -- RootLayoutContent

const { isAuthenticated, isLoading, user } = useAuth();
const profileCompleted = useProfileSetupStore((state) => state.completed);
const currentStep = useProfileSetupStore((state) => state.currentStep);

useEffect(() => {
  if (!appReady) {
    return;
  }

  const inOnboardingGroup = segments[0] === '(onboarding)';
  const inAuthGroup = segments[0] === '(auth)';
  const inProfileSetupGroup = segments[0] === '(profile-setup)';

  // Guard 1: Unauthenticated users must be in onboarding or auth
  if (!isAuthenticated && !inOnboardingGroup && !inAuthGroup) {
    router.replace('/(onboarding)/splash');
    return;
  }

  // Guard 2: Authenticated but profile incomplete -> resume setup
  if (isAuthenticated && !profileCompleted && !inProfileSetupGroup) {
    const route = STEP_TO_ROUTE[currentStep] || '/(profile-setup)/name';
    router.replace(route as any);
    return;
  }

  // Guard 3: Fully authenticated -> redirect away from auth/onboarding screens
  const segmentsList = segments as string[];
  const inWelcomeScreen = inProfileSetupGroup && segmentsList[1] === 'welcome';

  if (
    isAuthenticated &&
    profileCompleted &&
    (inOnboardingGroup || inAuthGroup || inProfileSetupGroup) &&
    !inWelcomeScreen
  ) {
    router.replace('/(tabs)');
  }
}, [appReady, currentStep, isAuthenticated, profileCompleted, router, segments]);
```

- **Files:**
  - `src/app/_layout.tsx` -- Root layout with all three navigation guards
  - `src/store/profileSetupStore.ts` -- Provides `completed` and `currentStep` state
  - `src/constants/profile-options.ts` -- `STEP_TO_ROUTE` mapping for profile setup resumption
  - `src/features/auth/AuthContext.tsx` -- Provides `isAuthenticated`, `isLoading`, and `user`

- **When to Apply:** All navigation guard logic must live in `_layout.tsx`. Individual screens should never perform redirect logic based on auth or profile state -- they rely on the layout guard to place them in the correct route group. When adding a new route group that requires its own access rules, add the guard condition here.

- **Pitfalls:**
  - Always check `appReady` (and by extension `isLoading`) before evaluating guards. Redirecting before auth state has resolved causes flickers and incorrect routing.
  - Use `router.replace()`, not `router.push()`, for guard redirects. Using `push` allows the user to navigate back to a screen they should not access.
  - The `welcome` screen exception demonstrates that guard rules may need carve-outs. Document any such exceptions clearly in the guard effect.

---

### Pattern 5: Zustand + MMKV Persistence

- **Intent:** Provide fast, synchronous client-side state persistence using Zustand stores backed by MMKV storage. Unlike AsyncStorage, MMKV is synchronous and significantly faster, which eliminates the flash of default state on app startup. The Zustand `persist` middleware handles serialization transparently.

- **Implementation:**

The MMKV adapter bridges Zustand's `StateStorage` interface to the MMKV native module:

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
  }
};

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage);
```

Stores use the adapter via the `persist` middleware:

```typescript
// src/store/profileSetupStore.ts

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set) => ({
      ...initialState,
      setName: (firstName, lastInitial) => set({ firstName, lastInitial }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      completeSetup: () => set({ completed: true }),
      reset: () => set(initialState),
      // ... other setters
    }),
    {
      name: "profile-setup",
      storage: mmkvStorage
    }
  )
);
```

The underlying MMKV instance is created once:

```typescript
// src/cache/mmkv.ts

import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'raine-storage' });
```

- **Files:**
  - `src/cache/mmkv.ts` -- Singleton MMKV instance creation
  - `src/store/persist.ts` -- Zustand-compatible MMKV storage adapter
  - `src/store/profileSetupStore.ts` -- Profile setup state (multi-step form)
  - `src/store/introductionsStore.ts` -- Introductions state
  - `src/store/dropsStore.ts` -- Drops state
  - `src/store/communitiesStore.ts` -- Communities state
  - `src/store/appStore.ts` -- General app state

- **When to Apply:** Use this pattern for any client-side state that must survive app restarts (form progress, user preferences, cached identifiers). Always pass `mmkvStorage` as the `storage` option and provide a unique, descriptive `name` string for each store.

- **Pitfalls:**
  - Every persisted store **must** define a `reset()` method that sets state back to `initialState`. Failing to do so makes it impossible to cleanly clear user data on logout.
  - The `name` field must be unique across all stores. Collisions silently overwrite persisted data.
  - Avoid storing large blobs (images, long lists) in MMKV-backed stores. MMKV is fast but operates synchronously on the JS thread; large writes block rendering.
  - When changing the shape of a persisted store, consider adding a `version` field and `migrate` function to the persist config to handle schema evolution gracefully.

---

### Pattern 6: Provider Pattern

- **Intent:** Compose cross-cutting concerns (data fetching, authentication, theming) at the root of the component tree using nested React providers. This ensures that every screen and component has access to shared context without prop drilling, and that providers initialize in the correct order.

- **Implementation:**

```typescript
// src/app/_layout.tsx -- RootLayout

export default function RootLayout() {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        const firebase = await import('@react-native-firebase/app');
        const apps = firebase.default.apps;

        if (apps.length === 0) {
          setFirebaseMockMode(true);
        } else {
          setFirebaseMockMode(false);
        }
      } catch (error) {
        setFirebaseMockMode(true);
      }
      setFirebaseReady(true);
    };

    checkFirebase();
  }, []);

  if (!firebaseReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

The nesting order is significant:

1. **`QueryClientProvider`** -- React Query cache, outermost because auth and other providers may trigger queries.
2. **`AuthProvider`** -- Provides `useAuth()` context consumed by navigation guards and child components.
3. **`RootLayoutContent`** -- Contains the `Stack` navigator and all guard logic.

- **Files:**
  - `src/app/_layout.tsx` -- Root provider composition
  - `src/features/auth/AuthContext.tsx` -- `AuthProvider` definition and `useAuth()` hook
  - `src/services/queryClient.ts` -- `queryClient` singleton

- **When to Apply:** When introducing a new cross-cutting concern that multiple screens need (e.g., a theme provider, a notification context), wrap it at the root layout level. Place it in the nesting order based on its dependencies -- providers that depend on other contexts must be nested inside them.

- **Pitfalls:**
  - Provider ordering matters. `AuthProvider` must be inside `QueryClientProvider` if auth state changes trigger query invalidation.
  - The `firebaseReady` gate (`if (!firebaseReady) return null`) prevents child providers and components from rendering before the environment is determined. Removing this gate causes race conditions where services are called before mock mode is set.
  - Avoid adding too many providers at the root. If a context is only needed in one route group, scope it to that group's layout instead.

---

### Pattern 7: Feature Flag Pattern

- **Intent:** Control feature rollout and experimentation via Firebase Remote Config with safe local defaults. The pattern supports graceful degradation: if Remote Config is unreachable or the app is in mock mode, the app falls back to hardcoded default values, ensuring deterministic behavior.

- **Implementation:**

Server-side flag fetching with local defaults:

```typescript
// src/services/firebase/remoteConfig.ts

const defaultFlags = {
  chatReactionsEnabled: true,
  newProfileUIEnabled: false,
  subscriptionGatingEnabled: true
};

let cachedFlags: Record<string, boolean> = { ...defaultFlags };

export async function initRemoteConfig() {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Remote Config using default flags');
    cachedFlags = { ...config.features };
    return;
  }

  try {
    const remoteConfig = require('@react-native-firebase/remote-config').default;
    const rc = remoteConfig();
    await rc.setDefaults(defaultFlags);

    try {
      await rc.fetchAndActivate();
      const snapshot = Object.keys(defaultFlags).reduce(
        (acc, key) => {
          acc[key] = rc.getValue(key).asBoolean();
          return acc;
        },
        {} as Record<string, boolean>
      );
      cachedFlags = snapshot;
    } catch {
      // Keep cached defaults if fetch fails
    }
  } catch (error) {
    console.warn('Remote Config initialization failed:', error);
    cachedFlags = { ...defaultFlags };
  }
}

export function getFeatureFlag(key: keyof typeof defaultFlags): boolean {
  return cachedFlags[key] ?? defaultFlags[key];
}
```

React hook for consuming flags in components:

```typescript
// src/hooks/useFeatureFlag.ts

export function useFeatureFlag(
  key: 'chatReactionsEnabled' | 'newProfileUIEnabled' | 'subscriptionGatingEnabled'
) {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => getFeatureFlag(key));

  useEffect(() => {
    let mounted = true;
    initRemoteConfig().then(() => {
      if (mounted) {
        setIsEnabled(getFeatureFlag(key));
      }
    });
    return () => {
      mounted = false;
    };
  }, [key]);

  return { isEnabled };
}
```

- **Files:**
  - `src/services/firebase/remoteConfig.ts` -- Remote Config initialization, default flags, and `getFeatureFlag()` accessor
  - `src/hooks/useFeatureFlag.ts` -- React hook for component-level flag consumption
  - `src/config/environment.ts` -- Local default values in `config.features`
  - `src/app/_layout.tsx` -- Calls `initRemoteConfig()` on mount
  - `src/app/room/[id].tsx` -- Consumes `useFeatureFlag('chatReactionsEnabled')`

- **When to Apply:** Use feature flags for any behavior that may need to be toggled without a code deploy: new UI variants, experimental features, or gating premium functionality. Add the new flag key to `defaultFlags` in `remoteConfig.ts`, to `config.features` in `environment.ts`, and to the `useFeatureFlag` key union type.

- **Pitfalls:**
  - Always provide a default value for every flag. A missing default causes `undefined` to propagate, which is falsy but not an explicit `false`.
  - The `useFeatureFlag` hook initializes synchronously from the cache (`getFeatureFlag(key)`) and then updates after Remote Config fetch resolves. Components should handle the possibility that the flag value may change after mount.
  - In mock mode, flags come from `config.features`, not `defaultFlags`. Ensure both objects are kept in sync for consistent development behavior.
  - The `mounted` check in the hook prevents state updates on unmounted components. Never remove this guard.

---

### Pattern 8: Deep Linking Pattern

- **Intent:** Route users to specific in-app screens when they tap a push notification. The pattern handles two cases: (1) the app is in the foreground/background and a notification is tapped (`onNotificationOpenedApp`), and (2) the app was fully terminated and launched via a notification tap (`getInitialNotification`).

- **Implementation:**

The notification service exposes two listeners:

```typescript
// src/services/firebase/notifications.ts

export function onNotificationOpened(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return getMessaging().onNotificationOpenedApp(handler);
}

export async function getInitialNotification() {
  return getMessaging().getInitialNotification();
}
```

The root layout subscribes to both and navigates based on the notification payload:

```typescript
// src/app/_layout.tsx -- RootLayoutContent

useEffect(() => {
  // Case 1: App was backgrounded, user taps notification
  const unsubscribe = onNotificationOpened((message) => {
    const roomId = message?.data?.roomId;
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  });

  // Case 2: App was killed, launched via notification tap
  getInitialNotification().then((message) => {
    const roomId = message?.data?.roomId;
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  });

  return unsubscribe;
}, [router]);
```

- **Files:**
  - `src/services/firebase/notifications.ts` -- `onNotificationOpened()`, `getInitialNotification()`, `requestNotificationPermission()`, `getFcmToken()`
  - `src/app/_layout.tsx` -- Subscribes to notification-opened events and performs navigation

- **When to Apply:** When adding a new notification type that should deep-link to a specific screen, extend the handler in `_layout.tsx` to inspect additional fields in `message.data` and route accordingly. The notification payload structure (e.g., `{ roomId: string }`) should be documented alongside the backend endpoint that sends the notification.

- **Pitfalls:**
  - Use `router.push()` (not `replace()`) for notification deep links so the user can navigate back to their previous screen.
  - Always null-check `message?.data?.roomId` (or whatever payload field). Notifications without the expected data should be silently ignored, not crash the app.
  - The `getInitialNotification()` call is asynchronous and may resolve after navigation guards have already redirected. Ensure the target route is accessible given the current auth state; otherwise the guard will override the deep link.
  - Clean up the `onNotificationOpened` subscription by returning the unsubscribe function from the effect to prevent duplicate handlers on re-renders.
  - In mock mode, `getInitialNotification()` returns `null` and `onNotificationOpenedApp` is a no-op. Notification deep linking cannot be tested in mock mode without manually invoking the handler.

---

## Summary

| # | Pattern | Primary Concern | Key File |
|---|---------|----------------|----------|
| 1 | Lazy Native Module Loading | Prevent import-time crashes | `services/revenuecat/index.ts` |
| 2 | Mock Mode Guard | Dev/test without Firebase | `config/environment.ts` |
| 3 | Service Layer Abstraction | Centralize SDK access | `services/firebase/firestore.ts` |
| 4 | Navigation Guards | Auth + profile state machine | `app/_layout.tsx` |
| 5 | Zustand + MMKV Persistence | Fast synchronous persistence | `store/persist.ts` |
| 6 | Provider Pattern | Cross-cutting context composition | `app/_layout.tsx` |
| 7 | Feature Flag Pattern | Remote-controlled rollout | `services/firebase/remoteConfig.ts` |
| 8 | Deep Linking Pattern | Notification-to-screen routing | `services/firebase/notifications.ts` |

These patterns are interdependent. Lazy loading (Pattern 1) enables mock mode (Pattern 2), which is enforced through the service layer (Pattern 3). Navigation guards (Pattern 4) consume persisted state (Pattern 5) provided by the provider tree (Pattern 6). Feature flags (Pattern 7) follow the same mock-aware service pattern. Deep linking (Pattern 8) integrates with the navigation system governed by the guards.

See [System Invariants](./9-SYSTEM-INVARIANTS.md) for the rules that must never be violated when applying these patterns, and [Architecture](./1-ARCHITECTURE.md) for the broader system context.
