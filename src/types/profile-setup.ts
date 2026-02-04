export interface Child {
  name: string;
  birthMonth: number;
  birthYear: number;
}

export interface DueDate {
  month: number;
  year: number;
}

export type CityFeel = "rooted" | "finding_footing" | "local_but_missing";

export type BeforeMotherhood =
  | "travel"
  | "hosting"
  | "movement"
  | "nature"
  | "culture"
  | "career";

export type PerfectWeekend =
  | "adventure"
  | "slow_mornings"
  | "good_company"
  | "discovery"
  | "movement"
  | "family";

export type FeelYourself =
  | "alone_time"
  | "partner_time"
  | "friends_night"
  | "change_scenery";

export type HardTruth =
  | "lose_myself"
  | "recovery_time"
  | "mental_load"
  | "little_sleep"
  | "grief_joy"
  | "relationship_change";

export type UnexpectedJoy =
  | "deeper_love"
  | "person_becoming"
  | "body_resilience"
  | "partner_parent"
  | "function_no_sleep"
  | "fierce_instincts";

export type Aesthetic =
  | "clean_minimal"
  | "natural_textured"
  | "classic_timeless"
  | "eclectic_collected"
  | "coastal_casual"
  | "refined_essentials";

export type MomFriendStyle =
  | "coffee_dates"
  | "playdates"
  | "group_hangouts"
  | "virtual_chats"
  | "weekend_family"
  | "workout_buddies";

export type WhatBroughtYou =
  | "new_here"
  | "friends_no_kids"
  | "moms_who_get_it"
  | "deeper_connections";

export interface ProfileSetupData {
  firstName: string;
  lastInitial: string;
  photoURL: string;
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
  currentStep: number;
  completed: boolean;
}
