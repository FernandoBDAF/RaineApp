# Plan A: Backend Integration
## Fix Critical Backend Gaps to Enable Frontend

**Scope:** Raine-bk only (backend project)  
**Duration:** 1-2 days  
**Dependencies:** None (start immediately)  
**Parallel With:** Plan B (Foundation)  
**Blocks:** Real Firebase integration (Plan F)

---

## Context

The backend User schema is missing 22 profile fields the frontend writes during profile setup. The `generateProfileBio` Cloud Function doesn't exist. Two collections (`waitlist`, `referralCodes`) are missing. The subscription status enum doesn't match.

**Source:** [Integration Analysis](../systemic_view/integration-from-frontend-perspective.md) sections 4-5

---

## Deliverables

| # | Deliverable | File(s) | Effort |
|---|-------------|---------|--------|
| 1 | Updated User type with 22 profile fields | `functions/src/types/index.ts` | 1h |
| 2 | Updated onUserCreate trigger | `functions/src/triggers/auth/onUserCreate.ts` | 30m |
| 3 | Updated Firestore security rules | `firestore/firestore.rules` | 30m |
| 4 | Fixed subscription enum ("free" → "none") | 3 files | 15m |
| 5 | Fixed Storage rules (5MB → 10MB) | `storage/storage.rules` | 10m |
| 6 | `generateProfileBio` Cloud Function | `functions/src/callable/generateProfileBio.ts` | 4h |
| 7 | `waitlist` collection + rules | `firestore/firestore.rules` | 30m |
| 8 | `validateReferralCode` callable | `functions/src/callable/validateReferralCode.ts` | 2h |
| 9 | `consumeReferralCode` callable | `functions/src/callable/consumeReferralCode.ts` | 1h |
| 10 | Deploy all changes | `firebase deploy` | 15m |

**Total:** ~10 hours

---

## Task Details

### Task 1: Update User Type

**File:** `Raine-bk/functions/src/types/index.ts`

Add to the existing `User` interface:

```typescript
// Profile Setup fields
firstName: string;
lastInitial: string;
zipCode: string;
city: string;
state: string;
county: string;
cityFeel: CityFeel | null;
childCount: number;
isExpecting: boolean;
dueDate: DueDate | null;
children: Child[];
beforeMotherhood: BeforeMotherhood[];
perfectWeekend: PerfectWeekend[];
feelYourself: FeelYourself | null;
hardTruths: HardTruth[];
unexpectedJoys: UnexpectedJoy[];
aesthetic: Aesthetic[];
momFriendStyle: MomFriendStyle[];
whatBroughtYou: WhatBroughtYou | null;
generatedBio: string;
bioApproved: boolean;
profileSetupCompleted: boolean;
profileSetupCompletedAt?: Timestamp;

// Auth tracking
authProvider?: AuthProvider;
providerUid?: string;
```

Add supporting types:

```typescript
export interface Child { name: string; birthMonth: number; birthYear: number; }
export interface DueDate { month: number; year: number; }
export type AuthProvider = "email" | "facebook.com" | "apple.com" | "linkedin" | "unknown";
export type CityFeel = "rooted" | "finding_footing" | "local_but_missing";
export type BeforeMotherhood = "travel" | "hosting" | "movement" | "nature" | "culture" | "career";
export type PerfectWeekend = "adventure" | "slow_mornings" | "good_company" | "discovery" | "movement" | "family";
export type FeelYourself = "alone_time" | "partner_time" | "friends_night" | "change_scenery";
export type HardTruth = "lose_myself" | "recovery_time" | "mental_load" | "little_sleep" | "grief_joy" | "relationship_change";
export type UnexpectedJoy = "deeper_love" | "person_becoming" | "body_resilience" | "partner_parent" | "function_no_sleep" | "fierce_instincts";
export type Aesthetic = "clean_minimal" | "natural_textured" | "classic_timeless" | "eclectic_collected" | "coastal_casual" | "refined_essentials";
export type MomFriendStyle = "coffee_dates" | "playdates" | "group_hangouts" | "virtual_chats" | "weekend_family" | "workout_buddies";
export type WhatBroughtYou = "new_here" | "friends_no_kids" | "moms_who_get_it" | "deeper_connections";
```

### Task 2: Update onUserCreate

**File:** `Raine-bk/functions/src/triggers/auth/onUserCreate.ts`

Initialize all new profile fields to empty/default values in the user document creation.

### Task 3: Update Security Rules

**File:** `Raine-bk/firestore/firestore.rules`

Allow profile field writes but protect subscription/system fields.

### Task 4: Fix Subscription Enum

Change `"free"` → `"none"` in:
- `functions/src/types/index.ts`
- `functions/src/triggers/auth/onUserCreate.ts`
- `functions/src/webhooks/revenuecat.ts`

### Task 5: Fix Storage Rules

**File:** `Raine-bk/storage/storage.rules`

Change `5 * 1024 * 1024` → `10 * 1024 * 1024` and add explicit format validation.

### Task 6: generateProfileBio

**File:** `Raine-bk/functions/src/callable/generateProfileBio.ts`

Full implementation with OpenAI GPT-4o-mini, rate limiting (5/day), error handling. Requires `openai` npm package and API key in Secret Manager.

### Task 7: Waitlist Collection

Add security rules allowing write-only access for the `waitlist` collection.

### Tasks 8-9: Referral Code Functions

Two callable functions for validating and consuming referral codes against the `referralCodes` collection.

### Task 10: Deploy

```bash
cd Raine-bk
firebase deploy
firebase functions:list  # Verify 12+ functions
```

---

## Verification Checklist

- [ ] `yarn tsc` passes in `functions/` directory
- [ ] `firebase emulators:start` loads all functions
- [ ] `firebase deploy` succeeds
- [ ] Webhook still returns 200 with valid token
- [ ] New callable functions reject unauthenticated calls
- [ ] Bio generation returns a bio string
- [ ] Referral code validation works

---

## What This Unblocks

- Frontend profile setup can save to real Firestore
- Bio generation works end-to-end
- Waitlist collection accepts entries
- Referral code validation is real (not stubbed)
- Subscription status enums match
