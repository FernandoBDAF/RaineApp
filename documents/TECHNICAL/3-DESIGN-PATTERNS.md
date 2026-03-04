# Design Patterns

This document catalogs the 8 key design patterns used throughout the Raine codebase. Each pattern addresses a specific architectural concern -- from safely loading native modules to managing navigation state. Adhering to these patterns ensures consistency, testability, and resilience across the application.

Cross-references: [System Invariants](./9-SYSTEM-INVARIANTS.md) | [Architecture](./1-ARCHITECTURE.md)

---

## Table of Contents

1. [Lazy Native Module Loading](#pattern-1-lazy-native-module-loading)
2. [Firebase Initialization Guard](#pattern-2-firebase-initialization-guard)
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

Firebase modules use direct imports now that mock mode has been removed. The `firebase.ts` entry point initializes the app at import time and re-exports SDK instances:

```typescript
// src/services/firebase/firebase.ts

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  firebase.app();
}

export { auth, firestore };
export default firebase;
```

- **Files:**
  - `src/services/revenuecat/index.ts` -- RevenueCat purchases SDK
  - `src/services/firebase/firestore.ts` -- Firestore database access
  - `src/services/firebase/notifications.ts` -- FCM messaging
  - `src/services/firebase/remoteConfig.ts` -- Remote Config
  - `src/services/firebase/auth.ts` -- Firebase Authentication
  - `src/services/firebase/messages.ts` -- Chat message operations
  - `src/context/auth/AuthContext.tsx` -- Auth state listener

- **When to Apply:** Use this pattern whenever integrating a native module that may not be present in all build configurations (e.g., Expo Go, development builds without native config files, or optional SDKs). Never use top-level `import` for native modules that could crash during bundle evaluation.

- **Pitfalls:**
  - Do **not** use `typeof import(...)` or top-level dynamic `import()` -- Metro can resolve these at bundle time, defeating the purpose.
  - Always cache the loaded module in a module-scoped variable (e.g., `_Purchases`) to avoid calling `require()` on every invocation.
  - Remember that the loaded module reference is `any`-typed; add runtime guards or type assertions where needed rather than trusting the return shape blindly.

---

### Pattern 2: Firebase Initialization Guard

- **Intent:** Ensure that Firebase is properly initialized before any service call. Instead of routing to mock implementations, the guard throws an explicit error if the Firebase app was not initialized (e.g., missing `GoogleService-Info.plist` or `google-services.json`). This fails fast with a clear message rather than allowing silent misbehavior.

- **Implementation:**

```typescript
// src/services/firebase/auth.ts

import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const ensureFirebaseInitialized = () => {
  if (firebase.apps.length === 0) {
    throw new Error(
      '[Firebase] No app initialized. Make sure GoogleService-Info.plist is correctly bundled.'
    );
  }
};

export const signUp = (email: string, password: string) => {
  ensureFirebaseInitialized();
  return auth().createUserWithEmailAndPassword(email, password);
};

export const signIn = (email: string, password: string) => {
  ensureFirebaseInitialized();
  return auth().signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
  ensureFirebaseInitialized();
  return auth().signOut();
};

export const resetPassword = (email: string) => {
  ensureFirebaseInitialized();
  return auth().sendPasswordResetEmail(email);
};

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  ensureFirebaseInitialized();
  return auth().onAuthStateChanged(callback);
};
```

The initialization itself happens in `firebase.ts`, which is imported before any service is used:

```typescript
// src/services/firebase/firebase.ts

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
```

- **Files:**
  - `src/services/firebase/firebase.ts` -- Initializes the Firebase app at import time; exports `auth`, `firestore`, and `firebase`
  - `src/services/firebase/auth.ts` -- `ensureFirebaseInitialized()` guard before every auth operation
  - `src/services/firebase/firestore.ts` -- Firestore database access
  - `src/services/firebase/notifications.ts` -- FCM messaging
  - `src/services/firebase/remoteConfig.ts` -- Remote Config
  - `src/services/firebase/connections.ts` -- Connection CRUD operations
  - `src/context/auth/AuthContext.tsx` -- Auth state listener

- **When to Apply:** Use `ensureFirebaseInitialized()` at the top of any service function that calls a Firebase SDK. The guard is a single `firebase.apps.length === 0` check -- lightweight enough to call on every invocation.

- **Pitfalls:**
  - The guard throws synchronously. Callers that cannot tolerate an exception (e.g., `onAuthStateChanged` in a `useEffect`) should wrap the call in a try/catch and handle the missing-Firebase case gracefully.
  - `firebase.ts` must be imported before any service module that uses `ensureFirebaseInitialized()`. The app's import graph naturally guarantees this because `_layout.tsx` imports from `context/auth/AuthContext.tsx`, which imports from `auth.ts`, which imports `firebase`.
  - Do not replace the guard with a silent no-op. The previous mock-mode approach was removed specifically because silent fallbacks hid real configuration issues.

---

### Pattern 3: Service Layer Abstraction

- **Intent:** Encapsulate native SDK access behind thin helper functions (`getDb()`, `getMessaging()`) so that the rest of the codebase never imports native modules directly. This centralizes lazy loading and module caching in a single location per service. Auth uses direct imports with `ensureFirebaseInitialized()` (see Pattern 2).

- **Implementation:**

```typescript
// src/services/firebase/firestore.ts

import firestore from '@react-native-firebase/firestore';

export function getDb() {
  return firestore();
}

export const db = {
  collection: (name: string) => getDb().collection(name),
};
```

```typescript
// src/services/firebase/notifications.ts

const getMessaging = () => {
  const messaging = require('@react-native-firebase/messaging').default;
  return messaging();
};
```

- **Files:**
  - `src/services/firebase/firestore.ts` -- `getDb()` for Firestore access
  - `src/services/firebase/auth.ts` -- Direct `auth()` calls guarded by `ensureFirebaseInitialized()`
  - `src/services/firebase/notifications.ts` -- `getMessaging()` for FCM
  - `src/services/firebase/connections.ts` -- Uses `getDb()` for connection document operations
  - `src/services/firebase/users.ts` -- Uses `getDb()` for user document queries
  - `src/services/firebase/rooms.ts` -- Uses `getDb()` for room document queries
  - `src/services/firebase/messages.ts` -- Uses `getDb()` for message collections

- **When to Apply:** Any time a new Firebase service or third-party native SDK is integrated, create a dedicated service file with a `get*()` accessor. Feature code (components, hooks, screens) should never call `require()` for native modules directly -- they must go through the service layer.

- **Pitfalls:**
  - Do not export the raw native module instance; always export a function that returns it. This ensures lazy loading works correctly.
  - The `db` backward-compatibility export in `firestore.ts` delegates to `getDb()` on each call. Avoid caching `db.collection(...)` references across renders.
  - For auth specifically, `ensureFirebaseInitialized()` is preferred over a `getAuth()` wrapper because the auth module is imported directly at the top of the file.

---

### Pattern 4: Navigation Guards

- **Intent:** Enforce a strict navigation state machine: unauthenticated users see onboarding/auth screens, authenticated users without a completed profile are directed to the profile setup flow, and fully set-up users land in the main tab navigator. This prevents users from accessing screens they are not authorized for.

- **Implementation:**

```typescript
// src/app/_layout.tsx -- RootLayoutContent

const { isAuthenticated, isLoading } = useAuth();
const profileSetupCompletedAt = useProfileSetupStore(
  (state) => state.profileSetupCompletedAt
);
const currentStep = useProfileSetupStore((state) => state.currentStep);
const profileCompleted = !!profileSetupCompletedAt;

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
  if (
    isAuthenticated &&
    profileCompleted &&
    (inOnboardingGroup || inAuthGroup || inProfileSetupGroup)
  ) {
    router.replace('/(tabs)');
  }
}, [appReady, currentStep, isAuthenticated, profileCompleted, router, segments]);
```

- **Files:**
  - `src/app/_layout.tsx` -- Root layout with all three navigation guards
  - `src/store/profileSetupStore.ts` -- Provides `profileSetupCompletedAt` and `currentStep` state
  - `src/constants/profile-options.ts` -- `STEP_TO_ROUTE` mapping for profile setup resumption
  - `src/context/auth/AuthContext.tsx` -- Provides `isAuthenticated`, `isLoading`, and `user`

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

Firebase is initialized at import time by `firebase.ts` (see Pattern 2), so there is no async readiness gate. The nesting order is significant:

1. **`QueryClientProvider`** -- React Query cache, outermost because auth and other providers may trigger queries.
2. **`AuthProvider`** -- Provides `useAuth()` context consumed by navigation guards and child components.
3. **`RootLayoutContent`** -- Contains the `Stack` navigator and all guard logic.

- **Files:**
  - `src/app/_layout.tsx` -- Root provider composition
  - `src/context/auth/AuthContext.tsx` -- `AuthProvider` definition and `useAuth()` hook
  - `src/services/queryClient.ts` -- `queryClient` singleton

- **When to Apply:** When introducing a new cross-cutting concern that multiple screens need (e.g., a theme provider, a notification context), wrap it at the root layout level. Place it in the nesting order based on its dependencies -- providers that depend on other contexts must be nested inside them.

- **Pitfalls:**
  - Provider ordering matters. `AuthProvider` must be inside `QueryClientProvider` if auth state changes trigger query invalidation.
  - Firebase initialization is synchronous (happens at import time in `firebase.ts`). There is no `firebaseReady` gate because the app cannot render at all if `firebase.ts` fails to load.
  - Avoid adding too many providers at the root. If a context is only needed in one route group, scope it to that group's layout instead.

---

### Pattern 7: Feature Flag Pattern

- **Intent:** Control feature rollout and experimentation via Firebase Remote Config with safe local defaults. The pattern supports graceful degradation: if Remote Config is unreachable, the app falls back to hardcoded default values, ensuring deterministic behavior.

- **Implementation:**

Server-side flag fetching with local defaults:

```typescript
// src/services/firebase/remoteConfig.ts

const defaultFlags = {
  chatReactionsEnabled: true,
  newProfileUIEnabled: false,
  subscriptionGatingEnabled: true,
  momsLikeYouEnabled: true
};

let cachedFlags: Record<string, boolean> = { ...defaultFlags };

export async function initRemoteConfig() {
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
  - If Remote Config fetch fails, flags fall back to `defaultFlags`. Keep these defaults up to date as new flags are added.
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
  - When Firebase is not configured, `getInitialNotification()` and `onNotificationOpenedApp` will throw. Ensure Firebase is properly initialized before notification handlers are registered.

---

## Summary

| # | Pattern | Primary Concern | Key File |
|---|---------|----------------|----------|
| 1 | Lazy Native Module Loading | Prevent import-time crashes | `services/revenuecat/index.ts` |
| 2 | Firebase Initialization Guard | Fail-fast if Firebase missing | `services/firebase/auth.ts` |
| 3 | Service Layer Abstraction | Centralize SDK access | `services/firebase/firestore.ts` |
| 4 | Navigation Guards | Auth + profile state machine | `app/_layout.tsx` |
| 5 | Zustand + MMKV Persistence | Fast synchronous persistence | `store/persist.ts` |
| 6 | Provider Pattern | Cross-cutting context composition | `app/_layout.tsx` |
| 7 | Feature Flag Pattern | Remote-controlled rollout | `services/firebase/remoteConfig.ts` |
| 8 | Deep Linking Pattern | Notification-to-screen routing | `services/firebase/notifications.ts` |

These patterns are interdependent. Lazy loading (Pattern 1) keeps native modules safe at import time, while the initialization guard (Pattern 2) ensures Firebase is ready before any operation. The service layer (Pattern 3) centralizes SDK access. Navigation guards (Pattern 4) consume persisted state (Pattern 5) provided by the provider tree (Pattern 6). Feature flags (Pattern 7) use Remote Config with safe defaults. Deep linking (Pattern 8) integrates with the navigation system governed by the guards.

See [System Invariants](./9-SYSTEM-INVARIANTS.md) for the rules that must never be violated when applying these patterns, and [Architecture](./1-ARCHITECTURE.md) for the broader system context.
