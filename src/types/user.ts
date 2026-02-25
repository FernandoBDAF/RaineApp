import { z } from 'zod';
import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Custom Zod type for Firestore Timestamp
const firestoreTimestampSchema = z.custom<FirebaseFirestoreTypes.Timestamp>(
  (val: unknown): val is FirebaseFirestoreTypes.Timestamp =>
    val != null &&
    typeof val === 'object' &&
    'toDate' in val &&
    typeof (val as { toDate: unknown }).toDate === 'function'
);

const optionalTimestamp = firestoreTimestampSchema
  .optional()
  .transform((val) => val ?? firestore.Timestamp.now());

export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().default(''),
  displayName: z.string().default(''),
  photoURL: z.string().optional(),
  subscriptionStatus: z.string().default('free'),
  createdAt: optionalTimestamp,
  lastSeen: optionalTimestamp,
  firstName: z.string().default(''),
  lastInitial: z.string().default(''),
  zipCode: z.string().default(''),
  city: z.string().default(''),
  state: z.string().default(''),
  county: z.string().default(''),
  cityFeel: z.string().default(''),
  childCount: z.number().default(0),
  isExpecting: z.boolean().default(false),
  dueDate: z
    .union([
      z.object({ month: z.number(), year: z.number() }),
      z.string()
    ])
    .nullable()
    .default(null)
    .transform((val) => {
      if (val == null) return null;
      if (typeof val === 'string') {
        const parts = val.split(/[-/]/).map((p) => Number.parseInt(p, 10));
        if (parts.length < 2 || parts.some(Number.isNaN)) return null;
        const [a, b] = parts;
        const month = a <= 12 ? a : b;
        const year = a <= 12 ? b : a;
        if (month < 1 || month > 12 || year < 1900) return null;
        return { month, year };
      }
      return val;
    }),
  children: z.array(z.unknown()).default([]),
  beforeMotherhood: z.array(z.unknown()).default([]),
  perfectWeekend: z.array(z.unknown()).default([]),
  feelYourself: z.unknown().nullable().default(null),
  hardTruths: z.array(z.unknown()).default([]),
  unexpectedJoys: z.array(z.unknown()).default([]),
  aesthetic: z.array(z.unknown()).default([]),
  momFriendStyle: z.array(z.unknown()).default([]),
  whatBroughtYou: z.unknown().nullable().default(null),
  generatedBio: z.string().default(''),
  bioApproved: z.boolean().default(false),
  profileSetupCompletedAt: firestoreTimestampSchema.nullable().default(null),
  referralCode: z.string().optional(),
  currentStep: z.number().default(1)
});

export type UserProfile = z.infer<typeof userProfileSchema>;
