# Raine App Deployment Plan
## iOS & Android Deployment Guide

This document provides a step-by-step plan to deploy the Raine app to both iOS and Android devices.

---

## Prerequisites Checklist

### Accounts Required

| Account | Purpose | Sign Up |
|---------|---------|---------|
| **Expo Account** | EAS Build & Submit | [expo.dev](https://expo.dev) |
| **Apple Developer** | iOS App Store ($99/year) | [developer.apple.com](https://developer.apple.com) |
| **Google Play Console** | Android Play Store ($25 one-time) | [play.google.com/console](https://play.google.com/console) |

### Tools Required

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

### Firebase Configuration Files

Before building, ensure you have:

| Platform | File | Location |
|----------|------|----------|
| iOS | `GoogleService-Info.plist` | Project root or `ios/` |
| Android | `google-services.json` | Project root or `android/` |

Download these from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your Apps.

---

## Phase 1: Initial Setup (One-Time)

### Step 1.1: Login to Expo

```bash
cd /Users/fernandobarroso/repo/Raine/RaineApp-fb
eas login
```

Enter your Expo credentials when prompted.

### Step 1.2: Configure EAS Project

```bash
eas build:configure
```

This links your project to your Expo account.

### Step 1.3: Update app.json

Ensure your `app.json` has the required identifiers:

```json
{
  "expo": {
    "name": "Raine",
    "slug": "raine",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.raine.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.raine.app",
      "versionCode": 1
    }
  }
}
```

### Step 1.4: Update eas.json

Replace your current `eas.json` with this complete configuration:

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
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./play-store-key.json"
      }
    }
  }
}
```

---

## Phase 2: Development Builds (For Testing)

### iOS Development Build (Physical iPhone)

```bash
# Build for physical iPhone
eas build --profile development --platform ios
```

**What happens:**
1. EAS builds your app in the cloud (~15-20 minutes)
2. You'll receive a URL/QR code when complete
3. Scan QR with your iPhone camera to install

**First-time iOS setup:**
- EAS will prompt you to register your device
- Follow the prompts to add your iPhone's UDID

### Android Development Build (Physical Device)

```bash
# Build APK for Android
eas build --profile development --platform android
```

**What happens:**
1. EAS builds an APK (~10-15 minutes)
2. Download the APK from the build page
3. Install on your Android device (enable "Install from unknown sources")

### Build Both Platforms

```bash
# Build both simultaneously
eas build --profile development --platform all
```

---

## Phase 3: Testing with Development Builds

### Step 3.1: Start Metro with Dev Client

```bash
yarn start --dev-client
```

### Step 3.2: Connect Your Device

1. Open the installed Raine development app on your phone
2. The app will show a text field for the dev server URL
3. Enter your computer's IP address: `exp://YOUR_IP:8081`
   - Or scan the QR code shown in the terminal

### Step 3.3: Verify Everything Works

Test these features to ensure native modules work:
- [ ] Firebase Auth (login/signup)
- [ ] Firestore (data loading)
- [ ] MMKV (app doesn't crash on load)
- [ ] Push notification permissions

---

## Phase 4: Preview Builds (Internal Testing)

Preview builds are for sharing with testers before public release.

### iOS Preview Build

```bash
eas build --profile preview --platform ios
```

**Distribution options:**
- Share via ad-hoc distribution (requires device registration)
- Use TestFlight (see Phase 5)

### Android Preview Build

```bash
eas build --profile preview --platform android
```

**Distribution:**
- Share APK directly with testers
- Upload to Google Play Internal Testing

---

## Phase 5: Production Deployment

### iOS: App Store Submission

#### Step 5.1: Create App Store Connect Entry

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "+" → "New App"
3. Fill in app details (name, bundle ID, SKU)
4. Note the "Apple ID" for your app (numeric ID)

#### Step 5.2: Build for Production

```bash
eas build --profile production --platform ios
```

#### Step 5.3: Submit to App Store

```bash
eas submit --platform ios --latest
```

Or manually:
1. Download the `.ipa` from EAS
2. Upload via Transporter app or `altool`

#### Step 5.4: Complete App Store Listing

In App Store Connect, provide:
- Screenshots (6.7", 6.5", 5.5" sizes)
- App description
- Keywords
- Privacy policy URL
- Age rating questionnaire

#### Step 5.5: Submit for Review

Click "Submit for Review" in App Store Connect. Review typically takes 24-48 hours.

---

### Android: Play Store Submission

#### Step 5.1: Create Play Console Entry

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details

#### Step 5.2: Create Service Account Key

For automated submissions:
1. Go to Play Console → Setup → API access
2. Create a service account with "Release manager" permissions
3. Download JSON key as `play-store-key.json`
4. Place in project root (add to `.gitignore`!)

#### Step 5.3: Build for Production

```bash
eas build --profile production --platform android
```

#### Step 5.4: Submit to Play Store

```bash
eas submit --platform android --latest
```

Or manually:
1. Download the `.aab` from EAS
2. Upload in Play Console → Production → Create release

#### Step 5.5: Complete Store Listing

In Play Console, provide:
- Screenshots (phone, tablet, optional)
- Feature graphic (1024x500)
- Short & full descriptions
- Privacy policy URL
- Content rating questionnaire
- Target audience settings

#### Step 5.6: Submit for Review

Click "Review and roll out" → "Start rollout to Production"

---

## Quick Reference: Common Commands

```bash
# Login to Expo
eas login

# Check login status
eas whoami

# Build development (iOS)
eas build --profile development --platform ios

# Build development (Android)
eas build --profile development --platform android

# Build both platforms
eas build --profile development --platform all

# Build production
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest

# List all builds
eas build:list

# Download/run latest build
eas build:run --platform ios --latest
eas build:run --platform android --latest

# Start dev server for development builds
yarn start --dev-client

# Check build status
eas build:view
```

---

## Timeline Estimate

| Phase | Task | Duration |
|-------|------|----------|
| **Setup** | Accounts, credentials, config | 1-2 hours |
| **Dev Build** | First iOS/Android build | 30 minutes |
| **Testing** | Test on devices | 1-2 days |
| **Preview** | Internal testing builds | 30 minutes |
| **Production** | Store listings, screenshots | 2-4 hours |
| **Review** | App Store review | 1-3 days |
| **Review** | Play Store review | 1-3 days |

**Total: ~1 week for first deployment**

---

## Troubleshooting

### "Device not registered"
```bash
eas device:create
```
Follow prompts to register your iPhone's UDID.

### "Provisioning profile" errors
```bash
eas credentials
```
Select iOS → manage credentials → regenerate profiles.

### Build fails with native module errors
Ensure Firebase config files are in place:
- `GoogleService-Info.plist` for iOS
- `google-services.json` for Android

### "The bundle identifier doesn't match"
Update `app.json` to match your App Store Connect bundle ID.

---

## Immediate Next Steps for You

Since you don't have Xcode (macOS 14), here's your path:

### For iOS (Physical iPhone):

```bash
# 1. Login to Expo
eas login

# 2. Build for your iPhone
eas build --profile development --platform ios

# 3. When prompted, register your device
# 4. Wait for build (~15-20 min)
# 5. Scan QR code with iPhone to install
# 6. Start dev server
yarn start --dev-client
```

### For Android (Physical Device):

```bash
# 1. Build APK
eas build --profile development --platform android

# 2. Wait for build (~10-15 min)
# 3. Download APK from build page
# 4. Install on Android device
# 5. Start dev server
yarn start --dev-client
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-03 | Initial deployment plan |
