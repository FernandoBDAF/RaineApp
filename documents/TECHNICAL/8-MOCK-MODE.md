# Mock Mode (Removed)

> **Status:** This feature was removed from the codebase. This document is retained for historical context.

Mock mode was a development scaffold that allowed the full UI to run without real Firebase credentials. It was introduced during the initial development phase when the Facebook SDK was not configured and the backend was not yet deployed.

## Why It Was Removed

1. **Social login was replaced with email/password auth** — The Facebook SDK crash that originally motivated mock mode is no longer relevant
2. **Firebase is now fully configured** — Real `google-services.json` and `GoogleService-Info.plist` are bundled in all builds
3. **Dual-code-path risk** — Maintaining both mock and real paths meant bugs in the real path could go undetected during development
4. **The backend is deployed** — 9 Cloud Functions are live, Firestore security rules are active, and the app works end-to-end with real data

## What Replaced It

- All Firebase services now use real connections in all environments (dev and production)
- `isFirebaseMockMode()` in `src/config/environment.ts` still exists but always returns `false`
- The `mockAuth` module in `src/services/firebase/mock/` is no longer used
- Developers must have valid Firebase config files to run the app

## Historical Reference

For the original mock mode architecture and the bugs it solved, see:
- [implementation-history/8-dev-build-runtime-fixes.md](../../implementation-history/8-dev-build-runtime-fixes.md) — The debugging session that created mock mode
- [6-DECISION-LOG.md](../BUSINESS/6-DECISION-LOG.md) — Decision entries for mock mode and its removal
