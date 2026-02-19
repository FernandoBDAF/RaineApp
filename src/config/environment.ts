/**
 * Environment configuration for the app.
 * Detects whether Firebase is properly configured and enables mock mode if not.
 *
 * In development (`__DEV__`), mock mode is ALWAYS enabled because:
 * - Social login uses mock auth (Facebook SDK not configured)
 * - The mock user has no real Firestore/Storage permissions
 * - This keeps the full UI flow working without a real backend
 */

// Check if we're in development mode
export const isDev = __DEV__;

// Firebase mock mode flag set by _layout.tsx startup check
let _firebaseMockMode = false;

export function setFirebaseMockMode(enabled: boolean) {
  _firebaseMockMode = enabled;
  if ((enabled || isDev) && isDev) {
    console.warn(
      '🔶 Firebase Mock Mode Enabled - Firebase services are mocked for UI testing.\n' +
        'To use real Firebase in production, add google-services.json and configure the Facebook SDK.'
    );
  }
}

/**
 * Returns true when Firebase services should be mocked.
 * Always true in dev mode (mock auth means no real Firestore permissions).
 */
export function isFirebaseMockMode() {
  return _firebaseMockMode || config.firebase.forceMockMode;
}

// App configuration
export const config = {
  app: {
    name: 'Raine',
    bundleId: 'com.raine.app'
  },
  firebase: {
    // Set to true to force mock mode even with config files present
    forceMockMode: false
  },
  features: {
    // Default feature flags (used when Remote Config is unavailable)
    chatReactionsEnabled: true,
    newProfileUIEnabled: false,
    subscriptionGatingEnabled: false // Disabled in mock mode
  }
} as const;
