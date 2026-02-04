# Local Development Infrastructure Documentation

## Executive Summary

This document outlines the technical findings from debugging the Raine mobile application and provides recommendations for backend infrastructure to support efficient local development workflows. The application uses Expo with React Native and relies on several native modules that require specific infrastructure considerations.

---

## Table of Contents

1. [Current Architecture Overview](#1-current-architecture-overview)
2. [Native Module Dependencies](#2-native-module-dependencies)
3. [Issues Encountered](#3-issues-encountered)
4. [Development Environment Requirements](#4-development-environment-requirements)
5. [Backend Infrastructure Recommendations](#5-backend-infrastructure-recommendations)
6. [Local Development Workflow](#6-local-development-workflow)
7. [Environment Configuration](#7-environment-configuration)
8. [Testing Strategy](#8-testing-strategy)

---

## 1. Current Architecture Overview

### 1.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Expo SDK | 54.0.33 |
| Runtime | React Native | 0.81.5 |
| Language | TypeScript | 5.9.2 |
| Navigation | Expo Router | 6.0.23 |
| State Management | Zustand | 5.0.11 |
| Data Fetching | TanStack React Query | 5.90.20 |
| Styling | NativeWind (Tailwind) | 4.2.1 |
| Backend Services | Firebase | 23.8.6 |
| Payments | RevenueCat | 9.7.6 |
| Storage | MMKV | 4.1.2 |

### 1.2 Project Structure

```
RaineApp-fb/
├── src/
│   ├── app/                    # Expo Router file-based routing
│   │   ├── (auth)/            # Authentication screens
│   │   ├── (onboarding)/      # Onboarding flow
│   │   ├── (tabs)/            # Main tab navigation
│   │   └── room/              # Chat room screens
│   ├── cache/                  # MMKV storage utilities
│   ├── components/            # Reusable UI components
│   ├── features/              # Feature modules (auth)
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # External service integrations
│   │   ├── firebase/          # Firebase services
│   │   ├── referral/          # Referral system
│   │   └── revenuecat/        # Subscription management
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── assets/                    # Static assets
├── docs/                      # Documentation
└── app.json                   # Expo configuration
```

### 1.3 Firebase Services Integration

The application integrates the following Firebase services:

| Service | Package | Purpose |
|---------|---------|---------|
| Authentication | `@react-native-firebase/auth` | User authentication (Email, Social) |
| Firestore | `@react-native-firebase/firestore` | Real-time database |
| Cloud Messaging | `@react-native-firebase/messaging` | Push notifications |
| Remote Config | `@react-native-firebase/remote-config` | Feature flags |
| Crashlytics | `@react-native-firebase/crashlytics` | Crash reporting |
| Analytics | `@react-native-firebase/analytics` | User analytics |
| Storage | `@react-native-firebase/storage` | File storage |

---

## 2. Native Module Dependencies

### 2.1 Critical Native Modules

The following packages require native code and **cannot run in Expo Go**:

#### React Native Firebase (`@react-native-firebase/*`)
- **Requirement**: Native iOS/Android linking
- **Config Files Required**:
  - iOS: `GoogleService-Info.plist`
  - Android: `google-services.json`
- **Impact**: All Firebase functionality (auth, database, notifications)

#### MMKV Storage (`react-native-mmkv` v4.x)
- **Requirement**: Nitro Modules (TurboModules)
- **Dependencies**: `react-native-nitro-modules`
- **New Architecture**: Requires `newArchEnabled: true`
- **Impact**: Local storage, state persistence

#### React Native Reanimated (`react-native-reanimated`)
- **Requirement**: Worklets runtime
- **Dependencies**: `react-native-worklets`
- **Impact**: Animations, gesture handling

#### Facebook SDK (`react-native-fbsdk-next`)
- **Requirement**: Native Facebook SDK integration
- **Config Required**: Facebook App ID, Client Token
- **Impact**: Facebook social login

### 2.2 Dependency Version Matrix

```json
{
  "react-native-reanimated": "~4.1.1",
  "react-native-worklets": "0.5.1",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "5.6.2",
  "react-native-mmkv": "4.1.2",
  "react-native-nitro-modules": "0.33.5",
  "@expo/metro-runtime": "6.1.2"
}
```

**Important**: Version mismatches between these packages and Expo SDK can cause build failures. Always verify compatibility with `expo doctor`.

---

## 3. Issues Encountered

### 3.1 Expo Go Incompatibility

**Problem**: Native modules cannot run in Expo Go.

**Error Examples**:
```
Error: Native module RNFBAppModule not found
Error: Failed to get NitroModules: The native "NitroModules" Turbo/Native-Module could not be found
```

**Root Cause**: Expo Go is a pre-built client that doesn't include custom native modules. Apps using Firebase, MMKV, or other native dependencies require a **Development Build**.

**Solution**: Use EAS Build to create a custom development client:
```bash
eas build --profile development --platform ios
```

### 3.2 Missing Peer Dependencies

**Problem**: Several packages had unmet peer dependencies causing bundling failures.

**Dependencies Added**:
| Package | Required By |
|---------|-------------|
| `react-native-worklets` | `react-native-reanimated` |
| `react-native-safe-area-context` | `expo-router` |
| `react-native-screens` | `expo-router` |
| `@expo/metro-runtime` | `expo-router` |
| `react-native-nitro-modules` | `react-native-mmkv` |

### 3.3 TypeScript Type Errors

**Issues Fixed**:

| File | Issue | Fix |
|------|-------|-----|
| `src/cache/mmkv.ts` | MMKV v4 API change | Use `createMMKV()` instead of `new MMKV()` |
| `src/store/persist.ts` | `storage.delete()` not found | Changed to `storage.remove()` |
| `src/hooks/useEntitlement.ts` | RevenueCat listener API | Use `removeCustomerInfoUpdateListener()` |
| `src/services/firebase/*.ts` | Duplicate `id` in spreads | Reorder spread to avoid conflicts |

### 3.4 MMKV API Changes (v3 → v4)

The MMKV package underwent significant API changes with the Nitro Modules migration:

```typescript
// Old API (v2.x/v3.x)
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();
storage.delete('key');

// New API (v4.x)
import { createMMKV, type MMKV } from 'react-native-mmkv';
const storage: MMKV = createMMKV({ id: 'raine-storage' });
storage.remove('key');
```

---

## 4. Development Environment Requirements

### 4.1 System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| Yarn | 1.22.x | 1.22.22 |
| Xcode (iOS) | 15.0 | 16.0+ |
| Android Studio | Hedgehog | Latest |
| macOS (for iOS) | 13.0 | 14.0+ |
| React Native | 0.75+ | 0.81.5 |

### 4.2 Required Configuration Files

#### Firebase Configuration

**iOS** (`GoogleService-Info.plist`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>CLIENT_ID</key>
    <string>{YOUR_CLIENT_ID}</string>
    <key>REVERSED_CLIENT_ID</key>
    <string>{YOUR_REVERSED_CLIENT_ID}</string>
    <key>API_KEY</key>
    <string>{YOUR_API_KEY}</string>
    <key>GCM_SENDER_ID</key>
    <string>{YOUR_GCM_SENDER_ID}</string>
    <key>BUNDLE_ID</key>
    <string>com.raine.app</string>
    <key>PROJECT_ID</key>
    <string>{YOUR_PROJECT_ID}</string>
    <key>GOOGLE_APP_ID</key>
    <string>{YOUR_APP_ID}</string>
</dict>
</plist>
```

**Android** (`google-services.json`):
```json
{
  "project_info": {
    "project_number": "{PROJECT_NUMBER}",
    "project_id": "{PROJECT_ID}",
    "storage_bucket": "{STORAGE_BUCKET}"
  },
  "client": [{
    "client_info": {
      "mobilesdk_app_id": "{APP_ID}",
      "android_client_info": {
        "package_name": "com.raine.app"
      }
    },
    "api_key": [{"current_key": "{API_KEY}"}]
  }]
}
```

### 4.3 Environment Variables

Create a `.env` file (not committed to git):

```bash
# Firebase (for web/testing)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# RevenueCat
REVENUECAT_API_KEY_IOS=
REVENUECAT_API_KEY_ANDROID=

# Facebook SDK
FACEBOOK_APP_ID=
FACEBOOK_CLIENT_TOKEN=
FACEBOOK_DISPLAY_NAME=Raine
```

---

## 5. Backend Infrastructure Recommendations

### 5.1 Firebase Emulator Suite for Local Development

**Recommendation**: Deploy Firebase Emulator Suite for local development to avoid costs and enable offline development.

#### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Local Development                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐     ┌─────────────────────────────────┐  │
│   │   Mobile    │     │     Firebase Emulator Suite      │  │
│   │   App       │────▶│  ┌─────────┐  ┌─────────────┐   │  │
│   │  (Dev Build)│     │  │  Auth   │  │  Firestore  │   │  │
│   └─────────────┘     │  └─────────┘  └─────────────┘   │  │
│                       │  ┌─────────┐  ┌─────────────┐   │  │
│                       │  │Functions│  │   Storage   │   │  │
│                       │  └─────────┘  └─────────────┘   │  │
│                       └─────────────────────────────────┘  │
│                                                              │
│   Emulator UI: http://localhost:4000                        │
│   Auth:        http://localhost:9099                        │
│   Firestore:   http://localhost:8080                        │
│   Functions:   http://localhost:5001                        │
│   Storage:     http://localhost:9199                        │
└─────────────────────────────────────────────────────────────┘
```

#### Firebase Emulator Configuration (`firebase.json`)

```json
{
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "0.0.0.0"
    },
    "firestore": {
      "port": 8080,
      "host": "0.0.0.0"
    },
    "functions": {
      "port": 5001,
      "host": "0.0.0.0"
    },
    "storage": {
      "port": 9199,
      "host": "0.0.0.0"
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

#### Mobile App Emulator Connection

```typescript
// src/services/firebase/firebase.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';

const DEV_MACHINE_IP = '10.0.0.232'; // Your local IP

if (__DEV__) {
  // Connect to emulators in development
  auth().useEmulator(`http://${DEV_MACHINE_IP}:9099`);
  firestore().useEmulator(DEV_MACHINE_IP, 8080);
  functions().useEmulator(DEV_MACHINE_IP, 5001);
  storage().useEmulator(DEV_MACHINE_IP, 9199);
}
```

### 5.2 Docker Compose for Backend Services

**Recommendation**: Create a Docker Compose setup for consistent local development environments.

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  firebase-emulators:
    image: andreysenov/firebase-tools:latest
    container_name: raine-firebase-emulators
    ports:
      - "4000:4000"   # Emulator UI
      - "9099:9099"   # Auth
      - "8080:8080"   # Firestore
      - "5001:5001"   # Functions
      - "9199:9199"   # Storage
      - "9229:9229"   # Debug port
    volumes:
      - ./firebase:/firebase
      - firebase-data:/firebase/data
    working_dir: /firebase
    command: firebase emulators:start --import=/firebase/data --export-on-exit
    environment:
      - FIREBASE_PROJECT_ID=raine-dev
    networks:
      - raine-network

  # Optional: Mock RevenueCat for subscription testing
  revenuecat-mock:
    image: node:20-alpine
    container_name: raine-revenuecat-mock
    ports:
      - "3001:3001"
    volumes:
      - ./mocks/revenuecat:/app
    working_dir: /app
    command: npm start
    networks:
      - raine-network

volumes:
  firebase-data:

networks:
  raine-network:
    driver: bridge
```

### 5.3 Seed Data for Development

**Recommendation**: Create seed scripts to populate the emulators with test data.

#### `scripts/seed-firestore.ts`

```typescript
import * as admin from 'firebase-admin';

// Initialize with emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
admin.initializeApp({ projectId: 'raine-dev' });

const db = admin.firestore();

async function seedUsers() {
  const users = [
    {
      uid: 'test-user-1',
      displayName: 'Test User 1',
      email: 'test1@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=test1',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      uid: 'test-user-2',
      displayName: 'Test User 2',
      email: 'test2@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=test2',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];

  for (const user of users) {
    await db.collection('users').doc(user.uid).set(user);
    console.log(`Created user: ${user.displayName}`);
  }
}

async function seedRooms() {
  const rooms = [
    {
      name: 'General Chat',
      memberIds: ['test-user-1', 'test-user-2'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessage: {
        text: 'Welcome to the chat!',
        senderId: 'test-user-1',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
    },
  ];

  for (const room of rooms) {
    const docRef = await db.collection('rooms').add(room);
    console.log(`Created room: ${room.name} (${docRef.id})`);
  }
}

async function main() {
  console.log('🌱 Seeding Firestore...\n');
  await seedUsers();
  await seedRooms();
  console.log('\n✅ Seeding complete!');
  process.exit(0);
}

main().catch(console.error);
```

### 5.4 Feature Flags via Remote Config

**Recommendation**: Use Firebase Remote Config for feature flags with local defaults.

#### Local Feature Flag Defaults

```typescript
// src/config/featureFlags.ts
export const DEFAULT_FEATURE_FLAGS = {
  chatReactionsEnabled: true,
  subscriptionGatingEnabled: false,
  newOnboardingFlow: false,
  debugModeEnabled: __DEV__,
  maxMessageLength: 1000,
  supportedSocialProviders: ['google', 'apple', 'facebook'],
} as const;

export type FeatureFlags = typeof DEFAULT_FEATURE_FLAGS;
```

#### Remote Config Service

```typescript
// src/services/firebase/remoteConfig.ts
import remoteConfig from '@react-native-firebase/remote-config';
import { DEFAULT_FEATURE_FLAGS } from '../../config/featureFlags';

export async function initializeRemoteConfig() {
  await remoteConfig().setDefaults(DEFAULT_FEATURE_FLAGS);
  
  if (__DEV__) {
    // Fetch immediately in development
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 0,
    });
  }
  
  await remoteConfig().fetchAndActivate();
}

export function getFeatureFlag<K extends keyof typeof DEFAULT_FEATURE_FLAGS>(
  key: K
): typeof DEFAULT_FEATURE_FLAGS[K] {
  const value = remoteConfig().getValue(key);
  
  // Type-safe value extraction
  const defaultValue = DEFAULT_FEATURE_FLAGS[key];
  if (typeof defaultValue === 'boolean') {
    return value.asBoolean() as typeof DEFAULT_FEATURE_FLAGS[K];
  }
  if (typeof defaultValue === 'number') {
    return value.asNumber() as typeof DEFAULT_FEATURE_FLAGS[K];
  }
  if (typeof defaultValue === 'string') {
    return value.asString() as typeof DEFAULT_FEATURE_FLAGS[K];
  }
  // For arrays/objects
  try {
    return JSON.parse(value.asString()) as typeof DEFAULT_FEATURE_FLAGS[K];
  } catch {
    return defaultValue;
  }
}
```

---

## 6. Local Development Workflow

### 6.1 First-Time Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd RaineApp-fb

# 2. Install dependencies
yarn install

# 3. Copy environment files
cp .env.example .env
# Edit .env with your credentials

# 4. Start Firebase emulators (in separate terminal)
cd ../Raine-bk  # Backend project
docker-compose up -d
# OR: firebase emulators:start

# 5. Build development client
yarn global add eas-cli
eas login
eas build --profile development --platform ios
# Download and install the .app on simulator

# 6. Start Metro bundler
yarn start

# 7. Open in development build (not Expo Go!)
# Press 'i' for iOS simulator with dev client installed
```

### 6.2 Daily Development Workflow

```bash
# Terminal 1: Start Firebase emulators
docker-compose up

# Terminal 2: Start Metro bundler
cd RaineApp-fb
yarn start

# Terminal 3: Run TypeScript checks (optional, watch mode)
yarn tsc --watch --noEmit
```

### 6.3 Package.json Scripts

Add these helpful scripts:

```json
{
  "scripts": {
    "start": "expo start",
    "start:dev": "expo start --dev-client",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "build:dev:ios": "eas build --profile development --platform ios",
    "build:dev:android": "eas build --profile development --platform android",
    "build:preview": "eas build --profile preview",
    "build:prod": "eas build --profile production",
    "doctor": "npx expo-doctor",
    "seed": "ts-node scripts/seed-firestore.ts",
    "emulators": "firebase emulators:start"
  }
}
```

---

## 7. Environment Configuration

### 7.1 EAS Build Profiles

Update `eas.json` for different environments:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "env": {
        "APP_ENV": "development",
        "FIREBASE_ENV": "emulator"
      }
    },
    "development-device": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "env": {
        "APP_ENV": "development",
        "FIREBASE_ENV": "emulator"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging",
        "FIREBASE_ENV": "staging"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "APP_ENV": "production",
        "FIREBASE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 7.2 App Configuration by Environment

```typescript
// src/config/env.ts
type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  firebaseEmulatorHost: string | null;
  revenueCatApiKey: string;
  enableDebugLogs: boolean;
}

const configs: Record<Environment, EnvConfig> = {
  development: {
    apiUrl: 'http://localhost:5001/raine-dev/us-central1',
    firebaseEmulatorHost: '10.0.0.232', // Your machine's local IP
    revenueCatApiKey: process.env.REVENUECAT_API_KEY_IOS ?? '',
    enableDebugLogs: true,
  },
  staging: {
    apiUrl: 'https://us-central1-raine-staging.cloudfunctions.net',
    firebaseEmulatorHost: null,
    revenueCatApiKey: process.env.REVENUECAT_API_KEY_IOS ?? '',
    enableDebugLogs: true,
  },
  production: {
    apiUrl: 'https://us-central1-raine-prod.cloudfunctions.net',
    firebaseEmulatorHost: null,
    revenueCatApiKey: process.env.REVENUECAT_API_KEY_IOS ?? '',
    enableDebugLogs: false,
  },
};

export const ENV = process.env.APP_ENV as Environment ?? 'development';
export const config = configs[ENV];
```

---

## 8. Testing Strategy

### 8.1 Unit Testing Setup

```bash
yarn add -D jest @testing-library/react-native @testing-library/jest-native
```

#### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation|react-native-reanimated)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
};
```

### 8.2 Mocking Native Modules

```typescript
// __mocks__/react-native-mmkv.ts
export const createMMKV = jest.fn(() => ({
  set: jest.fn(),
  getString: jest.fn(),
  getBoolean: jest.fn(),
  getNumber: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
  getAllKeys: jest.fn(() => []),
  contains: jest.fn(() => false),
}));

export type MMKV = ReturnType<typeof createMMKV>;
```

```typescript
// __mocks__/@react-native-firebase/auth.ts
export default () => ({
  currentUser: null,
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return jest.fn(); // unsubscribe
  }),
});
```

### 8.3 E2E Testing with Maestro

**Recommendation**: Use Maestro for E2E testing as it works well with React Native.

#### Sample Test Flow (`e2e/login.yaml`)

```yaml
appId: com.raine.app
---
- launchApp
- assertVisible: "Welcome to Raine"
- tapOn: "Continue with Google"
# Maestro handles the OAuth flow
- assertVisible: "Home"
```

---

## Appendix A: Troubleshooting Guide

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `NitroModules not found` | Running in Expo Go | Use Development Build |
| `RNFBAppModule not found` | Missing Firebase config | Add `GoogleService-Info.plist` / `google-services.json` |
| `Cannot resolve module` | Missing peer dependency | Run `yarn add <package>` |
| `Version mismatch` | Incompatible package versions | Run `expo doctor` and follow recommendations |
| `Metro bundler crash` | Corrupted cache | Run `yarn start --clear` |

### Useful Commands

```bash
# Check Expo compatibility
npx expo-doctor

# Clear all caches
watchman watch-del-all && rm -rf node_modules && yarn install && yarn start --clear

# Verify native config
npx react-native config

# Check EAS build status
eas build:list

# Download latest development build
eas build:run --platform ios --latest
```

---

## Appendix B: Checklist for New Developers

- [ ] Install Node.js 20.x LTS
- [ ] Install Yarn 1.22.x
- [ ] Install Xcode (for iOS) or Android Studio (for Android)
- [ ] Clone repository and run `yarn install`
- [ ] Copy `.env.example` to `.env` and fill in values
- [ ] Download Firebase config files from Firebase Console
- [ ] Install EAS CLI: `yarn global add eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Build development client: `eas build --profile development --platform ios`
- [ ] Install development build on simulator
- [ ] Start Firebase emulators (if using local backend)
- [ ] Run `yarn start` and press `i` for iOS

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-04 | Engineering | Initial documentation |

