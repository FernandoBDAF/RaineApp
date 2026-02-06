# Raine Profile Setup Implementation Plan

**Status:** ✅ 95% Complete  
**Last Updated:** February 2026

## Overview

This plan covers the implementation of the multi-screen profile setup flow that users complete after authentication. The flow consists of 14 screens collecting personal information, preferences, and lifestyle details to enable personalized mom-matching.

**Implementation Status:** All 14 screens are implemented and functional. Minor validation improvements deferred to backlog.

---

## User Flow

```
Login Success
     │
     ▼
┌─────────────────────────────────────────────────────┐
│              Profile Setup Flow (14 screens)         │
│         First-time only • Progress persisted         │
└─────────────────────────────────────────────────────┘
     │
     ├─► 1. Name (first + last initial)
     ├─► 2. Photo (upload)
     ├─► 3. Location (zip code)
     ├─► 4. City Feel (single select)
     ├─► 5. Children (dynamic form)
     ├─► 6. Before Motherhood (multi-select grid, max 3)
     ├─► 7. Perfect Weekend (multi-select grid, max 3)
     ├─► 8. Feel Like Yourself (single select)
     ├─► 9. Hard Truth (multi-select list)
     ├─► 10. Unexpected Joys (multi-select list)
     ├─► 11. Aesthetic (color grid, max 2)
     ├─► 12. Mom Friends (multi-select list)
     ├─► 13. What Brought You (single select)
     └─► 14. Generated Bio (review + confirm)
              │
              ▼
         Main App (Tabs)
```

---

## Screen Specifications

### Screen 1: Name

**Route:** `/(profile-setup)/name`

| Element | Specification |
|---------|---------------|
| Headline | "Let's start with your name" |
| Subheadline | "FIRST NAME AND LAST NAME INITIAL" |
| First Name Input | Required, 1-50 chars, letters only |
| Last Initial Input | Required, exactly 1 letter + auto-append "." |
| Continue Button | Disabled until both valid |

---

### Screen 2: Photo Upload

**Route:** `/(profile-setup)/photo`

| Element | Specification |
|---------|---------------|
| Headline | "We would love to put a face to your name" |
| Subheadline | "RAINE IS BUILT ON REAL CONNECTION" |
| Upload Area | Square, camera icon, "Tap to upload" |
| Accepted Formats | JPG, PNG, HEIC |
| Max Size | 10MB |
| Min Resolution | 300x300px |
| Continue Button | Disabled until photo uploaded |

**Implementation Notes:**
- Use `expo-image-picker` for camera/gallery
- Resize with `expo-image-manipulator` before upload
- Upload to Firebase Storage
- Show circular preview after selection

---

### Screen 3: Location (Zip Code)

**Route:** `/(profile-setup)/location`

| Element | Specification |
|---------|---------------|
| Headline | "Where do you call home?" |
| Subheadline | "WE'LL INTRODUCE YOU TO MOMS WORTH KNOWING — WHO HAPPEN TO LIVE NEARBY" |
| Input | 5 individual digit boxes |
| Validation | Must be valid US zip code |
| Auto-populate | City/State from zip lookup |
| Geo-Gate | SF Bay Area counties only |
| Continue Button | Disabled until valid Bay Area zip |

**Approved Counties:**
- San Francisco
- Marin
- Contra Costa
- Alameda
- San Mateo
- Santa Clara
- Sonoma
- Napa

**Out-of-Area Flow:**
- Show modal: "Raine is currently only available in the San Francisco Bay Area"
- Email input for waitlist
- Store: email, zip, city, state, county, timestamp

---

### Screen 4: City Feel

**Route:** `/(profile-setup)/city-feel`

| Element | Specification |
|---------|---------------|
| Headline | "In this city, you feel..." |
| Type | Single select |
| Options | 3 choices |
| Continue Button | Disabled until selection made |

**Options:**
1. "Rooted—this is home"
2. "Still finding your footing"
3. "Like a local, but missing where you're from"

---

### Screen 5: Children

**Route:** `/(profile-setup)/children`

| Element | Specification |
|---------|---------------|
| Headline | "Tell us about your children" |
| Subheadline | "How many children do you have?" |
| Number Selector | 1, 2, 3, 4+ (pill buttons) |
| Expecting Toggle | "I'm Expecting" button |
| Due Date | Month/Year dropdowns (if expecting) |
| Per Child | Name input + Birth Month/Year dropdowns |
| Continue Button | Disabled until all fields complete |

**Validation:**
- Birth date cannot be in future
- Birth date cannot be >18 years ago
- Due date must be in future

---

### Screen 6: Before Motherhood

**Route:** `/(profile-setup)/before-motherhood`

| Element | Specification |
|---------|---------------|
| Headline | "Before motherhood, your life revolved around..." |
| Subheadline | "SELECT UP TO 3" |
| Type | Multi-select grid (2 columns) |
| Max Selections | 3 |
| Continue Button | Disabled until at least 1 selected |

**Options (with descriptions):**
| ID | Title | Description |
|----|-------|-------------|
| travel | Travel | "get me to the next city (or country!)" |
| hosting | Hosting | "give me an excuse to have people over" |
| movement | Movement | "running, pilates, yoga—whatever gets me moving" |
| nature | Nature | "if it's green and outside, I'm there" |
| culture | Culture | "museums, music, theater—feed my soul" |
| career | Career | "ambition was (is) my middle name" |

---

### Screen 7: Perfect Weekend

**Route:** `/(profile-setup)/perfect-weekend`

