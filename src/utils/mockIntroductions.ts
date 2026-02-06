import type {
  MatchProfile,
  Introduction,
  SavedConnection,
} from "../types/introduction";

// ── Match Profiles ──────────────────────────────────────────────────────────

export const mockMatchProfiles: MatchProfile[] = [
  {
    userId: "match_1",
    firstName: "Amanda",
    lastInitial: "R",
    photoURL: "https://picsum.photos/300/400?random=1",
    city: "Austin",
    state: "TX",
    children: [{ name: "Liam", age: "3" }],
    tags: ["Montessori", "Food Allergies", "Outdoor Play"],
    matchDescription:
      "Shares your Montessori philosophy and navigating toddler food allergies",
    matchScore: 94,
    bio: "Former teacher turned stay-at-home mom. Love exploring parks and farmers markets with my little one.",
  },
  {
    userId: "match_2",
    firstName: "Brooke",
    lastInitial: "T",
    photoURL: "https://picsum.photos/300/400?random=2",
    city: "Austin",
    state: "TX",
    children: [
      { name: "Ella", age: "2" },
      { name: "James", age: "5" },
    ],
    tags: ["Sleep Training", "Sibling Dynamics", "Working Mom"],
    matchDescription:
      "Also balancing two under five and loves swapping sleep-training tips",
    matchScore: 91,
    bio: "Product manager by day, chaos manager by night. Always up for a playdate or a coffee chat.",
  },
  {
    userId: "match_3",
    firstName: "Natalie",
    lastInitial: "K",
    photoURL: "https://picsum.photos/300/400?random=3",
    city: "Dallas",
    state: "TX",
    children: [{ name: "Mia", age: "1" }],
    tags: ["First-Time Mom", "Postpartum Fitness", "Book Club"],
    matchDescription:
      "First-time mom who shares your love for postpartum fitness routines",
    matchScore: 88,
    bio: "New mom finding my groove. I run a tiny book club for moms and would love more members!",
  },
  {
    userId: "match_4",
    firstName: "Isabella",
    lastInitial: "M",
    photoURL: "https://picsum.photos/300/400?random=4",
    city: "Houston",
    state: "TX",
    children: [
      { name: "Noah", age: "4" },
      { name: "Ava", age: "1" },
    ],
    tags: ["Bilingual Parenting", "Travel", "Gentle Parenting"],
    matchDescription:
      "Raising bilingual kids and practicing gentle parenting, just like you",
    matchScore: 87,
    bio: "Bilingual household (English/Spanish). We travel as much as possible and love making new friends along the way.",
  },
  {
    userId: "match_5",
    firstName: "Sophia",
    lastInitial: "W",
    photoURL: "https://picsum.photos/300/400?random=5",
    city: "San Antonio",
    state: "TX",
    children: [{ name: "Oliver", age: "2" }],
    tags: ["Plant-Based", "Sensory Play", "Minimalism"],
    matchDescription:
      "Fellow plant-based mom exploring sensory play ideas for toddlers",
    matchScore: 85,
    bio: "Minimalist, plant-based mama. I DIY most of our sensory bins and would love to trade ideas.",
  },
];

// ── Active Introductions (accepted, with roomId) ───────────────────────────

export const mockActiveIntroductions: Introduction[] = [
  {
    id: "intro_a1",
    fromUserId: "me",
    toUserId: "match_1",
    status: "accepted",
    roomId: "room_intro_1",
    mutualCommunities: 3,
    matchDescription: mockMatchProfiles[0].matchDescription,
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    respondedAt: new Date(Date.now() - 1 * 60 * 1000),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "intro_a2",
    fromUserId: "match_2",
    toUserId: "me",
    status: "accepted",
    roomId: "room_intro_2",
    mutualCommunities: 2,
    matchDescription: mockMatchProfiles[1].matchDescription,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
    respondedAt: new Date(Date.now() - 30 * 60 * 1000),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "intro_a3",
    fromUserId: "me",
    toUserId: "match_3",
    status: "accepted",
    roomId: "room_intro_3",
    mutualCommunities: 1,
    matchDescription: mockMatchProfiles[2].matchDescription,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "intro_a4",
    fromUserId: "match_4",
    toUserId: "me",
    status: "accepted",
    roomId: "room_intro_4",
    mutualCommunities: 4,
    matchDescription: mockMatchProfiles[3].matchDescription,
    createdAt: new Date("2025-11-03T10:00:00"),
    respondedAt: new Date("2025-11-03T12:00:00"),
    expiresAt: new Date("2025-11-10T12:00:00"),
  },
  {
    id: "intro_a5",
    fromUserId: "me",
    toUserId: "match_5",
    status: "accepted",
    roomId: "room_intro_5",
    mutualCommunities: 2,
    matchDescription: mockMatchProfiles[4].matchDescription,
    createdAt: new Date("2025-10-28T14:00:00"),
    respondedAt: new Date("2025-10-29T09:00:00"),
    expiresAt: new Date("2025-11-05T09:00:00"),
  },
];

