import { isFirebaseMockMode, config } from '../../config/environment';
import remoteConfig from '@react-native-firebase/remote-config';

const defaultFlags = {
  chatReactionsEnabled: true,
  newProfileUIEnabled: false,
  subscriptionGatingEnabled: true
};

// In-memory cache for feature flags
let cachedFlags: Record<string, boolean> = { ...defaultFlags };

export async function initRemoteConfig() {
  if (isFirebaseMockMode()) {
    console.log('🔶 [Mock] Remote Config using default flags');
    cachedFlags = { ...config.features };
    return;
  }

  try {
    const rc = remoteConfig();
    await rc.setDefaults(defaultFlags);

    try {
      await rc.fetchAndActivate();
      const snapshot = Object.keys(defaultFlags).reduce(
        (acc, key) => {
          acc[key] = rc.getValue(key).asBoolean();
          return acc;
        },
        {} as Record<string, boolean>
      );
      cachedFlags = snapshot;
    } catch {
      // Keep cached defaults if fetch fails
    }
  } catch (error) {
    console.warn('Remote Config initialization failed:', error);
    cachedFlags = { ...defaultFlags };
  }
}

export function getFeatureFlag(key: keyof typeof defaultFlags): boolean {
  return cachedFlags[key] ?? defaultFlags[key];
}
