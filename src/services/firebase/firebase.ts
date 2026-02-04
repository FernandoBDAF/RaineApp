/**
 * Firebase app initialization.
 * This module is lazy-loaded to prevent crashes when Firebase is not configured.
 */

import { isFirebaseMockMode } from '../../config/environment';

export function getFirebaseApp() {
  if (isFirebaseMockMode()) {
    return null;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const firebase = require('@react-native-firebase/app').default;
  return firebase;
}