| Element | Specification |
|---------|---------------|
| Headline | "The perfect weekend meant..." |
| Subheadline | "SELECT UP TO 3" |
| Type | Multi-select grid (2 columns) |
| Max Selections | 3 |
| Continue Button | Disabled until at least 1 selected |

**Options (with descriptions):**
| ID | Title | Description |
|----|-------|-------------|
| adventure | Adventure | "spontaneous plans and zero itinerary" |
| slow_mornings | Slow Mornings | "good coffee, no alarm, maybe brunch?" |
| good_company | Good Company | "long meals, great wine, even better conversation" |
| discovery | Discovery | "new places, new things, new obsessions" |
| movement | Movement | "endorphins first, everything else second" |
| family | Family | "the people who know you best" |

---

### Screen 8: Feel Like Yourself

**Route:** `/(profile-setup)/feel-yourself`

| Element | Specification |
|---------|---------------|
| Headline | "To feel like yourself again, you need..." |
| Type | Single select |
| Options | 4 choices |
| Continue Button | Disabled until selection made |

**Options:**
1. "Time completely alone (like, truly alone)"
2. "Quality time with your partner"
3. "A night out with friends"
4. "A change of scenery"

---

### Screen 9: Hard Truth

**Route:** `/(profile-setup)/hard-truth`

| Element | Specification |
|---------|---------------|
| Headline | "The hard truth about motherhood I wish someone had told me..." |
| Subheadline | "SELECT ALL THAT APPLY" |
| Type | Multi-select list |
| Min Selections | 1 |
| Continue Button | Disabled until at least 1 selected |

**Options:**
1. "That I'd lose myself for a while"
2. "How long recovery really takes"
3. "How much of the mental load I'd carry"
4. "What little sleep actually means"
5. "That grief & joy would coexist"
6. "How my relationship would change"

---

### Screen 10: Unexpected Joys

**Route:** `/(profile-setup)/unexpected-joys`

| Element | Specification |
|---------|---------------|
| Headline | "The unexpected joys of motherhood that have surprised you most?" |
| Subheadline | "SELECT ALL THAT APPLY" |
| Type | Multi-select list |
| Min Selections | 1 |
| Continue Button | Disabled until at least 1 selected |

**Options:**
1. "How much deeper love can go"
2. "The person I'm becoming"
3. "My body's strength & resilience"
4. "Watching my partner as a parent"
5. "My capacity to function on no sleep"
6. "How fierce my instincts are"

---

### Screen 11: Aesthetic

**Route:** `/(profile-setup)/aesthetic`

| Element | Specification |
|---------|---------------|
| Headline | "How would you describe your aesthetic?" |
| Subheadline | "SELECT UP TO 2" |
| Type | Color grid (2 columns) |
| Max Selections | 2 |
| Continue Button | Disabled until at least 1 selected |

**Options (with placeholder colors):**
| Label | Color |
|-------|-------|
| Clean & minimal | #F5F5F5 (light gray) |
| Natural & textured | #D4C4A8 (beige) |
| Classic & timeless | #2C3E50 (dark blue) |
| Eclectic & collected | #E74C3C (red) |
| Coastal casual | #5DADE2 (sky blue) |
| Refined essentials | #BDC3C7 (silver) |

**Note:** Uses colored placeholder cards. Real images can be swapped in later.

---

### Screen 12: Mom Friends

**Route:** `/(profile-setup)/mom-friends`

| Element | Specification |
|---------|---------------|
| Headline | "When it comes to making mom friends..." |
| Subheadline | "SELECT ALL THAT APPLY" |
| Type | Multi-select list |
| Min Selections | 1 |
| Continue Button | Disabled until at least 1 selected |

**Options:**
1. "Coffee dates (kid-free if possible!)"
2. "Playdates at the park"
3. "Group hangouts & events"
4. "Virtual chats & voice notes"
5. "Weekend family hangs"
6. "Workout buddies"

---

### Screen 13: What Brought You

**Route:** `/(profile-setup)/what-brought-you`

| Element | Specification |
|---------|---------------|
| Headline | "What brought you to Raine?" |
| Type | Single select |
| Options | 4 choices |
| Continue Button | Disabled until selection made |

**Options:**
1. "I'm new here and need my village"
2. "My current friends don't have kids yet"
3. "Looking for moms who really get it"
4. "Want deeper connections beyond small talk"

---

### Screen 14: Generated Bio

**Route:** `/(profile-setup)/bio`

| Element | Specification |
|---------|---------------|
| Headline | "Here's your bio" |
| Bio Display | Bordered card with italic AI-generated text |
| Loading State | Spinner while generating bio via Cloud Function |
| Question | "Does this sound like you?" |
| Feedback Buttons | "Not quite" / "That's me!" |
| Complete Button | Enabled after "That's me!" |

**Bio Generation (AI):**
- Call `generateProfileBio` Cloud Function with all profile data
- OpenAI generates warm, personalized 2-3 sentence bio
- If "Not quite" → call `regenerateBio` with feedback to generate new version
- Show loading spinner during API calls

---

## Technical Implementation

### Phase 1: Dependencies

```bash
yarn add expo-image-picker expo-image-manipulator
```

---

### Phase 2: File Structure

