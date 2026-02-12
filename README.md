# Raine App

A React Native mobile application built with Expo, featuring social authentication, real-time messaging, and subscription management.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.81.5 |
| Platform | Expo SDK | 54 |
| Navigation | Expo Router | 6 (file-based routing) |
| Styling | NativeWind (Tailwind CSS) | 4 |
| State | Zustand + MMKV persistence | 5 / 4 |
| Backend | Firebase (Auth, Firestore, Messaging, Remote Config, Storage, Functions) | 23.x |
| Subscriptions | RevenueCat | 9 |
| Language | TypeScript | 5.9 |
| Architecture | React Native New Architecture | enabled |

---

## How Expo Works in This Project

### Expo Go vs. Development Builds

This project **cannot run in Expo Go**. It uses native modules (Firebase, MMKV, RevenueCat, Facebook SDK) that require compiled native code. Instead, it uses **EAS Development Builds** — custom native binaries that include all native modules and connect to Metro for JS hot-reload.

| Concept | What it means |
|---------|--------------|
| **Expo Go** | Pre-built app from the App Store. Only supports Expo SDK modules. **Not compatible with this project.** |
| **Development Build** | Custom APK/IPA built via EAS that includes all native dependencies. Connects to Metro like Expo Go but supports any native module. |
| **EAS Build** | Cloud build service that compiles the native binary. Runs `expo prebuild` → Gradle/Xcode → outputs APK or IPA. |
| **Metro** | JS bundler that serves your TypeScript/JSX code. Runs locally via `yarn dev`. The development build connects to it over the network. |

### Key Configuration Files

| File | Purpose |
|------|---------|
| `app.json` | Expo project config: app name, slug, plugins, native settings (bundle ID, package name, Firebase config paths) |
| `eas.json` | EAS Build profiles: development, preview, production — each with platform-specific settings |
| `package.json` | Dependencies and scripts. `"main": "expo-router/entry"` is the app entry point (must not be changed) |
| `babel.config.js` | Babel presets (`babel-preset-expo`, `nativewind/babel`) and plugins (`react-native-reanimated/plugin`) |
| `metro.config.js` | Metro bundler config with NativeWind integration |
| `tailwind.config.js` | Tailwind CSS theme and content paths |
| `global.css` | Tailwind directives (`@tailwind base/components/utilities`) |
| `google-services.json` | Firebase config for Android (downloaded from Firebase Console) |
| `GoogleService-Info.plist` | Firebase config for iOS (downloaded from Firebase Console) |

### Expo Router (File-Based Routing)

Routes live in `src/app/`. The directory structure IS the navigation structure:

```
src/app/
├── _layout.tsx              ← Root layout (auth guards, splash screen, providers)
├── index.tsx                ← Entry redirect → /(onboarding)/splash
├── (onboarding)/            ← Onboarding group (splash, referral code)
├── (auth)/                  ← Auth group (login, terms)
├── (profile-setup)/         ← Profile setup group (14-step flow)
├── (tabs)/                  ← Main tab navigator (Home, Introductions, Communities, Drops)
├── room/[id].tsx            ← Chat room (dynamic route)
├── drop/[id].tsx            ← Drop detail
├── introduction/[userId].tsx ← Introduction profile (modal)
├── community/[id].tsx       ← Community detail
├── profile.tsx              ← User profile
└── subscription.tsx         ← Subscription screen
```

