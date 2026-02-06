# Frontend Authentication Implementation Plan

**Project:** RaineApp  
**Scope:** Social login implementation (Facebook, Instagram, LinkedIn, Apple)  
**Reference:** `systemic_view/2-AUTHENTICATION-IMPLEMENTATION-STUDY.md`

---

## Overview

The frontend authentication work implements social login flows for four providers, integrates them with Firebase Auth, and ensures the existing auth architecture (AuthContext, routing guards, MMKV persistence) continues to work seamlessly.

---

## Current State

### Already Implemented
- `AuthContext.tsx` - Auth state management with MMKV persistence ✅
- `auth.ts` - Email/password auth service (Firebase Auth SDK) ✅
- `socialAuth.ts` - Partial social auth (Facebook code exists, LinkedIn stub) ⚠️
- `login.tsx` - Login screen with 3 social buttons ✅
- `SocialButton.tsx` - UI component for social login buttons ✅
- `_layout.tsx` - Root navigation with auth-based routing guards ✅
- `react-native-fbsdk-next` - Facebook SDK installed ✅
- `expo-auth-session` - OAuth library installed ✅
- `expo-web-browser` - Browser for OAuth installed ✅
- Mock mode for development without Firebase ✅

### Gaps
| Component | Status | Issue |
|-----------|--------|-------|
| `socialAuth.ts` - Facebook | ⚠️ Code exists | Needs Facebook App ID configured |
| `socialAuth.ts` - Instagram | ⚠️ Stub | Currently just calls Facebook login |
| `socialAuth.ts` - LinkedIn | ❌ Not implemented | Returns error string |
| Apple Sign In | ❌ Missing | No code, no button |
| `app.json` | ⚠️ Incomplete | Missing Facebook App ID, URL schemes |
| `AuthContext.tsx` | ⚠️ Incomplete | No social login methods, has redundant Firestore profile creation |
| `SocialButton.tsx` | ⚠️ Incomplete | Missing Apple style |
| `types/auth.ts` | ⚠️ Incomplete | Missing `'apple'` provider type |

---

## Phase 1: Configuration & Types

**Owner:** LLM  
**Duration:** ~30 minutes  
**Blocked by:** Facebook App ID (human must create Facebook App first)

### Task 1.1: Update Type Definitions

**File:** `src/types/auth.ts`

**Changes:**
```typescript
// Before
export type SocialProvider = 'instagram' | 'facebook' | 'linkedin';

// After
export type SocialProvider = 'instagram' | 'facebook' | 'linkedin' | 'apple';
```

### Task 1.2: Update app.json

**File:** `app.json`

**Changes:**
- Add Facebook App ID and URL scheme
- Add Facebook SDK configuration for iOS
- Add Facebook manifest placeholders for Android

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.raine.app",
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["fb{FACEBOOK_APP_ID}"]
          }
        ],
        "FacebookAppID": "{FACEBOOK_APP_ID}",
        "FacebookClientToken": "{FACEBOOK_CLIENT_TOKEN}",
        "FacebookDisplayName": "Raine",
        "LSApplicationQueriesSchemes": ["fbapi", "fbauth2"]
      }
    },
    "android": {
      "package": "com.raine.app",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      ["expo-router", {"root": "src/app"}],
      "expo-dev-client",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      ["react-native-fbsdk-next", {
        "appID": "{FACEBOOK_APP_ID}",
        "clientToken": "{FACEBOOK_CLIENT_TOKEN}",
        "displayName": "Raine",
        "scheme": "fb{FACEBOOK_APP_ID}"
      }]
    ]
  }
}
```

**Note:** `{FACEBOOK_APP_ID}` and `{FACEBOOK_CLIENT_TOKEN}` are placeholders - human replaces after creating Facebook App.

### Task 1.3: Create LinkedIn Config

**File:** `src/config/linkedin.ts` (NEW)

```typescript
export const LINKEDIN_CONFIG = {
  clientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || '',
  scopes: ['openid', 'profile', 'email'],
  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
};
```

### Task 1.4: Configure Cloud Functions Region

**File:** `src/config/firebase.ts` or where functions are imported (NEW or updated)

**Critical:** All Cloud Functions are deployed to `us-west2`. The default region for the Firebase Functions SDK is `us-central1`. Every `functions()` call must specify the region.

```typescript
// Helper for all callable function invocations
import functions from '@react-native-firebase/functions';