```
src/
├── app/
│   ├── (profile-setup)/
│   │   ├── _layout.tsx           # Stack with progress header
│   │   ├── name.tsx              # Screen 1
│   │   ├── photo.tsx             # Screen 2
│   │   ├── location.tsx          # Screen 3
│   │   ├── city-feel.tsx         # Screen 4
│   │   ├── children.tsx          # Screen 5
│   │   ├── before-motherhood.tsx # Screen 6
│   │   ├── perfect-weekend.tsx   # Screen 7
│   │   ├── feel-yourself.tsx     # Screen 8
│   │   ├── hard-truth.tsx        # Screen 9
│   │   ├── unexpected-joys.tsx   # Screen 10
│   │   ├── aesthetic.tsx         # Screen 11
│   │   ├── mom-friends.tsx       # Screen 12
│   │   ├── what-brought-you.tsx  # Screen 13
│   │   └── bio.tsx               # Screen 14
├── components/
│   └── profile-setup/
│       ├── ProgressDots.tsx      # Horizontal progress indicator
│       ├── SetupHeader.tsx       # Header with progress
│       ├── SelectionCard.tsx     # Single/multi select card
│       ├── GridCard.tsx          # 2-col card with title + desc
│       ├── ColorGridCard.tsx     # Color placeholder card (aesthetic)
│       ├── ZipCodeInput.tsx      # 5-digit box input
│       ├── ChildForm.tsx         # Dynamic child entry
│       ├── PhotoUpload.tsx       # Photo picker + preview
│       ├── MonthYearPicker.tsx   # Dropdown date selectors
│       └── ContinueButton.tsx    # Full-width bottom button
├── services/
│   ├── profile/
│   │   └── index.ts              # Profile CRUD
│   ├── location/
│   │   ├── index.ts              # Zip code lookup API
│   │   └── zipToCounty.ts        # Manual county mapping
│   └── bio/
│       └── index.ts              # AI bio generation
├── store/
│   └── profileSetupStore.ts      # Zustand store for form state
├── types/
│   └── profile-setup.ts          # TypeScript interfaces
└── constants/
    └── profile-options.ts        # All selection options
```

---

### Phase 3: Type Definitions

**File:** `src/types/profile-setup.ts`

```typescript
export interface Child {
  name: string;
  birthMonth: number;
  birthYear: number;
}

export interface DueDate {
  month: number;
  year: number;
}

export type CityFeel = 'rooted' | 'finding_footing' | 'local_but_missing';

export type BeforeMotherhood = 'travel' | 'hosting' | 'movement' | 'nature' | 'culture' | 'career';

export type PerfectWeekend = 'adventure' | 'slow_mornings' | 'good_company' | 'discovery' | 'movement' | 'family';

export type FeelYourself = 'alone_time' | 'partner_time' | 'friends_night' | 'change_scenery';

export type HardTruth = 
  | 'lose_myself'
  | 'recovery_time'
  | 'mental_load'
  | 'little_sleep'
  | 'grief_joy'
  | 'relationship_change';

export type UnexpectedJoy =
  | 'deeper_love'
  | 'person_becoming'
  | 'body_resilience'
  | 'partner_parent'
  | 'function_no_sleep'
  | 'fierce_instincts';

export type Aesthetic =
  | 'clean_minimal'
  | 'natural_textured'
  | 'classic_timeless'
  | 'eclectic_collected'
  | 'coastal_casual'
  | 'refined_essentials';

export type MomFriendStyle =
  | 'coffee_dates'
  | 'playdates'
  | 'group_hangouts'
  | 'virtual_chats'
  | 'weekend_family'
  | 'workout_buddies';

export type WhatBroughtYou =
  | 'new_here'
  | 'friends_no_kids'
  | 'moms_who_get_it'
  | 'deeper_connections';

export interface ProfileSetupData {
  // Screen 1
  firstName: string;
  lastInitial: string;
  
  // Screen 2
  photoURL: string;
  
  // Screen 3
  zipCode: string;
  city: string;
  state: string;
  county: string;
  
  // Screen 4
  cityFeel: CityFeel | null;
  
  // Screen 5
  childCount: number;
  isExpecting: boolean;
  dueDate: DueDate | null;
  children: Child[];
  
  // Screen 6
  beforeMotherhood: BeforeMotherhood[];
  
  // Screen 7
  perfectWeekend: PerfectWeekend[];
  
  // Screen 8
  feelYourself: FeelYourself | null;
  
  // Screen 9
  hardTruths: HardTruth[];
  
  // Screen 10
  unexpectedJoys: UnexpectedJoy[];
  
  // Screen 11
  aesthetic: Aesthetic[];
  
  // Screen 12
  momFriendStyle: MomFriendStyle[];
  
  // Screen 13
  whatBroughtYou: WhatBroughtYou | null;
  
  // Screen 14
  generatedBio: string;
  bioApproved: boolean;
  
  // Meta
  currentStep: number;
  completed: boolean;
}
```

---

### Phase 4: Zustand Store

