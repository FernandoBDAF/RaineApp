# Troubleshooting Guide

This guide consolidates all known issues, root causes, and fixes encountered during Raine app development. Use the quick fix table for fast resolution, then consult the detailed sections when more context is needed.

---

## Table of Contents

1. [Quick Fix Table](#quick-fix-table)
2. [EventEmitter Crash (Native Module Imports)](#eventemitter-crash-native-module-imports)
3. [Activity Class Not Found (Android Emulator)](#activity-class-not-found-android-emulator)
4. [Social Login Crash (Facebook SDK)](#social-login-crash-facebook-sdk)
5. [Firestore Permission Denied (Mock Mode)](#firestore-permission-denied-mock-mode)
6. [Sign-Out Crash](#sign-out-crash)
7. [White Flash Before Splash Screen](#white-flash-before-splash-screen)
8. [Metro Issues](#metro-issues)
9. [NativeWind Styling Issues](#nativewind-styling-issues)
10. [TypeScript Errors](#typescript-errors)
11. [Build and Environment Issues](#build-and-environment-issues)

---

## Quick Fix Table

| Problem | Solution |
|---------|----------|
| `EventEmitter of undefined` | A native module is imported at the top level. Move to lazy `require()` inside a function body. |
| `Activity class does not exist` | Wipe emulator data: `emulator -avd <NAME> -wipe-data -no-snapshot`. |
| Social login crash | Facebook SDK is not configured. Use mock auth in development (default behavior). |
| `firestore/permission-denied` | Mock user has no Firestore permissions. Ensure `isFirebaseMockMode()` returns `true` in dev. |
| `auth/no-current-user` on sign-out | Auth service is using real Firebase instead of mock. Check `isDev` guard in `auth.ts`. |
| White flash before splash | `SplashScreen.preventAutoHideAsync()` must be at module level, not inside `useEffect`. |
| `Native module X not found` | Rebuild the development client: `yarn build:dev:android` + `yarn install:android`. |
| Metro port conflict (`Port 8081 in use`) | `pkill -f "expo start" && yarn dev` |
| Watchman recrawling | `watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)" && yarn clean` |
| Styles not applying (NativeWind) | `yarn clean:all` -- ensure `metro.config.js` has the `withNativeWind` wrapper. |
| TypeScript errors | `yarn type-check` -- see detailed section for common patterns. |
| `NitroModules not found` | Running in Expo Go. Use a development build instead. |
| `RNFBAppModule not found` | Firebase config files missing or development build not installed. |
| RevenueCat singleton error | `Purchases.configure` was not called. Check the configuration guard in `revenuecat/index.ts`. |
| `zsh: command not found: eas` | `npm install -g eas-cli` or use `npx eas-cli`. |
| Android SDK not found | Set `ANDROID_HOME` in `~/.zshrc`. See [Build and Environment Issues](#android-sdk-not-found). |
| Zustand infinite loop | Use `useShallow` to memoize selectors that return objects. |

---

## EventEmitter Crash (Native Module Imports)

### Error

```
[runtime not ready]: TypeError: Cannot read property 'EventEmitter' of undefined
```

### Root Cause

Native modules (`react-native-purchases`, `react-native-fbsdk-next`, `@react-native-firebase/*`) are imported at the top level in files that are part of the Expo Router route tree. Expo Router eagerly loads all route modules to build the navigation tree. When a route module imports a native module at the top level, that module's `NativeEventEmitter` initializes before the React Native runtime is ready.

### Known Sources

| File | Problematic Import |
|------|--------------------|
| `services/revenuecat/index.ts` | `import Purchases from 'react-native-purchases'` |
| `services/firebase/remoteConfig.ts` | `import remoteConfig from '@react-native-firebase/remote-config'` |
| `hooks/useEntitlement.ts` | `import Purchases from 'react-native-purchases'` |
| `app/subscription.tsx` | `import type { ... } from 'react-native-purchases'` (Metro resolves it) |

### Fix

Replace all top-level imports of native modules with lazy `require()` inside function bodies:

```typescript
// BAD -- crashes at startup
import Purchases from 'react-native-purchases';

// GOOD -- lazy require inside a function
function getPurchases() {
  return require('react-native-purchases').default;
}
```

For type imports in route files, use local type definitions instead of `import type` from native modules. Metro may still resolve `import type` in route files.

```typescript
// BAD in route files -- metro resolves the import
import type { PurchasesOffering } from 'react-native-purchases';

// GOOD -- local type definition
interface RCOffering { availablePackages: RCPackage[] }
```

### Prevention

Never add a top-level `import` of a native module in any file that is part of the route tree or is transitively imported by a route file. See [documents/TECHNICAL/9-SYSTEM-INVARIANTS.md](../../documents/TECHNICAL/9-SYSTEM-INVARIANTS.md) for the complete set of rules.

---

## Activity Class Not Found (Android Emulator)

### Error

```
Error: Activity class {com.raine.app/com.raine.app.MainActivity} does not exist.
```

### Root Cause (Two Parts)

**Part 1 -- Conflicting Entry Points:**

The project had two conflicting entry systems: `package.json` set `"main": "expo-router/entry"` (correct), while a root `index.ts` called `registerRootComponent(App)` and a root `App.tsx` existed. This conflict caused the generated `MainActivity` to reference the wrong component.

**Part 2 -- Stale Emulator Data (API 36):**

Even after fixing the entry conflict, API 36 emulators cached corrupted package data. The ART runtime reported `[location is error]` for dex optimization, and the package manager could not resolve the activity despite it being correctly declared in the manifest.

### Fix

```bash
# 1. Ensure no root index.ts or App.tsx exists (Expo Router uses expo-router/entry)

# 2. Rebuild the development client
yarn build:dev:android

# 3. Wipe emulator data and cold boot
pkill -f emulator
~/Library/Android/sdk/emulator/emulator -avd <AVD_NAME> -wipe-data -no-snapshot &

# 4. Wait for boot, then install and launch
yarn install:android
yarn dev
```

### Diagnostic Commands

| Command | Purpose |
|---------|---------|
| `adb shell pm dump <pkg>` | View manifest declarations and install state |
| `adb shell pm art dump <pkg>` | Check ART dex optimization status |
| `adb shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER <pkg>` | Test if the system can resolve the launcher activity |
| `aapt dump badging <apk>` | Inspect APK manifest for launchable activity |

### Prevention

- Use only one entry strategy. For Expo Router: `"main": "expo-router/entry"` in `package.json`. Never keep a root `index.ts` with `registerRootComponent` or a root `App.tsx`.
- Prefer API 35 (Android 15) emulators. API 36 preview has known stability issues.
- After changing entry files or native configuration, always rebuild the native client.

---

## Social Login Crash (Facebook SDK)

### Error

App crashes when tapping a social login button (e.g., "Continue with Instagram").

### Root Cause

The `react-native-fbsdk-next` package is in dependencies but is **not configured** in `app.json` plugins. There is no Facebook App ID. When `isFirebaseMockMode()` returned `false` (because `google-services.json` existed), the social auth code tried to load the real Facebook SDK, which caused a native crash.

### Fix

The `socialAuth.ts` service now uses `shouldUseRealFacebookSdk()`, which returns `false` in dev mode. Social login always uses mock auth in development. The `react-native-fbsdk-next` module is never loaded in dev.

To enable real Facebook login in production:

1. Add the plugin to `app.json`:

```json
{
  "plugins": [
    ["react-native-fbsdk-next", {
      "appID": "YOUR_FACEBOOK_APP_ID",
      "clientToken": "YOUR_CLIENT_TOKEN",
      "displayName": "Raine",
      "scheme": "fbYOUR_FACEBOOK_APP_ID"
    }]
  ]
}
```

2. Rebuild the native binary.

### Prevention

In development, social login should always use mock auth. The Facebook SDK should only be loaded when a valid Facebook App ID is configured and the build is not in dev mode.

---

## Firestore Permission Denied (Mock Mode)

### Error

```
Error: [firestore/permission-denied] The caller does not have permission
to execute the specified operation.
```

### Root Cause

Mock user (`mock-user-123`) has no Firestore security rule permissions. Services like `saveProfileSetup` and `messages.ts` attempted real Firestore operations because `isFirebaseMockMode()` returned `false`.

### Fix

`isFirebaseMockMode()` in `src/config/environment.ts` now returns `true` when `isDev` is `true`. This single change fixed all Firebase service files at once, since they all use this function as their guard:

```typescript
export async function myFirebaseOperation() {
  if (isFirebaseMockMode()) {
    return; // skip real Firestore in dev
  }
  const firestore = require('@react-native-firebase/firestore').default;
  await firestore().collection('x').doc('y').set(data);
}
```

### Prevention

Every Firebase service function must check `isFirebaseMockMode()` before making real Firebase calls. See [documents/TECHNICAL/9-SYSTEM-INVARIANTS.md](../../documents/TECHNICAL/9-SYSTEM-INVARIANTS.md) for enforcement rules.

---

## Sign-Out Crash

### Error

```
Error: [auth/no-current-user] No user currently signed in.
```

### Root Cause

`auth.ts` called `getAuth().signOut()` using real Firebase Auth. Real Firebase Auth had no signed-in user because the app used mock auth for login (mock user `mock-user-123` only exists in the mock auth system).

### Fix

`auth.ts`'s `getAuth()` now returns `mockAuth` when `isDev` is `true`, consistent with the global `isFirebaseMockMode()` behavior. The mock auth `signOut()` clears the mock session without calling real Firebase.

---

## White Flash Before Splash Screen

### Error

A brief white screen is visible before the Raine splash image appears.

### Root Cause (Two Parts)

1. `src/app/index.tsx` redirected to `/(tabs)`, which rendered a frame before the `_layout.tsx` navigation guard redirected to onboarding.
2. `SplashScreen.preventAutoHideAsync()` was called inside a `useEffect`, which runs after the first render.

### Fix

- Changed `index.tsx` to redirect to `/(onboarding)/splash`.
- Moved `SplashScreen.preventAutoHideAsync()` to module level in `_layout.tsx` (outside any component or `useEffect`).

### Prevention

- `SplashScreen.preventAutoHideAsync()` must always be called at module level, before any component renders.
- The index route must redirect to `/(onboarding)/splash`, not `/(tabs)`. The `_layout.tsx` navigation guard handles routing after initialization.

---

## Metro Issues

### Port Conflict

```
Port 8081 is running this app in another window
```

```bash
# Kill existing Metro processes
pkill -f "expo start"
yarn dev

# Or kill by specific port
lsof -ti:8081 | xargs kill -9
```

### Watchman Recrawling

```
Watchman: watch-project has overflowed, resynchronizing...
```

```bash
watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)"
yarn clean
```

### Stale Cache

If Metro serves outdated code or fails to resolve modules:

```bash
# Clear Metro cache
yarn clean

# Nuclear option: clear everything
yarn clean:all
```

### Metro Crashes

```bash
# Clear all caches and reinstall
watchman watch-del-all && rm -rf node_modules && yarn install && yarn dev
```

---

## NativeWind Styling Issues

### Styles Not Applying

All text appears unstyled with no Tailwind classes taking effect.

### Root Cause

NativeWind v4 requires a `metro.config.js` file with the `withNativeWind` wrapper to process Tailwind CSS classes at build time.

### Fix

1. Verify `metro.config.js` exists and contains:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

2. Verify all required configuration files are present:

| File | Purpose |
|------|---------|
| `metro.config.js` | `withNativeWind` wrapper |
| `tailwind.config.js` | Tailwind theme with `nativewind/preset` |
| `babel.config.js` | Includes `nativewind/babel` preset |
| `global.css` | Contains `@tailwind base/components/utilities` directives |
| `nativewind-env.d.ts` | TypeScript type declarations |

3. Ensure `global.css` is imported in the root `_layout.tsx`.

4. Clear caches and restart:

```bash
yarn clean:all
```

---

## TypeScript Errors

Run `yarn type-check` to identify TypeScript issues. Below are the most common patterns encountered in this project.

### MMKV v4 API Changes

```typescript
// Old API (v3) -- no longer valid
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();
storage.delete('key');

// New API (v4)
import { createMMKV, type MMKV } from 'react-native-mmkv';
const storage: MMKV = createMMKV({ id: 'raine-storage' });
storage.remove('key');
```

### RevenueCat Listener Cleanup

```typescript
// Old API -- listener.remove() does not exist
const listener = Purchases.addCustomerInfoUpdateListener(callback);
return () => listener.remove();

// Correct API
const listener = Purchases.addCustomerInfoUpdateListener(callback);
return () => Purchases.removeCustomerInfoUpdateListener(listener);
```

### Firestore Document ID Duplication

```typescript
// Causes duplicate id warning
{ id: doc.id, ...doc.data() }

// Spread first, then override id
{ ...(doc.data() as Omit<Message, 'id'>), id: doc.id }
```

### Firestore `doc.exists` Type Narrowing

```typescript
// Ternary does not narrow types properly
return doc.exists ? { ...doc.data(), id: doc.id } : null;

// Use an if-statement for proper narrowing
if (!doc.exists) {
  return null;
}
return { ...(doc.data() as Omit<Room, 'id'>), id: doc.id };
```

### Zustand Persist Storage Adapter

```typescript
import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '../cache/mmkv';

const mmkvStateStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};

export const zustandStorage = createJSONStorage(() => mmkvStateStorage);
```

### Zustand getSnapshot Infinite Loop

```
ERROR  The result of getSnapshot should be cached to avoid an infinite loop
```

Use `useShallow` to memoize selectors that return new objects each render:

```typescript
import { useShallow } from 'zustand/react/shallow';

const payload = useProfileSetupStore(
  useShallow((state) => ({
    firstName: state.firstName,
    lastInitial: state.lastInitial,
  }))
);
```

---

## Build and Environment Issues

### EAS CLI Not Found

```
zsh: command not found: eas
```

```bash
# Option 1: Install globally with npm
npm install -g eas-cli

# Option 2: Use npx
npx eas-cli build --profile development --platform android

# Option 3: Add yarn global bin to PATH
export PATH="$HOME/.yarn/bin:$PATH"
```

### Android SDK Not Found

```
Failed to resolve the Android SDK path.
Error: spawn adb ENOENT
```

Add to `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then restart the terminal: `source ~/.zshrc`.

### Xcode Requires Newer macOS

Use EAS cloud builds for iOS. No local Xcode installation is required. EAS builds work regardless of your local macOS version.

### Build Fails with Native Module Errors

Ensure Firebase config files are in place:

- `GoogleService-Info.plist` for iOS.
- `google-services.json` for Android.

### Provisioning Profile Errors (iOS)

```bash
eas credentials
```

Select iOS, manage credentials, and regenerate profiles.

### Device Not Registered (iOS)

```bash
eas device:create
```

Follow the prompts to register your iPhone's UDID.

### .expo Files Tracked by Git

```bash
# Ensure .expo/ is in .gitignore, then remove tracked files
git rm --cached .expo/devices.json
```

---

## Useful Diagnostic Commands

```bash
# Start development server
yarn dev

# Type check
yarn type-check

# Clear all caches and restart
yarn clean:all

# Build development client
yarn build:dev:android
yarn build:dev:ios

# Install latest build on device
yarn install:android
yarn install:ios

# Run Expo diagnostics
yarn doctor

# Check Expo compatibility
npx expo-doctor

# Verify native config
npx react-native config

# Check EAS build status
eas build:list
```

---

## Cross-References

- [System Invariants](../../documents/TECHNICAL/9-SYSTEM-INVARIANTS.md) -- Critical rules that prevent the crashes documented in this guide. Read this before contributing new code.
- [Mock Mode Details](../../documents/TECHNICAL/8-MOCK-MODE.md) -- How mock mode works, when it activates, and how to switch to real Firebase.
- [Local Development Setup](./LOCAL-DEV-SETUP.md) -- Prerequisites, first-time build, and emulator configuration.
- [Deployment Guide](./DEPLOYMENT.md) -- Building for preview, production, and submitting to app stores.
- [Dev Build Runtime Fixes (Session Study)](../8-dev-build-runtime-fixes.md) -- Full debugging session notes with investigation details.
- [Original Troubleshooting Guide](../5-troubleshooting-guide.md) -- Historical record of issues encountered during initial development.