export const getCallableFunctions = () => functions().region('us-west2');
```

**All existing code calling `functions().httpsCallable(...)` must change to `getCallableFunctions().httpsCallable(...)`.**

---

## Phase 2: Facebook & Instagram Implementation

**Owner:** LLM  
**Duration:** ~1 hour

### Task 2.1: Update socialAuth.ts - Facebook

**File:** `src/services/firebase/socialAuth.ts`

**Changes:**
- The Facebook implementation already exists and is correct
- Verify permissions requested: `['public_profile', 'email']`
- No code changes needed if Facebook App is properly configured

### Task 2.2: Update socialAuth.ts - Instagram

**File:** `src/services/firebase/socialAuth.ts`

**Changes:**
- Instagram login uses Facebook SDK under the hood (Instagram is owned by Meta)
- Users authenticate with their Facebook-linked Instagram account
- Request same permissions as Facebook: `['public_profile', 'email']`
- The existing code already does this (calls `signInWithFacebook()`)
- Optionally: differentiate the UX flow by adding `loginBehavior` option

**Current code is functionally correct:**
```typescript
export async function signInWithInstagram(): Promise<SocialAuthResult> {
  const result = await signInWithFacebook();
  return { ...result, provider: 'instagram' };
}
```

**Important UX Decision:**
Instagram and Facebook both use the Facebook SDK. The user will see a Facebook login dialog regardless of which button they tap. Options:
1. **Keep both buttons** - user chooses familiarity (some prefer "Instagram", others "Facebook")
2. **Merge into one "Continue with Meta"** - technically honest but less familiar
3. **Keep as-is** - both work, same underlying flow

**Recommendation:** Keep both buttons. Users identify with their preferred platform.

### Task 2.3: Add Facebook SDK Initialization

**File:** `src/config/facebook.ts` (NEW)

```typescript
import { Platform } from 'react-native';

export function initializeFacebookSDK() {
  try {
    const { Settings } = require('react-native-fbsdk-next');
    if (Platform.OS === 'ios') {
      Settings.initializeSDK();
    }
  } catch (error) {
    console.warn('Facebook SDK initialization failed:', error);
  }
}
```

**File:** `src/app/_layout.tsx`

**Changes:**
- Call `initializeFacebookSDK()` in root layout `useEffect`

---

## Phase 3: LinkedIn Implementation

**Owner:** LLM  
**Duration:** ~1-2 hours

### Task 3.1: Implement LinkedIn OAuth Flow

**File:** `src/services/firebase/socialAuth.ts`

**Changes:**
- Implement `signInWithLinkedIn()` using `expo-auth-session`
- Open LinkedIn OAuth in system browser
- Receive authorization code via redirect
- Call backend Cloud Function `linkedInExchangeCode` to get Firebase custom token
- Sign in to Firebase with custom token

**Implementation:**
```typescript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// LinkedIn backend endpoint (onRequest, NOT onCall - user isn't authenticated yet)
const LINKEDIN_EXCHANGE_URL = 
  'https://us-west2-raineapp-backend.cloudfunctions.net/linkedInExchangeCode';

