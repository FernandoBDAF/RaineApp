import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// Mock implementations for when Firebase is not configured

const getMessaging = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messaging = require('@react-native-firebase/messaging').default;
  return messaging();
};

export async function requestNotificationPermission() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messaging = require('@react-native-firebase/messaging').default;
  const authStatus = await getMessaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFcmToken() {
  return getMessaging().getToken();
}

export function onForegroundMessage(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return getMessaging().onMessage(handler);
}

export function onNotificationOpened(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void
) {
  return getMessaging().onNotificationOpenedApp(handler);
}

export async function getInitialNotification() {
  return getMessaging().getInitialNotification();
}
