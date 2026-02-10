# 4 -- Business Rules

> Canonical reference for every business rule encoded in the RaineApp codebase.
> Each rule is traceable to the file and code mechanism that enforces it.

---

## 1. Access Control

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| AC-1 | Invite-only access | Users must present a valid referral code before they can proceed to authentication. Without a validated code cached in MMKV, the splash screen redirects to the referral entry screen. | `src/app/(onboarding)/splash.tsx` | `getJson<ReferralCode>(storageKeys.validatedReferralCode)` checked after splash timer; absence routes to `/(onboarding)/referral`. |
| AC-2 | Referral code format | A referral code must be exactly 7 alphanumeric characters (upper or lower case, digits). Any other input is rejected client-side before any network call. | `src/services/referral/index.ts` | Regex validation: `/^[A-Za-z0-9]{7}$/`. Returns `{ valid: false }` on mismatch. |
| AC-3 | Referral code consumption | After successful validation, the code is "consumed" and bound to a user ID to prevent reuse. | `src/services/referral/index.ts` | `consumeReferralCode(code, userId)` logs the binding (stub implementation; production will write to Firestore). |
| AC-4 | Geographic restriction | The app is available only to residents of 8 Bay Area counties: San Francisco, Marin, Contra Costa, Alameda, San Mateo, Santa Clara, Sonoma, and Napa. | `src/constants/profile-options.ts`, `src/services/location/zipToCounty.ts` | `APPROVED_COUNTIES` array defines the allowed set. `isApprovedZip()` checks the user's ZIP code against `ZIP_COUNTY_MAP`, a hardcoded mapping of county to ZIP codes. |
| AC-5 | ZIP code validation | User-entered ZIP must be exactly 5 digits. Invalid ZIPs are rejected before any API call. | `src/services/location/index.ts` | Regex validation: `/^\d{5}$/`. Returns `{ valid: false }` on mismatch. |
| AC-6 | Out-of-area redirect | Users whose ZIP code resolves to a county outside the approved list are redirected to an out-of-area screen instead of proceeding with profile setup. | `src/app/(profile-setup)/location.tsx` | If `result.isApproved === false`, the router pushes `/(profile-setup)/out-of-area`. |
| AC-7 | ZIP lookup with fallback | ZIP code city/state resolution uses the Zippopotam.us API. If the API is unreachable but the ZIP is in the local `ZIP_COUNTY_MAP`, the lookup succeeds with a fallback (`city: 'Unknown'`, `state: 'CA'`). | `src/services/location/index.ts` | `catch` block in `lookupZipCode()` falls back to local county data when available. |
| AC-8 | Profile completion gate | Authenticated users who have not completed profile setup are redirected to their current profile setup step. They cannot access the main app tabs. | `src/app/_layout.tsx` | Navigation guard: `isAuthenticated && !profileCompleted && !inProfileSetupGroup` triggers `router.replace(STEP_TO_ROUTE[currentStep])`. |

---

## 2. Authentication

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| AUTH-1 | Social login only | The app exposes only social login providers (Facebook, Instagram, LinkedIn). There is no email/password authentication flow in the UI. | `src/services/firebase/socialAuth.ts` | Only `signInWithFacebook`, `signInWithInstagram`, and `signInWithLinkedIn` are exported. No email auth service exists. |
| AUTH-2 | Instagram delegates to Facebook | Instagram sign-in is implemented by calling the Facebook login flow and relabeling the provider. | `src/services/firebase/socialAuth.ts` | `signInWithInstagram()` calls `signInWithFacebook()` then spreads `{ ...result, provider: 'instagram' }`. |
| AUTH-3 | LinkedIn not yet implemented | LinkedIn login returns a failure with an explicit "not yet implemented" message in production. In dev, it falls through to mock auth. | `src/services/firebase/socialAuth.ts` | `signInWithLinkedIn()` returns `{ success: false, error: 'LinkedIn sign in not yet implemented' }` when not in mock mode. |
| AUTH-4 | Facebook SDK in production only | The real Facebook SDK (`react-native-fbsdk-next`) is used only when both conditions are true: (a) not in dev mode, and (b) Firebase mock mode is off. | `src/services/firebase/socialAuth.ts` | `shouldUseRealFacebookSdk()` returns `false` if `isDev` or `isFirebaseMockMode()`. Dynamic `import()` of the SDK is guarded by this check. |
| AUTH-5 | Facebook permissions | Facebook login requests `public_profile` and `email` permissions. | `src/services/firebase/socialAuth.ts` | `LoginManager.logInWithPermissions(['public_profile', 'email'])`. |
| AUTH-6 | Mock auth in development | In dev mode, all social login calls route to `mockSocialLogin()`, which invokes `loginAsMockUser()` from the mock auth module. | `src/services/firebase/socialAuth.ts` | `shouldUseRealFacebookSdk()` returns `false` in dev; `mockSocialLogin(provider)` is called instead. |
| AUTH-7 | Unauthenticated redirect | Any unauthenticated user navigating outside the onboarding or auth groups is redirected to the splash screen. | `src/app/_layout.tsx` | Navigation guard: `!isAuthenticated && !inOnboardingGroup && !inAuthGroup` triggers `router.replace('/(onboarding)/splash')`. |

