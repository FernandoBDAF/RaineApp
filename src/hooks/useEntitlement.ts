import { useEffect, useState } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { getCustomerInfo } from '../services/revenuecat';

export function useEntitlement(entitlementId: string) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const info = await getCustomerInfo();
        if (isMounted) {
          setCustomerInfo(info);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    const listener = (info: CustomerInfo) => {
      if (isMounted) {
        setCustomerInfo(info);
      }
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      isMounted = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const hasAccess = Boolean(customerInfo?.entitlements.active[entitlementId]);

  return { hasAccess, isLoading, customerInfo };
}
