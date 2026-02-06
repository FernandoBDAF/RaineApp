export type IntroductionStatus = "pending" | "accepted" | "declined" | "expired";

export interface Introduction {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: IntroductionStatus;
  roomId?: string;
  mutualCommunities: number;
  matchDescription: string;
  createdAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export interface SavedConnection {
  userId: string;
  firstName: string;
  lastInitial: string;
  photoURL: string;
  bio: string;
  mutualCommunities: number;
  matchDescription: string;
  savedAt: Date;
}

export interface MatchProfile {
  userId: string;
  firstName: string;
  lastInitial: string;
  photoURL: string;
  city: string;
  state: string;
  children: Array<{ name: string; age: string }>;
  tags: string[];
  matchDescription: string;
  matchScore: number;
  bio: string;
}
