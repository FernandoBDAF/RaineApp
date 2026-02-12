# Service Layer

> The service layer provides thin wrappers around external SDKs and APIs. Each service exports a consistent API and supports mock-mode substitution in development and when Firebase or native modules are not configured. This document describes the service inventory, Firebase integration patterns, mock implementation approach, RevenueCat usage, external APIs, and how to add new services.

---

## 1. Service Layer Overview

The service layer sits between the state layer (Zustand stores, React Query) and external systems (Firebase, RevenueCat, third-party APIs). Its responsibilities:

- **Abstraction**: Hide SDK specifics behind stable function signatures
- **Mock substitution**: Route to mock implementations when `isFirebaseMockMode()` or `isDev` is true
- **Lazy loading**: Defer native module imports until first use to avoid crashes when Firebase or other native modules are not initialized
- **Guard clauses**: Each function checks the environment before performing real I/O

Services are organized under `src/services/` with Firebase-related modules in `src/services/firebase/`. Non-Firebase services (RevenueCat, location, profile, bio, referral, activity) live at the top level of `src/services/`.

---

## 2. Service Inventory

| File | Purpose | Mock behavior | Lazy loaded |
|------|---------|---------------|-------------|
| `firebase/auth.ts` | Email/password auth (sign up, sign in, sign out, reset password) | Delegates to `mockAuth`; simulates auth state and listeners | Yes |
| `firebase/socialAuth.ts` | Social sign-in (Facebook, Instagram, LinkedIn) and sign-out | `mockSocialLogin` / `setMockUser`; logs and uses mock user | No (dynamic import on call) |
| `firebase/firestore.ts` | Firestore instance factory | Returns mock collections with no-op or empty results | Yes |
| `firebase/users.ts` | User profile CRUD and real-time listener | Returns `null` or empty; logs; no-op writes | No (uses `getDb()`) |
| `firebase/rooms.ts` | Chat rooms (list, get, create) | Returns `null` or empty rooms; logs; mock room IDs | No |
| `firebase/messages.ts` | Chat messages (listeners, pagination, send, reactions) | Empty messages; logs; mock message IDs | No |
| `firebase/notifications.ts` | FCM permission, token, handlers | Mock messaging object with stubbed methods | Yes |
| `firebase/remoteConfig.ts` | Feature flags | Uses `config.features` or default flags in memory | No (RC lazy in init) |
| `firebase/mock/mockAuth.ts` | Mock Firebase Auth implementation | Full in-memory auth with listeners, delays | N/A |
| `revenuecat/index.ts` | In-app purchases, offerings, customer info | Returns null/empty when not configured; warns | Yes |
| `profile/index.ts` | Profile setup, photo upload, waitlist | Skips Firestore/Storage; returns URI as-is | No |
| `bio/index.ts` | AI bio generation via Cloud Function | Falls back to `buildFallbackBio` when mock/no Firebase | No |
| `location/index.ts` | Zip lookup (city, state, county, approved status) | No mock; uses Zippopotam API + local county map | No |
| `referral/index.ts` | Referral code validation and consumption | Format-only validation; simulated delay; no backend | No |
| `activity/index.ts` | Activity counts (intro requests, unread, etc.) | Hardcoded mock counts; no real data source yet | No |

---

## 3. Firebase Services Detail

### 3.1 Auth Flow

**Email/password auth** (`auth.ts`):

- `getAuth()` returns `mockAuth` when `useMockAuth()` is true (i.e. `isFirebaseMockMode()` or `isDev`)
- Otherwise, lazy-requires `@react-native-firebase/auth` and returns the Firebase Auth instance
- Exported functions (`signUp`, `signIn`, `signOut`, `resetPassword`, `onAuthStateChanged`) all delegate to `getAuth()`

**Social auth** (`socialAuth.ts`):

- `shouldUseRealFacebookSdk()` returns false in dev or when Firebase mock mode is on
- When false: `signInWithFacebook` / `signInWithLinkedIn` call `mockSocialLogin()`, which imports `mockAuth` and calls `loginAsMockUser()`
- When true: uses `react-native-fbsdk-next` and Firebase Auth credentials
- `socialSignOut()` either sets mock user to null (mock path) or calls Facebook `LoginManager.logOut()` and Firebase `signOut()`

### 3.2 Firestore Operations

- **Instance**: `getDb()` in `firestore.ts` returns either a mock Firestore or the real Firestore, depending on `isFirebaseMockMode()`
- **Collections**: `users`, `rooms`, `waitlist`; messages live in `rooms/{roomId}/messages` subcollection
- **Pattern**: Each domain module (`users`, `rooms`, `messages`) uses `getDb()` or `getUsersCollection()` / `getRoomsCollection()` and checks `isFirebaseMockMode()` at each entry point
- **Mock Firestore**: Mock collections return empty snapshots, no-op `set`/`update`/`delete`, and empty arrays from `get()` and `onSnapshot()`

### 3.3 Messaging (FCM)

- **Instance**: `getMessaging()` returns a mock object in mock mode, or the real Firebase Messaging instance
- **Mock**: `requestPermission` returns `1` (AUTHORIZED), `getToken` returns a mock string, `onMessage`/`onNotificationOpenedApp` return no-op unsubscribe functions
- **Permission**: `requestNotificationPermission()` checks Firebase `AuthorizationStatus.AUTHORIZED` or `PROVISIONAL` when not mocked