**File:** `src/store/profileSetupStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import type { ProfileSetupData, Child } from '../types/profile-setup';

interface ProfileSetupStore extends ProfileSetupData {
  // Actions
  setName: (firstName: string, lastInitial: string) => void;
  setPhoto: (url: string) => void;
  setLocation: (zipCode: string, city: string, state: string, county: string) => void;
  setCityFeel: (feel: ProfileSetupData['cityFeel']) => void;
  setChildren: (count: number, children: Child[], isExpecting: boolean, dueDate: ProfileSetupData['dueDate']) => void;
  setBeforeMotherhood: (selections: ProfileSetupData['beforeMotherhood']) => void;
  setPerfectWeekend: (selections: ProfileSetupData['perfectWeekend']) => void;
  setFeelYourself: (selection: ProfileSetupData['feelYourself']) => void;
  setHardTruths: (selections: ProfileSetupData['hardTruths']) => void;
  setUnexpectedJoys: (selections: ProfileSetupData['unexpectedJoys']) => void;
  setAesthetic: (selections: ProfileSetupData['aesthetic']) => void;
  setMomFriendStyle: (selections: ProfileSetupData['momFriendStyle']) => void;
  setWhatBroughtYou: (selection: ProfileSetupData['whatBroughtYou']) => void;
  setBio: (bio: string, approved: boolean) => void;
  setCurrentStep: (step: number) => void;
  completeSetup: () => void;
  reset: () => void;
}

const initialState: ProfileSetupData = {
  firstName: '',
  lastInitial: '',
  photoURL: '',
  zipCode: '',
  city: '',
  state: '',
  county: '',
  cityFeel: null,
  childCount: 0,
  isExpecting: false,
  dueDate: null,
  children: [],
  beforeMotherhood: [],
  perfectWeekend: [],
  feelYourself: null,
  hardTruths: [],
  unexpectedJoys: [],
  aesthetic: [],
  momFriendStyle: [],
  whatBroughtYou: null,
  generatedBio: '',
  bioApproved: false,
  currentStep: 1,
  completed: false
};

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setName: (firstName, lastInitial) => set({ firstName, lastInitial }),
      setPhoto: (photoURL) => set({ photoURL }),
      setLocation: (zipCode, city, state, county) => set({ zipCode, city, state, county }),
      setCityFeel: (cityFeel) => set({ cityFeel }),
      setChildren: (childCount, children, isExpecting, dueDate) => 
        set({ childCount, children, isExpecting, dueDate }),
      setBeforeMotherhood: (beforeMotherhood) => set({ beforeMotherhood }),
      setPerfectWeekend: (perfectWeekend) => set({ perfectWeekend }),
      setFeelYourself: (feelYourself) => set({ feelYourself }),
      setHardTruths: (hardTruths) => set({ hardTruths }),
      setUnexpectedJoys: (unexpectedJoys) => set({ unexpectedJoys }),
      setAesthetic: (aesthetic) => set({ aesthetic }),
      setMomFriendStyle: (momFriendStyle) => set({ momFriendStyle }),
      setWhatBroughtYou: (whatBroughtYou) => set({ whatBroughtYou }),
      setBio: (generatedBio, bioApproved) => set({ generatedBio, bioApproved }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      completeSetup: () => set({ completed: true }),
      reset: () => set(initialState)
    }),
    {
      name: 'profile-setup',
      storage: mmkvStorage
    }
  )
);
```

---

### Phase 5: Constants

**File:** `src/constants/profile-options.ts`

```typescript
export const CITY_FEEL_OPTIONS = [
  { id: 'rooted', label: 'Rooted—this is home' },
  { id: 'finding_footing', label: 'Still finding your footing' },
  { id: 'local_but_missing', label: "Like a local, but missing where you're from" }
] as const;

export const BEFORE_MOTHERHOOD_OPTIONS = [
  { id: 'travel', title: 'Travel', description: 'get me to the next city (or country!)' },
  { id: 'hosting', title: 'Hosting', description: 'give me an excuse to have people over' },
  { id: 'movement', title: 'Movement', description: 'running, pilates, yoga—whatever gets me moving' },
  { id: 'nature', title: 'Nature', description: "if it's green and outside, I'm there" },
  { id: 'culture', title: 'Culture', description: 'museums, music, theater—feed my soul' },
  { id: 'career', title: 'Career', description: 'ambition was (is) my middle name' }
] as const;

export const PERFECT_WEEKEND_OPTIONS = [
  { id: 'adventure', title: 'Adventure', description: 'spontaneous plans and zero itinerary' },
  { id: 'slow_mornings', title: 'Slow Mornings', description: 'good coffee, no alarm, maybe brunch?' },
  { id: 'good_company', title: 'Good Company', description: 'long meals, great wine, even better conversation' },
  { id: 'discovery', title: 'Discovery', description: 'new places, new things, new obsessions' },
  { id: 'movement', title: 'Movement', description: 'endorphins first, everything else second' },
  { id: 'family', title: 'Family', description: 'the people who know you best' }
] as const;

export const FEEL_YOURSELF_OPTIONS = [
  { id: 'alone_time', label: 'Time completely alone (like, truly alone)' },
  { id: 'partner_time', label: 'Quality time with your partner' },
  { id: 'friends_night', label: 'A night out with friends' },
  { id: 'change_scenery', label: 'A change of scenery' }
] as const;

export const HARD_TRUTH_OPTIONS = [
  { id: 'lose_myself', label: "That I'd lose myself for a while" },
  { id: 'recovery_time', label: 'How long recovery really takes' },
  { id: 'mental_load', label: "How much of the mental load I'd carry" },
  { id: 'little_sleep', label: 'What little sleep actually means' },
  { id: 'grief_joy', label: 'That grief & joy would coexist' },
  { id: 'relationship_change', label: 'How my relationship would change' }
] as const;

export const UNEXPECTED_JOY_OPTIONS = [
  { id: 'deeper_love', label: 'How much deeper love can go' },
  { id: 'person_becoming', label: "The person I'm becoming" },
  { id: 'body_resilience', label: "My body's strength & resilience" },
  { id: 'partner_parent', label: 'Watching my partner as a parent' },
  { id: 'function_no_sleep', label: 'My capacity to function on no sleep' },
  { id: 'fierce_instincts', label: 'How fierce my instincts are' }
] as const;

export const AESTHETIC_OPTIONS = [
  { id: 'clean_minimal', label: 'Clean & minimal', color: '#F5F5F5' },
  { id: 'natural_textured', label: 'Natural & textured', color: '#D4C4A8' },
  { id: 'classic_timeless', label: 'Classic & timeless', color: '#2C3E50' },
  { id: 'eclectic_collected', label: 'Eclectic & collected', color: '#E74C3C' },
  { id: 'coastal_casual', label: 'Coastal casual', color: '#5DADE2' },
  { id: 'refined_essentials', label: 'Refined essentials', color: '#BDC3C7' }
] as const;

export const MOM_FRIEND_STYLE_OPTIONS = [
  { id: 'coffee_dates', label: 'Coffee dates (kid-free if possible!)' },
  { id: 'playdates', label: 'Playdates at the park' },
  { id: 'group_hangouts', label: 'Group hangouts & events' },
  { id: 'virtual_chats', label: 'Virtual chats & voice notes' },
  { id: 'weekend_family', label: 'Weekend family hangs' },
  { id: 'workout_buddies', label: 'Workout buddies' }
] as const;

export const WHAT_BROUGHT_YOU_OPTIONS = [
  { id: 'new_here', label: "I'm new here and need my village" },
  { id: 'friends_no_kids', label: "My current friends don't have kids yet" },
  { id: 'moms_who_get_it', label: 'Looking for moms who really get it' },
  { id: 'deeper_connections', label: 'Want deeper connections beyond small talk' }
] as const;

export const APPROVED_COUNTIES = [
  'San Francisco',
  'Marin',
  'Contra Costa',
  'Alameda',
  'San Mateo',
  'Santa Clara',
  'Sonoma',
  'Napa'
] as const;

export const TOTAL_STEPS = 14;
```

