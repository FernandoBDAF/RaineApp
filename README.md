# Raine App

A React Native mobile application built with Expo, featuring social authentication, real-time messaging, and subscription management.

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand with MMKV persistence
- **Backend:** Firebase (Auth, Firestore, Messaging, Remote Config)
- **Subscriptions:** RevenueCat
- **Language:** TypeScript

## Prerequisites

- Node.js 18+
- Yarn package manager
- For iOS development: macOS with Xcode
- For Android development: Android Studio with an emulator or physical device
- EAS CLI (for building development clients)

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start Development Server

**Without Firebase (Mock Mode):**

If you don't have Firebase configured, the app will automatically run in mock mode, allowing you to develop and test the UI:

```bash
yarn dev
```

Press `a` for Android or `i` for iOS.

**With Firebase (Full Features):**

See [Firebase Configuration](#firebase-configuration) below.

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start Expo dev server |
| `yarn dev` | Start with dev client support |
| `yarn android` | Start and open on Android |
| `yarn ios` | Start and open on iOS |
| `yarn type-check` | Run TypeScript compiler |
| `yarn lint` | Run ESLint |
| `yarn clean` | Start with cleared cache |
| `yarn clean:all` | Clear all caches (watchman, node_modules, metro) |
| `yarn doctor` | Run Expo diagnostics |

### Build Commands

| Command | Description |
|---------|-------------|
| `yarn build:dev:android` | Build Android development client |
| `yarn build:dev:ios` | Build iOS development client |
| `yarn build:dev:ios:simulator` | Build iOS simulator development client |
| `yarn build:preview:android` | Build Android preview APK |
| `yarn build:preview:ios` | Build iOS preview IPA |
| `yarn build:prod:android` | Build Android production release |
| `yarn build:prod:ios` | Build iOS production release |
| `yarn install:android` | Install latest Android build |
| `yarn install:ios` | Install latest iOS build |

## Firebase Configuration

This app uses Firebase for authentication, database, and push notifications. Firebase requires native modules, which means you need a **development build** (not Expo Go).

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add an Android app with package name: `com.raine.app`
4. Add an iOS app with bundle ID: `com.raine.app`

### Step 2: Download Config Files

**Android:**
1. Download `google-services.json` from Firebase Console
2. Place it in the project root (the build process will handle placement)

**iOS:**
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in the project root

### Step 3: Update app.json

Uncomment the `googleServicesFile` paths in `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### Step 4: Build Development Client

```bash
# For Android
yarn build:dev:android

# For iOS
yarn build:dev:ios
```

### Step 5: Install and Run

```bash
# Install on connected Android device/emulator
yarn install:android

# Then start the dev server
yarn dev
```

## Project Structure

```
src/
├── app/                    # Expo Router pages (file-based routing)
│   ├── (auth)/            # Authentication screens
│   ├── (onboarding)/      # Onboarding flow
│   ├── (profile-setup)/   # Profile setup flow
│   ├── (tabs)/            # Main tab navigator
│   ├── room/              # Chat room screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── config/               # App configuration
│   └── environment.ts    # Environment variables & mock mode
├── constants/            # Static values
├── features/             # Feature modules
│   └── auth/            # Authentication logic
├── hooks/               # Custom React hooks
├── services/            # External service integrations
│   ├── firebase/        # Firebase services (with mock support)
│   └── revenuecat/      # RevenueCat subscription service
├── store/               # Zustand state stores
├── types/               # TypeScript type definitions
└── cache/               # Local storage (MMKV)
```

## Development Modes

### Mock Mode (Default without Firebase)

When Firebase config files are not present, the app automatically enables mock mode:

- Authentication works with simulated users
- Firestore operations return mock data
- Push notifications are disabled
- Remote config returns default values

This allows full UI development without Firebase setup.

### Full Firebase Mode

With proper Firebase configuration, all features work:

- Social authentication (Instagram, Facebook, LinkedIn)
- Real-time Firestore database
- Push notifications
- Remote config for feature flags

## Styling with NativeWind

This project uses NativeWind v4 for Tailwind CSS styling in React Native.

### Usage

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

### Configuration Files

- `tailwind.config.js` - Tailwind configuration
- `metro.config.js` - Metro bundler with NativeWind
- `global.css` - Tailwind directives
- `nativewind-env.d.ts` - TypeScript support

## Troubleshooting

See [docs/troubleshooting-guide.md](./docs/troubleshooting-guide.md) for detailed solutions to common issues.

### Quick Fixes

**Styles not applying:**
```bash
yarn clean:all
```

**Metro port conflict:**
```bash
pkill -f "expo start"
yarn dev
```

**TypeScript errors:**
```bash
yarn type-check
```

**Native module errors:**
You need a development build. See [Firebase Configuration](#firebase-configuration).

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# RevenueCat
REVENUECAT_API_KEY_ANDROID=your_android_key
REVENUECAT_API_KEY_IOS=your_ios_key

# Feature Flags (optional - uses Remote Config in production)
FORCE_MOCK_MODE=false
```

## Building for Production

### Android

```bash
# Build production AAB for Play Store
yarn build:prod:android
```

### iOS

```bash
# Build production IPA for App Store
yarn build:prod:ios
```

## Contributing

1. Run type checking before committing: `yarn type-check`
2. Run linting: `yarn lint`
3. Follow the existing code style and patterns

## License

Proprietary - All rights reserved