---

## 3. Profile Setup

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| PS-1 | 14 mandatory steps | Profile setup consists of exactly 14 sequential steps. The constant `TOTAL_STEPS = 14` is the source of truth. | `src/constants/profile-options.ts` | `TOTAL_STEPS` constant and `STEP_TO_ROUTE` mapping (keys 1-14). |
| PS-2 | Step-to-route mapping | Each step number maps to a specific route. Steps: 1-Name, 2-Photo, 3-Location, 4-City Feel, 5-Children, 6-Before Motherhood, 7-Perfect Weekend, 8-Feel Yourself, 9-Hard Truth, 10-Unexpected Joys, 11-Aesthetic, 12-Mom Friends, 13-What Brought You, 14-Bio. | `src/constants/profile-options.ts` | `STEP_TO_ROUTE: Record<number, string>` maps each integer to its route path. |
| PS-3 | Step progression | Moving forward increments `currentStep` via `setCurrentStep()`. The store persists the current step so users resume where they left off. | `src/store/profileSetupStore.ts` | `setCurrentStep(currentStep)` updates Zustand state; persisted to MMKV via `persist` middleware. |
| PS-4 | Back navigation | Navigating backward decrements the step but never below 1. | `src/store/profileSetupStore.ts` | `decrementStep()` uses `Math.max(1, state.currentStep - 1)`. |
| PS-5 | Profile completion flag | Completion is marked by setting `completed: true`. This flag controls whether the navigation guard redirects users back into setup. | `src/store/profileSetupStore.ts` | `completeSetup()` sets `{ completed: true }`. Read by `_layout.tsx` as `profileCompleted`. |
| PS-6 | Profile reset | The entire profile can be reset to its initial state, clearing all fields and returning to step 1 with `completed: false`. | `src/store/profileSetupStore.ts` | `reset()` applies `initialState` object. |
| PS-7 | Persistent state | All profile setup data survives app restarts. The store is persisted under the key `"profile-setup"` using MMKV storage. | `src/store/profileSetupStore.ts` | Zustand `persist` middleware with `storage: mmkvStorage` and `name: "profile-setup"`. |
| PS-8 | City Feel options | Single-select from 3 options: Rooted, Still finding your footing, Like a local but missing where you're from. | `src/constants/profile-options.ts` | `CITY_FEEL_OPTIONS` array (3 items). Store field `cityFeel` accepts a single value (`null` or option ID). |
| PS-9 | Before Motherhood options | Multi-select from 6 options: Travel, Hosting, Movement, Nature, Culture, Career. | `src/constants/profile-options.ts` | `BEFORE_MOTHERHOOD_OPTIONS` array (6 items). Store field `beforeMotherhood` is an array. |
| PS-10 | Perfect Weekend options | Multi-select from 6 options: Adventure, Slow Mornings, Good Company, Discovery, Movement, Family. | `src/constants/profile-options.ts` | `PERFECT_WEEKEND_OPTIONS` array (6 items). Store field `perfectWeekend` is an array. |
| PS-11 | Feel Yourself options | Single-select from 4 options: Time alone, Partner time, Friends night, Change of scenery. | `src/constants/profile-options.ts` | `FEEL_YOURSELF_OPTIONS` array (4 items). Store field `feelYourself` accepts a single value. |
| PS-12 | Hard Truth options | Multi-select from 6 options: Losing myself, Recovery time, Mental load, Little sleep, Grief and joy, Relationship change. | `src/constants/profile-options.ts` | `HARD_TRUTH_OPTIONS` array (6 items). Store field `hardTruths` is an array. |
| PS-13 | Unexpected Joy options | Multi-select from 6 options: Deeper love, Person becoming, Body resilience, Partner as parent, Function on no sleep, Fierce instincts. | `src/constants/profile-options.ts` | `UNEXPECTED_JOY_OPTIONS` array (6 items). Store field `unexpectedJoys` is an array. |
| PS-14 | Aesthetic options | Multi-select from 6 options, each with an associated color swatch: Clean & minimal, Natural & textured, Classic & timeless, Eclectic & collected, Coastal casual, Refined essentials. | `src/constants/profile-options.ts` | `AESTHETIC_OPTIONS` array (6 items, each with `color` hex value). Store field `aesthetic` is an array. |
| PS-15 | Mom Friend Style options | Multi-select from 6 options: Coffee dates, Playdates, Group hangouts, Virtual chats, Weekend family hangs, Workout buddies. | `src/constants/profile-options.ts` | `MOM_FRIEND_STYLE_OPTIONS` array (6 items). Store field `momFriendStyle` is an array. |
| PS-16 | What Brought You options | Single-select from 4 options: New here, Friends without kids, Moms who get it, Deeper connections. | `src/constants/profile-options.ts` | `WHAT_BROUGHT_YOU_OPTIONS` array (4 items). Store field `whatBroughtYou` accepts a single value. |
| PS-17 | Bio step | The final step generates a bio text that requires user approval before setup is complete. | `src/store/profileSetupStore.ts` | `setBio(generatedBio, bioApproved)` stores both the text and the approval boolean. |