---

## 4. Mock Implementation Pattern

### 4.1 mockAuth in Detail

`mockAuth` in `firebase/mock/mockAuth.ts` implements the same interface as Firebase Auth for the subset of operations used by `auth.ts`:

| Method | Behavior |
|--------|----------|
| `onAuthStateChanged(listener)` | Adds listener; calls it on next microtask with current user; returns unsubscribe |
| `signInWithEmailAndPassword(email, password)` | 500ms delay, sets `currentUser` from `MOCK_USER` with custom email, notifies listeners, returns `{ user }` |
| `createUserWithEmailAndPassword(email, password)` | 500ms delay, creates new user with `mock-user-{timestamp}` uid |
| `signOut()` | 200ms delay, sets `currentUser` to null, notifies listeners |
| `sendPasswordResetEmail(email)` | 300ms delay, logs to console |
| `currentUser` getter | Returns the in-memory user or null |

**State management**:

- `currentUser` and `listeners` are module-level
- `notifyListeners()` runs all registered listeners on state change
- `setMockUser(user)` and `loginAsMockUser()` are exported for tests and `socialAuth` mock path

**Why use mockAuth**:

- Allows full UI flow (onboarding, profile setup, chat) in development without a configured Firebase project
- Avoids crashes from uninitialized native modules
- Social login in dev always uses mock, so email auth must also use mock to stay consistent

---

## 5. RevenueCat Integration

### 5.1 Lazy Loading

The RevenueCat SDK is loaded via `require('react-native-purchases')` inside `getPurchases()`, not at top level. This avoids a `NativeEventEmitter` crash at import time when the native module is not fully initialized.

**Implementation**:

```ts
let _Purchases: any = null;
function getPurchases() {
  if (!_Purchases) {
    _Purchases = require('react-native-purchases').default;
  }
  return _Purchases!;
}
```

### 5.2 Why Lazy Load

- React Native native modules can fail to initialize if the app starts before the bridge is ready
- `react-native-purchases` registers event emitters at load time; loading lazily on first use reduces startup failure risk
- Avoid using `typeof import('react-native-purchases')` in conditions; Metro may resolve the import at bundle time and still load the native module

### 5.3 Configuration Guard

- `configureRevenueCat()` requires `EXPO_PUBLIC_REVENUECAT_API_KEY`; if empty, sets `revenueCatConfigured = false`
- All exported functions check `revenueCatConfigured`; when false, they warn and return null/empty instead of calling the SDK

---

## 6. External APIs

### 6.1 Zippopotam (Location)

`location/index.ts` calls `https://api.zippopotam.us/us/{zipCode}` to resolve city and state from a 5-digit US zip code. No mock is used; the service always hits the public API.

**Flow**:

- Validate format (`/^\d{5}$/`)
- Resolve county and approval status from local `zipToCounty.ts` map (Bay Area counties)
- Fetch from Zippopotam; on success, merge with county data
- On fetch failure but valid county: return partial result (city "Unknown", state "CA")

**Dependencies**: `zipToCounty.ts` defines `getCountyFromZip()` and `isApprovedZip()` using a static zip-to-county mapping for San Francisco Bay Area counties.

---

## 7. How to Add a New Service

### 7.1 Step-by-Step

1. **Create the service file** under `src/services/` (or `src/services/firebase/` for Firebase-backed services).

2. **Add the mock-mode guard** at the top of each exported function:

   ```ts
   import { isFirebaseMockMode } from '../../config/environment';

   export async function myOperation() {
     if (isFirebaseMockMode()) {
       // Log and return mock data or no-op
       return mockResult;
     }
     // Real implementation
   }
   ```

3. **Use lazy loading for native modules** when the module can crash at import time:

   ```ts
   function getNativeModule() {
     if (isFirebaseMockMode()) return mockModule;
     return require('@some/native-module').default();
   }
   ```

4. **Provide mock behavior** that:
   - Returns empty or null for reads when appropriate
   - Logs actions in dev (e.g. `console.log('🔶 [Mock] ...')`)
   - No-ops or returns synthetic IDs for writes
   - For real-time listeners, call the callback once with mock data and return an empty unsubscribe function

5. **Add a mock implementation module** if the service has complex state or listeners (e.g. `mockAuth`). Place it under `firebase/mock/` when it replaces a Firebase service.

6. **Document the service** in this inventory table and any relevant section.

### 7.2 Mock Mode Guard

Use `isFirebaseMockMode()` from `src/config/environment.ts`. It returns true when:

- `_firebaseMockMode` is set (by `_layout.tsx` startup check), or
- `isDev` (`__DEV__`) is true

In dev, mock mode is always enabled so that the UI can run without a configured backend.

---

## 8. Cross-References

| Document | Path |
|----------|------|
| Architecture | [1-ARCHITECTURE.md](./1-ARCHITECTURE.md) |
| Folder structure | [2-FOLDER-STRUCTURE.md](./2-FOLDER-STRUCTURE.md) |
| Design patterns | [3-DESIGN-PATTERNS.md](./3-DESIGN-PATTERNS.md) |
| Environment config | `src/config/environment.ts` |
| Firebase init / mock mode | `src/app/_layout.tsx` |
