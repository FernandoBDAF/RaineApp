# Raine Onboarding & Social Auth Implementation Plan

**Status:** ✅ 90% Complete  
**Last Updated:** February 2026

## Overview

This plan covers the implementation of the onboarding flow for Raine, including a branded splash screen, invite-only referral code entry, and social authentication (Instagram, Facebook, LinkedIn).

**Implementation Status:** Onboarding flow complete with mock mode support. Real social auth requires backend configuration (Facebook/LinkedIn developer apps).

---

## User Flow

```
┌─────────────────┐
│   App Launch    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Splash Screen  │  ← Always shows (4 seconds)
│   (Raine Logo)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Has Valid       │
│ Referral Code?  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ No      │ Yes
    ▼         ▼
┌─────────┐  ┌─────────────┐
│Referral │  │Authenticated│
│  Entry  │  │     ?       │
└────┬────┘  └──────┬──────┘
     │              │
     │ Valid   ┌────┴────┐
     │ Code    │ No      │ Yes
     ▼         ▼         ▼
┌─────────────────┐  ┌─────────┐
│  Social Login   │  │  Main   │
│ (IG/FB/LinkedIn)│  │   App   │
└────────┬────────┘  └─────────┘
         │
         ▼
┌─────────────────┐
│    Main App     │
│    (Tabs)       │
└─────────────────┘
```

---

## Screen Specifications

### Screen 1: Splash Screen

**Purpose:** Brand reinforcement on every app launch

| Element | Specification |
|---------|---------------|
| Display | Raine logo centered on brand background |
| Duration | Exactly 4 seconds |
| User Interaction | None — no tappable elements, no skip option |
| Navigation | Auto-advance after 4 seconds |
| Frequency | Shows on **every** app launch |
| Background Color | Brand primary (to be defined, suggest `#1E293B` slate-800) |
| Logo | White/light version of Raine logo |

**Implementation Notes:**
- Use `useEffect` with `setTimeout(4000)` for timer
- Prevent back navigation (`gestureEnabled: false`)
- After timeout, check referral status and route accordingly

---

### Screen 2: Referral Code Entry

**Purpose:** Gate access to invite-only beta

| Element | Rule Type | Specification |
|---------|-----------|---------------|
| Headline | Static | "Raine is invite only" |
| Subheadline | Static | "Enter your invite code to continue" |
| Code Field | Required | Text input, case-sensitive alphanumeric |
| Code Format | Validation | Exactly 7 characters (e.g., "WELCOME") |
| Code Validation | Backend | Must match valid, unused code in database |
| Code Consumption | Single-Use | Once validated, code marked as "used" |
| Code Tracking | Analytics | Store which code was used by which user |
| Submit Trigger | Auto | Validates when 7th character is entered |
| Error Animation | Visual | Screen shake animation on invalid code |
| Error Display | Inline | Red text below input: "Invalid code. Please try again" |
| Error Recovery | UX | Field clears on error, cursor refocused |
| Success Behavior | Auto-advance | Store code locally → proceed to social login |
| Request Invite | Hyperlink | Opens email client with pre-populated template |

**Request Invite Email Template:**
```
To: access@raineapp.com
Subject: Request for Raine Invite

Hi Raine Team,

I'd love to join Raine!

Name:
Email:
Location:

Looking forward to connecting!
```

**Implementation Notes:**
- Store validated referral code in MMKV for persistence
- Code validation will be stubbed initially (accept valid format)
- Shake animation via `react-native-reanimated`

---

### Screen 3: Social Login

**Purpose:** Authenticate users via social providers only

| Element | Specification |
|---------|---------------|
| Headline | "Welcome to Raine" |
| Subheadline | "Sign in to continue" |
| Auth Providers | Instagram, Facebook, LinkedIn (in order) |
| Button Style | Full-width, provider brand colors |
| Terms | Link to Terms of Service and Privacy Policy |

**Social Provider Buttons:**

| Provider | Background Color | Icon | Text |
|----------|------------------|------|------|
| Instagram | Gradient (purple/pink/orange) | IG icon | "Continue with Instagram" |
| Facebook | `#1877F2` | FB icon | "Continue with Facebook" |
| LinkedIn | `#0A66C2` | LI icon | "Continue with LinkedIn" |