---

### Phase 6: Services

**File:** `src/services/location/index.ts`

```typescript
import { getCountyFromZip, isApprovedZip } from './zipToCounty';

interface ZipLookupResult {
  valid: boolean;
  city?: string;
  state?: string;
  county?: string;
  isApproved?: boolean;
  error?: string;
}

export async function lookupZipCode(zipCode: string): Promise<ZipLookupResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { valid: false, error: 'Please enter a valid zip code' };
  }

  // First check our local Bay Area mapping
  const county = getCountyFromZip(zipCode);
  const isApproved = isApprovedZip(zipCode);

  try {
    // Get city/state from Zippopotam.us API
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    
    if (!response.ok) {
      return { valid: false, error: "This zip code doesn't exist" };
    }
    
    const data = await response.json();
    const place = data.places?.[0];
    
    if (!place) {
      return { valid: false, error: "This zip code doesn't exist" };
    }
    
    return {
      valid: true,
      city: place['place name'],
      state: place['state abbreviation'],
      county: county || 'Unknown', // Use our mapping, fallback to Unknown
      isApproved
    };
  } catch {
    // If API fails but we have local mapping, still allow
    if (county) {
      return {
        valid: true,
        city: 'Unknown',
        state: 'CA',
        county,
        isApproved: true
      };
    }
    return { valid: false, error: 'Unable to verify zip code' };
  }
}

export { getCountyFromZip, isApprovedZip } from './zipToCounty';
```

**File:** `src/services/profile/index.ts`

```typescript
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import type { ProfileSetupData } from '../../types/profile-setup';

export async function saveProfileSetup(uid: string, data: ProfileSetupData): Promise<void> {
  await firestore().collection('users').doc(uid).update({
    ...data,
    profileSetupCompleted: true,
    profileSetupCompletedAt: firestore.FieldValue.serverTimestamp()
  });
}

export async function uploadProfilePhoto(uid: string, uri: string): Promise<string> {
  const reference = storage().ref(`users/${uid}/profile.jpg`);
  await reference.putFile(uri);
  return reference.getDownloadURL();
}

export async function addToWaitlist(data: {
  email: string;
  zipCode: string;
  city: string;
  state: string;
  county: string;
}): Promise<void> {
  await firestore().collection('waitlist').add({
    ...data,
    source: 'onboarding',
    createdAt: firestore.FieldValue.serverTimestamp()
  });
}
```

---

### Phase 7: UI Components

#### 7.1 ProgressDots

**File:** `src/components/profile-setup/ProgressDots.tsx`

```typescript
import React from 'react';
import { View } from 'react-native';
import { TOTAL_STEPS } from '../../constants/profile-options';

interface ProgressDotsProps {
  currentStep: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ currentStep }) => {
  return (
    <View className="flex-row justify-center gap-1 py-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full ${
            index < currentStep ? 'bg-orange-500' : 'bg-slate-200'
          }`}
        />
      ))}
    </View>
  );
};
```

#### 7.2 SelectionCard

**File:** `src/components/profile-setup/SelectionCard.tsx`

```typescript
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  showCheckbox?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  selected,
  onPress,
  showCheckbox = false
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-lg border-2 px-4 py-4 ${
        selected ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
      }`}
    >
      <Text className="flex-1 text-base text-slate-800">{label}</Text>
      {showCheckbox && (
        <View
          className={`h-5 w-5 rounded border-2 ${
            selected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
          }`}
        >
          {selected && <Text className="text-center text-xs text-white">✓</Text>}
        </View>
      )}
    </Pressable>
  );
};
```

#### 7.3 GridCard

**File:** `src/components/profile-setup/GridCard.tsx`

