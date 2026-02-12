# iOS Build Configuration Fixes — Session Study

## Overview

This document captures the full debugging session that took the RaineApp from a
failing iOS build to a successful local simulator build using EAS + React Native
Firebase. It covers every issue found, the root cause, the fix, and the
**key learnings** that must be carried forward for future iOS builds and new
native module integrations.

**Branch:** `fix_ios_configurations`
**Date:** February 2026

---

## Table of Contents

1. [Context & Goal](#1-context--goal)
2. [Issue 1: Firebase Plugins Misconfigured in app.json](#2-issue-1-firebase-plugins-misconfigured-in-appjson)
3. [Issue 2: CocoaPods Static Frameworks Not Enabled](#3-issue-2-cocoapods-static-frameworks-not-enabled)
4. [Issue 3: Podfile Incompatibilities (Modular Headers, Warnings, Linkage)](#4-issue-3-podfile-incompatibilities-modular-headers-warnings-linkage)
5. [Issue 4: New Architecture Not Enabled in EAS Builds](#5-issue-4-new-architecture-not-enabled-in-eas-builds)
6. [Issue 5: Development Profile Not Targeting Simulator](#6-issue-5-development-profile-not-targeting-simulator)
7. [Issue 6: Dependency Version Mismatches](#7-issue-6-dependency-version-mismatches)
8. [Key Learnings & Invariants](#8-key-learnings--invariants)
9. [Files Changed](#9-files-changed)
10. [How to Build for iOS Locally](#10-how-to-build-for-ios-locally)

---

## 1. Context & Goal

The project already had a working Android development build (see
[8-dev-build-runtime-fixes.md](./8-dev-build-runtime-fixes.md)). The goal was
to get **iOS builds running locally on the simulator** using EAS Build with
the full React Native Firebase stack.

The starting state had several configuration issues specific to how CocoaPods,
Expo, and React Native Firebase interact on iOS. These issues do not surface
on Android because Android uses Gradle, not CocoaPods.

---

## 2. Issue 1: Firebase Plugins Misconfigured in app.json

### Problem

The `app.json` listed `@react-native-firebase/app` and
`@react-native-firebase/crashlytics` as Expo plugins:

```json
"plugins": [
  ["expo-router", { "root": "src/app" }],
  "expo-dev-client",
  "@react-native-firebase/app",
  "@react-native-firebase/crashlytics"
]
```

### Root Cause

`@react-native-firebase/app` and `@react-native-firebase/crashlytics` are
**not Expo config plugins**. Listing them in `plugins` does not configure
anything meaningful for iOS. The actual iOS setup requires:

1. The `GoogleService-Info.plist` file (already present via `ios.googleServicesFile`).
2. CocoaPods configured with **static frameworks** (Firebase's requirement).
3. Podfile tweaks for compatibility with Expo's managed prebuild.

### Fix

Replaced the Firebase plugin entries with the correct configuration:

```json
"plugins": [
  ["expo-router", { "root": "src/app" }],
  "expo-dev-client",
  ["expo-build-properties", { "ios": { "useFrameworks": "static" } }],
  "./plugins/ios-fix-rnfirebase.js"
]
```

### Learning

> **React Native Firebase does NOT provide Expo config plugins.** Do not list
> `@react-native-firebase/*` packages in `app.json` plugins. Instead, use
> `expo-build-properties` to set `useFrameworks: "static"` and a custom plugin
> to patch the Podfile.

---

## 3. Issue 2: CocoaPods Static Frameworks Not Enabled

### Problem

iOS build failed with linking errors related to Firebase pods. Firebase iOS
SDKs require **static linking** to work properly.

### Root Cause

By default, Expo generates a Podfile that uses dynamic frameworks. Firebase's
iOS SDKs are distributed as static libraries and must be linked statically.
Without explicit configuration, CocoaPods tries dynamic linking, which fails.

### Fix

Added `expo-build-properties` plugin to `app.json`:

```json
["expo-build-properties", { "ios": { "useFrameworks": "static" } }]
```

This tells Expo's prebuild to generate a Podfile with `use_frameworks! :linkage => :static`.

### Learning

> **Any project using `@react-native-firebase` on iOS MUST set
> `useFrameworks: "static"` via `expo-build-properties`.** This is the single
> most important iOS configuration for Firebase compatibility with Expo.

---

## 4. Issue 3: Podfile Incompatibilities (Modular Headers, Warnings, Linkage)

### Problem

Even with static frameworks enabled, the iOS build failed due to:

1. `use_modular_headers!` conflicting with Firebase pods.
2. `-Werror` flags turning Firebase/Flipper warnings into build errors.
3. Framework linkage not being set to `:static` in all cases.

### Root Cause

Expo's prebuild generates a Podfile that may include `use_modular_headers!`
and does not suppress warnings. These are incompatible with Firebase's iOS pods,
which produce compiler warnings and don't support modular headers.

### Fix

Created a custom Expo config plugin at `plugins/ios-fix-rnfirebase.js` that
uses `withDangerousMod` to patch the Podfile after prebuild:

```javascript
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withRNFirebaseFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const podfilePath = path.join(iosRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('Podfile not found. Skipping RNFirebase fix.');
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      let updated = false;

      // 1. Remove use_modular_headers! (Firebase breaks with it)
      if (podfile.includes('use_modular_headers!')) {
        podfile = podfile.replace(/use_modular_headers!\n?/g, '');
        updated = true;
      }

      // 2. Add inhibit_all_warnings! (prevents -Werror on Firebase/Flipper)
      if (!podfile.includes('inhibit_all_warnings!')) {
        if (podfile.match(/use_frameworks!.*\n/)) {
          podfile = podfile.replace(
            /(use_frameworks!.*\n)/,
            `$1inhibit_all_warnings!\n`
          );
        } else {
          podfile = `inhibit_all_warnings!\n\n${podfile}`;
        }
        updated = true;
      }

      // 3. Ensure static linkage (required for RNFirebase + Expo)
      if (podfile.includes('use_frameworks!') && !podfile.includes(':static')) {
        podfile = podfile.replace(
          /use_frameworks!.*\n/,
          'use_frameworks! :linkage => :static\n'
        );
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(podfilePath, podfile);
        console.log('Podfile updated with RNFirebase fixes');
      }

      return config;
    },
  ]);
};
```

### What Each Fix Does

| # | Podfile Change | Why |
|---|---------------|-----|
| 1 | Remove `use_modular_headers!` | Firebase C++ pods don't support modular headers; causes compilation errors |
| 2 | Add `inhibit_all_warnings!` | Firebase and Flipper pods emit warnings that fail the build when `-Werror` is active |
| 3 | Ensure `:linkage => :static` | Firebase iOS SDKs require static linking; dynamic linking causes unresolved symbols |

### Learning

> **When Expo's prebuild generates a Podfile that breaks a native dependency,
> use `withDangerousMod` to create a custom config plugin that patches the
> Podfile.** This is the officially supported escape hatch for CocoaPods
> customization in Expo managed workflow.
>
> **This plugin must run AFTER `expo-build-properties`** in the plugins array,
> so it can patch the Podfile that `expo-build-properties` already modified.

---

## 5. Issue 4: New Architecture Not Enabled in EAS Builds

### Problem

The app has `"newArchEnabled": true` in `app.json`, but the EAS build profiles
did not pass the `RCT_NEW_ARCH_ENABLED` environment variable. This can cause
mismatches between what the JavaScript bundle expects and what the native binary
provides.

### Root Cause

`app.json`'s `newArchEnabled` tells Expo to generate New Architecture code
during prebuild, but the actual C++ compilation of the New Architecture (Fabric,
TurboModules) is controlled by the `RCT_NEW_ARCH_ENABLED` environment variable
at build time. Without it, the native binary may be built with the old
architecture while the JS expects the new one.

### Fix

Added `RCT_NEW_ARCH_ENABLED` to all EAS build profiles in `eas.json`:

```json
{
  "development": {
    "env": {
      "RCT_NEW_ARCH_ENABLED": "1"
    }
  },
  "development-simulator": {
    "env": {
      "RCT_NEW_ARCH_ENABLED": "1"
    }
  },
  "preview": {
    "env": {
      "RCT_NEW_ARCH_ENABLED": "1"
    }
  },
  "production": {
    "env": {
      "RCT_NEW_ARCH_ENABLED": "1"
    }
  }
}
```

### Learning

> **If `newArchEnabled: true` is set in `app.json`, you MUST also set
> `RCT_NEW_ARCH_ENABLED: "1"` in ALL `eas.json` build profiles.** These are
> two separate configuration points — one for prebuild codegen, one for native
> compilation. They must be in sync.

---

## 6. Issue 5: Development Profile Not Targeting Simulator

### Problem

Running `eas build --profile development --platform ios` produced a build
for physical devices, not the simulator. The build couldn't be installed on the
local iOS simulator.

### Root Cause

The `development` profile in `eas.json` had `"simulator": false` for iOS.
Simulator builds require a different architecture (x86_64/arm64-simulator vs
arm64-device).

### Fix

Changed the `development` profile to target the simulator:

```json
"development": {
  "ios": {
    "simulator": true
  }
}
```

### Learning

> **For local development on the iOS simulator, the EAS build profile MUST have
> `ios.simulator: true`.** Device builds use a different architecture and cannot
> be installed on the simulator. Keep a separate `development-device` profile
> if you also need physical device builds.

---

## 7. Issue 6: Dependency Version Mismatches

### Problem

Build warnings and potential runtime issues from dependency version mismatches.

### Root Cause & Fix

| Dependency | Before | After | Why |
|-----------|--------|-------|-----|
| `expo-dev-client` | `^6.0.20` (caret) | `~6.0.20` (tilde) | Caret allows minor version bumps that may be incompatible with the current Expo SDK. Tilde restricts to patch versions only. |
| `react-native-svg` | not installed | `15.12.1` | Required by `lucide-react-native` (icon library). Missing dependency caused build failures on iOS where SVG native module was expected. |

### Learning

> **Always use tilde (`~`) version ranges for Expo ecosystem packages**
> (`expo-*`, `react-native-*` that Expo pins). Expo SDK releases are tightly
> coupled — a minor version bump in one package can break compatibility.
>
> **Run `npx expo-doctor` after adding new dependencies** to catch version
> mismatches early. It validates all Expo-related package versions against the
> current SDK.

---

## 8. Key Learnings & Invariants

These are the **rules** that must be followed for iOS builds to work with
React Native Firebase in the Expo managed workflow.

### 8.1 Firebase iOS = Static Frameworks (Always)

```json
// app.json plugins — REQUIRED
["expo-build-properties", { "ios": { "useFrameworks": "static" } }]
```

Without this, Firebase pods will fail to link. This is Firebase's #1
requirement on iOS.

### 8.2 Podfile Needs Patching for Firebase

The auto-generated Podfile from Expo prebuild is not Firebase-compatible
out of the box. Use a custom config plugin (`withDangerousMod`) to:

- Remove `use_modular_headers!`
- Add `inhibit_all_warnings!`
- Ensure `use_frameworks! :linkage => :static`

### 8.3 Plugin Order Matters

In `app.json`, plugins execute in order. The Podfile-patching plugin must
come AFTER `expo-build-properties`:

```json
"plugins": [
  ["expo-router", { "root": "src/app" }],
  "expo-dev-client",
  ["expo-build-properties", { "ios": { "useFrameworks": "static" } }],
  "./plugins/ios-fix-rnfirebase.js"  // MUST be after expo-build-properties
]
```

### 8.4 New Architecture Must Be Consistent

If `app.json` has `"newArchEnabled": true`, then ALL `eas.json` build profiles
must include:

```json
"env": { "RCT_NEW_ARCH_ENABLED": "1" }
```

### 8.5 Tilde Over Caret for Expo Packages

Use `~` (tilde) instead of `^` (caret) for all Expo ecosystem dependencies.
Expo SDK versions are tightly coupled; allowing minor bumps can break builds.

### 8.6 EAS Project Ownership

The `eas.projectId` and `owner` in `app.json` must match the EAS account
running the build. When transferring a project between accounts:

1. Update `expo.extra.eas.projectId` to the new project ID.
2. Update `expo.owner` to the new account username.
3. Run `eas project:init` if needed.

---

## 9. Files Changed

### Configuration Files

| File | Change |
|------|--------|
| `app.json` | Replaced Firebase pseudo-plugins with `expo-build-properties` + custom plugin; updated EAS project ID and owner |
| `eas.json` | Added `RCT_NEW_ARCH_ENABLED` env to all profiles; set `development` iOS to simulator mode |
| `package.json` | Changed `expo-dev-client` to tilde range; added `react-native-svg` |

### New Files

| File | Purpose |
|------|---------|
| `plugins/ios-fix-rnfirebase.js` | Custom Expo config plugin that patches the iOS Podfile for Firebase compatibility |

### Updated Lock File

| File | Change |
|------|--------|
| `yarn.lock` | Updated dependency tree to reflect new/changed packages |

---

## 10. How to Build for iOS Locally

```bash
# 1. Install dependencies
yarn install

# 2. Build the iOS development client for simulator
yarn build:dev:ios
# This runs: eas build --profile development --platform ios

# 3. Once the build completes, install on simulator
yarn install:ios
# This runs: eas build:run --platform ios --latest

# 4. Start the dev server
yarn dev
# This runs: expo start --dev-client
```

### Prerequisites

- **EAS CLI:** `npm install -g eas-cli`
- **EAS Account:** Logged in with `eas login`
- **Xcode:** Installed (for simulator runtime)
- **GoogleService-Info.plist:** Present at project root (referenced by `app.json`)

### Troubleshooting iOS Builds

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Firebase linking errors | Static frameworks not enabled | Ensure `expo-build-properties` with `useFrameworks: "static"` is in plugins |
| Compilation warnings → errors | `-Werror` on Firebase pods | Ensure `inhibit_all_warnings!` is in Podfile via custom plugin |
| Modular headers errors | `use_modular_headers!` present | Ensure custom plugin removes it |
| Build arch mismatch on simulator | `ios.simulator` set to `false` | Set to `true` in the EAS build profile |
| New Arch mismatch crashes | `RCT_NEW_ARCH_ENABLED` missing | Add env var to all `eas.json` profiles |
| `expo-doctor` version warnings | Caret ranges on Expo packages | Switch to tilde (`~`) ranges |

---

## Related Documents

- [8-dev-build-runtime-fixes.md](./8-dev-build-runtime-fixes.md) — Android build & runtime fixes
- [7-android-startup-crash-study.md](./7-android-startup-crash-study.md) — Android MainActivity crash
- [5-troubleshooting-guide.md](./5-troubleshooting-guide.md) — General troubleshooting reference
- [4-local-development-infrastructure.md](./4-local-development-infrastructure.md) — Local dev setup
- [4-deployment-plan.md](./4-deployment-plan.md) — Full deployment guide
