import type { SocialProvider } from '../../types';
import { isFirebaseMockMode } from '../../config/environment';

export interface SocialAuthResult {
  success: boolean;
  error?: string;
  provider: SocialProvider;
}

export async function signInWithFacebook(): Promise<SocialAuthResult> {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Facebook sign in');
    // Import mock auth and trigger login
    const { loginAsMockUser } = await import('./mock/mockAuth');
    loginAsMockUser();
    return { success: true, provider: 'facebook' };
  }

  try {
    // Lazy load Facebook SDK and Firebase Auth
    const { AccessToken, LoginManager } = await import('react-native-fbsdk-next');
    const auth = (await import('@react-native-firebase/auth')).default;

    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      return { success: false, error: 'Sign in cancelled', provider: 'facebook' };
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      return { success: false, error: 'Failed to get access token', provider: 'facebook' };
    }

    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    await auth().signInWithCredential(credential);

    return { success: true, provider: 'facebook' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Facebook sign in failed';
    return { success: false, error: message, provider: 'facebook' };
  }
}

export async function signInWithInstagram(): Promise<SocialAuthResult> {
  const result = await signInWithFacebook();
  return { ...result, provider: 'instagram' };
}

export async function signInWithLinkedIn(): Promise<SocialAuthResult> {
  return { success: false, error: 'LinkedIn sign in not yet implemented', provider: 'linkedin' };
}

export async function socialSignOut(): Promise<void> {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Social sign out');
    const { setMockUser } = await import('./mock/mockAuth');
    setMockUser(null);
    return;
  }

  try {
    const { LoginManager } = await import('react-native-fbsdk-next');
    LoginManager.logOut();
  } finally {
    const auth = (await import('@react-native-firebase/auth')).default;
    await auth().signOut();
  }
}