---

## 4. Feature Flags

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| FF-1 | Remote Config source | Feature flags are fetched from Firebase Remote Config at app startup. If the fetch fails, hardcoded defaults are used. | `src/services/firebase/remoteConfig.ts` | `initRemoteConfig()` calls `rc.fetchAndActivate()` inside a try/catch; on failure, `cachedFlags` retains `defaultFlags`. |
| FF-2 | chatReactionsEnabled | Controls whether chat reaction UI is available. Default: `true` (Remote Config), `true` (environment config). | `src/services/firebase/remoteConfig.ts`, `src/config/environment.ts` | `defaultFlags.chatReactionsEnabled = true`; `config.features.chatReactionsEnabled = true`. |
| FF-3 | newProfileUIEnabled | Controls whether a redesigned profile UI is shown. Default: `false` (Remote Config), `false` (environment config). | `src/services/firebase/remoteConfig.ts`, `src/config/environment.ts` | `defaultFlags.newProfileUIEnabled = false`; `config.features.newProfileUIEnabled = false`. |
| FF-4 | subscriptionGatingEnabled | Controls whether subscription-gated features are enforced. Default: `true` (Remote Config), `false` (environment config / mock mode). | `src/services/firebase/remoteConfig.ts`, `src/config/environment.ts` | Remote Config default: `true`. Environment config: `false` (comment: "Disabled in mock mode"). In mock mode, `initRemoteConfig()` uses `config.features` instead of `defaultFlags`. |
| FF-5 | Mock mode flag override | In mock mode, feature flags load from `config.features` (environment.ts) rather than Remote Config defaults, effectively disabling subscription gating. | `src/services/firebase/remoteConfig.ts` | `if (isFirebaseMockMode()) { cachedFlags = { ...config.features }; return; }`. |
| FF-6 | Hook-based consumption | Components consume feature flags via the `useFeatureFlag` hook, which accepts a typed union of flag keys and re-evaluates after Remote Config initializes. | `src/hooks/useFeatureFlag.ts` | `useFeatureFlag(key)` initializes state from `getFeatureFlag(key)`, then re-fetches after `initRemoteConfig()` resolves. |

---

