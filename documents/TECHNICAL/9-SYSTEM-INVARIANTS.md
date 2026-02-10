# System Invariants

For the debugging history that led to these rules, see [development/8-dev-build-runtime-fixes.md](../../implementation-history/8-dev-build-runtime-fixes.md).

---

## Overview

These five rules are prescriptive invariants that the RaineApp codebase must follow. Breaking any of them will re-introduce crashes and build failures that were fixed during the development build and runtime debugging session.

---

## 1. Never import native modules at the top level of route files

**Rule statement:** Native modules (`react-native-purchases`, `react-native-fbsdk-next`, `@react-native-firebase/*`) must never appear in a top-level `import` in any file that is part of the Expo Router route tree or is imported (directly or transitively) by a route file.

**Why:** Expo Router eagerly loads all route modules to build the navigation tree. If a route module imports a native module at the top level, that module's `NativeEventEmitter` initialises before the React Native runtime is ready, causing `TypeError: Cannot read property 'EventEmitter' of undefined`.

**Correct example:**

```typescript
// src/services/revenuecat/index.ts — lazy require inside a function
function getPurchases() {
  if (!_Purchases) {
    _Purchases = require('react-native-purchases').default;
  }
  return _Purchases!;
}

// src/app/subscription.tsx — local type definitions in route files
interface RCPackage {
  identifier: string;
  product: { title: string; description: string; priceString: string };
}
interface RCOffering {
  availablePackages: RCPackage[];
}
```

**Incorrect example:**

```typescript
// Top-level value import — crashes at startup
import Purchases from 'react-native-purchases';
import remoteConfig from '@react-native-firebase/remote-config';

// In route files, metro may still resolve the import
import type { PurchasesOffering } from 'react-native-purchases';

// Metro resolves the import expression
let x: typeof import('react-native-purchases').default;
```

**Enforcement:** Grep route files and their transitive imports for `import.*from.*react-native-purchases`, `import.*from.*@react-native-firebase/`, `import.*from.*react-native-fbsdk-next`. Type-only imports in route files may trigger resolution; prefer local type definitions. Run `yarn dev` and verify no EventEmitter crash on cold start.

---

## 2. Dev mode = mock mode

**Rule statement:** When `isDev` is true (`__DEV__ === true`), `isFirebaseMockMode()` must return `true`, regardless of whether `google-services.json` exists.

**Why:** The development build includes Firebase native modules, but the Facebook SDK is not configured (no App ID in `app.json` plugins). Real social login would crash. Mock auth creates a user with uid `mock-user-123`, which has no Firestore permissions. Real Firebase Auth has no session for that user, so sign-out would fail. Enabling mock mode globally in dev avoids all of these.

**Correct example:**

```typescript
// src/config/environment.ts
export const isDev = __DEV__;

export function isFirebaseMockMode() {
  return _firebaseMockMode || isDev;
}
```

**Incorrect example:**

```typescript
// Only checking config file presence — mock user has no Firestore permissions
export function isFirebaseMockMode() {
  return !hasGoogleServicesJson();
}
```

**Enforcement:** Ensure `isFirebaseMockMode()` includes `|| isDev` in its return expression. In development, all Firebase services that check this flag will use mocks. Verify `yarn dev` allows full flow: splash, referral, login, profile setup, home, sign out.

---

## 3. Single entry point (expo-router/entry)

**Rule statement:** The project must use `"main": "expo-router/entry"` in `package.json`. There must never be a root `index.ts` or `App.tsx` that calls `registerRootComponent()`.

**Why:** A conflicting entry point causes the Android build to reference the wrong component, producing `Error: Activity class {com.raine.app/com.raine.app.MainActivity} does not exist`. Expo Router's entry resolution is baked into the native binary at build time.

**Correct example:**

```json
// package.json
{
  "main": "expo-router/entry"
}
```

```text
# No root index.ts or App.tsx
src/app/
├── _layout.tsx
├── index.tsx
└── ...
```

**Incorrect example:**

```typescript
// index.ts (root) — conflicts with Expo Router
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

```typescript
// App.tsx (root) — unused but can confuse build
export default function App() { ... }
```

**Enforcement:** Verify `package.json` has `"main": "expo-router/entry"`. Ensure no `index.ts` or `App.tsx` exists at project root. After removing conflicting entry files, rebuild the native client; restarting Metro is not sufficient.

---

## 4. SplashScreen.preventAutoHideAsync at module level

**Rule statement:** `SplashScreen.preventAutoHideAsync()` must be called at module level in `_layout.tsx`, outside any component or `useEffect`.

**Why:** If called inside a `useEffect`, the layout renders at least one frame before the splash is locked. The native splash hides and the app shows a white screen before the Raine splash image appears.

**Correct example:**

```typescript
// src/app/_layout.tsx
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';

// Keep the native splash screen visible until we decide where to navigate.
// This MUST run at module level (before any component renders) to avoid a flash.
SplashScreen.preventAutoHideAsync();

const RootLayoutContent = () => {
  // ...
};
```

**Incorrect example:**

```typescript
const RootLayoutContent = () => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();  // Runs after first render — white flash
  }, []);
  return <Stack />;
};
```

**Enforcement:** Ensure `SplashScreen.preventAutoHideAsync()` appears at top-level in `_layout.tsx`, before any component definition. Cold-start the app and confirm no white flash before the Raine splash.

---

## 5. Index route redirects to onboarding splash

**Rule statement:** `src/app/index.tsx` must redirect to `/(onboarding)/splash`, not `/(tabs)`.

**Why:** The `_layout.tsx` navigation guard handles the real routing (onboarding, auth, profile-setup, or tabs). If `index.tsx` redirects to `/(tabs)`, the user briefly sees the tabs screen before the guard redirects them to onboarding or auth, causing a white flash.

**Correct example:**

```typescript
// src/app/index.tsx
import { Redirect } from 'expo-router';

/**
 * Root index route. The _layout.tsx navigation guard handles the actual
 * redirect (to onboarding, auth, profile-setup, or tabs). We redirect
 * to onboarding/splash here so there's no white flash while the guard runs.
 */
export default function Index() {
  return <Redirect href="/(onboarding)/splash" />;
}
```

**Incorrect example:**

```typescript
export default function Index() {
  return <Redirect href="/(tabs)" />;  // Tabs render before guard — white flash
}
```

**Enforcement:** Ensure `index.tsx` uses `href="/(onboarding)/splash"`. Cold-start and verify no flash of the tabs layout before onboarding.

---

## Cross-references

| Document | Purpose |
|----------|---------|
| [development/8-dev-build-runtime-fixes.md](../../implementation-history/8-dev-build-runtime-fixes.md) | Full debugging session, root causes, and fix rationale |
| [README.md](../../README.md) | Critical Rules for Contributors, project setup, troubleshooting |
| [src/config/environment.ts](../../src/config/environment.ts) | `isFirebaseMockMode()`, `isDev` implementation |
| [src/app/_layout.tsx](../../src/app/_layout.tsx) | SplashScreen call site, navigation guard |
| [src/app/index.tsx](../../src/app/index.tsx) | Root redirect target |
