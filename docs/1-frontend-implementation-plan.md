# Raine Frontend Implementation Plan
## React Native + Expo Mobile Application

### Tech Stack Overview
- **Framework**: Expo + React Native (Expo Development Builds)
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore (real-time listeners)
- **Local Cache**: MMKV (fast startup cache)
- **Subscriptions**: RevenueCat
- **Feature Flags**: Firebase Remote Config
- **Analytics**: Firebase Analytics → Amplitude (later)
- **Push Notifications**: Firebase Cloud Messaging (FCM)

---

## Phase 1: Project Foundation & Setup

### 1.1 Project Initialization
- [ ] Initialize Expo project with TypeScript
- [ ] Set up Expo Development Build configuration
- [ ] Configure `app.json` / `eas.json` for build profiles
- [ ] Set up version control and `.gitignore`

### 1.2 Development Environment
- [ ] Install core dependencies:
  - `expo-router` (navigation)
  - `nativewind` or `@shopify/restyle` (styling)
  - `react-native-mmkv` (local cache)
  - `@react-native-firebase/app` + auth + firestore
  - `react-native-purchases` (RevenueCat)
- [ ] Configure TypeScript strictness
- [ ] Set up ESLint + Prettier
- [ ] Configure Metro bundler

### 1.3 Project Structure
```
/src
  /app             # Expo Router screens
  /components      # Reusable UI components
  /features        # Feature-based modules
    /auth
    /chat
    /profile
    /subscriptions
  /services        # External services (Firebase, RevenueCat)
  /hooks           # Custom React hooks
  /utils           # Helper functions
  /types           # TypeScript types/interfaces
  /constants       # App constants, colors, config
  /store           # State management (if needed)
  /cache           # MMKV cache utilities
```

---

## Phase 2: UI Foundation & Navigation

### 2.1 Design System Setup
- [ ] Define color palette (theme)
- [ ] Set up typography system
- [ ] Create base UI components:
  - Button
  - Input
  - Card
  - Avatar
  - Loading states
  - Empty states
  - Error states

### 2.2 Navigation Structure
- [ ] Configure Expo Router file-based routing
- [ ] Create main navigation flows:
  - Auth flow (login, signup, password reset)
  - Main app flow (tabs/drawer)
  - Chat flow (room list, chat screen)
  - Profile flow (settings, subscription)
- [ ] Implement navigation guards (auth-based)
- [ ] Add loading screens and splash screen

### 2.3 Mock Data & Static Screens
- [ ] Create mock data for:
  - User profiles
  - Chat rooms
  - Messages
  - Reactions
- [ ] Build static versions of key screens:
  - Home/Room List
  - Chat Screen
  - Profile Screen
  - Settings Screen
  - Subscription Screen

### 2.4 State Management Strategy
- [ ] Evaluate state management options:
  - **Zustand**: Lightweight, minimal boilerplate (recommended for client state)
  - **TanStack Query**: Server state synchronization (recommended for Firestore data)
  - **Context API**: Simple cases (auth, theme)
- [ ] Define state architecture:
  ```typescript
  // Client State (Zustand)
  interface AppStore {
    // UI state
    activeRoomId: string | null;
    isOnline: boolean;
    // User preferences
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
  }

  // Auth State (Context)
  interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }

  // Subscription State (Context + RevenueCat)
  interface SubscriptionState {
    customerInfo: CustomerInfo | null;
    entitlements: Record<string, boolean>;
    isLoading: boolean;
  }
  ```
- [ ] Separate concerns:
  - **Server state**: Firestore data via listeners (rooms, messages, profiles)
  - **Client state**: UI state, preferences (Zustand)
  - **Auth state**: Current user (Context + Firebase)
  - **Subscription state**: Entitlements (Context + RevenueCat)
- [ ] Implement optimistic update patterns:
  - Message sending (show immediately, confirm on write)
  - Reactions (toggle immediately, rollback on error)
  - Profile updates (show immediately, revert on failure)