export async function signInWithLinkedIn(): Promise<SocialAuthResult> {
  if (isFirebaseMockMode()) {
    const { loginAsMockUser } = await import('./mock/mockAuth');
    loginAsMockUser();
    return { success: true, provider: 'linkedin' };
  }

  try {
    const auth = (await import('@react-native-firebase/auth')).default;
    
    const { LINKEDIN_CONFIG } = await import('../../config/linkedin');
    
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'raine',
      path: 'oauth/linkedin',
    });
    
    const discovery = {
      authorizationEndpoint: LINKEDIN_CONFIG.authorizationEndpoint,
      tokenEndpoint: LINKEDIN_CONFIG.tokenEndpoint,
    };
    
    const request = new AuthSession.AuthRequest({
      clientId: LINKEDIN_CONFIG.clientId,
      scopes: LINKEDIN_CONFIG.scopes,
      redirectUri,
      usePKCE: false,
    });
    
    const result = await request.promptAsync(discovery);
    
    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { success: false, error: 'Sign in cancelled', provider: 'linkedin' };
    }
    
    if (result.type !== 'success' || !result.params.code) {
      return { success: false, error: 'Authentication failed', provider: 'linkedin' };
    }
    
    // Exchange code for Firebase custom token via backend HTTP endpoint
    // NOTE: This uses fetch(), NOT httpsCallable(), because the backend
    // function is onRequest (user is not authenticated at this point)
    const response = await fetch(LINKEDIN_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: result.params.code,
        redirectUri,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.customToken) {
      return { 
        success: false, 
        error: data.error || 'Token exchange failed', 
        provider: 'linkedin' 
      };
    }
    
    // Sign in to Firebase with custom token
    await auth().signInWithCustomToken(data.customToken);
    
    return { success: true, provider: 'linkedin' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'LinkedIn sign in failed';
    return { success: false, error: message, provider: 'linkedin' };
  }
}
```

**Why `fetch()` instead of `httpsCallable()`:**  
The backend `linkedInExchangeCode` is implemented as `onRequest` (HTTP endpoint), NOT `onCall` (callable). This is because the user is not authenticated when making this call - they're in the process of authenticating. `onCall` requires a Firebase Auth token in the request header, which doesn't exist yet.

**Dependencies:**
- Backend `linkedInExchangeCode` Cloud Function must be deployed (as `onRequest`)
- LinkedIn App created in LinkedIn Developer Portal
- `EXPO_PUBLIC_LINKEDIN_CLIENT_ID` environment variable set

### Task 3.2: Update socialSignOut

**File:** `src/services/firebase/socialAuth.ts`

**Changes:**
- No LinkedIn-specific sign out needed (handled by Firebase)
- Current implementation is sufficient

---

## Phase 4: Apple Sign In Implementation

**Owner:** LLM  
**Duration:** ~1 hour

### Task 4.1: Install Apple Auth Package

**Owner:** Human

```bash
cd /path/to/RaineApp
yarn add @invertase/react-native-apple-authentication
```

### Task 4.2: Update app.json

**File:** `app.json`

**Changes:**
- Add Apple Sign In entitlement for iOS

```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    }
  }
}
```

### Task 4.3: Create Apple Auth Service

**File:** `src/services/firebase/appleAuth.ts` (NEW)

```typescript
import { Platform } from 'react-native';
import type { SocialAuthResult } from './socialAuth';

