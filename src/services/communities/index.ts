import type { Community, CommunityPost, PostReply } from "../../types/community";
import { getMockCommunities, getMockPosts, getMockReplies } from "../../utils/mockCommunities";

export function getCommunities(): Community[] {
  return getMockCommunities();
}

export function getCommunityById(id: string): Community | undefined {
  return getMockCommunities().find((c) => c.id === id);
}

export function getCommunityPosts(communityId: string): CommunityPost[] {
  return getMockPosts(communityId);
}

export function getNoteworthyPosts(communityId: string): CommunityPost[] {
  return getMockPosts(communityId).filter((p) => p.notable);
}

export function getAllNoteworthyPosts(): CommunityPost[] {
  return getMockPosts().filter((p) => p.notable);
}

export function getPostReplies(postId: string): PostReply[] {
  return getMockReplies(postId);
}

export function searchPosts(communityId: string, query: string): CommunityPost[] {
  const lowerQuery = query.toLowerCase();
  return getMockPosts(communityId).filter(
    (p) =>
      p.body.toLowerCase().includes(lowerQuery) ||
      p.authorName.toLowerCase().includes(lowerQuery)
  );
}
