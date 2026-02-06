import type {
  MatchProfile,
  Introduction,
  SavedConnection,
} from "../../types/introduction";
import {
  mockMatchProfiles,
  mockActiveIntroductions,
  mockSavedConnections,
  mockPendingIntroductions,
  mockPendingProfiles,
  mockLastMessages,
} from "../../utils/mockIntroductions";

export function getMatchProfiles(): MatchProfile[] {
  return mockMatchProfiles;
}

export function getActiveConversations(): Introduction[] {
  return mockActiveIntroductions;
}

export function getSavedConnections(): SavedConnection[] {
  return mockSavedConnections;
}

export function getPendingRequests(): Introduction[] {
  return mockPendingIntroductions;
}

export function getPendingProfiles(): MatchProfile[] {
  return mockPendingProfiles;
}

export function getLastMessage(roomId: string): { text: string; timestamp: Date } | undefined {
  return mockLastMessages[roomId];
}

export function getProfileByUserId(userId: string): MatchProfile | undefined {
  return [...mockMatchProfiles, ...mockPendingProfiles].find(
    (p) => p.userId === userId
  );
}
