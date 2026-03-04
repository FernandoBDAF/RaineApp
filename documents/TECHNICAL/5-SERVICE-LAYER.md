# Service Layer

> The service layer provides thin wrappers around external SDKs and APIs. Each service exports a consistent API with lazy loading to prevent native module crashes. This document describes the service inventory, Firebase integration patterns, RevenueCat usage, external APIs, and how to add new services.

---

## 1. Service Layer Overview

The service layer sits between the state layer (Zustand stores, React Query) and external systems (Firebase, RevenueCat, third-party APIs). Its responsibilities:

- **Abstraction**: Hide SDK specifics behind stable function signatures
- **Lazy loading**: Defer native module imports until first use to avoid crashes when native modules are not initialized
- **Initialization guard**: Auth services call `ensureFirebaseInitialized()` to fail fast if Firebase is not configured

Services are organized under `src/services/` with Firebase-related modules in `src/services/firebase/`. Non-Firebase services (RevenueCat, location, profile, bio, referral, activity) live at the top level of `src/services/`.

---

## 2. Service Inventory

| File | Purpose | Lazy loaded |
|------|---------|-------------|
| `firebase/firebase.ts` | Firebase app initialization; re-exports `auth`, `firestore` | No (runs at import) |
| `firebase/auth.ts` | Email/password auth (sign up, sign in, sign out, reset password) | No (direct import with `ensureFirebaseInitialized()`) |
| `firebase/firestore.ts` | Firestore instance factory (`getDb()`) | No (direct import) |
| `firebase/connections.ts` | Connection CRUD (add, set, update, delete, query) | No (uses `getDb()`) |
| `firebase/users.ts` | User profile CRUD and real-time listener | No (uses `getDb()`) |
| `firebase/rooms.ts` | Chat rooms (list, get, create) | No (uses `getDb()`) |
| `firebase/messages.ts` | Chat messages (listeners, pagination, send, reactions) | No (uses `getDb()`) |
| `firebase/notifications.ts` | FCM permission, token, handlers | Yes (lazy `require`) |
| `firebase/remoteConfig.ts` | Feature flags via Remote Config | Yes (lazy `require` in init) |
| `revenuecat/index.ts` | In-app purchases, offerings, customer info | Yes |
| `profile/index.ts` | Profile setup, photo upload, waitlist | No |
| `bio/index.ts` | AI bio generation via Cloud Function | No |
| `location/index.ts` | Zip lookup (city, state, county, approved status) | No |
| `referral/index.ts` | Referral code validation and consumption | No |
| `activity/index.ts` | Activity counts (intro requests, unread, etc.) | No |

---

## 3. Firebase Services Detail

### 3.1 Auth Flow

**Email/password auth** (`auth.ts`):

- Imports `auth` from `@react-native-firebase/auth` and `firebase` from `@react-native-firebase/app` directly at the top of the file
- `ensureFirebaseInitialized()` checks `firebase.apps.length` and throws if no app is initialized
- Every exported function (`signUp`, `signIn`, `signOut`, `resetPassword`, `onAuthStateChanged`) calls `ensureFirebaseInitialized()` before delegating to `auth()`
- `getFirebaseApp()` is a safe accessor that returns `null` instead of throwing when no app is initialized

### 3.2 Firestore Operations

- **Instance**: `getDb()` in `firestore.ts` imports `firestore` from `@react-native-firebase/firestore` directly and returns `firestore()`
- **Collections**: `users`, `rooms`, `connections`, `waitlist`; messages live in `rooms/{roomId}/messages` subcollection
- **Pattern**: Each domain module (`users`, `rooms`, `messages`, `connections`) uses `getDb()` or convenience accessors like `getConnectionsCollection()` to access its collection
- **Connections**: `connections.ts` provides full CRUD: `addConnection`, `setConnection`, `updateConnection`, `deleteConnection`, `getConnectionById`, `getConnectionsByConnectionUserUid`, and `cancelConnectionRequest`

### 3.3 Messaging (FCM)

- **Instance**: `getMessaging()` lazy-requires `@react-native-firebase/messaging` and returns the real Firebase Messaging instance
- **Permission**: `requestNotificationPermission()` checks Firebase `AuthorizationStatus.AUTHORIZED` or `PROVISIONAL`
- **Exports**: `getFcmToken()`, `onForegroundMessage()`, `onNotificationOpened()`, `getInitialNotification()`

---

## 4. Mock Implementations (Removed)

Mock mode and all mock implementations (`mockAuth`, mock Firestore collections, mock FCM, etc.) have been removed from the codebase. All services now operate against real Firebase. For historical context on how mock mode worked, see [TECHNICAL/8-MOCK-MODE.md](./8-MOCK-MODE.md).

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

2. **For Firebase services**, import the SDK directly and use `ensureFirebaseInitialized()` if calling auth, or use `getDb()` from `firestore.ts` for Firestore operations:

   ```ts
   import { getDb } from './firestore';

   const getMyCollection = () => getDb().collection('myCollection');

   export async function myOperation(id: string) {
     const doc = await getMyCollection().doc(id).get();
     return doc.data();
   }
   ```

3. **Use lazy loading for native modules** when the module can crash at import time:

   ```ts
   function getNativeModule() {
     return require('@some/native-module').default();
   }
   ```

4. **Document the service** in this inventory table and any relevant section.

---

## 8. Cross-References

| Document | Path |
|----------|------|
| Architecture | [1-ARCHITECTURE.md](./1-ARCHITECTURE.md) |
| Folder structure | [2-FOLDER-STRUCTURE.md](./2-FOLDER-STRUCTURE.md) |
| Design patterns | [3-DESIGN-PATTERNS.md](./3-DESIGN-PATTERNS.md) |
| Environment config | `src/config/environment.ts` |
| Firebase init | `src/services/firebase/firebase.ts` |
