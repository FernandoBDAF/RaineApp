import type { SocialProvider } from '../../types';
import { isFirebaseMockMode, isDev } from '../../config/environment';

export interface SocialAuthResult {
  success: boolean;
  error?: string;
  provider: SocialProvider;
}

/**
 * Fall back to mock auth when real social login is not available.
 */
async function mockSocialLogin(provider: SocialProvider): Promise<SocialAuthResult> {
  if (isDev) {
    console.log(`🔶 [Mock] ${provider} sign in`);
  }
  const { loginAsMockUser } = await import('./mock/mockAuth');
  loginAsMockUser();
  return { success: true, provider };
}

/**
 * Whether we should use the real Facebook SDK for social login.
 * Returns true ONLY in production when Firebase mock mode is off.
 * In development, we always use mock auth to avoid native SDK crashes
 * from unconfigured Facebook App ID.
 */
function shouldUseRealFacebookSdk(): boolean {
  if (isDev) return false;
  if (isFirebaseMockMode()) return false;
  return true;
}

export async function signInWithFacebook(): Promise<SocialAuthResult> {
  if (!shouldUseRealFacebookSdk()) {
    return mockSocialLogin('facebook');
  }

  try {
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
  if (!shouldUseRealFacebookSdk()) {
    return mockSocialLogin('linkedin');
  }
  return { success: false, error: 'LinkedIn sign in not yet implemented', provider: 'linkedin' };
}

export async function socialSignOut(): Promise<void> {
  if (!shouldUseRealFacebookSdk()) {
    if (isDev) {
      console.log('🔶 [Mock] Social sign out');
    }
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
