export const CITY_FEEL_OPTIONS = [
  { id: "rooted", label: "Rooted—this is home" },
  { id: "finding_footing", label: "Still finding your footing" },
  { id: "local_but_missing", label: "Like a local, but missing where you're from" }
] as const;

export const BEFORE_MOTHERHOOD_OPTIONS = [
  { id: "travel", title: "Travel", description: "get me to the next city (or country!)" },
  { id: "hosting", title: "Hosting", description: "give me an excuse to have people over" },
  {
    id: "movement",
    title: "Movement",
    description: "running, pilates, yoga—whatever gets me moving"
  },
  { id: "nature", title: "Nature", description: "if it's green and outside, I'm there" },
  { id: "culture", title: "Culture", description: "museums, music, theater—feed my soul" },
  { id: "career", title: "Career", description: "ambition was (is) my middle name" }
] as const;

export const PERFECT_WEEKEND_OPTIONS = [
  { id: "adventure", title: "Adventure", description: "spontaneous plans and zero itinerary" },
  { id: "slow_mornings", title: "Slow Mornings", description: "good coffee, no alarm, maybe brunch?" },
  {
    id: "good_company",
    title: "Good Company",
    description: "long meals, great wine, even better conversation"
  },
  { id: "discovery", title: "Discovery", description: "new places, new things, new obsessions" },
  { id: "movement", title: "Movement", description: "endorphins first, everything else second" },
  { id: "family", title: "Family", description: "the people who know you best" }
] as const;

export const FEEL_YOURSELF_OPTIONS = [
  { id: "alone_time", label: "Time completely alone (like, truly alone)" },
  { id: "partner_time", label: "Quality time with your partner" },
  { id: "friends_night", label: "A night out with friends" },
  { id: "change_scenery", label: "A change of scenery" }
] as const;

export const HARD_TRUTH_OPTIONS = [
  { id: "lose_myself", label: "That I'd lose myself for a while" },
  { id: "recovery_time", label: "How long recovery really takes" },
  { id: "mental_load", label: "How much of the mental load I'd carry" },
  { id: "little_sleep", label: "What little sleep actually means" },
  { id: "grief_joy", label: "That grief & joy would coexist" },
  { id: "relationship_change", label: "How my relationship would change" }
] as const;

export const UNEXPECTED_JOY_OPTIONS = [
  { id: "deeper_love", label: "How much deeper love can go" },
  { id: "person_becoming", label: "The person I'm becoming" },
  { id: "body_resilience", label: "My body's strength & resilience" },
  { id: "partner_parent", label: "Watching my partner as a parent" },
  { id: "function_no_sleep", label: "My capacity to function on no sleep" },
  { id: "fierce_instincts", label: "How fierce my instincts are" }
] as const;

export const AESTHETIC_OPTIONS = [
  { id: "clean_minimal", label: "Clean & minimal", color: "#F5F5F5" },
  { id: "natural_textured", label: "Natural & textured", color: "#D4C4A8" },
  { id: "classic_timeless", label: "Classic & timeless", color: "#2C3E50" },
  { id: "eclectic_collected", label: "Eclectic & collected", color: "#E74C3C" },
  { id: "coastal_casual", label: "Coastal casual", color: "#5DADE2" },
  { id: "refined_essentials", label: "Refined essentials", color: "#BDC3C7" }
] as const;

export const MOM_FRIEND_STYLE_OPTIONS = [
  { id: "coffee_dates", label: "Coffee dates (kid-free if possible!)" },
  { id: "playdates", label: "Playdates at the park" },
  { id: "group_hangouts", label: "Group hangouts & events" },
  { id: "virtual_chats", label: "Virtual chats & voice notes" },
  { id: "weekend_family", label: "Weekend family hangs" },
  { id: "workout_buddies", label: "Workout buddies" }
] as const;

export const WHAT_BROUGHT_YOU_OPTIONS = [
  { id: "new_here", label: "I'm new here and need my village" },
  { id: "friends_no_kids", label: "My current friends don't have kids yet" },
  { id: "moms_who_get_it", label: "Looking for moms who really get it" },
  { id: "deeper_connections", label: "Want deeper connections beyond small talk" }
] as const;

export const APPROVED_COUNTIES = [
  "San Francisco",
  "Marin",
  "Contra Costa",
  "Alameda",
  "San Mateo",
  "Santa Clara",
  "Sonoma",
  "Napa"
] as const;

export const TOTAL_STEPS = 14;
