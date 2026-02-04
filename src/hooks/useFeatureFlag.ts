import { useEffect, useState } from 'react';
import { getFeatureFlag, initRemoteConfig } from '../services/firebase/remoteConfig';

export function useFeatureFlag(key: 'chatReactionsEnabled' | 'newProfileUIEnabled' | 'subscriptionGatingEnabled') {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => getFeatureFlag(key));

  useEffect(() => {
    let mounted = true;
    initRemoteConfig().then(() => {
      if (mounted) {
        setIsEnabled(getFeatureFlag(key));
      }
    });
    return () => {
      mounted = false;
    };
  }, [key]);

  return { isEnabled };
}
