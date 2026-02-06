# Android Startup Crash Study: MainActivity Not Found

## Summary

The Android development build crashed on launch with:

```
Error: Activity class {com.raine.app/com.raine.app.MainActivity} does not exist.
```

Two issues contributed to this error:

1. **Conflicting entry points** -- legacy `index.ts` / `App.tsx` files conflicted with Expo Router's `expo-router/entry`.
2. **Stale emulator state** -- even after rebuilding the APK without the conflicting files, the Android API 36 emulator cached corrupted package data that prevented the activity from being resolved.

## Symptoms

- EAS build completed successfully.
- APK installed on the emulator without errors.
- App crashed immediately when launched via `am start`, `eas build:run`, or `monkey`.
- `pm dump` showed the activity registered in the manifest.
- `dexdump` confirmed `com.raine.app.MainActivity` existed in `classes5.dex`.
- `pm art dump` showed `[location is error]` for dex optimization.
- `cmd package resolve-activity` returned "No activity found" despite the manifest being correct.

## Root Cause

### Issue 1: Conflicting Entry Points

The project had two conflicting entry systems:

- `package.json` set `"main": "expo-router/entry"` (correct for Expo Router).
- Root `index.ts` called `registerRootComponent(App)` (legacy Expo entry).
- Root `App.tsx` existed but was unused by Expo Router.

### Issue 2: Stale Emulator Data (API 36)

After rebuilding the APK without the conflicting files, the error persisted. Deep investigation revealed:

- The ART runtime reported `[location is error]` for the app's dex optimization.
- The package manager could not resolve the activity even though it was correctly declared in the manifest and the class existed in the dex files.
- This was an **emulator-specific issue** caused by corrupted cached package data on the API 36 emulator.

This is a known class of issues on newer Android API emulators (reported in react-native issue #36926 and related threads).

## Fix Applied

### Step 1: Remove conflicting entry files

- Deleted `RaineApp/index.ts`
- Deleted `RaineApp/App.tsx`

### Step 2: Rebuild the development client

```
yarn build:dev:android
```

### Step 3: Wipe emulator data and cold boot

```bash
# Kill any running emulator
pkill -f emulator

# Cold boot with wiped data
~/Library/Android/sdk/emulator/emulator -avd <AVD_NAME> -wipe-data -no-snapshot
```

### Step 4: Install and launch

```bash
adb install <path-to-apk>
adb shell am start -n com.raine.app/.MainActivity
```

After wiping the emulator data, the app launched successfully.

## Investigation Tools Used

These commands were valuable for diagnosing the issue:

| Command | Purpose |
|---------|---------|
| `adb shell pm dump <pkg>` | View manifest declarations, flags, install state |
| `adb shell pm art dump <pkg>` | Check ART dex optimization status |
| `adb shell cmd package resolve-activity` | Test if the system can resolve the launcher activity |
| `adb shell monkey -p <pkg> -c LAUNCHER 1` | Test launcher resolution |
| `aapt dump badging <apk>` | Inspect APK manifest for launchable activity |
| `dexdump -f <dex>` | Verify class exists in dex files |
| `adb shell pm unstop <pkg>` | Clear "stopped" state on the package |

## Why Rebuild Is Required

Expo Router entry resolution is baked into the native binary. If the wrong entry file exists at build time, the generated native code points to the wrong component. Restarting Metro is not enough; a new native build is required after removing the conflicting entry files.

## Prevention Checklist

- Use only one entry strategy:
  - For Expo Router: `package.json` must use `"main": "expo-router/entry"`.
  - Do not keep root `index.ts` with `registerRootComponent`.
  - Do not keep root `App.tsx` from the legacy template.
- After changing entry files, always rebuild the native client.
- When debugging "Activity class does not exist" errors:
  1. First verify the class exists in the APK (`dexdump`, `aapt dump badging`).
  2. Check ART status (`pm art dump`).
  3. If the class exists but can't be resolved, **wipe emulator data and cold boot**.
- Prefer API 35 (Android 15) emulators for day-to-day development. API 36 preview emulators can have stability issues.

## Reference

- Plan: `fix_android_startup_crash_a690d384.plan.md`
- React Native issue: https://github.com/facebook/react-native/issues/36926
- Expo docs on emulator setup: https://docs.expo.dev/workflow/android-studio-emulator