```typescript
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface GridCardProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export const GridCard: React.FC<GridCardProps> = ({
  title,
  description,
  selected,
  onPress
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 rounded-lg border-2 p-4 ${
        selected ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
      }`}
    >
      <Text className="text-center text-base font-semibold text-slate-800">{title}</Text>
      <Text className="mt-1 text-center text-sm text-slate-500">{description}</Text>
    </Pressable>
  );
};
```

#### 7.4 ColorGridCard

**File:** `src/components/profile-setup/ColorGridCard.tsx`

```typescript
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ColorGridCardProps {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

export const ColorGridCard: React.FC<ColorGridCardProps> = ({
  label,
  color,
  selected,
  onPress
}) => {
  // Determine text color based on background brightness
  const isLightBackground = color.toLowerCase() > '#888888';
  
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 aspect-square rounded-lg overflow-hidden ${
        selected ? 'border-4 border-orange-500' : 'border-2 border-transparent'
      }`}
    >
      <View
        style={{ backgroundColor: color }}
        className="flex-1 items-center justify-center p-3"
      >
        <Text
          className={`text-center text-sm font-medium ${
            isLightBackground ? 'text-slate-800' : 'text-white'
          }`}
        >
          {label}
        </Text>
      </View>
      {selected && (
        <View className="absolute top-2 right-2 h-5 w-5 rounded-full bg-orange-500 items-center justify-center">
          <Text className="text-xs text-white">✓</Text>
        </View>
      )}
    </Pressable>
  );
};
```

---

#### 7.5 ContinueButton

**File:** `src/components/profile-setup/ContinueButton.tsx`

```typescript
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  disabled = false,
  label = 'CONTINUE'
}) => {
  return (
    <View className="px-6 pb-8 pt-4">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`rounded-lg py-4 ${
          disabled ? 'bg-slate-200' : 'bg-orange-500'
        }`}
      >
        <Text
          className={`text-center text-sm font-semibold tracking-widest ${
            disabled ? 'text-slate-400' : 'text-white'
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};
```

#### 7.6 SetupHeader

**File:** `src/components/profile-setup/SetupHeader.tsx`

```typescript
import React from 'react';
import { Text, View } from 'react-native';

interface SetupHeaderProps {
  headline: string;
  subheadline?: string;
}

export const SetupHeader: React.FC<SetupHeaderProps> = ({ headline, subheadline }) => {
  return (
    <View className="px-6 pt-6">
      <Text className="text-2xl font-serif text-slate-900">{headline}</Text>
      {subheadline && (
        <Text className="mt-2 text-xs font-semibold uppercase tracking-widest text-orange-500">
          {subheadline}
        </Text>
      )}
    </View>
  );
};
```

---

### Phase 8: Navigation Updates

**File:** `src/app/(profile-setup)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ProgressDots } from '../../components/profile-setup/ProgressDots';
import { useProfileSetupStore } from '../../store/profileSetupStore';

export default function ProfileSetupLayout() {
  const currentStep = useProfileSetupStore((state) => state.currentStep);

  return (
    <View className="flex-1 bg-white">
      <ProgressDots currentStep={currentStep} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_right'
        }}
      />
    </View>
  );
}
```

**Update:** `src/app/_layout.tsx`

Add `(profile-setup)` to the Stack and update routing logic to check for profile completion:

```typescript
// In RootLayoutContent, add:
const profileCompleted = useProfileSetupStore((state) => state.completed);

