# Development Build & Runtime Fixes — Session Study

## Overview

This document captures the full debugging session that took the RaineApp from a
non-functional Android development build to a fully running app with mock auth,
mock Firestore, and a clean navigation flow. It covers every issue found, the
root cause, the fix, and — most importantly — the **system invariants** that
must be maintained going forward.

---

## Table of Contents

1. [System Architecture Invariants](#1-system-architecture-invariants)
2. [Issue 1: Android MainActivity Not Found](#2-issue-1-android-mainactivity-not-found)
3. [Issue 2: EventEmitter Crash at Startup](#3-issue-2-eventemitter-crash-at-startup)
4. [Issue 3: Social Login Crash (Facebook SDK)](#4-issue-3-social-login-crash-facebook-sdk)
5. [Issue 4: White Flash Before Splash Screen](#5-issue-4-white-flash-before-splash-screen)
6. [Issue 5: Firestore Permission Denied](#6-issue-5-firestore-permission-denied)
7. [Issue 6: Sign-Out Crash](#7-issue-6-sign-out-crash)
8. [Files Changed](#8-files-changed)
9. [How to Run Locally](#9-how-to-run-locally)

---

## 1. System Architecture Invariants

These are the **rules** the codebase must follow. Breaking any of them will
re-introduce the bugs fixed in this session.

### 1.1 Never import native modules at the top level

Native modules (`react-native-purchases`, `react-native-fbsdk-next`,
`@react-native-firebase/*`) must **never** appear in a top-level `import`
statement in any file that is part of the Expo Router route tree or is imported
(directly or transitively) by a route file.

**Why:** Expo Router eagerly loads all route modules to build the navigation
tree. If a route module imports a native module at the top level, that module's
`NativeEventEmitter` initialises before the React Native runtime is ready,
causing `TypeError: Cannot read property 'EventEmitter' of undefined`.

**Rule:**
```
✅  const mod = require('native-module').default;     // inside a function body
✅  import type { Foo } from 'native-module';          // type-only (USUALLY safe)
❌  import Mod from 'native-module';                    // top-level value import
❌  import type { Foo } from 'native-module';           // in a route file (metro may still resolve it)
❌  let x: typeof import('native-module').default;      // metro resolves the import expression
```

> **Caveat:** Even `import type` can trigger module resolution in metro/Expo
> Router route files. For native modules, prefer local type definitions in route
> files and keep `import type` in non-route service files only.

### 1.2 Dev mode = mock mode (always)

In development (`__DEV__ === true`), the entire Firebase + social auth stack
is mocked. This is enforced by `isFirebaseMockMode()` returning `true` when
`isDev` is `true`, regardless of whether `google-services.json` exists.

**Why:** The development build includes Firebase native modules (they're in the
APK), but the Facebook SDK is not configured (no App ID in `app.json` plugins).
This means:
- Real social login will crash (no Facebook App ID).
- Mock auth creates a user with uid `mock-user-123`.
- Real Firestore rejects operations from `mock-user-123` (permission denied).
- Real Firebase Auth has no `mock-user-123` session (sign-out fails).

Enabling mock mode globally in dev avoids all of these.

**Rule:** If you need to test against **real** Firebase in development, you must:
1. Add `react-native-fbsdk-next` to `app.json` plugins with a real Facebook App ID.
2. Remove or override `isDev` from `isFirebaseMockMode()`.
3. Rebuild the native binary.

### 1.3 Expo Router entry point

The project uses Expo Router with `"main": "expo-router/entry"` in
`package.json`. There must **never** be a root `index.ts` or `App.tsx` that
calls `registerRootComponent()`. This conflicts with Expo Router's entry system
and causes `MainActivity` not to be found on Android.

### 1.4 Splash screen must be locked at module level

`SplashScreen.preventAutoHideAsync()` must be called at **module level** in
`_layout.tsx` (outside any component or `useEffect`). If called inside a
`useEffect`, the layout renders at least one frame before the splash is locked,
causing a white flash.

### 1.5 The index route must redirect to the splash

`src/app/index.tsx` must redirect to `/(onboarding)/splash`, not `/(tabs)`.
The `_layout.tsx` navigation guard handles the real routing. If `index.tsx`
redirects to tabs, the user briefly sees the tabs screen before the guard
redirects them to onboarding/auth.

---

## 2. Issue 1: Android MainActivity Not Found

**Error:**
```
Error: Activity class {com.raine.app/com.raine.app.MainActivity} does not exist.
```

**Root cause (two-part):**
1. Legacy `index.ts` (with `registerRootComponent`) and `App.tsx` conflicted
   with Expo Router's `expo-router/entry`.
2. API 36 emulator had stale package manager cache preventing activity resolution
   even after rebuilding.

**Fix:**
- Deleted `RaineApp/index.ts` and `RaineApp/App.tsx`.
- Rebuilt with `yarn build:dev:android`.
- Wiped emulator data: `emulator -avd <name> -wipe-data -no-snapshot`.

**Detailed study:** [`development/7-android-startup-crash-study.md`](./7-android-startup-crash-study.md)

---

## 3. Issue 2: EventEmitter Crash at Startup

**Error:**
```
[runtime not ready]: TypeError: Cannot read property 'EventEmitter' of undefined
```

**Root cause:** Top-level imports of native modules in files loaded during
startup. Three sources:

| File | Problematic Import |
|------|--------------------|
| `services/revenuecat/index.ts` | `import Purchases from 'react-native-purchases'` |
| `services/firebase/remoteConfig.ts` | `import remoteConfig from '@react-native-firebase/remote-config'` |
| `hooks/useEntitlement.ts` | `import Purchases from 'react-native-purchases'` |
| `app/subscription.tsx` | `import type { ... } from 'react-native-purchases'` (metro resolved it) |
| `services/revenuecat/index.ts` | `typeof import('react-native-purchases').default` (metro resolved it) |

**Fix:** Changed all to lazy `require()` inside function bodies. Replaced
`import type` in route files with local type definitions.

---

## 4. Issue 3: Social Login Crash (Facebook SDK)

**Error:** App crashed when tapping "Continue with Instagram" on the login
screen.

**Root cause:** Firebase was configured (`google-services.json` present), so
`isFirebaseMockMode()` returned `false`. The social auth code tried to use the
real Facebook SDK, but `react-native-fbsdk-next` was not configured in
`app.json` plugins (no Facebook App ID). Loading or calling the module caused
native crashes.

**Fix:** `socialAuth.ts` now uses `shouldUseRealFacebookSdk()` which returns
`false` in dev mode. Social login always uses mock auth in development. The
`react-native-fbsdk-next` module is never loaded in dev.

---

## 5. Issue 4: White Flash Before Splash Screen

**Error:** Brief white screen visible before the Raine splash image appeared.

**Root cause (two-part):**
1. `src/app/index.tsx` redirected to `/(tabs)`, which rendered a frame before
   `_layout.tsx` navigation guard kicked in.
2. `SplashScreen.preventAutoHideAsync()` was called inside a `useEffect`,
   which runs after the first render.

**Fix:**
- Changed `index.tsx` to redirect to `/(onboarding)/splash`.
- Moved `SplashScreen.preventAutoHideAsync()` to module level in `_layout.tsx`.

---

## 6. Issue 5: Firestore Permission Denied

**Error:**
```
Error: [firestore/permission-denied] The caller does not have permission
to execute the specified operation.
```

**Root cause:** Mock user (`mock-user-123`) has no Firestore security rule
permissions. Services like `saveProfileSetup` and `messages.ts` checked
`isFirebaseMockMode()` which returned `false` (Firebase IS configured), so
they attempted real Firestore operations.

**Fix:** Made `isFirebaseMockMode()` return `true` when `isDev` is `true`.
This single change fixed **all** Firebase service files at once, since they
all use this function as their guard.

---

## 7. Issue 6: Sign-Out Crash

**Error:**
```
Error: [auth/no-current-user] No user currently signed in.
```

**Root cause:** `auth.ts` called `getAuth().signOut()` which used real Firebase
Auth (mock mode was off). Real Firebase Auth had no signed-in user (we used
mock auth for login).

**Fix:** `auth.ts`'s `getAuth()` now returns `mockAuth` in dev mode (consistent
with the global `isFirebaseMockMode()` fix).

---

## 8. Files Changed

### Core Architecture
| File | Change |
|------|--------|
| `src/config/environment.ts` | `isFirebaseMockMode()` returns `true` in dev mode |
| `src/app/_layout.tsx` | `SplashScreen.preventAutoHideAsync()` at module level |
| `src/app/index.tsx` | Redirect to `/(onboarding)/splash` instead of `/(tabs)` |

### Auth System
| File | Change |
|------|--------|
| `src/services/firebase/auth.ts` | `useMockAuth()` checks `isDev`; simplified `onAuthStateChanged` |
| `src/services/firebase/socialAuth.ts` | `shouldUseRealFacebookSdk()` — never loads fbsdk in dev |
| `src/services/firebase/mock/mockAuth.ts` | Initial listener uses `Promise.resolve()` instead of `setTimeout(100)` |
| `src/features/auth/AuthContext.tsx` | No changes needed (all fixes upstream) |

### Firebase Services (lazy loading + mock guards)
| File | Change |
|------|--------|
| `src/services/firebase/remoteConfig.ts` | Lazy `require()` instead of top-level import |
| `src/services/firebase/notifications.ts` | Already had mock guards (no changes needed) |
| `src/services/profile/index.ts` | `shouldSkipFirestore()` + lazy `require()` for firestore/storage |

### RevenueCat (lazy loading)
| File | Change |
|------|--------|
| `src/services/revenuecat/index.ts` | Lazy `require()` via `getPurchases()` helper |
| `src/hooks/useEntitlement.ts` | Lazy `require()` inside `useEffect` |
| `src/app/subscription.tsx` | Local type defs instead of `import type` from native module |

### Documentation
| File | Change |
|------|--------|
| `development/7-android-startup-crash-study.md` | Full investigation of MainActivity crash |
| `development/8-dev-build-runtime-fixes.md` | This document |
| `README.md` | Updated Quick Start, added emulator tips |

### Deleted Files
| File | Reason |
|------|--------|
| `index.ts` (root) | Conflicted with Expo Router entry |
| `App.tsx` (root) | Conflicted with Expo Router entry |

---

## 9. How to Run Locally

```bash
# 1. Install dependencies
yarn install

# 2. Build the development client (first time or after native dep changes)
yarn build:dev:android

# 3. Wipe emulator and cold boot (avoids stale cache on API 36)
pkill -f emulator
~/Library/Android/sdk/emulator/emulator -avd <AVD_NAME> -wipe-data -no-snapshot &

# 4. Install the build
yarn install:android

# 5. Start the dev server
yarn dev
```

**In development:**
- All Firebase services are mocked (Firestore, Auth, Messaging, Remote Config).
- Social login uses mock auth (no Facebook App ID needed).
- RevenueCat is not configured (returns mock data).
- The full UI flow works: splash → referral → login → profile setup → home → rooms.

**To use real Firebase in production:**
1. Configure `react-native-fbsdk-next` plugin in `app.json` with Facebook App ID.
2. Set Firestore security rules for your users.
3. Set `EXPO_PUBLIC_REVENUECAT_API_KEY` environment variable.
4. Build with `yarn build:prod:android` or `yarn build:prod:ios`.
