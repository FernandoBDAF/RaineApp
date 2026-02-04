import Purchases, { CustomerInfo } from 'react-native-purchases';

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
  Purchases.configure({ apiKey, appUserID: userId });
  revenueCatConfigured = true;
}

export async function identifyUser(userId: string) {
  if (!revenueCatConfigured) {
    warnNotConfigured('identifyUser');
    return null as unknown as ReturnType<typeof Purchases.logIn>;
  }
  return Purchases.logIn(userId);
}

export async function getOfferings() {
  if (!revenueCatConfigured) {
    warnNotConfigured('getOfferings');
    return { current: null, all: {} } as unknown as ReturnType<typeof Purchases.getOfferings>;
  }
  return Purchases.getOfferings();
}

export async function purchasePackage(pack: Parameters<typeof Purchases.purchasePackage>[0]) {
  if (!revenueCatConfigured) {
    warnNotConfigured('purchasePackage');
    return null as unknown as ReturnType<typeof Purchases.purchasePackage>;
  }
  return Purchases.purchasePackage(pack);
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
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
    } as CustomerInfo;
  }
  return Purchases.getCustomerInfo();
}

export async function restorePurchases() {
  if (!revenueCatConfigured) {
    warnNotConfigured('restorePurchases');
    return null as unknown as ReturnType<typeof Purchases.restorePurchases>;
  }
  return Purchases.restorePurchases();
}