export async function signInWithApple(): Promise<SocialAuthResult> {
  if (Platform.OS !== 'ios') {
    return { success: false, error: 'Apple Sign In is only available on iOS', provider: 'apple' };
  }

  try {
    const { appleAuth } = await import('@invertase/react-native-apple-authentication');
    const auth = (await import('@react-native-firebase/auth')).default;

    // Perform Apple auth request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure identityToken is available
    if (!appleAuthRequestResponse.identityToken) {
      return { success: false, error: 'Apple Sign In failed - no identity token', provider: 'apple' };
    }

    // Create Firebase credential
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Sign in to Firebase
    const userCredential = await auth().signInWithCredential(appleCredential);

    // Apple may provide name only on first sign-in
    // Update display name if provided
    const { fullName } = appleAuthRequestResponse;
    if (fullName?.givenName && !userCredential.user.displayName) {
      const displayName = [fullName.givenName, fullName.familyName]
        .filter(Boolean)
        .join(' ');
      await userCredential.user.updateProfile({ displayName });
    }

    return { success: true, provider: 'apple' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Apple Sign In failed';
    
    // Check for user cancellation
    if (message.includes('1001') || message.includes('canceled')) {
      return { success: false, error: 'Sign in cancelled', provider: 'apple' };
    }
    
    return { success: false, error: message, provider: 'apple' };
  }
}
```

---

## Phase 5: UI Updates

**Owner:** LLM  
**Duration:** ~1 hour

### Task 5.1: Update SocialButton Component

**File:** `src/components/ui/SocialButton.tsx`

**Changes:**
- Add Apple styling
- Add icons (optional but improves UX)
- Handle platform-specific rendering (Apple only on iOS)

```typescript
const providerStyles: Record<SocialProvider, { label: string; className: string }> = {
  instagram: {
    label: 'Continue with Instagram',
    className: 'bg-pink-600',
  },
  facebook: {
    label: 'Continue with Facebook',
    className: 'bg-[#1877F2]',
  },
  linkedin: {
    label: 'Continue with LinkedIn',
    className: 'bg-[#0A66C2]',
  },
  apple: {
    label: 'Continue with Apple',
    className: 'bg-black',
  },
};
```

### Task 5.2: Update Login Screen

**File:** `src/app/(auth)/login.tsx`

**Changes:**
- Add Apple Sign In button (iOS only)
- Import `signInWithApple` from appleAuth
- Update `handleSocialLogin` to handle 'apple' provider
- Adjust layout/spacing for 4 buttons (iOS) or 3 buttons (Android)

```typescript
import { Platform } from 'react-native';
import { signInWithApple } from '../../services/firebase/appleAuth';

// In handleSocialLogin:
const result =
  provider === 'apple'
    ? await signInWithApple()
    : provider === 'instagram'
      ? await signInWithInstagram()
      : provider === 'facebook'
        ? await signInWithFacebook()
        : await signInWithLinkedIn();

// In render:
<View className="space-y-4">
  {Platform.OS === 'ios' && (
    <SocialButton provider="apple" onPress={() => handleSocialLogin('apple')} disabled={!!loading} />
  )}
  <SocialButton provider="instagram" onPress={() => handleSocialLogin('instagram')} disabled={!!loading} />
  <SocialButton provider="facebook" onPress={() => handleSocialLogin('facebook')} disabled={!!loading} />
  <SocialButton provider="linkedin" onPress={() => handleSocialLogin('linkedin')} disabled={!!loading} />
</View>
```

### Task 5.3: Update AuthContext

**File:** `src/features/auth/AuthContext.tsx`

**Changes:**
- Add `socialLogin` method to context (wrapper for all social auth)
- Remove redundant Firestore profile creation (backend `onUserCreate` handles this)
- Add provider tracking

```typescript
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: SocialProvider) => Promise<SocialAuthResult>;  // NEW
  logout: () => Promise<void>;
  reset: (email: string) => Promise<void>;
}
```

**Key change - remove Firestore profile creation from `register`:**

The backend `onUserCreate` trigger already creates the Firestore profile. The current frontend code duplicates this:

```typescript
// REMOVE this block from register():
if (!isFirebaseMockMode()) {
  const firestore = require('@react-native-firebase/firestore').default;
  const profile = { ... };
  await createUserProfile(credential.user.uid, profile);
}
```

The backend trigger fires automatically on any auth method (email, social, Apple). No frontend Firestore write needed.

---

## Phase 6: Error Handling & Edge Cases

**Owner:** LLM  
**Duration:** ~30 minutes

### Task 6.1: Handle Account Linking

When a user signs up with Facebook, then later tries to sign in with Apple using the same email, Firebase may throw `auth/account-exists-with-different-credential`.

**File:** `src/services/firebase/socialAuth.ts`

**Add error handler:**
```typescript
function handleAuthError(error: any, provider: SocialProvider): SocialAuthResult {
  const code = error?.code || '';
  
  if (code === 'auth/account-exists-with-different-credential') {
    return {
      success: false,
      error: 'An account with this email already exists. Try signing in with a different method.',
      provider,
    };
  }
  
  if (code === 'auth/user-disabled') {
    return {
      success: false,
      error: 'This account has been disabled. Contact support.',
      provider,
    };
  }
  
  if (code === 'auth/network-request-failed') {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
      provider,
    };
  }
  
  return {
    success: false,
    error: error?.message || `${provider} sign in failed`,
    provider,
  };
}
```

### Task 6.2: Handle Cancelled Flows

Ensure all providers handle user cancellation gracefully:
- Facebook: `result.isCancelled` ✅ Already handled
- LinkedIn: `result.type === 'cancel'` ✅ In new implementation
- Apple: Error code `1001` ✅ In new implementation

### Task 6.3: Loading State Per Button

Current loading state disables all buttons when one is loading. This is correct behavior - prevent multiple auth attempts.

No changes needed.

### Task 6.4: Update Mock Mode

**File:** `src/services/firebase/mock/mockAuth.ts`

Ensure mock mode handles all 4 providers:
- Facebook mock ✅ Already works
- Instagram mock ✅ Calls Facebook mock
- LinkedIn mock → Add mock
- Apple mock → Add mock

---

## Phase 7: EAS Rebuild

**Owner:** Human  
**Duration:** ~20 minutes

After all code changes are complete, rebuild the app to include native configuration:

```bash
cd /path/to/RaineApp

