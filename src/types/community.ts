export type CommunityCategory = "location" | "child_age" | "experience" | "topic" | "stage";
export type CommunityBadge = "LOCATION" | "AGE" | "EXPERIENCE" | "TOPIC" | "STAGE";

export interface Community {
  id: string;
  name: string;
  description: string;
  coverPhotoURL: string;
  category: CommunityCategory;
  badge: CommunityBadge;
  memberCount: number;
  postCount: number;
  lastActivityAt: Date;
  tags: string[];
  isPublic: boolean;
  maxMembers?: number;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  timestamp: Date;
  likeCount: number;
  replyCount: number;
  bookmarkCount: number;
  pinned: boolean;
  notable: boolean;
  liked?: boolean;
  bookmarked?: boolean;
}

export interface PostReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  timestamp: Date;
  likeCount: number;
  liked?: boolean;
}

export interface CommunityMembership {
  communityId: string;
  name: string;
  coverPhotoURL: string;
  joinedAt: Date;
  lastRead?: Date;
  notificationsEnabled: boolean;
}

export interface SavedPost {
  postId: string;
  communityId: string;
  communityName: string;
  authorName: string;
  body: string;
  savedAt: Date;
}

export interface UserQuestion {
  questionId: string;
  communityId: string;
  communityName: string;
  body: string;
  answerCount: number;
  status: "active" | "archived";
  createdAt: Date;
  lastAnswerAt?: Date;
}
