// Lazy-load RevenueCat to avoid NativeEventEmitter crash at import time
// when the native module is not fully initialized.
// NOTE: Do NOT use `typeof import('react-native-purchases')` here — metro
// can resolve the import at bundle time and trigger the native module load.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _Purchases: any = null;

function getPurchases() {
  if (!_Purchases) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _Purchases = require('react-native-purchases').default;
  }
  return _Purchases!;
}

let revenueCatConfigured = false;

function warnNotConfigured(action: string) {
  console.warn(
    `🔶 RevenueCat not configured; skipping ${action}. ` +
      'Set EXPO_PUBLIC_REVENUECAT_API_KEY to enable purchases.'
  );
}

export async function configureRevenueCat(userId?: string) {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';
  if (!apiKey) {
    revenueCatConfigured = false;
    return;
  }
  try {
    getPurchases().configure({ apiKey, appUserID: userId });
    revenueCatConfigured = true;
  } catch (error) {
    console.warn('🔶 RevenueCat configure failed:', error);
    revenueCatConfigured = false;
  }
}

export async function identifyUser(userId: string) {
  if (!revenueCatConfigured) {
    warnNotConfigured('identifyUser');
    return null;
  }
  return getPurchases().logIn(userId);
}

export async function getOfferings() {
  if (!revenueCatConfigured) {
    warnNotConfigured('getOfferings');
    return { current: null, all: {} };
  }
  return getPurchases().getOfferings();
}

export async function purchasePackage(pack: any) {
  if (!revenueCatConfigured) {
    warnNotConfigured('purchasePackage');
    return null;
  }
  return getPurchases().purchasePackage(pack);
}

export async function getCustomerInfo() {
  if (!revenueCatConfigured) {
    warnNotConfigured('getCustomerInfo');
    return {
      activeSubscriptions: [],
      allExpirationDates: {},
      allPurchaseDates: {},
      entitlements: { all: {}, active: {} },
      firstSeen: '',
      latestExpirationDate: null,
      originalAppUserId: '',
      originalApplicationVersion: null,
      requestDate: '',
      originalPurchaseDate: null,
      managementURL: null,
      nonSubscriptionTransactions: []
    };
  }
  return getPurchases().getCustomerInfo();
}

export async function restorePurchases() {
  if (!revenueCatConfigured) {
    warnNotConfigured('restorePurchases');
    return null;
  }
  return getPurchases().restorePurchases();
}
