# RaineApp Development Backlog

This document tracks deferred tasks, minor improvements, and future enhancements that are not critical for initial launch.

**Last Updated:** February 2026

---

## Priority Levels

- **P0 (Critical):** Blocks launch, must fix immediately
- **P1 (High):** Important for user experience
- **P2 (Medium):** Nice to have, improves quality
- **P3 (Low):** Future enhancement

---

## Deferred Tasks

### Profile Setup Improvements

#### Photo Screen Validation (P1)

**Issue:** Photo upload lacks validation checks mentioned in spec.

**Missing:**
- [ ] Min resolution validation (300x300px)
- [ ] Max file size validation (10MB check before upload)
- [ ] Make Continue button disabled until photo uploaded (currently optional)
- [ ] Update subheadline from "OPTIONAL" to "RAINE IS BUILT ON REAL CONNECTION"

**Files to Update:**
- `src/app/(profile-setup)/photo.tsx`
- `src/components/profile-setup/PhotoUpload.tsx`

**Estimated Effort:** 1-2 hours

---

#### Children Screen Validation (P1)

**Issue:** Missing birth date and due date validation.

**Missing:**
- [ ] Birth date cannot be in the future
- [ ] Birth date cannot be >18 years ago
- [ ] Due date must be in the future
- [ ] Show validation errors inline

**Files to Update:**
- `src/app/(profile-setup)/children.tsx`
- `src/components/profile-setup/ChildForm.tsx`

**Estimated Effort:** 1-2 hours

---

#### Name Screen Auto-Append Period (P3)

**Issue:** Last initial doesn't auto-append "." as per spec.

**Missing:**
- [ ] Automatically append "." to last initial input

**Files to Update:**
- `src/app/(profile-setup)/name.tsx`

**Estimated Effort:** 15 minutes

---

#### MonthYearPicker Dropdown (P2)

**Issue:** MonthYearPicker uses Input components instead of native dropdowns/pickers.

**Improvement:**
- [ ] Replace Input fields with proper picker components
- [ ] Use `@react-native-picker/picker` or native select
- [ ] Better mobile UX with native scroll wheels

**Files to Update:**
- `src/components/profile-setup/MonthYearPicker.tsx`

**Estimated Effort:** 2-3 hours

---

### Testing Infrastructure

#### Unit Tests (P1)

**Missing:**
- [ ] Jest configuration
- [ ] Testing library setup
- [ ] Unit tests for services (location, bio, profile)
- [ ] Unit tests for utility functions
- [ ] Mock setup for Firebase

**Files to Create:**
- `jest.config.js`
- `__tests__/services/location.test.ts`
- `__tests__/services/bio.test.ts`
- `__tests__/utils/*.test.ts`
- `__mocks__/@react-native-firebase/*.ts`

**Estimated Effort:** 1-2 days

---

#### Component Tests (P2)

**Missing:**
- [ ] Tests for UI components (Button, Input, etc.)
- [ ] Tests for profile-setup components
- [ ] Snapshot tests for screens

**Files to Create:**
- `__tests__/components/ui/*.test.tsx`
- `__tests__/components/profile-setup/*.test.tsx`

**Estimated Effort:** 2-3 days

---

#### E2E Tests (P2)

**Missing:**
- [ ] Maestro setup
- [ ] E2E test flows (onboarding, profile setup, chat)
- [ ] CI integration

**Files to Create:**
- `.maestro/` directory
- `e2e/onboarding.yaml`
- `e2e/profile-setup.yaml`

**Estimated Effort:** 2-3 days

---

### Error Handling & UX

#### Error Boundaries (P1)

**Missing:**
- [ ] React Error Boundary component
- [ ] Wrap root layout
- [ ] Wrap profile-setup flow
- [ ] Wrap chat screens
- [ ] Fallback UI for crashes

