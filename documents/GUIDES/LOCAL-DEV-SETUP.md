# Local Development Setup

This guide walks through setting up a local development environment for the Raine mobile application from scratch. It covers prerequisites, building the development client, configuring emulators, and running the app with mock services.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [First-Time Build (EAS Cloud Build)](#first-time-build-eas-cloud-build)
4. [Emulator Setup](#emulator-setup)
5. [Installing Builds on Device or Emulator](#installing-builds-on-device-or-emulator)
6. [Starting Metro](#starting-metro)
7. [Connecting the Development Client](#connecting-the-development-client)
8. [Environment Variables](#environment-variables)
9. [Daily Development Workflow](#daily-development-workflow)
10. [Common Setup Issues](#common-setup-issues)

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| Yarn | 1.22.x | 1.22.22 |
| macOS (for iOS) | 13.0 | 14.0+ |
| Xcode (iOS) | 15.0 | 16.0+ |
| Android Studio | Hedgehog | Latest stable |
| Watchman | -- | Latest (`brew install watchman`) |

### Required Accounts

| Account | Purpose |
|---------|---------|
| Expo (expo.dev) | EAS Build and Submit services |
| Apple Developer (iOS only) | Device builds and App Store ($99/year) |
| Google Play Console (Android only) | Play Store ($25 one-time) |

### Why Not Expo Go?

This project **cannot run in Expo Go**. It uses native modules (Firebase, MMKV, RevenueCat, Facebook SDK) that require compiled native code. Instead, it uses **EAS Development Builds** -- custom native binaries that include all native dependencies and connect to Metro for JS hot-reload.

| Concept | Description |
|---------|-------------|
| Expo Go | Pre-built app from the App Store. Only supports Expo SDK modules. Not compatible with this project. |
| Development Build | Custom APK/IPA built via EAS that includes all native dependencies. Connects to Metro like Expo Go but supports any native module. |
| EAS Build | Cloud build service that compiles the native binary. Runs `expo prebuild` then Gradle/Xcode, and outputs APK or IPA. |
| Metro | JS bundler that serves TypeScript/JSX code. Runs locally via `yarn dev`. The development build connects to it over the network. |

---

## Environment Setup

### 1. Install Node.js

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20
```

### 2. Install Yarn

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
```

### 3. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

If `eas` is not found after installation, see [Common Setup Issues](#eas-cli-not-found) below.

### 4. Install Watchman (recommended)

```bash
brew install watchman
```

### 5. Install Android Studio (for Android development)

1. Download and install [Android Studio](https://developer.android.com/studio).
2. Open Android Studio and install the Android SDK via **Settings > Languages & Frameworks > Android SDK**.
3. Add the following to `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

4. Restart your terminal:

```bash
source ~/.zshrc
```

### 6. Install Xcode (for iOS development)

1. Install Xcode from the Mac App Store (requires macOS 14+).
2. Open Xcode and accept the license agreement.
3. Install iOS Simulator runtimes via **Xcode > Settings > Platforms**.

If your macOS version does not support the required Xcode version, use EAS cloud builds instead. EAS builds work regardless of your local Xcode version.

### 7. Clone and Install Dependencies

```bash
cd RaineApp
yarn install
```

---

## First-Time Build (EAS Cloud Build)

The development client must be built at least once before you can run the app. This is a cloud build that takes approximately 10-15 minutes.

### Android

```bash
yarn build:dev:android
```

This produces an APK with all native modules included. The build runs on EAS servers; no local Android SDK setup is required for the build itself.

### iOS (Physical Device)

```bash
yarn build:dev:ios
```

First-time iOS builds will prompt you to register your device. Follow the prompts to add your iPhone's UDID.

### iOS (Simulator)

```bash
yarn build:dev:ios:simulator
```

No Apple Developer account is required for simulator builds.

### When to Rebuild

A new native build is required when:

- A native dependency is added or updated (e.g., `@react-native-firebase/*`, `react-native-mmkv`).
- `app.json` plugins are changed.
- Firebase config files (`google-services.json`, `GoogleService-Info.plist`) are modified.

Pure TypeScript/JSX changes never require a rebuild. If you see `Native module X not found` errors at runtime, you need a rebuild.

---

## Emulator Setup

### Android: Create an AVD

1. Open Android Studio.
2. Go to **Tools > Device Manager**.
3. Click **Create Device**.
4. Select a device profile (e.g., Pixel 7).
5. Select a system image. **API 35 (Android 15) is recommended.** API 36 preview has known stability issues with package resolution and dex optimization.
6. Finish the wizard and launch the emulator.

### Android: Wipe Data (Required for API 36 Issues)

If you encounter `Activity class does not exist` errors, wipe the emulator data and cold boot:

```bash
# Kill any running emulator
pkill -f emulator

# List available AVDs
~/Library/Android/sdk/emulator/emulator -list-avds

# Wipe data and cold boot (replace <AVD_NAME> with your AVD)
~/Library/Android/sdk/emulator/emulator -avd <AVD_NAME> -wipe-data -no-snapshot &

# Verify the emulator has fully booted (returns "1" when ready)
~/Library/Android/sdk/platform-tools/adb shell getprop sys.boot_completed
```

### iOS Simulator

iOS simulators are managed through Xcode. Open **Xcode > Window > Devices and Simulators** to manage simulators.

---

## Installing Builds on Device or Emulator

After the EAS build completes, install it on your device or emulator:

### Android

```bash
yarn install:android
```

This downloads the latest development build from EAS and installs it on the connected device or running emulator.

### iOS

```bash
yarn install:ios
```

For physical iPhones, scan the QR code provided by EAS after the build completes.

---

## Starting Metro

```bash
yarn dev
```

This starts the Metro bundler, which serves your TypeScript/JSX code to the development client. The development build connects to Metro automatically over the network.

If the app does not connect automatically, press `a` (Android) or `i` (iOS) in the Metro terminal to launch the app on the respective platform.

---

## Connecting the Development Client

1. Open the installed Raine development app on your device or emulator.
2. The app connects to Metro automatically if the dev server is running on the same network.
3. If the app shows a connection screen, enter your computer's IP address or scan the QR code from the Metro terminal.

In development mode (`__DEV__ === true`), all Firebase services are automatically mocked. The full UI flow works without backend credentials: splash, referral code, login, 14-step profile setup, home, rooms, profile, and sign out.

For details on how mock mode works and how to switch to real Firebase, see [documents/TECHNICAL/8-MOCK-MODE.md](../../documents/TECHNICAL/8-MOCK-MODE.md).

---

## Environment Variables

Create a `.env` file in the project root (not committed to git):

```bash
# RevenueCat (required for subscriptions in production)
EXPO_PUBLIC_REVENUECAT_API_KEY=your_key

# Firebase (optional -- native SDKs use google-services.json / GoogleService-Info.plist)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Facebook SDK (optional -- only needed if enabling real social login)
FACEBOOK_APP_ID=
FACEBOOK_CLIENT_TOKEN=
FACEBOOK_DISPLAY_NAME=Raine
```

In development, mock mode is active by default. Environment variables are only required for production builds or when testing against real backend services.

### Firebase Configuration Files

These are downloaded from the [Firebase Console](https://console.firebase.google.com) and placed in the project root:

| Platform | File |
|----------|------|
| Android | `google-services.json` |
| iOS | `GoogleService-Info.plist` |

---

## Daily Development Workflow

Once the development client is installed, daily development requires only starting Metro:

```bash
yarn dev
```

The installed development client reconnects automatically. No rebuild is necessary unless native dependencies change.

### Optional: TypeScript Watch Mode

```bash
yarn type-check --watch
```

### Useful Commands

```bash
# Check Expo SDK compatibility
yarn doctor

# Clear Metro cache and restart
yarn clean

# Clear everything (node_modules, caches, watchman)
yarn clean:all

# List EAS builds
eas build:list

# Download and run the latest build
eas build:run --platform ios --latest
eas build:run --platform android --latest
```

---

## Common Setup Issues

### EAS CLI Not Found

```
zsh: command not found: eas
```

Yarn global packages may not be in your shell PATH. Options:

```bash
# Option 1: Use npx
npx eas-cli build --profile development --platform android

# Option 2: Add yarn global bin to PATH
export PATH="$HOME/.yarn/bin:$PATH"

# Option 3: Install with npm instead
npm install -g eas-cli
```

### Android SDK Not Found

```
Failed to resolve the Android SDK path.
```

Set `ANDROID_HOME` in `~/.zshrc` as described in [Environment Setup](#5-install-android-studio-for-android-development) above.

### Xcode Requires Newer macOS

If your macOS version does not support the latest Xcode, use EAS cloud builds for iOS. No local Xcode installation is required for cloud builds.

### Metro Port Conflict

```
Port 8081 is running this app in another window
```

```bash
pkill -f "expo start"
yarn dev
```

### Watchman Recrawling

```bash
watchman watch-del "$(pwd)" ; watchman watch-project "$(pwd)"
yarn clean
```

### Native Module Not Found After Install

If you see `Native module X not found` after installing a new package, a native rebuild is required:

```bash
yarn build:dev:android   # or yarn build:dev:ios
yarn install:android     # or yarn install:ios
yarn dev
```

---

## Cross-References

- [Mock Mode Details](../../documents/TECHNICAL/8-MOCK-MODE.md) -- How mock mode works, when it activates, and how to test with real Firebase.
- [System Invariants](../../documents/TECHNICAL/9-SYSTEM-INVARIANTS.md) -- Critical rules for the codebase that prevent crashes.
- [Deployment Guide](./DEPLOYMENT.md) -- Building for preview, production, and submitting to app stores.
- [Troubleshooting Guide](./TROUBLESHOOTING.md) -- Detailed fixes for common runtime and build errors.
