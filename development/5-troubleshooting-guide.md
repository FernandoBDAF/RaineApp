# Troubleshooting Guide - RaineApp

This document details the problems encountered during development and their solutions for future reference.

---

## Table of Contents

1. [React Native Reanimated & Worklets](#1-react-native-reanimated--worklets)
2. [Expo Router Peer Dependencies](#2-expo-router-peer-dependencies)
3. [React Native MMKV v4 Migration](#3-react-native-mmkv-v4-migration)
4. [TypeScript Errors](#4-typescript-errors)
5. [Firebase Native Modules Not Found](#5-firebase-native-modules-not-found)
6. [NativeWind/Tailwind Styles Not Applying](#6-nativewindtailwind-styles-not-applying)
7. [Metro Port Conflicts](#7-metro-port-conflicts)
8. [EAS CLI Not Found](#8-eas-cli-not-found)
9. [Zustand getSnapshot Infinite Loop](#9-zustand-getsnapshot-infinite-loop)
10. [Firebase App Not Initialized (Mock Mode)](#10-firebase-app-not-initialized-mock-mode)
11. [RevenueCat Not Configured](#11-revenuecat-not-configured)
12. [Android SDK Not Found](#12-android-sdk-not-found)
13. [Xcode Requires Newer macOS](#13-xcode-requires-newer-macos)
14. [Expo .expo Files Tracked by Git](#14-expo-expo-files-tracked-by-git)

---

## 1. React Native Reanimated & Worklets

### Problem
```
ERROR: [BABEL]: Cannot find module 'react-native-worklets/plugin'
```

### Cause
- `react-native-reanimated@^4.2.1` was installed, but Expo SDK 54 requires `~4.1.1`
- `react-native-worklets` is a required peer dependency for reanimated v4

### Solution
1. Downgrade reanimated to the Expo-compatible version:
   ```bash
   yarn add react-native-reanimated@~4.1.1
   ```

2. Install the worklets dependency:
   ```bash
   yarn add react-native-worklets@0.5.1
   ```

---

## 2. Expo Router Peer Dependencies

### Problem
```
warning: expo-router@6.0.23 has unmet peer dependency "react-native-safe-area-context@>= 5.4.0"
warning: expo-router@6.0.23 has unmet peer dependency "react-native-screens@*"
```

### Cause
`expo-router` requires specific peer dependencies that weren't installed.

### Solution
```bash
yarn add react-native-safe-area-context react-native-screens@~4.16.0 @expo/metro-runtime
```

---

## 3. React Native MMKV v4 Migration

### Problem
```
ERROR: Unable to resolve "react-native-nitro-modules" from "node_modules/react-native-mmkv/src/getMMKVFactory.ts"
```

### Cause
`react-native-mmkv` v4+ uses a new architecture built on Nitro Modules.

### Solution

1. Install the Nitro Modules dependency:
   ```bash
   yarn add react-native-nitro-modules
   ```

2. Update MMKV initialization code (API changed in v4):

   **Before (v3):**
   ```typescript
   import { MMKV } from 'react-native-mmkv';
   export const storage = new MMKV();
   ```

   **After (v4):**
   ```typescript
   import { createMMKV, type MMKV } from 'react-native-mmkv';
   export const storage: MMKV = createMMKV({ id: 'raine-storage' });
   ```

3. Update method names:
   - `storage.delete(key)` → `storage.remove(key)`

---

## 4. TypeScript Errors

### 4.1 RevenueCat Listener Cleanup

**Problem:** `listener.remove()` doesn't exist on the listener type.

**Solution:**
```typescript
// Before
const listener = Purchases.addCustomerInfoUpdateListener(callback);
return () => listener.remove();

// After
const listener = Purchases.addCustomerInfoUpdateListener(callback);
return () => Purchases.removeCustomerInfoUpdateListener(listener);
```

### 4.2 Firestore Document ID Duplication

**Problem:** TypeScript error when spreading `doc.data()` that already contains `id`.

**Solution:**
```typescript
// Before - causes duplicate id warning
{ id: doc.id, ...doc.data() }

// After - spread first, then override id
{ ...(doc.data() as Omit<Message, 'id'>), id: doc.id }
```

### 4.3 Firestore `doc.exists` Type Inference

**Problem:** Ternary with `doc.exists` doesn't narrow types properly.

**Solution:**
```typescript
// Before
return doc.exists ? { ...doc.data(), id: doc.id } : null;

// After
if (!doc.exists) {
  return null;
}
return { ...(doc.data() as Omit<Room, 'id'>), id: doc.id };
```

### 4.4 Zustand Persist Storage

**Problem:** MMKV storage adapter not compatible with Zustand's `StateStorage` type.

**Solution:**
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

---

## 5. Firebase Native Modules Not Found

### Problem
```
ERROR: Native module RNFBAppModule not found.
ERROR: Failed to get NitroModules: The native "NitroModules" Turbo/Native-Module could not be found.
```

App shows white screen then crashes.

### Cause
- Firebase (`@react-native-firebase/*`) requires native modules
- Native modules don't work in Expo Go - requires a **development build**
- Top-level imports of Firebase modules crash the app if Firebase isn't configured

### Solution

#### Option A: Firebase Mock Mode (for UI development)

1. **Created `src/config/environment.ts`:**
   ```typescript
   export const isDev = __DEV__;
   
   let _firebaseMockMode = false;
   
   export function setFirebaseMockMode(enabled: boolean) {
     _firebaseMockMode = enabled;
   }
   
   export function isFirebaseMockMode() {
     return _firebaseMockMode;
   }
   ```

2. **Lazy-load all Firebase imports:**
   ```typescript
   // Before - crashes if Firebase not configured
   import firestore from '@react-native-firebase/firestore';
   
   // After - lazy load with mock fallback
   const getFirestore = () => {
     if (isFirebaseMockMode()) {
       return getDb(); // mock implementation
     }
     return require('@react-native-firebase/firestore').default();
   };
   ```

3. **Initialize mock mode in `_layout.tsx`:**
   ```typescript
   useEffect(() => {
     const checkFirebase = async () => {
       try {
         const firebase = await import('@react-native-firebase/app');
         if (firebase.default.apps.length === 0) {
           setFirebaseMockMode(true);
         }
       } catch {
         setFirebaseMockMode(true);
       }
       setFirebaseReady(true);
     };
     checkFirebase();
   }, []);
   ```

#### Option B: Create Development Build (for full Firebase)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Build development client:
   ```bash
   yarn build:dev:android
   # or
   yarn build:dev:ios
   ```

3. Install on device/emulator:
   ```bash
   yarn install:android
   ```

4. Add Firebase config files:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

---

## 6. NativeWind/Tailwind Styles Not Applying

### Problem
UI renders with no styling - all text appears as plain unstyled text.

### Cause
NativeWind v4 requires a `metro.config.js` file with the `withNativeWind` wrapper to process Tailwind CSS classes.

### Solution

Create `metro.config.js` in project root:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

Then restart Metro with cache cleared:
```bash
yarn start --clear
```

### Required Files Checklist

1. **`metro.config.js`** - withNativeWind wrapper
2. **`tailwind.config.js`** - with nativewind/preset
3. **`babel.config.js`** - with nativewind/babel preset
4. **`global.css`** - with @tailwind directives
5. **`nativewind-env.d.ts`** - TypeScript types
6. **Import `global.css`** in root `_layout.tsx`

---

## 7. Metro Port Conflicts

### Problem
```
ERROR: Port 8081 is running this app in another window
```

### Solution
Kill existing Metro processes:

```bash
# Kill specific port
lsof -ti:8081 | xargs kill -9

# Kill all Expo processes
pkill -f "expo start"

# Or use the clean script
yarn clean:all
```

---

## 8. EAS CLI Not Found

### Problem
```
zsh: command not found: eas
```

### Cause
Yarn global packages aren't in the shell PATH.

### Solution

**Option 1:** Use npx
```bash
npx eas-cli build --profile development --platform android
```

**Option 2:** Add yarn global bin to PATH
```bash
export PATH="$HOME/.yarn/bin:$PATH"
```

**Option 3:** Use full path
```bash
~/.yarn/bin/eas build --profile development --platform android
```

---

## 9. Zustand getSnapshot Infinite Loop

### Problem
```
ERROR  The result of getSnapshot should be cached to avoid an infinite loop
ERROR  Maximum update depth exceeded
```

### Cause
Zustand selector returned a **new object each render**, which invalidated subscriptions and retriggered effects.

### Solution
Use `useShallow` to memoize the selector:
```typescript
import { useShallow } from 'zustand/react/shallow';

const payload = useProfileSetupStore(
  useShallow((state) => ({
    firstName: state.firstName,
    lastInitial: state.lastInitial,
    // ...
  }))
);
```

---

## 10. Firebase App Not Initialized (Mock Mode)

### Problem
```
Error: No Firebase App '[DEFAULT]' has been created - call firebase.initializeApp()
```

### Cause
Firebase config files were missing and code tried to call Firestore/Functions anyway.

### Solution
Guard Firebase calls when mock mode is enabled:
```typescript
import { isFirebaseMockMode } from '../config/environment';

export async function saveProfileSetup(...) {
  if (isFirebaseMockMode()) {
    return;
  }
  return firestore().collection('users').doc(uid).update(...);
}
```

---

## 11. RevenueCat Not Configured

### Problem
```
Error: There is no singleton instance. Make sure you configure Purchases...
```

### Cause
`Purchases.getOfferings()` and friends were called before `Purchases.configure`.

### Solution
Add a configuration guard:
```typescript
let revenueCatConfigured = false;

export async function configureRevenueCat(...) {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';
  if (!apiKey) return;
  Purchases.configure({ apiKey, appUserID: userId });
  revenueCatConfigured = true;
}

export async function getOfferings() {
  if (!revenueCatConfigured) {
    return { current: null, all: {} };
  }
  return Purchases.getOfferings();
}
```

---

## 12. Android SDK Not Found

### Problem
```
Failed to resolve the Android SDK path. Default install location not found.
Error: spawn adb ENOENT
```

### Cause
Android Studio / SDK not installed or `ANDROID_HOME` not set.

### Solution
1. Install Android Studio and SDK.
2. Add to `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
3. Restart terminal:
```bash
source ~/.zshrc
```

---

## 13. Xcode Requires Newer macOS

### Problem
Xcode requires macOS 15.6+ but the machine is on macOS 14.

### Solutions
- Use **EAS cloud build** with a physical iPhone (no Xcode required).
- Use **Android emulator** instead of iOS.
- Upgrade macOS if possible.

---

## 14. Expo .expo Files Tracked by Git

### Problem
`.expo/devices.json` and other `.expo` files tracked by git.

### Solution
1. Ensure `.expo/` is ignored in `.gitignore`.
2. Remove tracked files:
```bash
git rm --cached .expo/devices.json
```

---

## Quick Reference: Common Commands

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

# Run diagnostics
yarn doctor
```

---

## Files Modified During Troubleshooting

| File | Changes |
|------|---------|
| `package.json` | Added dependencies, scripts |
| `metro.config.js` | Created for NativeWind |
| `app.json` | Added native module plugins |
| `eas.json` | Added build profiles |
| `src/cache/mmkv.ts` | Updated to MMKV v4 API |
| `src/store/persist.ts` | Fixed Zustand storage adapter |
| `src/hooks/useEntitlement.ts` | Fixed RevenueCat listener cleanup |
| `src/config/environment.ts` | Created for mock mode |
| `src/services/firebase/*.ts` | Added lazy loading + mocks |
| `src/app/_layout.tsx` | Added Firebase init check |