// Update navigation effect:
if (isAuthenticated && !profileCompleted && !inProfileSetup) {
  router.replace('/(profile-setup)/name');
}
```

---

### Phase 9: Screen Implementation Order

| Priority | Screens | Complexity | Components Needed |
|----------|---------|------------|-------------------|
| 1 | Name | Low | SetupHeader, ContinueButton |
| 2 | City Feel, Feel Yourself, What Brought You | Low | SelectionCard |
| 3 | Hard Truth, Unexpected Joys, Mom Friends | Low | SelectionCard (multi) |
| 4 | Before Motherhood, Perfect Weekend | Medium | GridCard |
| 5 | Children | High | ChildForm, MonthYearPicker |
| 6 | Location | High | ZipCodeInput, zipToCounty, Out-of-area modal |
| 7 | Photo | High | PhotoUpload, Image picker |
| 8 | Aesthetic | Low | ColorGridCard (placeholders) |
| 9 | Bio | Medium | AI generation via Cloud Function |

---

## Implementation Checklist

### Phase 1: Foundation ✅ COMPLETE
- [x] Install dependencies (expo-image-picker, expo-image-manipulator)
- [x] Create `src/types/profile-setup.ts`
- [x] Create `src/constants/profile-options.ts`
- [x] Create `src/store/profileSetupStore.ts`

### Phase 2: Core Components ✅ COMPLETE
- [x] Create `ProgressDots.tsx`
- [x] Create `SetupHeader.tsx`
- [x] Create `ContinueButton.tsx`
- [x] Create `SelectionCard.tsx`
- [x] Create `GridCard.tsx`

### Phase 3: Simple Screens ✅ COMPLETE
- [x] Create `(profile-setup)/_layout.tsx`
- [x] Create `name.tsx`
- [x] Create `city-feel.tsx`
- [x] Create `feel-yourself.tsx`
- [x] Create `what-brought-you.tsx`

### Phase 4: Multi-Select Screens ✅ COMPLETE
- [x] Create `hard-truth.tsx`
- [x] Create `unexpected-joys.tsx`
- [x] Create `mom-friends.tsx`

### Phase 5: Grid Screens ✅ COMPLETE
- [x] Create `before-motherhood.tsx`
- [x] Create `perfect-weekend.tsx`

### Phase 6: Complex Screens ✅ COMPLETE
- [x] Create `services/location/zipToCounty.ts` (manual Bay Area mapping)
- [x] Create `services/location/index.ts` (zip lookup with county)
- [x] Create `ZipCodeInput.tsx`
- [x] Create `location.tsx` with geo-gate logic
- [x] Create out-of-area modal with waitlist
- [x] Create `ChildForm.tsx` and `MonthYearPicker.tsx`
- [x] Create `children.tsx`

### Phase 7: Photo & Aesthetic ✅ COMPLETE
- [x] Create `PhotoUpload.tsx`
- [x] Create `photo.tsx`
- [x] Create `ColorGridCard.tsx` (placeholder colors)
- [x] Create `aesthetic.tsx`

### Phase 8: Bio Generation (AI) ✅ COMPLETE
- [x] Create `services/bio/index.ts` (Firebase Cloud Function call)
- [x] Create `bio.tsx` with loading state and regenerate option
- [x] Document backend Cloud Function requirements

### Phase 9: Integration ✅ COMPLETE
- [x] Update root `_layout.tsx` with profile setup routing
- [x] Create `services/profile/index.ts` for Firestore save
- [x] Create `services/location/index.ts` for zip lookup
- [x] Test full flow end-to-end

### Phase 10: Polish ⚠️ PARTIAL
- [x] Add animations/transitions
- [ ] Handle keyboard avoidance (deferred to backlog)
- [x] Test on iOS and Android
- [x] Handle offline state (via mock mode)

---

## Implementation Status: ~95% Complete

✅ **Completed:**
- All 14 screens implemented and functional
- All UI components created
- All services (bio, location, profile) implemented
- State management with Zustand + MMKV
- Firebase mock mode support
- Navigation and routing
- Error handling and fallbacks

⚠️ **Needs Polish (see backlog):**
- Photo screen validation (min resolution, max size)
- Children screen date validation
- Keyboard avoidance
- Accessibility labels

🚧 **Requires Backend:**
- Real Firebase configuration
- `generateProfileBio` Cloud Function with OpenAI
- Firestore security rules
- Firebase Storage security rules

---

## Backend Integration Points

| Feature | Type | Details |
|---------|------|---------|
| Profile Data | Firestore `users/{uid}` | All ProfileSetupData fields |
| Waitlist | Firestore `waitlist` | email, zipCode, city, state, county, source, createdAt |
| Profile Photo | Storage `users/{uid}/profile.jpg` | Resized before upload |
| Bio Generation | Cloud Function `generateProfileBio` | Requires OpenAI API key in secrets |

### Cloud Function Requirements

The `generateProfileBio` Cloud Function needs to be created in the backend project:

```
Required:
- Firebase Cloud Functions v2
- OpenAI API key stored in Firebase secrets
- Input: ProfileSetupData object
- Output: { bio: string }
- Rate limiting recommended
```

---

## Design Decisions

### 1. Typography
Use system serif font via NativeWind for simplicity:
```typescript
// In tailwind.config.js, extend fontFamily:
fontFamily: {
  serif: ['Georgia', 'Times New Roman', 'serif']
}
```
This avoids custom font loading complexity while maintaining the serif aesthetic.

### 2. Brand Colors
Primary accent: `#F4511E` (orange). Update `colors.ts` with full palette.

### 3. Aesthetic Images
Use **placeholder colored backgrounds with labels** for v1:
```typescript
export const AESTHETIC_OPTIONS = [
  { id: 'clean_minimal', label: 'Clean & minimal', color: '#F5F5F5' },
  { id: 'natural_textured', label: 'Natural & textured', color: '#D4C4A8' },
  { id: 'classic_timeless', label: 'Classic & timeless', color: '#2C3E50' },
  { id: 'eclectic_collected', label: 'Eclectic & collected', color: '#E74C3C' },
  { id: 'coastal_casual', label: 'Coastal casual', color: '#5DADE2' },
  { id: 'refined_essentials', label: 'Refined essentials', color: '#BDC3C7' }
] as const;
```
Real images can be added later without code changes.

### 4. Bio Generation (AI Integration)
Integrate with OpenAI or Firebase Cloud Functions from day one:

**File:** `src/services/bio/index.ts`
```typescript
import functions from '@react-native-firebase/functions';
import type { ProfileSetupData } from '../../types/profile-setup';

export async function generateBio(profile: ProfileSetupData): Promise<string> {
  const generateBioFn = functions().httpsCallable('generateProfileBio');
  const result = await generateBioFn({ profile });
  return result.data.bio;
}

export async function regenerateBio(
  profile: ProfileSetupData,
  feedback?: string
): Promise<string> {
  const generateBioFn = functions().httpsCallable('generateProfileBio');
  const result = await generateBioFn({ profile, feedback, regenerate: true });
  return result.data.bio;
}
```

**Backend Cloud Function (for reference):**
```typescript
// functions/src/generateProfileBio.ts
export const generateProfileBio = functions.https.onCall(async (data, context) => {
  const { profile, feedback, regenerate } = data;
  
  const prompt = buildBioPrompt(profile, feedback, regenerate);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200
  });
  
  return { bio: response.choices[0].message.content };
});

function buildBioPrompt(profile: ProfileSetupData, feedback?: string, regenerate?: boolean): string {
  return `Generate a warm, authentic bio (2-3 sentences) for a mom on Raine, a connection app.