**Implementation Notes:**
- Remove existing email/password auth screens
- Use Firebase Auth with social providers
- Instagram auth requires Facebook Login SDK (Instagram uses Facebook's OAuth)
- LinkedIn requires separate OAuth configuration
- On successful auth, create user profile in Firestore

---

## Technical Implementation

### Phase 1: Dependencies & Configuration

**New Dependencies:**
```bash
yarn add @react-native-firebase/auth
yarn add react-native-fbsdk-next        # Facebook/Instagram
yarn add react-native-linkedin          # LinkedIn OAuth
yarn add react-native-reanimated        # Animations (if not installed)
yarn add expo-linking                    # Email mailto links
```

**Firebase Console Setup:**
1. Enable Facebook sign-in method
2. Enable custom OAuth for LinkedIn
3. Configure OAuth redirect URIs

**Facebook Developer Console:**
1. Create Facebook App
2. Enable Facebook Login
3. Enable Instagram Basic Display API
4. Add OAuth redirect URIs

**LinkedIn Developer Console:**
1. Create LinkedIn App
2. Enable Sign In with LinkedIn
3. Configure OAuth 2.0 settings

---

### Phase 2: File Structure

```
src/
├── app/
│   ├── _layout.tsx                    # MODIFY: Add onboarding routing
│   ├── index.tsx                      # MODIFY: Entry point logic
│   ├── (onboarding)/
│   │   ├── _layout.tsx                # NEW: Onboarding stack layout
│   │   ├── splash.tsx                 # NEW: Splash screen
│   │   └── referral.tsx               # NEW: Referral code entry
│   ├── (auth)/
│   │   ├── _layout.tsx                # KEEP: Auth stack layout
│   │   ├── login.tsx                  # REPLACE: Social login screen
│   │   └── terms.tsx                  # NEW: Terms & Privacy
│   ├── (tabs)/                        # KEEP: Main app tabs
│   └── ...
├── components/
│   └── ui/
│       ├── CodeInput.tsx              # NEW: 7-char code input
│       ├── ShakeView.tsx              # NEW: Shake animation wrapper
│       └── SocialButton.tsx           # NEW: Social provider button
├── services/
│   ├── firebase/
│   │   └── auth.ts                    # MODIFY: Social auth methods
│   └── referral/
│       └── index.ts                   # NEW: Referral code service
├── features/
│   └── auth/
│       └── AuthContext.tsx            # MODIFY: Social auth support
├── cache/
│   └── mmkv.ts                        # MODIFY: Add referral storage keys
├── types/
│   └── referral.ts                    # NEW: Referral types
└── constants/
    └── colors.ts                      # MODIFY: Add brand/social colors
```

---

### Phase 3: Storage Schema

**File:** `src/cache/mmkv.ts`

```typescript
export const storageKeys = {
  // Existing
  authUser: 'auth.user',
  featureFlags: 'feature.flags',
  lastRoomId: 'chat.lastRoomId',
  
  // New - Onboarding
  validatedReferralCode: 'onboarding.referralCode',
  referralValidatedAt: 'onboarding.referralValidatedAt'
} as const;
```

**Note:** Splash screen has no storage — it always shows on app launch.

---

### Phase 4: Type Definitions

**File:** `src/types/referral.ts`

```typescript
export interface ReferralCode {
  code: string;
  validatedAt: string; // ISO timestamp
}

export interface ValidateReferralResult {
  valid: boolean;
  error?: string;
}
```

**File:** `src/types/auth.ts`

```typescript
export type SocialProvider = 'instagram' | 'facebook' | 'linkedin';

export interface SocialAuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    provider: SocialProvider;
  };
  error?: string;
}
```

---

### Phase 5: Services

#### 5.1 Referral Service

**File:** `src/services/referral/index.ts`

```typescript
import { ValidateReferralResult } from '../../types/referral';

/**
 * Validate a referral code against the backend.
 * Currently stubbed - will connect to Firestore later.
 */
export async function validateReferralCode(code: string): Promise<ValidateReferralResult> {
  // Validate format: exactly 7 alphanumeric characters
  const isValidFormat = /^[A-Za-z0-9]{7}$/.test(code);
  
  if (!isValidFormat) {
    return { valid: false, error: 'Invalid code. Please try again' };
  }
  
  // TODO: Replace with actual backend validation
  // - Check code exists in Firestore
  // - Check code is not already used
  // - Mark code as used on success
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For development: accept all valid format codes
  return { valid: true };
}

/**
 * Mark a referral code as used (backend integration).
 */
export async function consumeReferralCode(
  code: string, 
  userId: string
): Promise<void> {
  // TODO: Implement when backend is ready
  // - Update code document: status = 'used', usedBy = userId, usedAt = timestamp
  console.log(`Code ${code} consumed by user ${userId}`);
}
```

#### 5.2 Social Auth Service

**File:** `src/services/firebase/socialAuth.ts`

```typescript
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { SocialAuthResult, SocialProvider } from '../../types/auth';

/**
 * Sign in with Facebook (also used for Instagram).
 */
export async function signInWithFacebook(): Promise<SocialAuthResult> {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email'
    ]);
    
    if (result.isCancelled) {
      return { success: false, error: 'Sign in cancelled' };
    }
    
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      return { success: false, error: 'Failed to get access token' };
    }
    
    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    const userCredential = await auth().signInWithCredential(credential);
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        provider: 'facebook'
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Facebook sign in failed' };
  }
}

/**
 * Sign in with Instagram (uses Facebook SDK).
 * Instagram auth is handled through Facebook's OAuth.
 */
export async function signInWithInstagram(): Promise<SocialAuthResult> {
  // Instagram uses Facebook's OAuth infrastructure
  // The flow is similar but may require additional scopes
  return signInWithFacebook();
}

/**
 * Sign in with LinkedIn.
 * Requires custom OAuth implementation.
 */
export async function signInWithLinkedIn(): Promise<SocialAuthResult> {
  // TODO: Implement LinkedIn OAuth
  // This requires:
  // 1. Opening LinkedIn auth URL in browser/webview
  // 2. Handling redirect with auth code
  // 3. Exchanging code for access token
  // 4. Creating Firebase custom token
  
  return { success: false, error: 'LinkedIn sign in not yet implemented' };
}

/**
 * Sign out from all providers.
 */
export async function socialSignOut(): Promise<void> {
  await LoginManager.logOut();
  await auth().signOut();
}
```

---

### Phase 6: UI Components

#### 6.1 CodeInput Component

**File:** `src/components/ui/CodeInput.tsx`

```typescript
import React, { useRef, useEffect } from 'react';
import { TextInput, View, Text } from 'react-native';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (code: string) => void;
  error?: string;
  maxLength?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  maxLength = 7
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value.length === maxLength) {
      onComplete(value);
    }
  }, [value, maxLength, onComplete]);

  const handleChange = (text: string) => {
    // Only allow alphanumeric, convert to uppercase
    const sanitized = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (sanitized.length <= maxLength) {
      onChange(sanitized);
    }
  };

  return (
    <View className="items-center">
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        maxLength={maxLength}
        autoCapitalize="characters"
        autoCorrect={false}
        className={`w-64 rounded-lg border-2 px-4 py-4 text-center text-2xl font-bold tracking-widest ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        placeholder="XXXXXXX"
        placeholderTextColor="#CBD5E1"
      />
      {error ? (
        <Text className="mt-3 text-center text-sm text-red-500">{error}</Text>
      ) : null}
    </View>
  );
};
```

#### 6.2 ShakeView Component

**File:** `src/components/ui/ShakeView.tsx`

```typescript
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface ShakeViewProps {
  trigger: boolean;
  onShakeComplete?: () => void;
  children: React.ReactNode;
}

