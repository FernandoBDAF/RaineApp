import { useEffect, useState } from 'react';
import { getCustomerInfo } from '../services/revenuecat';

export function useEntitlement(entitlementId: string) {
  const [customerInfo, setCustomerInfo] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const info = await getCustomerInfo();
        if (isMounted) {
          setCustomerInfo(info as Record<string, any>);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    // Lazy-load Purchases listener to avoid NativeEventEmitter crash at import time
    let removeListener: (() => void) | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Purchases = require('react-native-purchases').default;
      const listener = (info: Record<string, any>) => {
        if (isMounted) {
          setCustomerInfo(info);
        }
      };
      Purchases.addCustomerInfoUpdateListener(listener);
      removeListener = () => Purchases.removeCustomerInfoUpdateListener(listener);
    } catch {
      // RevenueCat not available, skip listener
    }

    return () => {
      isMounted = false;
      removeListener?.();
    };
  }, []);

  const hasAccess = Boolean(
    customerInfo && (customerInfo as any)?.entitlements?.active?.[entitlementId]
  );

  return { hasAccess, isLoading, customerInfo };
}