- [ ] Create state management utilities:
  - `/store/appStore.ts` (Zustand store)
  - `/store/hooks.ts` (Custom selector hooks)
  - `/store/persist.ts` (MMKV persistence middleware)

---

## Phase 3: Authentication Layer

### 3.1 Firebase Auth Setup
- [ ] Initialize Firebase SDK
- [ ] Configure Firebase project (iOS/Android apps)
- [ ] Implement auth service wrapper:
  - `signUp(email, password)`
  - `signIn(email, password)`
  - `signOut()`
  - `resetPassword(email)`
  - `getCurrentUser()`
  - `onAuthStateChanged()`

### 3.2 Auth Screens Implementation
- [ ] Build Login screen
- [ ] Build Signup screen
- [ ] Build Password Reset screen
- [ ] Add form validation
- [ ] Handle auth errors (user-friendly messages)

### 3.3 Auth State Management
- [ ] Create auth context/provider
- [ ] Implement auth persistence
- [ ] Add protected route logic
- [ ] Cache user session in MMKV for fast startup

---

## Phase 4: Firestore Integration

### 4.1 Firestore Setup
- [ ] Initialize Firestore SDK
- [ ] Configure offline persistence
- [ ] Set up Firestore data models (TypeScript types):
  ```typescript
  interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: Timestamp;
    lastSeen: Timestamp;
  }

  interface Room {
    id: string;
    name: string;
    memberIds: string[];
    lastMessage?: {
      text: string;
      senderId: string;
      timestamp: Timestamp;
    };
    createdAt: Timestamp;
  }

  interface Message {
    id: string;
    roomId: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
    reactions?: Record<string, string[]>; // emoji -> userIds
  }
  ```

### 4.2 User Profile Management
- [ ] Implement user profile creation on signup
- [ ] Create user profile service:
  - `getUserProfile(uid)`
  - `updateUserProfile(uid, data)`
  - `listenToUserProfile(uid, callback)`
- [ ] Build profile edit screen
- [ ] Add profile photo upload (Firebase Storage)

### 4.3 Data Access Layer
- [ ] Create Firestore service wrappers:
  - `/services/firestore/users.ts`
  - `/services/firestore/rooms.ts`
  - `/services/firestore/messages.ts`
- [ ] Implement error handling and retry logic
- [ ] Add offline state detection

---

## Phase 5: Chat Real-time & Core Features

### 5.1 Room List Implementation
- [ ] Implement room list query:
  - Filter rooms by membership
  - Order by last message timestamp
  - Limit to N rooms (pagination)
- [ ] Set up real-time listener (`onSnapshot`)
- [ ] Display room list with:
  - Room name
  - Last message preview
  - Unread indicator (optional)
  - Timestamp

### 5.2 Chat Screen Implementation
- [ ] Implement message list query:
  - Filter by roomId
  - Order by timestamp desc
  - Load last 50 messages (paginate on scroll)
- [ ] Set up real-time message listener
- [ ] Build message UI:
  - Sender info (avatar, name)
  - Message text
  - Timestamp
  - Reactions display
- [ ] Implement message sending:
  - Input field
  - Send button
  - Optimistic UI updates
  - Error handling

### 5.3 Message Pagination
- [ ] Implement "load more" on scroll to top
- [ ] Use Firestore query cursors (`startAfter`)
- [ ] Cache loaded messages locally
- [ ] Handle edge cases (no more messages)

### 5.4 Reactions Feature
- [ ] Design reaction UI (emoji picker)
- [ ] Implement reaction logic:
  - Add reaction to message
  - Remove reaction from message
  - Update Firestore (subcollection or map field)
- [ ] Show reaction counts and users
- [ ] Optimistic UI for reactions

---

## Phase 6: Push Notifications