**Important:** Expo Router eagerly loads all route modules to build the navigation tree. This means any top-level `import` in a route file runs immediately at startup. See [Critical Rules](#critical-rules-for-contributors) below.

### EAS Build Profiles (`eas.json`)

| Profile | Use Case | Output | Distribution |
|---------|----------|--------|-------------|
| `development` | Daily development | APK (Android) / IPA (iOS device) | Internal |
| `development-simulator` | iOS Simulator | Simulator build | Internal |
| `preview` | QA / stakeholder testing | APK / IPA | Internal |
| `production` | App Store / Play Store | AAB (Android) / IPA (iOS) | Store |

### Native Plugins (`app.json` → `plugins`)

These Expo config plugins modify the native project during `expo prebuild`:

| Plugin | Purpose |
|--------|---------|
| `expo-router` | File-based routing with `root: "src/app"` |
| `expo-dev-client` | Development client launcher UI |
| `@react-native-firebase/app` | Firebase native initialization |
| `@react-native-firebase/crashlytics` | Crash reporting |

> **Note:** `react-native-fbsdk-next` is in dependencies but NOT in `plugins`. The Facebook App ID is not configured. In development, social login uses mock auth. To enable real Facebook login in production, add the plugin with your App ID.

---

## Prerequisites

- **Node.js** 18+
- **Yarn** 1.22+ (`corepack enable && corepack prepare yarn@1.22.22 --activate`)
- **EAS CLI** (`npm install -g eas-cli && eas login`)
- **For Android:** Android Studio with an emulator (API 35 recommended; API 36 has known issues)
- **For iOS:** macOS with Xcode 15+ (for device builds) or just EAS cloud builds
- **Watchman** (recommended): `brew install watchman`

---

## Step-by-Step Scenarios

### Scenario 1: First-Time Setup (From Scratch)

```bash
# 1. Clone and install
cd RaineApp
yarn install

# 2. Login to EAS (one-time)
eas login

# 3. Build the development client
yarn build:dev:android          # ~10-15 min (cloud build)
# OR for iOS device:
yarn build:dev:ios
# OR for iOS Simulator:
yarn build:dev:ios:simulator

# 4. Install on device/emulator
yarn install:android            # downloads and installs the latest build
# OR
yarn install:ios

# 5. Start the dev server
yarn dev

# The app connects to Metro automatically. Full UI flow works with mock data.
```

### Scenario 2: Daily Development (Build Already Exists)

```bash
# Just start Metro — the installed dev client reconnects automatically
yarn dev

# If the app isn't connecting, press 'a' (Android) or 'i' (iOS) in the terminal
```

### Scenario 3: After Adding/Updating a Native Dependency

Any change to a package that includes native code (e.g., adding a new `@react-native-firebase/*` module, updating `react-native-mmkv`, etc.) requires a new native build:

```bash
# 1. Install the dependency
yarn add <package-name>

# 2. Rebuild
yarn build:dev:android
# AND/OR
yarn build:dev:ios

# 3. Reinstall on device
yarn install:android

# 4. Restart Metro
yarn dev
```

> **How to know if a rebuild is needed:** If you see `Native module X not found` errors at runtime, you need a rebuild. Pure JS/TS changes never need a rebuild.

### Scenario 4: After Pulling New Code

```bash
# 1. Install any new dependencies
yarn install

# 2. Check if native deps changed (compare yarn.lock diff for native packages)
# If yes: rebuild with yarn build:dev:android / yarn build:dev:ios + reinstall
# If no: just start Metro

# 3. Clear caches (recommended after big changes)
yarn clean

# 4. If Metro has stale state
watchman watch-del '/path/to/RaineApp' ; watchman watch-project '/path/to/RaineApp'
yarn clean
```

### Scenario 5: Metro / Cache Issues

```bash
# Clear Metro cache and restart
yarn clean

# Nuclear option: clear everything
yarn clean:all

# If watchman is recrawling repeatedly
watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)"
yarn clean

# Kill orphan Metro processes
pkill -f "expo start"
yarn dev
```

### Scenario 6: Android Emulator Issues

```bash
# "Activity class does not exist" error (common on API 36)
pkill -f emulator
~/Library/Android/sdk/emulator/emulator -avd <AVD_NAME> -wipe-data -no-snapshot &
# Wait for boot, then:
yarn install:android
yarn dev

# List available emulators
~/Library/Android/sdk/emulator/emulator -list-avds

# Check if emulator is fully booted
~/Library/Android/sdk/platform-tools/adb shell getprop sys.boot_completed
# Returns "1" when ready
```

### Scenario 7: iOS Builds

```bash
# For physical iPhone (requires Apple Developer account)
yarn build:dev:ios
yarn install:ios

# For iOS Simulator (no Apple account needed)
yarn build:dev:ios:simulator
yarn install:ios

# If macOS/Xcode version is too old for local builds, EAS cloud builds work
# regardless of your local Xcode version
```

### Scenario 8: Preview Build for QA

```bash
# Android APK for testers
yarn build:preview:android
# Share the EAS download link with testers

# iOS IPA for testers (requires Apple Developer account + ad-hoc provisioning)
yarn build:preview:ios
```

### Scenario 9: Production Release

```bash
# Android (AAB for Play Store)
yarn build:prod:android

# iOS (IPA for App Store)
yarn build:prod:ios

# Submit to stores
eas submit --platform android --latest
eas submit --platform ios --latest
```

### Scenario 10: Type Check and Lint Before Committing

```bash
# TypeScript
yarn type-check

# ESLint
yarn lint

# Run both
yarn type-check && yarn lint
```

---

## Development Modes

### Mock Mode (Default in Development)

In development (`__DEV__ === true`), **all Firebase services are automatically mocked**:

| Service | Mock Behavior |
|---------|--------------|
| Authentication | Mock user (`mock-user-123`) via `loginAsMockUser()` |
| Firestore | Returns empty collections, skips writes |
| Storage | Returns the original URI (no upload) |
| Messaging | Returns mock token, no-op listeners |
| Remote Config | Returns default feature flags |
| RevenueCat | Not configured — returns mock entitlements |

**Why:** The development build includes Firebase native modules, but the Facebook SDK is not configured (no App ID). Mock mode ensures the full UI flow works without real backend credentials.

**The full mock flow works:** Splash → Referral code → Login → 14-step profile setup → Home → Rooms → Profile → Sign out.

### Production Mode

In production builds (`__DEV__ === false`), real Firebase services are used. Requirements:

- `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) from Firebase Console
- `react-native-fbsdk-next` plugin in `app.json` with Facebook App ID
- `EXPO_PUBLIC_REVENUECAT_API_KEY` environment variable
- Firestore security rules configured for your users

---

## Project Structure

```
RaineApp/
├── src/
│   ├── app/                      # Expo Router pages (file-based routing)
│   │   ├── (auth)/               # Login, terms
│   │   ├── (onboarding)/         # Splash, referral code
│   │   ├── (profile-setup)/      # 14-step profile flow
│   │   ├── (tabs)/               # Main tab navigator
│   │   ├── room/                 # Chat rooms
│   │   ├── _layout.tsx           # Root layout (guards, providers, splash)
│   │   └── index.tsx             # Entry redirect
│   ├── cache/                    # MMKV local storage
│   ├── components/               # Reusable UI components
│   │   ├── profile-setup/        # Profile setup components
│   │   └── ui/                   # Base UI (Button, Input, etc.)
│   ├── config/
│   │   └── environment.ts        # Dev/prod detection, mock mode flag
│   ├── constants/                # Static values, profile options
│   ├── features/
│   │   └── auth/                 # AuthContext provider
│   ├── hooks/                    # Custom React hooks
│   ├── services/
│   │   ├── firebase/             # Firebase wrappers (all with mock guards)
│   │   │   ├── mock/             # Mock implementations
│   │   │   ├── auth.ts           # Auth (sign in, sign out, listener)
│   │   │   ├── firestore.ts      # Firestore instance (mock or real)
│   │   │   ├── messages.ts       # Chat messages
│   │   │   ├── notifications.ts  # Push notifications
│   │   │   ├── remoteConfig.ts   # Feature flags
│   │   │   ├── rooms.ts          # Chat rooms
│   │   │   ├── socialAuth.ts     # Social login (Instagram, Facebook, LinkedIn)
│   │   │   └── users.ts          # User profiles
│   │   ├── bio/                  # AI bio generation
│   │   ├── profile/              # Profile save, photo upload, waitlist
│   │   ├── revenuecat/           # Subscription management
│   │   └── referral/             # Referral code validation
│   ├── store/                    # Zustand stores (app, profile-setup)
│   └── types/                    # TypeScript type definitions
├── assets/                       # Images, icons, splash screen
├── development/                  # Working docs (gitignored, local only)
├── documents/                    # Implementation plans
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── babel.config.js               # Babel (expo + nativewind + reanimated)
├── metro.config.js               # Metro bundler (NativeWind)
├── tailwind.config.js            # Tailwind theme
├── global.css                    # Tailwind directives
└── google-services.json          # Firebase Android config
```

---

## Critical Rules for Contributors

These invariants prevent crashes and must be followed in all new code:

### 1. Never import native modules at the top level

```typescript
// BAD — crashes at startup (EventEmitter not ready)
import Purchases from 'react-native-purchases';
import remoteConfig from '@react-native-firebase/remote-config';

// BAD — metro resolves the import even for type-only in route files
import type { PurchasesOffering } from 'react-native-purchases';

// GOOD — lazy require inside a function
function getPurchases() {
  return require('react-native-purchases').default;
}

// GOOD — local type definition in route files
interface RCOffering { availablePackages: RCPackage[] }
```

### 2. Every Firebase service must check `isFirebaseMockMode()`

```typescript
import { isFirebaseMockMode } from '../../config/environment';

export async function myFirebaseOperation() {
  if (isFirebaseMockMode()) {
    // Return mock data or skip
    return;
  }
  // Real Firebase call (lazy require)
  const firestore = require('@react-native-firebase/firestore').default;
  await firestore().collection('x').doc('y').set(data);
}
```

### 3. Keep `"main": "expo-router/entry"` in package.json

Never add a root `index.ts` with `registerRootComponent()` or a root `App.tsx`. These conflict with Expo Router and break the Android build.

### 4. `SplashScreen.preventAutoHideAsync()` stays at module level

It must execute before any component renders. Do not move it into a `useEffect`.

---

## Firebase Configuration (Production)

### Step 1: Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select a project
3. Add Android app: `com.raine.app`
4. Add iOS app: `com.raine.app`

### Step 2: Config Files

- Download `google-services.json` → place in project root
- Download `GoogleService-Info.plist` → place in project root

### Step 3: Facebook SDK (for Social Login)

Add to `app.json` plugins:

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

### Step 4: Rebuild

```bash
yarn build:dev:android
yarn build:dev:ios
```

---

## Environment Variables

```env
# RevenueCat (required for subscriptions)
EXPO_PUBLIC_REVENUECAT_API_KEY=your_key

# Feature flags are managed via Firebase Remote Config in production
# and use defaults from config/environment.ts in development
```

---

## Styling with NativeWind

```tsx
import { View, Text } from 'react-native';

export function MyComponent() {
  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-slate-900">
        Hello World
      </Text>
    </View>
  );
}
```

Config files: `tailwind.config.js`, `metro.config.js`, `global.css`, `nativewind-env.d.ts`.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Native module X not found` | Rebuild: `yarn build:dev:android` + `yarn install:android` |
| `EventEmitter of undefined` | A native module is imported at top level. Use lazy `require()` |
| `Activity class does not exist` | Wipe emulator: `emulator -avd <NAME> -wipe-data -no-snapshot` |
| Styles not applying | `yarn clean:all` |
| Metro port conflict | `pkill -f "expo start" && yarn dev` |
| TypeScript errors | `yarn type-check` |
| Watchman recrawling | `watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)"` |
| Firestore permission denied | You're in production mode with a mock user. Check `isFirebaseMockMode()` |
| Sign-out crash | Auth service is using real Firebase instead of mock. Check `isDev` guard |

**Detailed guides:**
- [System Invariants](./documents/TECHNICAL/9-SYSTEM-INVARIANTS.md)
- [Troubleshooting Guide](./documents/GUIDES/TROUBLESHOOTING.md)
- [Full Documentation Index](./documents/README.md)

---

## Contributing

1. Run `yarn type-check && yarn lint` before committing
2. Follow the [Critical Rules](#critical-rules-for-contributors) above
3. Never import native modules at the top level of route files
4. Test the full flow: splash → referral → login → profile setup → home → sign out

## License

Proprietary - All rights reserved