# Rebuild for iOS simulator (fastest for testing)
eas build --profile development-simulator --platform ios

# Rebuild for Android
eas build --profile development --platform android
```

**Why rebuild is required:**
- Facebook SDK needs native configuration (Info.plist / AndroidManifest)
- Apple Sign In needs entitlement
- LinkedIn OAuth redirect URI registered
- Native modules updated

---

## Phase 8: Testing

**Owner:** Human + LLM  
**Duration:** ~1-2 hours

### Test Matrix

| Provider | iOS Simulator | iOS Device | Android Emulator | Android Device |
|----------|:---:|:---:|:---:|:---:|
| Facebook | ⚠️ Limited | ✅ Full | ⚠️ Limited | ✅ Full |
| Instagram | ⚠️ Limited | ✅ Full | ⚠️ Limited | ✅ Full |
| LinkedIn | ✅ Works | ✅ Full | ✅ Works | ✅ Full |
| Apple | ❌ No sim | ✅ Full | N/A | N/A |

**Note:** Facebook SDK has limited functionality on simulators/emulators. Use physical devices for full testing.

### Test Scenarios

#### Scenario 1: Fresh Facebook Login
1. Tap "Continue with Facebook"
2. Facebook native dialog appears
3. Enter test account credentials
4. Grant permissions
5. **Expected:** Redirected to profile setup screen
6. **Verify:** User document in Firestore with `authProvider: "facebook.com"`

#### Scenario 2: Fresh Instagram Login
1. Tap "Continue with Instagram"
2. Facebook dialog appears (expected - Instagram uses Facebook)
3. Enter credentials
4. **Expected:** Same as Facebook flow
5. **Verify:** User logged in

#### Scenario 3: Fresh LinkedIn Login
1. Tap "Continue with LinkedIn"
2. Browser opens LinkedIn login
3. Enter credentials, authorize
4. **Expected:** Browser closes, app shows profile setup
5. **Verify:** User document with `authProvider: "linkedin"`

#### Scenario 4: Fresh Apple Login (iOS)
1. Tap "Continue with Apple"
2. Apple Sign In sheet appears
3. Use Face ID / Touch ID
4. Choose email option (real or relay)
5. **Expected:** Profile setup screen
6. **Verify:** User document with `authProvider: "apple.com"`

#### Scenario 5: Return User
1. Close app completely
2. Reopen app
3. **Expected:** Goes directly to main app (session persisted in MMKV)

#### Scenario 6: Logout
1. Tap logout in settings
2. **Expected:** Redirected to onboarding/login screen
3. **Verify:** MMKV cleared, Firebase session ended

#### Scenario 7: Duplicate Account
1. Sign up with Facebook (email: test@example.com)
2. Sign out
3. Try to sign up with Apple (same email)
4. **Expected:** Clear error message about existing account

#### Scenario 8: Cancelled Login
1. Tap any social button
2. Cancel the login dialog
3. **Expected:** Back to login screen, no error shown (or "cancelled" message)

#### Scenario 9: No Network
1. Turn off WiFi/data
2. Tap any social button
3. **Expected:** Network error message

#### Scenario 10: Mock Mode
1. Run app in dev without Firebase config
2. Tap any social button
3. **Expected:** Mock user logged in, app navigates normally

---

## File Summary

### New Files (LLM Creates)
| File | Purpose |
|------|---------|
| `src/config/linkedin.ts` | LinkedIn OAuth configuration |
| `src/config/facebook.ts` | Facebook SDK initialization |
| `src/services/firebase/appleAuth.ts` | Apple Sign In implementation |

### Modified Files (LLM Edits)
| File | Changes |
|------|---------|
| `src/types/auth.ts` | Add `'apple'` to SocialProvider |
| `app.json` | Facebook config, Apple entitlement, fbsdk plugin |
| `src/services/firebase/socialAuth.ts` | Implement LinkedIn, add error handler |
| `src/features/auth/AuthContext.tsx` | Add `socialLogin`, remove redundant Firestore write |
| `src/components/ui/SocialButton.tsx` | Add Apple styling |
| `src/app/(auth)/login.tsx` | Add Apple button, use socialLogin |
| `src/app/_layout.tsx` | Call `initializeFacebookSDK()` |

### Human Tasks (Sequential)
| # | Task | When |
|---|------|------|
| 1 | Create Facebook App in Meta Developer Console | Before Phase 2 |
| 2 | Get Facebook App ID + Client Token | Before Phase 2 |
| 3 | Replace placeholders in `app.json` | Before Phase 7 |
| 4 | Create LinkedIn App in LinkedIn Developer Portal | Before Phase 3 |
| 5 | Set `EXPO_PUBLIC_LINKEDIN_CLIENT_ID` in `.env` | Before Phase 3 |
| 6 | Install `@invertase/react-native-apple-authentication` | Before Phase 4 |
| 7 | Enable Apple Sign In in Apple Developer Portal | Before Phase 4 |
| 8 | EAS rebuild (iOS + Android) | Phase 7 |
| 9 | Test on physical devices | Phase 8 |

### Dependencies Between Plans

| Frontend Task | Depends on Backend | Notes |
|---------------|-------------------|-------|
| Facebook login | Firebase Console: Facebook provider enabled | |
| Instagram login | Same as Facebook | Uses same Facebook SDK call |
| LinkedIn login | Backend `linkedInExchangeCode` deployed as `onRequest` | Frontend calls via `fetch()`, NOT `httpsCallable()` |
| Apple login | Firebase Console: Apple provider enabled | |
| All social logins | Backend `onUserCreate` trigger updated with provider tracking | |
| All callable functions | N/A | Must use `functions().region('us-west2')` - default is `us-central1` |
| Post-auth profile | `subscriptionStatus` enum alignment | Backend uses `"free"`, frontend must match |

### Critical Integration Notes

> **Region Override Required:** All `functions().httpsCallable()` calls MUST specify region `us-west2`. Default is `us-central1` which will cause "NOT_FOUND" errors. Use `functions().region('us-west2').httpsCallable(...)`.

> **LinkedIn is `fetch()`, not `httpsCallable()`:** The LinkedIn backend function is `onRequest` because the user isn't authenticated yet. Use `fetch()` with the full URL.

> **Instagram is Facebook:** The `signInWithInstagram()` function should simply call `signInWithFacebook()`. Do NOT request `instagram_basic` permission - that's for the Instagram content API, not authentication.

> **Apple displayName:** Apple only provides the user's name on the FIRST sign-in. The frontend must call `userCredential.user.updateProfile({ displayName })` immediately. On subsequent sign-ins, the name will come from the backend user document.

---

## Execution Order

```
Phase 1 (LLM)    → Types, configs, app.json prep
Phase 2 (LLM)    → Facebook/Instagram code (already mostly done)
Phase 3 (LLM)    → LinkedIn OAuth implementation
Phase 4 (LLM)    → Apple Sign In implementation
Phase 5 (LLM)    → UI updates (buttons, login screen, AuthContext)
Phase 6 (LLM)    → Error handling & edge cases
  ↓
Human fills in Facebook App ID / LinkedIn Client ID
  ↓
Phase 7 (Human)   → EAS rebuild
Phase 8 (Both)    → Testing on devices
```

**Total Frontend Effort:** ~5-6 hours (LLM) + ~3-4 hours (Human)
