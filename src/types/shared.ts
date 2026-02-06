export interface ActivityCounts {
  introRequests: number;
  unreadMessages: number;
  savedTips: number;
  questionResponses: number;
}

export interface TimelineItem {
  id: string;
  type: "intro" | "community_post" | "message";
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Date;
  preview: string;
  unread: boolean;
}
