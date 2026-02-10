# Raine - Decision Log

**Last Updated:** February 2026
**Purpose:** Document why key technical and business choices were made so future contributors understand the reasoning behind the current architecture.

---

## Table of Contents

1. [Expo + React Native](#decision-expo--react-native)
2. [Expo Router](#decision-expo-router-for-navigation)
3. [Zustand for State Management](#decision-zustand-for-state-management)
4. [MMKV for Local Persistence](#decision-mmkv-for-local-persistence)
5. [NativeWind for Styling](#decision-nativewind-for-styling)
6. [Firebase as Backend Platform](#decision-firebase-as-backend-platform)
7. [Mock Mode Always On in Development](#decision-mock-mode-always-on-in-development)
8. [Lazy Loading for Native Modules](#decision-lazy-loading-for-native-modules)
9. [Invite-Only with Referral Codes](#decision-invite-only-with-referral-codes)
10. [Bay Area Counties Only](#decision-bay-area-counties-only)
11. [14-Step Profile Setup](#decision-14-step-profile-setup)
12. [Tests Deferred](#decision-tests-deferred)
13. [EAS Cloud Builds](#decision-eas-cloud-builds)
14. [New Architecture Enabled](#decision-new-architecture-enabled)

---

### Decision: Expo + React Native

- **Date:** January 2026
- **Context:** Raine needed a cross-platform mobile framework. The founding team had one frontend engineer writing both iOS and Android, so native development for each platform was not feasible within the target timeline.
- **Options Considered:**
  1. **Native (Swift + Kotlin)** -- Maximum performance and platform fidelity, but requires two codebases and two skill sets.
  2. **Flutter (Dart)** -- Single codebase with strong performance, but the Dart ecosystem is smaller for social/Firebase integrations and hiring is harder.
  3. **React Native (bare)** -- Large ecosystem, JavaScript/TypeScript talent pool, but manual native configuration is time-consuming.
  4. **React Native + Expo** -- Managed workflow with EAS Build, extensive library support, and over-the-air updates.
- **Decision:** React Native with Expo (SDK 54, development builds).
- **Rationale:** Expo eliminates most native toolchain friction (Xcode/Gradle configuration, code signing, native module linking) while still allowing custom native modules through development builds. The React Native ecosystem has mature Firebase, RevenueCat, and social auth libraries. TypeScript support is first-class. The team already had React experience, reducing ramp-up time.
- **Consequences:** Tied to Expo's release cycle for SDK upgrades. Some native modules require development builds rather than Expo Go. Performance-critical features may eventually need native modules, but this has not been a constraint so far.

---

### Decision: Expo Router for Navigation

- **Date:** January 2026
- **Context:** The app requires nested navigation: onboarding stack, auth stack, profile setup stack, and a main tab navigator with per-tab stacks. A routing solution was needed that could handle deep linking, URL-based navigation, and layout nesting.
- **Options Considered:**
  1. **React Navigation** -- The established standard for React Native. Imperative API, extensive documentation, large community.
  2. **Expo Router** -- File-based routing built on top of React Navigation. Convention over configuration, automatic deep linking, typed routes.
- **Decision:** Expo Router v6 with file-based routing (`src/app/` as root).
- **Rationale:** Expo Router reduces boilerplate by deriving the navigation tree from the file system. Route groups (`(onboarding)`, `(auth)`, `(profile-setup)`, `(tabs)`) map directly to the app's navigation structure, making the architecture self-documenting. Deep linking comes free. Typed routes catch navigation errors at compile time. Since the project already uses Expo, Router integrates seamlessly with the build pipeline.
- **Consequences:** All route files are eagerly loaded by Expo Router to build the navigation tree, which means native module imports in route files trigger initialization before the React Native runtime is ready (see "Lazy Loading for Native Modules" below). The team must follow the invariant that route files never contain top-level native module imports.

---

### Decision: Zustand for State Management

- **Date:** January 2026
- **Context:** The app has several independent state domains: authentication state, profile setup (14-step wizard), onboarding progress, chat state, and feature flags. A state management solution was needed that could handle persistence, middleware, and isolated stores without heavy boilerplate.
- **Options Considered:**
  1. **Redux Toolkit** -- Industry standard, excellent devtools, but heavy boilerplate for small-to-medium apps. Requires actions, reducers, and selectors for every slice.
  2. **React Context API** -- Built-in, zero dependencies, but causes unnecessary re-renders when context values change. Not suited for high-frequency updates or large state trees.
  3. **MobX** -- Reactive, minimal boilerplate, but proxy-based reactivity can be unpredictable with React Native's bridge and adds a conceptual layer (observables, actions, computed).
  4. **Zustand** -- Minimal API, hooks-based, supports middleware (persist, devtools), no provider wrappers needed.
- **Decision:** Zustand v5 with per-domain stores and persist middleware.
- **Rationale:** Zustand's API is a single `create()` call per store. Each feature domain (profile setup, auth, onboarding) gets its own store with its own persistence key, avoiding a monolithic state tree. The `persist` middleware integrates directly with MMKV for synchronous hydration at startup. No `<Provider>` wrappers simplifies the component tree. The bundle size impact is minimal (~2KB gzipped).
- **Consequences:** No centralized devtools equivalent to Redux DevTools (though Zustand has a devtools middleware). State is distributed across files, which requires discipline to keep organized. React Context is still used alongside Zustand for dependency-injection patterns (e.g., providing services), but not for high-frequency state.

---

### Decision: MMKV for Local Persistence

- **Date:** January 2026
- **Context:** The app persists onboarding progress, profile setup state, referral codes, and user preferences locally so users can resume interrupted flows. The persistence layer needs to be synchronous (to avoid flash-of-empty-state on startup) and fast.
- **Options Considered:**
  1. **AsyncStorage** -- The default React Native key-value store. Asynchronous, JavaScript-bridge-based, adequate for small payloads but slow for frequent reads/writes.
  2. **MMKV** -- Memory-mapped key-value storage from WeChat. Synchronous reads/writes, ~30x faster than AsyncStorage, direct C++ bridge via JSI/Nitro Modules.
- **Decision:** react-native-mmkv v4 (Nitro Modules variant).
- **Rationale:** MMKV's synchronous API means Zustand stores hydrate before the first render, eliminating loading states during app startup. This is critical for the splash screen flow: the app must know immediately whether the user has a stored referral code, auth session, and profile setup progress. The v4 release uses Nitro Modules for the C++ bridge, aligning with the New Architecture. Performance benchmarks show MMKV is roughly 30x faster than AsyncStorage for typical key-value operations.
- **Consequences:** Requires a development build (cannot use Expo Go). Adds a native dependency that must be rebuilt when upgrading. Data is not encrypted by default (acceptable for non-sensitive preference data; sensitive tokens use Firebase Auth's own storage).

---

### Decision: NativeWind for Styling

- **Date:** January 2026
- **Context:** The app has a custom design system with consistent spacing, colors, typography, and responsive layouts. A styling approach was needed that supports rapid iteration, design-system tokens, and platform-consistent rendering.
- **Options Considered:**
  1. **React Native StyleSheet** -- Built-in, zero dependencies, but verbose for design systems. No utility classes, no responsive breakpoints, requires manual token management.
  2. **Styled Components** -- CSS-in-JS with tagged templates. Familiar to web developers, but adds runtime overhead (style recalculation on every render) and increases bundle size.
  3. **NativeWind (Tailwind CSS for React Native)** -- Utility-first classes compiled to React Native styles at build time. Tailwind's design-system tokens (spacing, colors, typography) come built-in.
- **Decision:** NativeWind v4 with Tailwind CSS v3.
- **Rationale:** NativeWind provides Tailwind's utility-class vocabulary (`px-4`, `text-lg`, `bg-white`, `rounded-xl`) in React Native, compiled to static StyleSheet objects at build time with zero runtime overhead. The design system is defined in `tailwind.config.js`, giving a single source of truth for colors, spacing, and typography. Iteration speed is significantly faster than managing StyleSheet objects manually. The v4 release supports the New Architecture and CSS-level features like `gap`, `container queries`, and CSS variables.
- **Consequences:** Adds a build-time dependency (Tailwind CSS + NativeWind Babel plugin). Developers must learn Tailwind class names. Complex animations still require Reanimated or inline styles. Debugging styles means mapping utility classes back to their generated values.

---

### Decision: Firebase as Backend Platform

- **Date:** January 2026
- **Context:** Raine needs authentication (social providers), a real-time database, file storage, push notifications, analytics, feature flags, crash reporting, and serverless functions. The backend must support real-time listeners for chat and community features.
- **Options Considered:**
  1. **Custom backend (Node.js/Express + PostgreSQL)** -- Full control, but requires building and hosting auth, real-time infrastructure, push notification delivery, and file storage from scratch. Significant operational burden for a small team.
  2. **Supabase** -- Open-source Firebase alternative with PostgreSQL, real-time subscriptions, auth, and storage. Strong SQL support, but the React Native SDK is less mature than Firebase's, and social auth provider support (especially Facebook/Instagram) requires more manual configuration.
  3. **Firebase** -- Google's BaaS with mature React Native SDKs (`@react-native-firebase/*`), built-in social auth, Firestore (real-time NoSQL), Cloud Storage, FCM, Remote Config, Crashlytics, and Analytics.
- **Decision:** Firebase (full suite: Auth, Firestore, Storage, Functions, FCM, Remote Config, Crashlytics, Analytics).
- **Rationale:** Firebase provides every backend service the app needs under a single platform with first-class React Native support via `@react-native-firebase`. Firestore's real-time listeners are essential for chat and community features. Firebase Auth supports Facebook, Google, and Apple sign-in with minimal configuration. Cloud Functions handle server-side logic (bio generation, referral validation) without managing infrastructure. The free tier (Spark plan) covers development and early production usage.
- **Consequences:** Vendor lock-in to Google Cloud. Firestore's NoSQL model requires careful data modeling (no JOINs, denormalization needed). Costs scale with read/write operations, which must be monitored. The `@react-native-firebase` packages are native modules that require development builds and add to binary size.

---

### Decision: Mock Mode Always On in Development

- **Date:** February 2026
- **Context:** During development build testing, enabling real Firebase services caused cascading failures. The Facebook SDK crashed because no Facebook App ID was configured in `app.json` plugins. Even when auth was bypassed, the mock user (`mock-user-123`) had no Firestore security rule permissions, causing every database operation to fail with "permission denied." Signing out a mock user through real Firebase Auth also crashed because no corresponding auth session existed.
- **Options Considered:**
  1. **Configure real Facebook App ID in development** -- Would fix the SDK crash but requires Facebook developer app setup, review, and ongoing maintenance for development builds. Still leaves Firestore permission issues for mock users.
  2. **Conditional mock per service** -- Mock only the services that crash, leaving others real. Complex to maintain, creates inconsistent behavior between dev and production.
  3. **Mock mode globally enabled in development** -- When `__DEV__ === true`, all Firebase services (Auth, Firestore, Storage) return mock data. The entire UI flow works without a live backend.
- **Decision:** `isFirebaseMockMode()` returns `true` whenever `__DEV__` is `true`, regardless of other conditions. Enforced in `src/config/environment.ts`.
- **Rationale:** A single, deterministic rule eliminates an entire class of development-time crashes. The mock layer provides consistent test data for all 14 profile setup screens, chat, and navigation flows. Developers never need Firebase credentials or network access to work on the UI. Testing against real Firebase requires an explicit opt-in: configure the Facebook App ID, override `isDev` in `isFirebaseMockMode()`, and rebuild the native binary.
- **Consequences:** Development builds cannot test real backend integration without manual override. Bugs in the real Firebase integration layer can only be caught in preview or production builds. This is an acceptable trade-off because the mock layer faithfully mirrors the real data shapes, and integration testing happens in the preview build profile.

---

### Decision: Lazy Loading for Native Modules

- **Date:** February 2026
- **Context:** The app crashed at startup with `TypeError: Cannot read property 'EventEmitter' of undefined`. The root cause was that Expo Router eagerly loads all route modules to build the navigation tree. When a route file had a top-level `import` of a native module (`react-native-purchases`, `react-native-fbsdk-next`, or any `@react-native-firebase/*` package), the module's `NativeEventEmitter` initialized before the React Native runtime bridge was ready.
- **Options Considered:**
  1. **Move native modules to non-route files only** -- Would work, but limits where native functionality can be used and is hard to enforce as the codebase grows.
  2. **Lazy-load native modules via `require()` inside function bodies** -- Defers module initialization until the function is actually called, by which time the bridge is ready.
  3. **Use dynamic `import()` expressions** -- Similar to `require()` but asynchronous. Adds complexity with promises for every native call.
- **Decision:** Native modules (`react-native-purchases`, `react-native-fbsdk-next`, `@react-native-firebase/*`) must never appear in top-level `import` statements in route files. Use `require()` inside function bodies or restrict value imports to non-route service files.
- **Rationale:** The `require()` pattern is the simplest fix that addresses the root cause. It defers native module initialization to the point of use, when the bridge is guaranteed to be ready. Type-only imports (`import type`) are permitted in non-route service files but must be avoided even in route files because Metro may still resolve the module. This invariant is documented in the system architecture invariants (see `implementation-history/8-dev-build-runtime-fixes.md`).
- **Consequences:** Developers must remember the lazy-loading rule, which is non-obvious and easy to violate. A single top-level import of a native module in a route file will crash the app at startup. The invariant is documented but not enforced by a lint rule (a custom ESLint rule is a future improvement).

---

### Decision: Invite-Only with Referral Codes

- **Date:** January 2026
- **Context:** Raine targets mothers in the Bay Area who want genuine, trust-based social connections. Open registration would allow anyone to join, diluting the community quality and undermining the "no strangers, just friends of friends" value proposition. A growth-gating mechanism was needed.
- **Options Considered:**
  1. **Open registration** -- Maximizes growth velocity but sacrifices community trust and quality. No social vetting.
  2. **Waitlist with manual approval** -- Controls quality but creates friction and requires dedicated moderation staff.
  3. **Invite-only with referral codes** -- Each existing member can invite others via a unique 7-character alphanumeric code. Every new member traces back to a real social link.
- **Decision:** Invite-only access gated by a 7-character referral code entered before authentication.
- **Rationale:** The referral model creates an organic trust graph where every member is socially connected to at least one existing member. This aligns with the core product promise: "No strangers. Just friends of friends." Referral codes also create natural viral growth loops -- members who value the platform share codes with moms they think would benefit. The code-first flow (enter code before sign-in) ensures that no user data is collected until they have proven they were invited.
- **Consequences:** Growth is inherently slower than open registration. Early-stage growth depends on seed users distributing codes. The referral validation is currently client-side (any valid 7-character alphanumeric string is accepted); backend validation with single-use consumption is planned. A "Request Invite" flow (email to access@raineapp.com) exists for users without a code.

---

### Decision: Bay Area Counties Only

- **Date:** January 2026
- **Context:** Raine's value depends on geographic proximity -- moms need to be able to meet in person. Launching broadly would spread the user base thin, resulting in few matches in any given area. A geographic constraint was needed to ensure critical mass in one region before expanding.
- **Options Considered:**
  1. **No geographic restriction** -- Maximum addressable market, but matches would be geographically scattered and unable to meet in person.
  2. **Single city (San Francisco only)** -- Very dense but excludes the broader Bay Area suburban mom population.
  3. **Bay Area counties** -- Eight counties (San Francisco, Marin, Contra Costa, Alameda, San Mateo, Santa Clara, Sonoma, Napa) covering the metro area where moms are likely to travel for meetups.
- **Decision:** Restrict sign-up to eight Bay Area counties, enforced during profile setup via zip code validation against a county lookup table.
- **Rationale:** The Bay Area provides a large enough population of the target demographic (mothers in a major metro) while maintaining geographic density. Limiting to counties rather than a single city captures suburban moms who identify as "Bay Area" even if they live in Marin or the East Bay. Out-of-area users are directed to a waitlist, preserving demand signals for future expansion. The restriction is enforced at Step 3 (Location) of the profile setup flow.
- **Consequences:** Users outside the eight counties cannot join (they are routed to a waitlist with email collection). Expansion requires updating the `APPROVED_COUNTIES` constant and potentially adjusting matching algorithms for new regions. The waitlist data provides a geographic heat map for prioritizing future expansion.

---

### Decision: 14-Step Profile Setup

- **Date:** January 2026
- **Context:** Raine's matching algorithm depends on rich, multidimensional user profiles. Shallow profiles (name + photo) would produce poor matches. The system needs to understand each mom's location, life stage, interests, values, parenting style, and social preferences to surface genuinely compatible connections.
- **Options Considered:**
  1. **Minimal setup (3-5 fields)** -- Low friction, but insufficient data for quality matching. Users would need to fill in details later, and most would not.
  2. **Progressive profiling** -- Collect basics upfront, ask for more over time. Lower initial friction, but matching quality starts poor and the prompts feel intrusive mid-session.
  3. **Comprehensive upfront setup (14 steps)** -- Higher initial friction, but captures everything needed for matching from Day 1.
- **Decision:** 14-screen profile setup flow collecting name, photo, location, city feel, children, pre-motherhood interests, weekend preferences, self-perception, parenting truths, joys, aesthetic, mom-friend style, motivation, and an AI-generated bio.
- **Rationale:** Each of the 14 fields serves a specific role in the matching algorithm. Location and city feel determine geographic compatibility. Children data determines life-stage alignment. Interest fields (before motherhood, perfect weekend, aesthetic) drive lifestyle matching. Mom-friend style and what-brought-you determine social compatibility. The AI-generated bio synthesizes all inputs into a human-readable summary. By collecting this data during onboarding -- when user motivation is highest (they just received an invite) -- the platform achieves complete profiles from Day 1. Completion rates in testing have been acceptable because the screens are quick, visually engaging (selection cards, color grids), and each one is clearly purposeful.
- **Consequences:** Higher drop-off risk during onboarding compared to minimal setup. Progress persistence via MMKV mitigates this by allowing users to resume where they left off. The 14-step flow adds development complexity (14 screens, validation rules, navigation logic, state management per step). Any changes to the matching algorithm may require adding or modifying profile steps.

---

### Decision: Tests Deferred

- **Date:** January 2026
- **Context:** The project started as an MVP with a single engineer and a target timeline of 8-10 weeks to reach a functional prototype. Writing comprehensive tests (unit, integration, E2E) alongside feature development would have significantly slowed velocity during the foundation phase.
- **Options Considered:**
  1. **Test-driven development (TDD)** -- Write tests before implementation. Highest confidence, but roughly doubles development time for an MVP with rapidly changing requirements.
  2. **Tests alongside features** -- Write tests after each feature. Good practice, but still adds 30-50% overhead per feature during a phase where speed is critical.
  3. **Defer tests to post-MVP** -- Build the feature set first, add test coverage once the architecture stabilizes. Fastest path to a working product.
- **Decision:** Defer automated testing until after the MVP feature set is complete and the architecture has stabilized.
- **Rationale:** During the foundation phase, screens and data models changed frequently as the product vision solidified. Tests written against early implementations would have required constant rewriting, negating their value. The mock data layer effectively serves as a manual integration test: if the full UI flow works end-to-end with mock data, the component contracts are correct. Type safety via TypeScript strict mode catches a large class of bugs at compile time. The trade-off is acceptable for an MVP where the primary risk is not shipping at all.
- **Consequences:** No automated regression detection. Bugs are caught through manual testing and TypeScript type checking. Technical debt accumulates. A testing strategy (Jest for unit tests, React Native Testing Library for component tests, Detox or Maestro for E2E) is planned for the stabilization phase after MVP launch.

---

### Decision: EAS Cloud Builds

- **Date:** January 2026
- **Context:** The project uses custom native modules (`@react-native-firebase`, `react-native-mmkv`, `react-native-purchases`, `react-native-fbsdk-next`) that require native compilation. Local builds require a properly configured Xcode (macOS only) and Android SDK environment, which is fragile and time-consuming to maintain.
- **Options Considered:**
  1. **Local builds (`expo run:ios`, `expo run:android`)** -- Full control, no cloud dependency, but requires local Xcode/Android SDK setup, manual code signing, and breaks frequently with native dependency updates.
  2. **EAS Build (Expo Application Services)** -- Cloud-based build service that handles native compilation, code signing, and artifact distribution. Supports development, preview, and production build profiles.
  3. **Other CI/CD (GitHub Actions, Bitrise)** -- More configurable, but requires maintaining custom build scripts and provisioning profiles. Higher operational overhead.
- **Decision:** EAS Build with three profiles: `development` (dev client, internal distribution), `preview` (internal APK/IPA for testing), and `production` (app store bundles).
- **Rationale:** EAS Build abstracts native toolchain management entirely. The `eas.json` configuration defines build profiles declaratively. Code signing is managed through Expo's credential service. Builds are reproducible across environments (no "works on my machine" issues). The development profile produces a dev client APK/IPA for testing with `expo start --dev-client`. The preview profile produces a standalone app for QA. The production profile produces signed bundles for App Store and Play Store submission. EAS Submit handles store uploads.
- **Consequences:** Build times are longer than local builds (queued in the cloud). Free tier has limited build minutes per month. Debugging native build failures requires reading cloud logs rather than local terminal output. The team maintains `eas.json` instead of Xcode/Gradle configuration, which is a net simplification.

---

### Decision: New Architecture Enabled

- **Date:** January 2026
- **Context:** React Native's New Architecture (Fabric renderer + TurboModules + JSI) was stabilized in React Native 0.76+ and is the default in Expo SDK 54. The project needed to decide whether to enable it from the start or stay on the legacy architecture.
- **Options Considered:**
  1. **Legacy architecture (bridge-based)** -- Maximum library compatibility, well-understood performance characteristics. Will eventually be deprecated.
  2. **New Architecture enabled** -- JSI-based synchronous native calls, Fabric renderer with concurrent features, TurboModules for lazy-loaded native modules. The future of React Native.
- **Decision:** Enable New Architecture from Day 1 (`"newArchEnabled": true` in `app.json`).
- **Rationale:** Starting on the New Architecture avoids a painful migration later. Key dependencies already support it: `react-native-mmkv` v4 uses Nitro Modules (JSI-based), `react-native-reanimated` v4 is New Architecture native, and `@react-native-firebase` v23 supports both architectures. The JSI bridge provides synchronous native calls, which improves performance for MMKV reads and Reanimated animations. Fabric's concurrent rendering aligns with React 19's concurrent features. Since this is a new project with no legacy bridge dependencies, there is no migration cost.
- **Consequences:** Some older third-party libraries may not support the New Architecture (requires checking before adding new dependencies). Debugging tools and documentation are still catching up. The Nitro Modules ecosystem is newer and less battle-tested than the bridge-based module ecosystem. These risks are acceptable given that the project's core dependencies are already compatible.

---

## Cross-References

| Document | Relationship |
|----------|--------------|
| [Product Overview](./1-PRODUCT-OVERVIEW.md) | Product vision, four pillars, target audience, and tech stack overview |
| [User Flows](./2-USER-FLOWS.md) | End-to-end user journey maps referenced by invite-only and profile setup decisions |
| [Onboarding Spec](./3-FEATURE-SPECS/3.1-ONBOARDING.md) | Referral code gate and social login implementation details |
| [Profile Setup Spec](./3-FEATURE-SPECS/3.2-PROFILE-SETUP.md) | 14-step flow specification, geographic restriction, and state management |
| [Master Implementation Plan](../../implementation-history/7-MASTER-IMPLEMENTATION-PLAN.md) | Architecture strategy, phased roadmap, and mock-first development philosophy |
| [Dev Build & Runtime Fixes](../../implementation-history/8-dev-build-runtime-fixes.md) | System invariants for mock mode, lazy loading, and Expo Router entry point |
| [package.json](../../package.json) | Dependency versions for all libraries referenced in this log |
| [app.json](../../app.json) | Expo configuration including New Architecture flag and plugin setup |
| [eas.json](../../eas.json) | EAS Build profiles (development, preview, production) |
| [environment.ts](../../src/config/environment.ts) | Mock mode implementation and feature flag defaults |
