import functions from "@react-native-firebase/functions";
import type { ProfileSetupData } from "../../types/profile-setup";
import { isFirebaseMockMode } from "../../config/environment";

interface BioResponse {
  bio: string;
}

function hasFirebaseApp(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const firebaseApp = require("@react-native-firebase/app").default;
    return Array.isArray(firebaseApp?.apps) && firebaseApp.apps.length > 0;
  } catch {
    return false;
  }
}

function buildFallbackBio(profile: ProfileSetupData): string {
  const name = profile.firstName ? profile.firstName : "a Raine mom";
  const location = profile.city && profile.state ? `${profile.city}, ${profile.state}` : "the Bay Area";
  const kids = profile.childCount ? `${profile.childCount} ${profile.childCount === 1 ? "child" : "children"}` : "kids";
  const vibe = profile.cityFeel ? profile.cityFeel.replace(/_/g, " ") : "finding her footing";
  return `Hi, I'm ${name} from ${location}. I'm a mom of ${kids} and I'm ${vibe} here. I’m excited to connect with other moms who get it.`;
}

export async function generateBio(profile: ProfileSetupData): Promise<string> {
  if (isFirebaseMockMode() || !hasFirebaseApp()) {
    return buildFallbackBio(profile);
  }
  const generateBioFn = functions().httpsCallable<
    { profile: ProfileSetupData },
    BioResponse
  >("generateProfileBio");
  try {
    const result = await generateBioFn({ profile });
    return result.data.bio;
  } catch (error) {
    console.warn("Bio generation failed, using fallback:", error);
    return buildFallbackBio(profile);
  }
}

export async function regenerateBio(
  profile: ProfileSetupData,
  feedback?: string
): Promise<string> {
  if (isFirebaseMockMode() || !hasFirebaseApp()) {
    return buildFallbackBio(profile);
  }
  const generateBioFn = functions().httpsCallable<
    { profile: ProfileSetupData; feedback?: string; regenerate?: boolean },
    BioResponse
  >("generateProfileBio");
  try {
    const result = await generateBioFn({ profile, feedback, regenerate: true });
    return result.data.bio;
  } catch (error) {
    console.warn("Bio regeneration failed, using fallback:", error);
    return buildFallbackBio(profile);
  }
}
