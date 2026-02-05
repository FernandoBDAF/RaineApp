import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import type { ProfileSetupData } from "../../types/profile-setup";
import { isFirebaseMockMode } from "../../config/environment";

export async function saveProfileSetup(uid: string, data: ProfileSetupData): Promise<void> {
  if (isFirebaseMockMode()) {
    return;
  }
  await firestore().collection("users").doc(uid).update({
    ...data,
    profileSetupCompleted: true,
    profileSetupCompletedAt: firestore.FieldValue.serverTimestamp()
  });
}

export async function uploadProfilePhoto(uid: string, uri: string): Promise<string> {
  if (isFirebaseMockMode()) {
    return uri;
  }
  const reference = storage().ref(`users/${uid}/profile.jpg`);
  await reference.putFile(uri);
  return reference.getDownloadURL();
}

export async function addToWaitlist(data: {
  email: string;
  zipCode: string;
  city: string;
  state: string;
  county: string;
}): Promise<void> {
  if (isFirebaseMockMode()) {
    return;
  }
  await firestore().collection("waitlist").add({
    ...data,
    source: "onboarding",
    createdAt: firestore.FieldValue.serverTimestamp()
  });
}
