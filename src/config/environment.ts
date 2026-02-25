export const isDev = __DEV__;

let _firebaseMockMode = false;

export function setFirebaseMockMode(enabled: boolean) {
  _firebaseMockMode = enabled;
}

export function isFirebaseMockMode() {
  return _firebaseMockMode;
}

export const config = {
  app: {
    name: 'Raine',
    bundleId: 'com.raine.app'
  },
  firebase: {
    forceMockMode: false
  },
  features: {
    chatReactionsEnabled: true,
    newProfileUIEnabled: false,
    subscriptionGatingEnabled: false
  }
} as const;
