# Mock Mode

## Overview

Mock mode is a development and testing mode in which all Firebase-dependent services are replaced with in-memory mock implementations. The app runs the full UI flow (onboarding, auth, profile setup, chat, navigation) without requiring real Firebase configuration, credentials, or network access.

## Why Mock Mode Exists

### 1. Facebook SDK Crash

Real social login (Facebook, Instagram) requires the Facebook SDK to be configured with a valid App ID via `app.json` plugins. When the SDK is present but unconfigured, calling `LoginManager.logInWithPermissions()` or loading the native module can crash the app. In development, the Facebook SDK is typically not configured, so social login is mocked to avoid these native crashes.

### 2. Firestore Permissions

The mock auth layer creates a user with uid `mock-user-123`. This user does not exist in Firebase Auth or Firestore security rules. If real Firestore were used with mock auth, all read and write operations would fail with permission denied. Mocking Firestore ensures the UI can simulate successful writes and reads.

### 3. Development Without Credentials

Developers can work on the full app UI without:
- `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)
- A configured Firebase project
- Network access to Firebase
- Facebook App ID or other social provider credentials

## How Mock Mode Is Detected

The flag is controlled in `src/config/environment.ts`:

```ts
export function isFirebaseMockMode() {
  return _firebaseMockMode || isDev;
}
```

`isFirebaseMockMode()` returns `true` when:
- `isDev` is `true` (i.e. `__DEV__` from React Native, meaning a development build), or
- `_firebaseMockMode` is `true`, set by the startup check in `_layout.tsx`

At app startup, `_layout.tsx` runs a Firebase check:
1. Imports `@react-native-firebase/app`
2. If `firebase.default.apps.length === 0`, or if the import throws, it calls `setFirebaseMockMode(true)`
3. Otherwise it calls `setFirebaseMockMode(false)`

Because of the `|| isDev` clause, mock mode is **always** enabled in development builds, regardless of whether Firebase config files are present. In production, mock mode is only active when Firebase failed to initialize.

## Mock Implementations Inventory

| Service | Location | Mock Behavior | Returns |
|---------|----------|---------------|---------|
| Auth | `mock/mockAuth.ts` | In-memory user state, simulated sign-in/sign-out | `currentUser`, sign-in result |
| Firestore | `firestore.ts` | No-op collection/doc API, empty snapshots | `{ docs: [] }`, `{ exists: false }` |
| Remote Config | `remoteConfig.ts` | Skip fetch, use `config.features` | Default flags from environment |
| Messaging | `notifications.ts` | Permission granted, fake FCM token | `1` (AUTHORIZED), `'mock-fcm-token-' + timestamp` |
| Users | `users.ts` | Skip Firestore, log only | `null`, no-op |
| Rooms | `rooms.ts` | Empty rooms, no-op create | `[]`, `null`, `'mock-room-' + timestamp` |
| Messages | `messages.ts` | Empty messages, no-op send/update | `[]`, `'mock-message-' + timestamp` |
| Profile | `profile/index.ts` | Skip Firestore writes, return URI as-is for upload | No-op, original `uri` |
| Bio | `bio/index.ts` | Skip Cloud Function, use local fallback | `buildFallbackBio(profile)` |
| Firebase App | `firebase.ts` | No real app | `null` |
| Social Auth | `socialAuth.ts` | Call `loginAsMockUser()`, skip SDK | `{ success: true, provider }` |

## The Mock User

When mock auth is used, a fixed mock user is available:

| Field | Value |
|-------|-------|
| uid | `mock-user-123` |
| email | `test@example.com` |
| displayName | `Test User` |
| photoURL | `https://i.pravatar.cc/150?u=test` |
| emailVerified | `true` |

Email/password sign-in in mock mode updates `email` and `displayName` from the provided email; `createUserWithEmailAndPassword` generates a unique uid with `mock-user-${Date.now()}`.

## Full Mock Flow: Tapping Instagram in Dev

When a user taps the Instagram sign-in button in a development build:

1. `signInWithInstagram()` in `socialAuth.ts` is called.
2. It delegates to `signInWithFacebook()` (Instagram uses Facebook auth).
3. `shouldUseRealFacebookSdk()` returns `false` because `isDev` is `true`.
4. `mockSocialLogin('facebook')` runs instead of loading the Facebook SDK.
5. `mockSocialLogin` calls `loginAsMockUser()` from `mockAuth.ts`.
6. `loginAsMockUser()` sets `currentUser` to the mock user and calls `notifyListeners()`.
7. Auth listeners (e.g. in `AuthContext`) receive the mock user.
8. `signInWithInstagram()` returns `{ success: true, provider: 'instagram' }`.
9. The app treats the user as authenticated and proceeds to profile setup or main tabs.
10. All subsequent Firestore, Storage, and Firebase API calls use mock implementations that return empty or placeholder data.

## Overriding Mock Mode for Real Firebase Testing

To test against real Firebase in a development build:

1. **Add Firebase and Facebook configuration.** Place `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) in the project, and add `react-native-fbsdk-next` to `app.json` plugins with a valid Facebook App ID.
2. **Override the mock check.** Modify `isFirebaseMockMode()` in `src/config/environment.ts` to temporarily exclude `isDev`, e.g. return only `_firebaseMockMode`, or introduce a debug flag that disables mock mode when set.
3. **Rebuild the native binary.** Run `npx expo prebuild --clean` and rebuild the dev client so native modules and config are picked up.

Alternatively, use a production or release build (`__DEV__ === false`), where mock mode is off unless Firebase failed to initialize.

## Production Behavior

In production, `isDev` (`__DEV__`) is `false`. Mock mode is active only when:
- `firebase.default.apps.length === 0` at startup, or
- The Firebase module fails to load

In those cases, `setFirebaseMockMode(true)` is called and the app runs with mocked Firebase services. For production deployments, Firebase and Facebook must be correctly configured so that the startup check succeeds and mock mode stays off.

---

## Cross-References

- [1-ARCHITECTURE.md](./1-ARCHITECTURE.md) — Environment module and mock mode activation
- [3-DESIGN-PATTERNS.md](./3-DESIGN-PATTERNS.md) — Mock substitution pattern and `isFirebaseMockMode()` usage
- [5-SERVICE-LAYER.md](./5-SERVICE-LAYER.md) — Service layer mock routing
- [../BUSINESS/4-BUSINESS-RULES.md](../BUSINESS/4-BUSINESS-RULES.md) — MM-1 (dev equals mock), MM-3, MM-4, MM-6
- [../BUSINESS/6-DECISION-LOG.md](../BUSINESS/6-DECISION-LOG.md) — Decision on `isFirebaseMockMode()` and dev mode
- `src/config/environment.ts` — `isFirebaseMockMode()`, `setFirebaseMockMode()`, `isDev`
- `src/app/_layout.tsx` — Firebase startup check
- `src/services/firebase/mock/mockAuth.ts` — Mock auth implementation
- `src/services/firebase/socialAuth.ts` — `shouldUseRealFacebookSdk()`, `mockSocialLogin()`