### 6.1 FCM Setup
- [ ] Configure Firebase Cloud Messaging
- [ ] Add FCM to Expo Development Build
- [ ] Request notification permissions
- [ ] Get and store FCM token in Firestore (`users/{uid}.fcmToken`)

### 6.2 Notification Handling
- [ ] Handle foreground notifications
- [ ] Handle background notifications
- [ ] Implement notification tap actions (deep linking)
- [ ] Add notification preferences in settings

### 6.3 Backend Integration
- [ ] Verify Cloud Function sends notifications (backend team)
- [ ] Test notification delivery
- [ ] Handle notification edge cases (expired tokens, etc.)

---

## Phase 7: Remote Config & Feature Flags

### 7.1 Firebase Remote Config Setup
- [ ] Initialize Remote Config SDK
- [ ] Define default config values
- [ ] Create config fetch utility
- [ ] Implement config caching (MMKV)

### 7.2 Feature Flag Implementation
- [ ] Create feature flag wrapper:
  ```typescript
  interface FeatureFlags {
    chatReactionsEnabled: boolean;
    newProfileUIEnabled: boolean;
    subscriptionGatingEnabled: boolean;
  }
  ```
- [ ] Fetch config on app start (background)
- [ ] Use flags to conditionally render features
- [ ] Add admin flag override for testing

### 7.3 Gradual Rollout Support
- [ ] Implement version-based rollout checks
- [ ] Add platform-based flags (iOS vs Android)
- [ ] Test flag changes without app update

---

## Phase 8: Subscriptions & RevenueCat

### 8.1 RevenueCat Setup
- [ ] Create RevenueCat account and project
- [ ] Configure iOS and Android apps
- [ ] Set up products and entitlements
- [ ] Add RevenueCat SDK to Expo Development Build

### 8.2 RevenueCat Integration
- [ ] Initialize RevenueCat SDK with user ID
- [ ] Implement subscription service:
  - `getOfferings()`
  - `purchasePackage(package)`
  - `getCustomerInfo()`
  - `checkEntitlement(entitlementId)`
- [ ] Handle purchase flow:
  - Display offerings
  - Initiate purchase
  - Handle success/failure
  - Restore purchases

### 8.3 Subscription Gating
- [ ] Create entitlement check hook:
  ```typescript
  const { hasAccess, isLoading } = useEntitlement('premium');
  ```
- [ ] Add subscription gates to premium features
- [ ] Build paywall screen
- [ ] Handle subscription state changes

### 8.4 Subscription State Sync
- [ ] Listen to RevenueCat customer info updates
- [ ] Optionally sync with Firestore (if backend updates it)
- [ ] Handle subscription expiration gracefully
- [ ] Add restore purchases option

---

## Phase 9: Analytics & Observability

### 9.1 Firebase Analytics Setup
- [ ] Initialize Firebase Analytics
- [ ] Define key events:
  - `sign_up`
  - `login`
  - `message_sent`
  - `room_joined`
  - `subscription_purchased`
  - `feature_viewed`
- [ ] Implement analytics service wrapper
- [ ] Add screen tracking

### 9.2 User Property Tracking
- [ ] Set user properties:
  - `subscription_status`
  - `account_age`
  - `last_active`
- [ ] Update properties on state changes

### 9.3 Amplitude Integration (Future)
- [ ] Add Amplitude SDK
- [ ] Mirror key events to Amplitude
- [ ] Set up funnels and cohorts
- [ ] Configure behavioral analysis

---

## Phase 10: Performance Optimization & Caching

### 10.1 MMKV Cache Strategy
- [ ] Cache user profile for instant load
- [ ] Cache last opened room ID
- [ ] Cache last message cursor for pagination
- [ ] Cache feature flags snapshot
- [ ] Implement cache invalidation strategy

### 10.2 Firestore Optimization
- [ ] Enable Firestore cache persistence
- [ ] Implement query result caching
- [ ] Optimize listener setup (avoid unnecessary re-renders)
- [ ] Use Firestore indexes where needed

