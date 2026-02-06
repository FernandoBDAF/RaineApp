import { Redirect } from 'expo-router';

/**
 * Root index route. The _layout.tsx navigation guard handles the actual
 * redirect (to onboarding, auth, profile-setup, or tabs). We redirect
 * to onboarding/splash here so there's no white flash while the guard runs.
 */
export default function Index() {
  return <Redirect href="/(onboarding)/splash" />;
}