## 5. Subscriptions

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| SUB-1 | RevenueCat integration | In-app subscriptions are managed through RevenueCat. Configuration requires the `EXPO_PUBLIC_REVENUECAT_API_KEY` environment variable. | `src/services/revenuecat/index.ts` | `configureRevenueCat()` reads `process.env.EXPO_PUBLIC_REVENUECAT_API_KEY`; skips configuration if empty. |
| SUB-2 | Premium entitlement | The premium tier is identified by the entitlement ID `"premium"`. Access is checked against `customerInfo.entitlements.active.premium`. | `src/app/subscription.tsx`, `src/hooks/useEntitlement.ts` | `useEntitlement('premium')` returns `hasAccess = Boolean(customerInfo?.entitlements?.active?.[entitlementId])`. |
| SUB-3 | Graceful degradation | If RevenueCat is not configured (no API key or initialization failure), all purchase-related functions return safe empty defaults instead of throwing. | `src/services/revenuecat/index.ts` | Each exported function checks `revenueCatConfigured`; if `false`, logs a warning and returns a stub response (e.g., `{ entitlements: { active: {} } }`). |
| SUB-4 | Lazy SDK loading | The RevenueCat native module is loaded lazily via `require()` to avoid `NativeEventEmitter` crashes at import time. | `src/services/revenuecat/index.ts` | `getPurchases()` uses a cached `require('react-native-purchases').default` call on first access. |
| SUB-5 | User identification | Authenticated users are identified to RevenueCat by their Firebase UID for cross-device entitlement tracking. | `src/app/_layout.tsx`, `src/services/revenuecat/index.ts` | `_layout.tsx` calls `identifyUser(user.uid)` when `user?.uid` changes. `identifyUser()` calls `Purchases.logIn(userId)`. |
| SUB-6 | Restore purchases | Users can restore previous purchases via `restorePurchases()`, which delegates to the RevenueCat SDK. | `src/app/subscription.tsx`, `src/services/revenuecat/index.ts` | Subscription screen renders a "Restore purchases" button bound to `restorePurchases()`. |

---

## 6. Navigation Guards

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| NAV-1 | Unauthenticated users | If the user is not authenticated and is not already in the `(onboarding)` or `(auth)` route groups, redirect to the splash screen. | `src/app/_layout.tsx` | `if (!isAuthenticated && !inOnboardingGroup && !inAuthGroup) router.replace('/(onboarding)/splash')`. |
| NAV-2 | Authenticated, incomplete profile | If the user is authenticated but has not completed profile setup, and is not already in the `(profile-setup)` group, redirect to their current setup step. | `src/app/_layout.tsx` | `if (isAuthenticated && !profileCompleted && !inProfileSetupGroup) router.replace(STEP_TO_ROUTE[currentStep])`. Falls back to `/(profile-setup)/name` if step is unmapped. |
| NAV-3 | Authenticated, complete profile | If the user is authenticated with a completed profile and is still in an onboarding, auth, or profile-setup route (excluding the welcome screen), redirect to the main tabs. | `src/app/_layout.tsx` | `if (isAuthenticated && profileCompleted && (inOnboardingGroup \|\| inAuthGroup \|\| inProfileSetupGroup) && !inWelcomeScreen) router.replace('/(tabs)')`. |
| NAV-4 | Welcome screen exception | The welcome screen within the profile-setup group is excluded from the NAV-3 redirect, allowing it to display after profile completion before the user enters the main app. | `src/app/_layout.tsx` | `const inWelcomeScreen = inProfileSetupGroup && segmentsList[1] === 'welcome'`; this flag exempts the route from the redirect. |
| NAV-5 | Guard dependencies | Navigation guards only run after the app is ready (auth state resolved, splash screen hidden). The `appReady` flag prevents premature redirects. | `src/app/_layout.tsx` | `if (!appReady) return;` at the top of the navigation guard `useEffect`. `appReady` is set to `true` after `isLoading` becomes `false`. |
| NAV-6 | Native splash screen | The Expo native splash screen is kept visible until auth state is resolved, preventing a white flash before navigation guards execute. | `src/app/_layout.tsx` | `SplashScreen.preventAutoHideAsync()` at module level; `SplashScreen.hideAsync()` called when `isLoading` becomes `false`. |

---

