/**
 * Environment configuration for the app.
 * Detects whether Firebase is properly configured and enables mock mode if not.
 */

// Check if we're in development mode
export const isDev = __DEV__;

// Firebase mock mode - enabled when Firebase config files are missing
// This will be automatically detected at runtime
let _firebaseMockMode = false;

export function setFirebaseMockMode(enabled: boolean) {
  _firebaseMockMode = enabled;
  if (enabled && isDev) {
    console.warn(
      '🔶 Firebase Mock Mode Enabled - Firebase services are mocked for UI testing.\n' +
      'To use real Firebase, add google-services.json (Android) or GoogleService-Info.plist (iOS) and rebuild.'
    );
  }
}

export function isFirebaseMockMode() {
  return _firebaseMockMode;
}

// App configuration
export const config = {
  app: {
    name: 'Raine',
    bundleId: 'com.raine.app',
  },
  firebase: {
    // Set to true to force mock mode even with config files present
    forceMockMode: false,
  },
  features: {
    // Default feature flags (used when Remote Config is unavailable)
    chatReactionsEnabled: true,
    newProfileUIEnabled: false,
    subscriptionGatingEnabled: false, // Disabled in mock mode
  },
} as const;