**Files to Create:**
- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorFallback.tsx`

**Estimated Effort:** 3-4 hours

---

#### Offline Mode Indicator (P2)

**Missing:**
- [ ] Network status detection
- [ ] Offline banner component
- [ ] Retry logic for failed requests
- [ ] Queue operations for offline sync

**Files to Create:**
- `src/hooks/useNetworkStatus.ts`
- `src/components/OfflineBanner.tsx`

**Estimated Effort:** 4-6 hours

---

### Performance Optimization

#### FlashList for Message Lists (P2)

**Issue:** Long message lists may have performance issues with FlatList.

**Improvement:**
- [ ] Replace FlatList with FlashList in chat screens
- [ ] Add `@shopify/flash-list` dependency
- [ ] Update MessageList component

**Files to Update:**
- `src/components/chat/MessageList.tsx`
- `src/app/room/[id].tsx`

**Estimated Effort:** 1-2 hours

---

#### Image Optimization (P2)

**Improvement:**
- [ ] Compress images before upload
- [ ] Generate thumbnails
- [ ] Use WebP format where supported
- [ ] Lazy load images in lists

**Files to Update:**
- `src/components/profile-setup/PhotoUpload.tsx`
- `src/services/profile/index.ts`

**Estimated Effort:** 2-3 hours

---

#### Bundle Size Optimization (P3)

**Improvement:**
- [ ] Analyze bundle with `react-native-bundle-visualizer`
- [ ] Remove unused dependencies
- [ ] Code split by route
- [ ] Tree-shake Firebase modules

**Estimated Effort:** 4-6 hours

---

### Accessibility

#### Screen Reader Support (P1)

**Missing:**
- [ ] Add `accessibilityLabel` to all interactive elements
- [ ] Add `accessibilityRole` for semantic meaning
- [ ] Add `accessibilityHint` where helpful
- [ ] Test with VoiceOver (iOS) and TalkBack (Android)

**Files to Update:** All screen and component files

**Estimated Effort:** 2-3 days

---

#### Keyboard Navigation (P2)

**Improvement:**
- [ ] Tab order for form fields
- [ ] Focus management
- [ ] Keyboard shortcuts (if applicable)

**Estimated Effort:** 1-2 days

---

### Backend Integration (Requires Backend Team)

#### Real Firebase Integration (P0 - Before Launch)

**Missing:**
- [ ] Firebase project setup (dev, staging, prod)
- [ ] Add `google-services.json` (Android)
- [ ] Add `GoogleService-Info.plist` (iOS)
- [ ] Configure Firebase security rules
- [ ] Test with real Firestore
- [ ] Test with real Cloud Functions
- [ ] Test push notifications

**Estimated Effort:** Backend team

---

#### AI Bio Generation Cloud Function (P0 - Before Launch)

**Missing:**
- [ ] Implement `generateProfileBio` Cloud Function
- [ ] OpenAI API integration
- [ ] Rate limiting (5 calls per user per day)
- [ ] Prompt engineering for quality bios

**Files to Create (Backend):**
- `functions/src/generateProfileBio.ts`

**Estimated Effort:** Backend team (4-6 hours)

---

#### RevenueCat Configuration (P1)

**Missing:**
- [ ] RevenueCat account setup
- [ ] Configure products and entitlements
- [ ] Add API keys to environment
- [ ] Test subscription flow end-to-end

**Estimated Effort:** Backend team + 2-3 hours frontend

---

### Feature Enhancements

#### Profile Editing (P1)

**Missing:**
- [ ] Edit profile screen
- [ ] Update existing profile data
- [ ] Re-upload photo
- [ ] Change location
- [ ] Regenerate bio

**Files to Create:**
- `src/app/(tabs)/edit-profile.tsx`

**Estimated Effort:** 1 day

---

#### Chat Features (P2)

**Missing:**
- [ ] Real-time message sync (Firestore listeners)
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Message reactions
- [ ] Image attachments
- [ ] Message deletion

**Files to Update:**
- `src/app/room/[id].tsx`
- `src/services/firebase/messages.ts`
- `src/components/chat/*.tsx`

**Estimated Effort:** 3-5 days

---

#### Push Notifications (P1)

**Missing:**
- [ ] FCM token registration
- [ ] Handle notification permissions
- [ ] Handle notification taps (deep linking)
- [ ] Background notification handler
- [ ] Notification preferences UI

**Files to Update:**
- `src/services/firebase/notifications.ts`
- `src/app/(tabs)/settings.tsx`

**Estimated Effort:** 1-2 days

---

### Documentation

#### API Documentation (P2)

**Missing:**
- [ ] Document all service functions
- [ ] Document component props with JSDoc
- [ ] Create Storybook for components (optional)

**Estimated Effort:** 2-3 days

---

#### Onboarding Documentation (P2)

**Missing:**
- [ ] New developer setup guide
- [ ] Common patterns guide
- [ ] Firebase setup walkthrough
- [ ] Troubleshooting FAQ

**Status:** Partially complete (see `documents/PROJECT-CONSOLIDATION.md`)

**Estimated Effort:** 1 day

---

## Recently Completed (February 2026)

### ✅ Profile Setup Flow
- All 14 screens implemented
- Zustand store with MMKV persistence
- Progress indicator
- Form validation
- Navigation guards

### ✅ Firebase Mock Mode
- Automatic detection of Firebase config
- Graceful fallbacks for all services
- Clear warnings when in mock mode
- Bio generation fallback

### ✅ RevenueCat Guards
- Configuration check before calls
- Mock mode support
- Clear warnings when not configured

### ✅ MMKV v4 Migration
- Updated to createMMKV API
- Fixed storage.remove() calls
- Zustand persistence adapter

### ✅ Zustand Infinite Loop Fix
- Implemented useShallow for memoization
- Fixed bio screen re-render issue

### ✅ Development Tooling
- TypeScript compilation working
- ESLint configuration
- Prettier setup
- Git ignore for .expo files
- Reset app data button in Settings

---

## Won't Do / Out of Scope

- Email/password authentication (social only per requirements)
- Web version (mobile-first)
- Offline message queue (future v2 feature)

---

## Notes

- Profile setup is ~95% complete, remaining items are polish/validation
- Core functionality is working end-to-end in mock mode
- Next priority: Firebase integration for production
- Backend team needed for Cloud Functions implementation

---

**Total Deferred Tasks:** 17  
**Estimated Total Effort:** 10-15 days (excluding backend work)