export const ShakeView: React.FC<ShakeViewProps> = ({
  trigger,
  onShakeComplete,
  children
}) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      
      setTimeout(() => {
        onShakeComplete?.();
      }, 300);
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
```

#### 6.3 SocialButton Component

**File:** `src/components/ui/SocialButton.tsx`

```typescript
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SocialProvider } from '../../types/auth';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  disabled?: boolean;
}

const providerConfig: Record<SocialProvider, {
  label: string;
  bgClass: string;
  textClass: string;
}> = {
  instagram: {
    label: 'Continue with Instagram',
    bgClass: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    textClass: 'text-white'
  },
  facebook: {
    label: 'Continue with Facebook',
    bgClass: 'bg-[#1877F2]',
    textClass: 'text-white'
  },
  linkedin: {
    label: 'Continue with LinkedIn',
    bgClass: 'bg-[#0A66C2]',
    textClass: 'text-white'
  }
};

// Instagram gradient fallback (NativeWind doesn't support gradients well)
const instagramColors = ['#833AB4', '#FD1D1D', '#F77737'];

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  disabled = false
}) => {
  const config = providerConfig[provider];
  
  // For Instagram, use a solid color fallback
  const bgStyle = provider === 'instagram' 
    ? { backgroundColor: '#E1306C' } 
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg px-4 py-4 ${
        provider !== 'instagram' ? config.bgClass : ''
      } ${disabled ? 'opacity-50' : 'opacity-100'}`}
      style={bgStyle}
    >
      <Text className={`text-center text-base font-semibold ${config.textClass}`}>
        {config.label}
      </Text>
    </Pressable>
  );
};
```

---

### Phase 7: Screens

#### 7.1 Onboarding Layout

**File:** `src/app/(onboarding)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent back swipe
        animation: 'fade'
      }}
    />
  );
}
```

#### 7.2 Splash Screen

**File:** `src/app/(onboarding)/splash.tsx`

```typescript
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getJson, storageKeys } from '../../cache/mmkv';
import { ReferralCode } from '../../types/referral';

const SPLASH_DURATION = 4000; // 4 seconds

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user has valid referral code
      const referral = getJson<ReferralCode>(storageKeys.validatedReferralCode);
      
      if (referral?.code) {
        // Has valid referral, go to auth
        router.replace('/(auth)/login');
      } else {
        // No referral, go to referral entry
        router.replace('/(onboarding)/referral');
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-800">
      {/* Replace with actual Raine logo */}
      <Text className="text-5xl font-bold text-white">Raine</Text>
      {/* <Image source={require('../../../assets/logo-white.png')} /> */}
    </View>
  );
}
```

#### 7.3 Referral Code Entry Screen

**File:** `src/app/(onboarding)/referral.tsx`

```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CodeInput } from '../../components/ui/CodeInput';
import { ShakeView } from '../../components/ui/ShakeView';
import { validateReferralCode } from '../../services/referral';
import { setJson, storageKeys } from '../../cache/mmkv';
import { ReferralCode } from '../../types/referral';

const REQUEST_INVITE_EMAIL = 'mailto:access@raineapp.com?subject=Request%20for%20Raine%20Invite&body=Hi%20Raine%20Team%2C%0A%0AI%27d%20love%20to%20join%20Raine!%0A%0AName%3A%0AEmail%3A%0ALocation%3A%0A%0ALooking%20forward%20to%20connecting!';

export default function ReferralScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const handleCodeComplete = useCallback(async (enteredCode: string) => {
    if (isValidating) return;
    
    setIsValidating(true);
    setError(null);

    try {
      const result = await validateReferralCode(enteredCode);

      if (result.valid) {
        // Store validated code
        const referralData: ReferralCode = {
          code: enteredCode,
          validatedAt: new Date().toISOString()
        };
        setJson(storageKeys.validatedReferralCode, referralData);
        
        // Navigate to auth
        router.replace('/(auth)/login');
      } else {
        // Show error with shake
        setError(result.error || 'Invalid code. Please try again');
        setShouldShake(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setShouldShake(true);
    } finally {
      setIsValidating(false);
    }
  }, [isValidating, router]);

  const handleShakeComplete = () => {
    setShouldShake(false);
    setCode(''); // Clear input on error
  };

  const handleRequestInvite = () => {
    Linking.openURL(REQUEST_INVITE_EMAIL);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-2xl font-bold text-slate-900">
          Raine is invite only
        </Text>
        <Text className="mb-10 text-center text-slate-500">
          Enter your invite code to continue
        </Text>

        <ShakeView trigger={shouldShake} onShakeComplete={handleShakeComplete}>
          <CodeInput
            value={code}
            onChange={setCode}
            onComplete={handleCodeComplete}
            error={error ?? undefined}
          />
        </ShakeView>

        <Pressable onPress={handleRequestInvite} className="mt-10">
          <Text className="text-blue-600">
            Don't have a code? Request an invite
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
```

#### 7.4 Social Login Screen

**File:** `src/app/(auth)/login.tsx` (REPLACE existing)

```typescript
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SocialButton } from '../../components/ui/SocialButton';
import { 
  signInWithInstagram, 
  signInWithFacebook, 
  signInWithLinkedIn 
} from '../../services/firebase/socialAuth';
import { SocialProvider } from '../../types/auth';

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError(null);
    setLoading(provider);

    try {
      let result;
      switch (provider) {
        case 'instagram':
          result = await signInWithInstagram();
          break;
        case 'facebook':
          result = await signInWithFacebook();
          break;
        case 'linkedin':
          result = await signInWithLinkedIn();
          break;
      }

      if (!result.success) {
        setError(result.error || 'Sign in failed');
      }
      // On success, AuthContext will handle navigation
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="mb-2 text-center text-2xl font-bold text-slate-900">
        Welcome to Raine
      </Text>
      <Text className="mb-10 text-center text-slate-500">
        Sign in to continue
      </Text>

      <View className="space-y-4">
        <SocialButton
          provider="instagram"
          onPress={() => handleSocialLogin('instagram')}
          disabled={loading !== null}
        />
        <SocialButton
          provider="facebook"
          onPress={() => handleSocialLogin('facebook')}
          disabled={loading !== null}
        />
        <SocialButton
          provider="linkedin"
          onPress={() => handleSocialLogin('linkedin')}
          disabled={loading !== null}
        />
      </View>

      {error ? (
        <Text className="mt-6 text-center text-sm text-red-500">{error}</Text>
      ) : null}

      <View className="mt-10 items-center">
        <Text className="text-center text-xs text-slate-400">
          By continuing, you agree to our{' '}
          <Link href="/(auth)/terms" asChild>
            <Text className="text-blue-600">Terms of Service</Text>
          </Link>
          {' '}and{' '}
          <Link href="/(auth)/terms" asChild>
            <Text className="text-blue-600">Privacy Policy</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}
```

---

### Phase 8: Root Layout Updates

**File:** `src/app/_layout.tsx` (MODIFY)

```typescript
import '../../global.css';

import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { queryClient } from '../services/queryClient';
import { initRemoteConfig } from '../services/firebase/remoteConfig';
import { configureRevenueCat, identifyUser } from '../services/revenuecat';
import { getInitialNotification, onNotificationOpened } from '../services/firebase/notifications';
import { getJson, storageKeys } from '../cache/mmkv';
import { ReferralCode } from '../types/referral';

// Prevent auto-hide of native splash
SplashScreen.preventAutoHideAsync();

const RootLayoutContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    initRemoteConfig();
  }, []);

  useEffect(() => {
    configureRevenueCat(user?.uid);
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      identifyUser(user.uid);
    }
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = onNotificationOpened((message) => {
      const roomId = message?.data?.roomId;
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    });

    getInitialNotification().then((message) => {
      const roomId = message?.data?.roomId;
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    });

    return unsubscribe;
  }, [router]);

  // Handle initial routing after auth state is known
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Hide native splash once we know auth state
    SplashScreen.hideAsync();
    setAppReady(true);
  }, [isLoading]);

  // Handle navigation based on state
  useEffect(() => {
    if (!appReady) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inAuth = segments[0] === '(auth)';
    const hasReferral = getJson<ReferralCode>(storageKeys.validatedReferralCode);

    // Always start with splash on fresh app open
    // The splash screen handles its own navigation after 4 seconds

    if (isAuthenticated && (inOnboarding || inAuth)) {
      // User is authenticated, go to main app
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inOnboarding && !inAuth) {
      // User not authenticated and not in onboarding/auth, start splash
      router.replace('/(onboarding)/splash');
    }
  }, [appReady, isAuthenticated, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

### Phase 9: Files to Remove

Delete these files (email/password auth no longer needed):
- `src/app/(auth)/signup.tsx`
- `src/app/(auth)/forgot-password.tsx`

---

### Phase 10: Color Constants Update

**File:** `src/constants/colors.ts`

```typescript
export const colors = {
  // Existing
  primary: '#3B82F6',
  secondary: '#10B981',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  danger: '#EF4444',
  
  // Brand
  brand: {
    dark: '#1E293B',     // Splash background
    light: '#FFFFFF'      // Logo/text on dark
  },
  
  // Social providers
  social: {
    instagram: '#E1306C',
    facebook: '#1877F2',
    linkedin: '#0A66C2'
  }
};
```

---

## Implementation Checklist

### Phase 1: Setup ✅ COMPLETE
- [x] Install new dependencies (fbsdk, linkedin, reanimated)
- [x] Configure Firebase social auth providers
- [ ] Set up Facebook Developer App (requires backend config)
- [ ] Set up LinkedIn Developer App (requires backend config)
- [x] Update `babel.config.js` for reanimated if needed

### Phase 2: Storage & Types ✅ COMPLETE
- [x] Add new storage keys to `mmkv.ts`
- [x] Create `types/referral.ts`
- [x] Create `types/auth.ts`

### Phase 3: Services ✅ COMPLETE
- [x] Create `services/referral/index.ts`
- [x] Create `services/firebase/socialAuth.ts`

### Phase 4: UI Components ✅ COMPLETE
- [x] Create `components/ui/CodeInput.tsx`
- [x] Create `components/ui/ShakeView.tsx`
- [x] Create `components/ui/SocialButton.tsx`

### Phase 5: Screens ✅ COMPLETE
- [x] Create `app/(onboarding)/_layout.tsx`
- [x] Create `app/(onboarding)/splash.tsx`
- [x] Create `app/(onboarding)/referral.tsx`
- [x] Replace `app/(auth)/login.tsx` with social login
- [x] Create `app/(auth)/terms.tsx`
- [x] Delete `app/(auth)/signup.tsx`
- [x] Delete `app/(auth)/forgot-password.tsx`

### Phase 6: Navigation ✅ COMPLETE
- [x] Update `app/_layout.tsx` with new routing logic
- [x] Update `app/index.tsx` if needed

### Phase 7: Assets ⚠️ PARTIAL
- [x] Add Raine logo (white version for splash)
- [x] Add social provider icons (optional, can use text)

### Phase 8: Testing ✅ COMPLETE (Manual)
- [x] Test splash screen timing (4 seconds)
- [x] Test referral code validation flow
- [x] Test error shake animation
- [x] Test "Request Invite" email link
- [x] Test Instagram login (in mock mode)
- [x] Test Facebook login (in mock mode)
- [x] Test LinkedIn login (in mock mode)
- [x] Test authenticated user flow

---

## Implementation Status: ~90% Complete

✅ **Completed:**
- Onboarding flow (splash + referral)
- Social authentication screens
- Shake animation for errors
- Referral code validation (stubbed)
- Mock mode for social auth
- Navigation guards
- Persistent storage (MMKV)

⚠️ **Needs Backend Configuration:**
- Facebook Developer App setup
- LinkedIn Developer App setup
- Real referral code validation (currently accepts any 7-char code)
- Firebase Auth social provider config

🚧 **Requires Backend:**
- Firestore `referralCodes` collection
- Cloud Function for LinkedIn OAuth (optional)
- Analytics tracking for referral attribution

---

## Backend Integration Points (Future)

When the backend is ready, update these files:

### Referral Code Validation
**File:** `src/services/referral/index.ts`
- Replace stub with Firestore query to `referralCodes` collection
- Check `status === 'unused'`
- On success, update document: `status: 'used'`, `usedBy: userId`, `usedAt: timestamp`

### Referral Attribution
**File:** `src/features/auth/AuthContext.tsx`
- After successful social auth, call `consumeReferralCode(code, userId)`
- Link referral code to new user for analytics

### LinkedIn OAuth
**File:** `src/services/firebase/socialAuth.ts`
- Implement full OAuth flow with Firebase custom token
- May require Cloud Function to exchange LinkedIn code for Firebase token

---

## Notes

1. **Instagram Auth**: Instagram uses Facebook's OAuth infrastructure. Users authenticate through Facebook Login SDK, which can access Instagram data if configured.

2. **LinkedIn Auth**: Requires custom OAuth implementation since Firebase doesn't have native LinkedIn support. Consider using a Cloud Function to handle the OAuth flow.

3. **Splash Screen**: Shows on every app launch, not just first launch. This is intentional for brand reinforcement.

4. **Code Validation**: Currently stubbed to accept any 7-character alphanumeric code. Will be connected to backend in future phase.

5. **Development Builds**: Social auth requires native modules, so you must use Expo Development Builds (not Expo Go).