### 10.3 Image Optimization
- [ ] Add image caching (expo-image)
- [ ] Optimize image uploads (resize before upload)
- [ ] Lazy load images in chat
- [ ] Add placeholder images

### 10.4 List Performance
- [ ] Use `FlatList` with proper `keyExtractor`
- [ ] Implement `getItemLayout` for known sizes
- [ ] Add `removeClippedSubviews` for long lists
- [ ] Optimize re-renders with `React.memo`

---

## Phase 11: Security & Validation

### 11.1 Input Validation
- [ ] Validate all user inputs client-side
- [ ] Sanitize message text (prevent XSS)
- [ ] Validate file uploads (size, type)

### 11.2 Security Best Practices
- [ ] Never expose API keys in code (use env variables)
- [ ] Store sensitive data only in MMKV (encrypted)
- [ ] Validate user permissions before UI actions
- [ ] Trust Firestore Security Rules as source of truth

### 11.3 Error Handling
- [ ] Implement global error boundary
- [ ] Add error logging (Firebase Crashlytics)
- [ ] Show user-friendly error messages
- [ ] Handle offline state gracefully

---

## Phase 12: Testing & Quality Assurance

### 12.1 Unit Testing
- [ ] Set up Jest + React Native Testing Library
- [ ] Write tests for:
  - Utility functions
  - Custom hooks
  - Service wrappers (mocked)

### 12.2 Integration Testing
- [ ] Test auth flows
- [ ] Test Firestore listeners
- [ ] Test navigation flows

### 12.3 Manual Testing Checklist
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test offline mode
- [ ] Test subscription flow (sandbox)
- [ ] Test push notifications
- [ ] Test feature flags
- [ ] Test real-time updates with multiple devices

---

## Phase 13: Build & Deployment

### 13.1 Development Builds
- [ ] Create development build for iOS
- [ ] Create development build for Android
- [ ] Test native modules (RevenueCat, FCM)

### 13.2 Internal Testing
- [ ] Configure TestFlight (iOS)
- [ ] Configure Google Play Internal Testing (Android)
- [ ] Invite beta testers
- [ ] Collect feedback

### 13.3 Production Build
- [ ] Configure production environment variables
- [ ] Set up EAS Build profiles
- [ ] Create production builds
- [ ] Test production builds thoroughly

### 13.4 App Store Submission
- [ ] Prepare App Store listing (iOS)
- [ ] Prepare Play Store listing (Android)
- [ ] Create screenshots and preview videos
- [ ] Write app description
- [ ] Submit for review

### 13.5 CI/CD Pipeline
- [ ] Configure GitHub Actions workflow:
  ```yaml
  # .github/workflows/ci.yml
  name: CI
  on:
    pull_request:
      branches: [main, develop]
    push:
      branches: [main]
  
  jobs:
    lint-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check
        - run: npm run test
  ```
- [ ] Set up PR checks:
  - TypeScript type checking (`tsc --noEmit`)
  - ESLint linting
  - Prettier formatting check
  - Unit test suite
  - Bundle size analysis (optional)
- [ ] Configure EAS Build automation:
  - Development builds on `develop` branch push
  - Preview builds on PR (via EAS Update)
  - Production builds on `main` branch push