// ── Saved Connections ───────────────────────────────────────────────────────

export const mockSavedConnections: SavedConnection[] = [
  {
    userId: "match_1",
    firstName: "Amanda",
    lastInitial: "R",
    photoURL: "https://picsum.photos/300/400?random=1",
    bio: "Former teacher turned stay-at-home mom. Love exploring parks and farmers markets.",
    mutualCommunities: 3,
    matchDescription: mockMatchProfiles[0].matchDescription,
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    userId: "match_3",
    firstName: "Natalie",
    lastInitial: "K",
    photoURL: "https://picsum.photos/300/400?random=3",
    bio: "New mom finding my groove. I run a tiny book club for moms.",
    mutualCommunities: 1,
    matchDescription: mockMatchProfiles[2].matchDescription,
    savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    userId: "match_4",
    firstName: "Isabella",
    lastInitial: "M",
    photoURL: "https://picsum.photos/300/400?random=4",
    bio: "Bilingual household (English/Spanish). We travel as much as possible.",
    mutualCommunities: 4,
    matchDescription: mockMatchProfiles[3].matchDescription,
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    userId: "match_5",
    firstName: "Sophia",
    lastInitial: "W",
    photoURL: "https://picsum.photos/300/400?random=5",
    bio: "Minimalist, plant-based mama. I DIY most of our sensory bins.",
    mutualCommunities: 2,
    matchDescription: mockMatchProfiles[4].matchDescription,
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

// ── Pending Introductions ───────────────────────────────────────────────────

export const mockPendingIntroductions: Introduction[] = [
  {
    id: "intro_p1",
    fromUserId: "pending_1",
    toUserId: "me",
    status: "pending",
    mutualCommunities: 2,
    matchDescription:
      "Also a working mom in tech, navigating daycare transitions",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "intro_p2",
    fromUserId: "pending_2",
    toUserId: "me",
    status: "pending",
    mutualCommunities: 3,
    matchDescription:
      "Shares your passion for outdoor adventures with toddlers",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "intro_p3",
    fromUserId: "pending_3",
    toUserId: "me",
    status: "pending",
    mutualCommunities: 1,
    matchDescription:
      "First-time mom looking for a supportive community nearby",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

// ── Mock conversation messages (for ConversationRow preview) ────────────────

export const mockLastMessages: Record<string, { text: string; timestamp: Date }> = {
  room_intro_1: {
    text: "Would love to swap Montessori activity ideas!",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  room_intro_2: {
    text: "That sleep schedule tip was a lifesaver 😴",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  room_intro_3: {
    text: "Are you going to the Saturday farmers market?",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  room_intro_4: {
    text: "¡Hola! My kids loved that bilingual book you recommended",
    timestamp: new Date("2025-11-03T14:30:00"),
  },
  room_intro_5: {
    text: "Here's the sensory bin recipe I mentioned 🌱",
    timestamp: new Date("2025-10-29T10:00:00"),
  },
};

// ── Pending profile details (for pending screen avatars / cards) ────────────

export const mockPendingProfiles: MatchProfile[] = [
  {
    userId: "pending_1",
    firstName: "Rachel",
    lastInitial: "D",
    photoURL: "https://picsum.photos/300/400?random=11",
    city: "Austin",
    state: "TX",
    children: [{ name: "Zoe", age: "2" }],
    tags: ["Working Mom", "Daycare", "Tech Industry"],
    matchDescription:
      "Also a working mom in tech, navigating daycare transitions",
    matchScore: 82,
    bio: "Software engineer and toddler mom. Coffee is my love language.",
  },
  {
    userId: "pending_2",
    firstName: "Taylor",
    lastInitial: "S",
    photoURL: "https://picsum.photos/300/400?random=12",
    city: "Round Rock",
    state: "TX",
    children: [{ name: "Leo", age: "3" }],
    tags: ["Hiking", "Nature Play", "Adventurous"],
    matchDescription:
      "Shares your passion for outdoor adventures with toddlers",
    matchScore: 80,
    bio: "We hike every weekend, rain or shine. Always looking for trail buddies!",
  },
  {
    userId: "pending_3",
    firstName: "Morgan",
    lastInitial: "L",
    photoURL: "https://picsum.photos/300/400?random=13",
    city: "Cedar Park",
    state: "TX",
    children: [{ name: "Ivy", age: "6m" }],
    tags: ["First-Time Mom", "Community", "Support"],
    matchDescription:
      "First-time mom looking for a supportive community nearby",
    matchScore: 78,
    bio: "Brand new to this mom life! Looking for other moms to navigate it with.",
  },
];
