/**
 * Firebase initialization with mock mode fallback.
 * Detects if Firebase is properly configured and enables mock mode if not.
 */

import { setFirebaseMockMode, config } from '../../config/environment';

let initialized = false;

export async function initializeFirebase(): Promise<boolean> {
  if (initialized) {
    return !config.firebase.forceMockMode;
  }

  if (config.firebase.forceMockMode) {
    setFirebaseMockMode(true);
    initialized = true;
    return false;
  }

  try {
    // Try to import and initialize Firebase
    const { default: firebase } = await import('@react-native-firebase/app');
    
    // Check if any apps are initialized (indicates config files are present)
    const apps = firebase.apps;
    
    if (apps.length === 0) {
      console.warn('Firebase: No apps initialized, enabling mock mode');
      setFirebaseMockMode(true);
      initialized = true;
      return false;
    }

    console.log('✅ Firebase initialized successfully');
    setFirebaseMockMode(false);
    initialized = true;
    return true;
  } catch (error) {
    console.warn('Firebase initialization failed, enabling mock mode:', error);
    setFirebaseMockMode(true);
    initialized = true;
    return false;
  }
}