- [ ] Set up deployment pipelines:
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy
  on:
    push:
      branches: [main]
  
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: expo/expo-github-action@v8
          with:
            eas-version: latest
            token: ${{ secrets.EXPO_TOKEN }}
        - run: npm ci
        - run: eas build --platform all --profile production --non-interactive
        - run: eas submit --platform all --profile production --non-interactive
  ```
- [ ] Configure environment secrets in GitHub:
  - `EXPO_TOKEN` (EAS authentication)
  - `FIREBASE_CONFIG` (Firebase credentials)
  - `REVENUECAT_API_KEY` (RevenueCat credentials)
- [ ] Set up branch protection rules:
  - Require PR reviews before merge
  - Require status checks to pass
  - Require branches to be up to date
- [ ] Implement EAS Update for OTA updates:
  - Configure update channels (development, preview, production)
  - Set up automatic updates on non-native changes
  - Define rollback strategy for failed updates
- [ ] Add build notifications:
  - Slack/Discord webhook for build status
  - Email notifications for failed builds

---

## Phase 14: Post-Launch Iteration

### 14.1 Monitoring
- [ ] Monitor crash reports (Crashlytics)
- [ ] Track analytics events
- [ ] Monitor subscription metrics
- [ ] Track API/Firestore usage

### 14.2 User Feedback
- [ ] Add in-app feedback mechanism
- [ ] Monitor app store reviews
- [ ] Track support requests

### 14.3 Continuous Improvement
- [ ] Prioritize bug fixes
- [ ] Implement feature requests
- [ ] Optimize performance based on metrics
- [ ] Run A/B tests with Remote Config

---

## Key Dependencies & Tools

### Core
```json
{
  "expo": "~52.x",
  "react-native": "0.76.x",
  "expo-router": "~4.x",
  "react-native-mmkv": "^3.x"
}
```

### State Management
```json
{
  "zustand": "^5.x",
  "@tanstack/react-query": "^5.x"
}
```

### Firebase
```json
{
  "@react-native-firebase/app": "^21.x",
  "@react-native-firebase/auth": "^21.x",
  "@react-native-firebase/firestore": "^21.x",
  "@react-native-firebase/messaging": "^21.x",
  "@react-native-firebase/remote-config": "^21.x",
  "@react-native-firebase/analytics": "^21.x",
  "@react-native-firebase/storage": "^21.x",
  "@react-native-firebase/crashlytics": "^21.x"
}
```

### RevenueCat
```json
{
  "react-native-purchases": "^8.x"
}
```

### UI/Styling
```json
{
  "nativewind": "^4.x",
  "react-native-reanimated": "~3.x",
  "react-native-gesture-handler": "~2.x"
}
```

### Dev Tools
```json
{
  "typescript": "^5.x",
  "eslint": "^8.x",
  "prettier": "^3.x",
  "@testing-library/react-native": "^12.x",
  "jest": "^29.x"
}
```

---

## Critical Success Factors

1. **Mobile-First Design**: Optimize for small screens, touch interactions, and mobile UX patterns
2. **Offline-First**: Leverage Firestore offline persistence and MMKV caching for fast cold starts
3. **Real-Time by Default**: Use Firestore listeners for immediate updates across devices
4. **Fast Startup**: Use MMKV to cache critical bootstrap data (user profile, last room, config)
5. **Security Rules**: Firestore Security Rules are non-negotiable—validate all access server-side
6. **Expo Dev Builds**: Use Development Builds (not Expo Go) for native modules
7. **Subscription-First**: Design with RevenueCat entitlements from the start
8. **Iterative Shipping**: Ship Phase 1-5 as MVP, then iterate with feature flags

---

## Timeline Considerations

**MVP (Phases 1-5)**: Core chat experience with auth and real-time messaging
**V1 (Phases 6-8)**: Add notifications, feature flags, and subscriptions
**V2 (Phases 9-11)**: Polish with analytics, performance optimization, and security hardening
**Production (Phases 12-14)**: Testing, deployment, and post-launch iteration

---

## Notes

- Keep the client as the "entitlement truth" for subscriptions (RevenueCat)
- Trust Firestore Security Rules—don't bypass them with client-side checks
- Use MMKV sparingly—only for fast startup cache, not as primary storage
- Plan for Amplitude migration from day one (consistent event naming)
- Test on real devices early and often (simulators hide performance issues)
- Build with Expo Development Builds from the start (avoid migration pain later)
