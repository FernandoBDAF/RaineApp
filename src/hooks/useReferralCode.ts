import { getAuth } from '@react-native-firebase/auth';
import { useCallback, useState } from 'react';
import { isReferralCodeTaken } from '../services/firebase/users';

export function useReferralCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkIfReferralCodeExists = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Anonymous login to get authentication token
      const auth = getAuth();
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }

      // Check if the referral code is taken
      const isReferralCodeTakenResult = await isReferralCodeTaken(code);

      // Delete the anonymous user
      await auth.currentUser?.delete();

      return isReferralCodeTakenResult;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error('Failed to check referral code');
      setError(errObj);
      throw errObj;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkIfReferralCodeExists, loading, error };
}