Profile:
- Name: ${profile.firstName}
- Location: ${profile.city}, ${profile.state}
- City feel: ${profile.cityFeel}
- Children: ${profile.childCount} (ages: ${profile.children.map(c => calculateAge(c)).join(', ')})
- Before motherhood: ${profile.beforeMotherhood.join(', ')}
- Perfect weekend: ${profile.perfectWeekend.join(', ')}
- To feel like herself: ${profile.feelYourself}
- Aesthetic: ${profile.aesthetic.join(', ')}
- Looking for: ${profile.whatBroughtYou}

Write in first person. Be warm and conversational. Mention 1-2 specific interests.
${regenerate && feedback ? `Previous bio feedback: "${feedback}". Generate a different version.` : ''}`;
}
```

### 5. Zip Code to County Mapping
Manual mapping for the 8 approved Bay Area counties:

**File:** `src/services/location/zipToCounty.ts`
```typescript
// SF Bay Area zip code ranges by county
const ZIP_COUNTY_MAP: Record<string, string[]> = {
  'San Francisco': ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94119', '94120', '94121', '94122', '94123', '94124', '94125', '94126', '94127', '94128', '94129', '94130', '94131', '94132', '94133', '94134', '94137', '94139', '94140', '94141', '94142', '94143', '94144', '94145', '94146', '94147', '94151', '94158', '94159', '94160', '94161', '94163', '94164', '94172', '94177', '94188'],
  'Marin': ['94901', '94903', '94904', '94912', '94913', '94914', '94915', '94920', '94924', '94925', '94929', '94930', '94933', '94937', '94938', '94939', '94940', '94941', '94942', '94945', '94946', '94947', '94948', '94949', '94950', '94956', '94957', '94960', '94963', '94964', '94965', '94966', '94970', '94971', '94973', '94974', '94976', '94977', '94978', '94979', '94998', '94999'],
  'Contra Costa': ['94505', '94506', '94507', '94509', '94511', '94513', '94514', '94516', '94517', '94518', '94519', '94520', '94521', '94522', '94523', '94524', '94525', '94526', '94527', '94528', '94529', '94530', '94531', '94547', '94548', '94549', '94553', '94556', '94561', '94563', '94564', '94565', '94569', '94570', '94572', '94575', '94582', '94583', '94595', '94596', '94597', '94598'],
  'Alameda': ['94501', '94502', '94536', '94537', '94538', '94539', '94540', '94541', '94542', '94543', '94544', '94545', '94546', '94550', '94551', '94552', '94555', '94557', '94560', '94566', '94568', '94577', '94578', '94579', '94580', '94586', '94587', '94588', '94601', '94602', '94603', '94604', '94605', '94606', '94607', '94608', '94609', '94610', '94611', '94612', '94613', '94614', '94615', '94617', '94618', '94619', '94620', '94621', '94622', '94623', '94624', '94649', '94659', '94660', '94661', '94662', '94666', '94701', '94702', '94703', '94704', '94705', '94706', '94707', '94708', '94709', '94710', '94712', '94720'],
  'San Mateo': ['94002', '94005', '94010', '94011', '94013', '94014', '94015', '94016', '94017', '94018', '94019', '94020', '94021', '94025', '94026', '94027', '94028', '94030', '94037', '94038', '94044', '94060', '94061', '94062', '94063', '94064', '94065', '94066', '94070', '94074', '94080', '94083', '94128', '94401', '94402', '94403', '94404', '94497'],
  'Santa Clara': ['94022', '94023', '94024', '94035', '94039', '94040', '94041', '94042', '94043', '94085', '94086', '94087', '94088', '94089', '94301', '94302', '94303', '94304', '94305', '94306', '94309', '95002', '95008', '95009', '95011', '95013', '95014', '95015', '95020', '95021', '95026', '95030', '95031', '95032', '95035', '95036', '95037', '95038', '95042', '95044', '95046', '95050', '95051', '95052', '95053', '95054', '95055', '95056', '95070', '95071', '95101', '95102', '95103', '95106', '95108', '95109', '95110', '95111', '95112', '95113', '95115', '95116', '95117', '95118', '95119', '95120', '95121', '95122', '95123', '95124', '95125', '95126', '95127', '95128', '95129', '95130', '95131', '95132', '95133', '95134', '95135', '95136', '95138', '95139', '95140', '95141', '95148', '95150', '95151', '95152', '95153', '95154', '95155', '95156', '95157', '95158', '95159', '95160', '95161', '95164', '95170', '95172', '95173', '95190', '95191', '95192', '95193', '95194', '95196'],
  'Sonoma': ['94922', '94923', '94926', '94927', '94928', '94931', '94951', '94952', '94953', '94954', '94955', '94972', '94975', '95401', '95402', '95403', '95404', '95405', '95406', '95407', '95409', '95412', '95416', '95419', '95421', '95425', '95430', '95431', '95433', '95436', '95439', '95441', '95442', '95444', '95446', '95448', '95450', '95452', '95462', '95465', '95471', '95472', '95473', '95476', '95480', '95486', '95487', '95492', '95497'],
  'Napa': ['94503', '94508', '94515', '94558', '94559', '94562', '94567', '94573', '94574', '94576', '94581', '94599']
};

export function getCountyFromZip(zipCode: string): string | null {
  for (const [county, zips] of Object.entries(ZIP_COUNTY_MAP)) {
    if (zips.includes(zipCode)) {
      return county;
    }
  }
  return null;
}

export function isApprovedZip(zipCode: string): boolean {
  return getCountyFromZip(zipCode) !== null;
}
```

### 6. Progress Persistence
Zustand store persists to MMKV, allowing users to resume if they exit mid-flow.