## 7. Content Rules

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| CR-1 | Splash screen duration | The custom splash screen displays for exactly 4 seconds before checking referral status and navigating. | `src/app/(onboarding)/splash.tsx` | `const SPLASH_DURATION_MS = 4000;` used in `setTimeout`. |
| CR-2 | Post-splash routing | After the splash timer, if a validated referral code exists in local cache, the user is sent to login. Otherwise, they are sent to the referral code entry screen. | `src/app/(onboarding)/splash.tsx` | `getJson<ReferralCode>(storageKeys.validatedReferralCode)` checked; presence routes to `/(auth)/login`, absence routes to `/(onboarding)/referral`. |
| CR-3 | Referral code format | 7-character alphanumeric string. Case-insensitive. No special characters, no whitespace. | `src/services/referral/index.ts` | Regex: `/^[A-Za-z0-9]{7}$/`. |
| CR-4 | Referral validation delay | A 500ms artificial delay is applied during referral code validation (simulating a network call to a future backend). | `src/services/referral/index.ts` | `await new Promise((resolve) => setTimeout(resolve, 500))` after format check passes. |
| CR-5 | ZIP code input length | The location screen enables the continue button only when the ZIP input is exactly 5 characters. | `src/app/(profile-setup)/location.tsx` | `const canContinue = useMemo(() => zipValue.length === 5, [zipValue])`. |
| CR-6 | Notification deep linking | Push notifications containing a `roomId` in their data payload deep-link to the corresponding chat room. | `src/app/_layout.tsx` | `onNotificationOpened` and `getInitialNotification` extract `message?.data?.roomId` and call `router.push(\`/room/${roomId}\`)`. |

---

## 8. Mock Mode

| # | Rule | Description | Where Enforced | How Enforced |
|---|------|-------------|----------------|--------------|
| MM-1 | Dev equals mock | In development (`__DEV__ === true`), Firebase mock mode is always enabled regardless of whether Firebase config files are present. | `src/config/environment.ts` | `isFirebaseMockMode()` returns `_firebaseMockMode \|\| isDev`. Since `isDev = __DEV__`, dev always resolves to `true`. |
| MM-2 | Auto-detection at startup | At app launch, the root layout checks for initialized Firebase apps. If none exist (no config files) or if the import fails, mock mode is activated. | `src/app/_layout.tsx` | `RootLayout` runs `checkFirebase()`: inspects `firebase.default.apps.length`; calls `setFirebaseMockMode(true)` if zero or on error. |
| MM-3 | All Firebase services mocked | When mock mode is active, all Firebase-dependent services (auth, Firestore, Remote Config, Storage) use mock implementations. No real Firestore writes or reads occur. | `src/config/environment.ts`, `src/services/firebase/socialAuth.ts`, `src/services/firebase/remoteConfig.ts` | Each service checks `isFirebaseMockMode()` and branches to mock behavior. Auth uses `loginAsMockUser()`, Remote Config uses `config.features` defaults. |
| MM-4 | Force mock mode | A configuration flag allows forcing mock mode even when Firebase config files are present. | `src/config/environment.ts` | `config.firebase.forceMockMode: false` (default off; can be set to `true`). |
| MM-5 | RevenueCat disabled in mock | Without the `EXPO_PUBLIC_REVENUECAT_API_KEY` environment variable (typical in dev), RevenueCat is not configured and all purchase functions return safe stubs. | `src/services/revenuecat/index.ts` | `configureRevenueCat()` exits early if `apiKey` is empty; `revenueCatConfigured` remains `false`; all functions check this flag before calling the SDK. |
| MM-6 | Feature flag override in mock | In mock mode, Remote Config is not fetched. Feature flags are sourced from `config.features` in environment.ts, which sets `subscriptionGatingEnabled: false`. | `src/services/firebase/remoteConfig.ts` | `initRemoteConfig()` returns early with `cachedFlags = { ...config.features }` when `isFirebaseMockMode()` is `true`. |
| MM-7 | Firebase readiness gate | The app renders nothing (`return null`) until the Firebase configuration check completes, preventing components from accessing Firebase services before mock mode is determined. | `src/app/_layout.tsx` | `if (!firebaseReady) return null;` in `RootLayout` component. |

---

## Cross-References

| Document | Relevance |
|----------|-----------|
| [1-PRODUCT-OVERVIEW.md](./1-PRODUCT-OVERVIEW.md) | Product context for why these rules exist (invite-only community, Bay Area focus). |
| [2-USER-FLOWS.md](./2-USER-FLOWS.md) | Step-by-step user journeys that these rules govern. |
| Feature Specs (when created) | Detailed specifications for features gated by these rules. |
| Data Model (when created) | Schema definitions for profile fields referenced in Profile Setup rules. |
| Decision Log (when created) | Architectural decisions behind rule choices (e.g., social-only auth, geographic restriction). |
