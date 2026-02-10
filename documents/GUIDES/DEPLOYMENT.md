# Deployment Guide

This guide covers building, distributing, and releasing the Raine app to the Apple App Store and Google Play Store using EAS Build and EAS Submit.

---

## Table of Contents

1. [EAS Build Profiles](#eas-build-profiles)
2. [Build Commands](#build-commands)
3. [Android Deployment (Google Play Store)](#android-deployment-google-play-store)
4. [iOS Deployment (Apple App Store)](#ios-deployment-apple-app-store)
5. [Version Management](#version-management)
6. [Pre-Deployment Checklist](#pre-deployment-checklist)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)

---

## EAS Build Profiles

Build profiles are defined in `eas.json` and control how the native binary is compiled.

| Profile | Use Case | Android Output | iOS Output | Distribution |
|---------|----------|----------------|------------|-------------|
| `development` | Daily development on physical devices | APK | IPA | Internal |
| `development-simulator` | iOS Simulator testing | -- | Simulator build | Internal |
| `preview` | QA and stakeholder testing | APK | IPA | Internal (ad-hoc) |
| `production` | App Store and Play Store releases | AAB (app bundle) | IPA | Store |

### Profile Details

**development** -- Includes the development client launcher UI. Connects to Metro for JS hot-reload. APK format for Android (sideloading). IPA for iOS physical devices.

**development-simulator** -- Same as development but targets the iOS Simulator. No Apple Developer account required.

**preview** -- Standalone app without development client UI. Suitable for sharing with testers who do not have a development environment. APK for Android. Ad-hoc IPA for iOS (requires device registration).

**production** -- Optimized build for store distribution. Android uses AAB format (required by Google Play). iOS uses IPA signed for App Store distribution. Auto-increments version numbers.

---

## Build Commands

### Development Builds

```bash
# Android (physical device)
yarn build:dev:android

# iOS (physical device)
yarn build:dev:ios

# iOS (Simulator)
yarn build:dev:ios:simulator
```

### Preview Builds

```bash
# Android APK for testers
yarn build:preview:android

# iOS IPA for testers (requires Apple Developer account + ad-hoc provisioning)
yarn build:preview:ios
```

### Production Builds

```bash
# Android AAB for Play Store
yarn build:prod:android

# iOS IPA for App Store
yarn build:prod:ios
```

### Utility Commands

```bash
# Build both platforms simultaneously
eas build --profile production --platform all

# List all builds
eas build:list

# View the latest build
eas build:view

# Download and run the latest build on a device
eas build:run --platform android --latest
eas build:run --platform ios --latest

# Check login status
eas whoami
```

---

## Android Deployment (Google Play Store)

### Prerequisites

1. A [Google Play Console](https://play.google.com/console) account ($25 one-time fee).
2. A service account key for automated submissions (optional but recommended).

### Create the Play Console Entry (First Time)

1. Open [Google Play Console](https://play.google.com/console).
2. Click **Create app**.
3. Fill in the app name, default language, app type, and pricing.
4. Complete the store listing: screenshots (phone, tablet), feature graphic (1024x500), short and full descriptions, privacy policy URL, content rating questionnaire, and target audience settings.

### Create a Service Account Key (for Automated Submissions)

1. In Play Console, go to **Setup > API access**.
2. Create a service account with **Release manager** permissions.
3. Download the JSON key and save it as `play-store-key.json` in the project root.
4. Add `play-store-key.json` to `.gitignore`.
5. Reference the key in `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./play-store-key.json"
      }
    }
  }
}
```

### Build and Submit

```bash
# 1. Build the production AAB
yarn build:prod:android

# 2. Submit to Play Store
eas submit --platform android --latest
```

### Manual Upload (Alternative)

1. Download the `.aab` file from the EAS build page.
2. In Play Console, go to **Production > Create release**.
3. Upload the AAB file.
4. Add release notes.
5. Click **Review and roll out > Start rollout to Production**.

### Internal Testing Track

For staged rollouts, upload to the internal testing track first:

1. In Play Console, go to **Testing > Internal testing**.
2. Create a release and upload the AAB.
3. Add testers by email address or Google Group.
4. Share the opt-in link with testers.

Promote from internal testing to production when ready.

---

## iOS Deployment (Apple App Store)

### Prerequisites

1. An [Apple Developer](https://developer.apple.com) account ($99/year).
2. An app entry in [App Store Connect](https://appstoreconnect.apple.com).

### Create the App Store Connect Entry (First Time)

1. Open [App Store Connect](https://appstoreconnect.apple.com).
2. Click **+** > **New App**.
3. Fill in the app name, primary language, bundle ID (`com.raine.app`), and SKU.
4. Note the Apple ID (numeric) for the app -- this is used in `eas.json` for automated submissions.

### Configure EAS Submit (Optional)

Add your Apple credentials to `eas.json` for automated submissions:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID"
      }
    }
  }
}
```

### Build and Submit

```bash
# 1. Build the production IPA
yarn build:prod:ios

# 2. Submit to App Store Connect
eas submit --platform ios --latest
```

### Manual Upload (Alternative)

1. Download the `.ipa` file from the EAS build page.
2. Upload via the **Transporter** app (macOS) or `altool`.

### TestFlight Distribution

After submitting to App Store Connect, the build automatically appears in TestFlight:

1. In App Store Connect, go to **TestFlight**.
2. The build undergoes automatic processing (5-30 minutes).
3. Add internal testers (up to 100, no review required).
4. Add external testers (up to 10,000, requires brief review).
5. Share the TestFlight invitation link with testers.

### Complete the Store Listing

In App Store Connect, provide:

- Screenshots for required device sizes (6.7", 6.5", 5.5").
- App description and keywords.
- Privacy policy URL.
- Age rating questionnaire.
- App review information (demo account if login is required).

### Submit for Review

Click **Submit for Review** in App Store Connect. Review typically takes 24-48 hours.

---

## Version Management

### Version Source

The project uses `"appVersionSource": "local"` in `eas.json`. This means version numbers are read from `app.json`, not from the EAS server.

| Field | Location | Purpose |
|-------|----------|---------|
| `expo.version` | `app.json` | User-facing version string (e.g., `1.0.0`) |
| `expo.ios.buildNumber` | `app.json` | iOS build number (must increment per submission) |
| `expo.android.versionCode` | `app.json` | Android version code (must increment per submission) |

### Auto-Increment

The production build profile has `"autoIncrement": true`, which automatically increments `buildNumber` (iOS) and `versionCode` (Android) on each production build.

### Manual Version Bumps

For major or minor version changes, update `expo.version` in `app.json` manually:

```json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 10
    }
  }
}
```

### Version Strategy

- **Patch** (1.0.0 -> 1.0.1): Bug fixes. Update `expo.version`; let auto-increment handle build numbers.
- **Minor** (1.0.0 -> 1.1.0): New features. Update `expo.version`; optionally reset `buildNumber` to 1.
- **Major** (1.0.0 -> 2.0.0): Breaking changes. Update `expo.version`; reset `buildNumber` to 1.

---

## Pre-Deployment Checklist

Complete these steps before every production release:

### Code Quality

- [ ] `yarn type-check` passes with no errors.
- [ ] `yarn lint` passes with no errors.
- [ ] Test the full flow: splash, referral, login, profile setup, home, rooms, profile, sign out.
- [ ] Test on both Android and iOS devices (or emulators).

### Configuration

- [ ] `google-services.json` (Android) is present and points to the production Firebase project.
- [ ] `GoogleService-Info.plist` (iOS) is present and points to the production Firebase project.
- [ ] `EXPO_PUBLIC_REVENUECAT_API_KEY` is set for production.
- [ ] Firestore security rules are deployed for the production project.
- [ ] `app.json` version number is correct.
- [ ] `react-native-fbsdk-next` plugin is configured in `app.json` with the production Facebook App ID (if social login is enabled).

### Store Assets

- [ ] Screenshots are up to date for all required device sizes.
- [ ] App description and release notes are written.
- [ ] Privacy policy URL is valid and accessible.

---

## Post-Deployment Verification

After submitting to the stores, verify the following:

### Immediate (Within 1 Hour)

- [ ] EAS build completed successfully (check `eas build:list`).
- [ ] EAS submit completed successfully (check Expo dashboard).
- [ ] Build appears in App Store Connect (TestFlight tab) or Play Console (release track).

### After Store Approval

- [ ] Download the app from the store on a clean device.
- [ ] Verify the app launches without crashes.
- [ ] Verify Firebase Authentication works (email, social login).
- [ ] Verify Firestore reads and writes function correctly.
- [ ] Verify push notifications are received.
- [ ] Verify RevenueCat subscription flows work.
- [ ] Check Firebase Crashlytics for any new crash reports.
- [ ] Monitor Firebase Analytics for expected user events.

---

## Rollback Procedures

### If a Production Issue Is Discovered

**Option 1: Halt the Rollout (Play Store)**

1. In Play Console, go to **Production > Releases**.
2. Click **Halt rollout** on the problematic release.
3. The previous version remains available to users who have not updated.

**Option 2: Submit a Hotfix**

1. Fix the issue in code.
2. Bump the version number in `app.json`.
3. Build and submit:

```bash
yarn build:prod:android
yarn build:prod:ios
eas submit --platform android --latest
eas submit --platform ios --latest
```

4. Request expedited review from Apple if the issue is critical (App Store Connect > App Review > Request Expedited Review).

**Option 3: Revert to a Previous Build**

1. Identify the last known good build in `eas build:list`.
2. Re-submit that build:

```bash
eas submit --platform android --id <BUILD_ID>
eas submit --platform ios --id <BUILD_ID>
```

### Prevention

- Always test preview builds with testers before promoting to production.
- Use staged rollouts on Google Play (start at 10%, increase gradually).
- Monitor Crashlytics closely for the first 24-48 hours after a release.

---

## Quick Reference

```bash
# Development builds
yarn build:dev:android
yarn build:dev:ios
yarn build:dev:ios:simulator

# Preview builds
yarn build:preview:android
yarn build:preview:ios

# Production builds
yarn build:prod:android
yarn build:prod:ios

# Submit to stores
eas submit --platform android --latest
eas submit --platform ios --latest

# Install on device
yarn install:android
yarn install:ios

# Start dev server
yarn dev
```

---

## Cross-References

- [Local Development Setup](./LOCAL-DEV-SETUP.md) -- Prerequisites, first-time build, and emulator configuration.
- [Troubleshooting Guide](./TROUBLESHOOTING.md) -- Fixes for build failures, native module errors, and device issues.
- [System Invariants](../../documents/TECHNICAL/9-SYSTEM-INVARIANTS.md) -- Rules that must be followed to prevent production crashes.
- [Mock Mode Details](../../documents/TECHNICAL/8-MOCK-MODE.md) -- How mock mode works and when to disable it for production testing.
