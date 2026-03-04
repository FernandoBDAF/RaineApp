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
