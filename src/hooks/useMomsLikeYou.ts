import { useCallback, useEffect } from 'react';
import { useMomsLikeYouStore } from '../store/momsLikeYouStore';

/**
 * Ensures moms-like-you data is loaded and provides refresh.
 * Fetches once when profiles are empty and uid is available.
 */
export function useMomsLikeYou(uid: string | undefined) {
  const { profiles, isLoading, error, fetchRandomUsers } = useMomsLikeYouStore();

  const refresh = useCallback(() => {
    if (uid) {
      fetchRandomUsers(uid);
    }
  }, [uid, fetchRandomUsers]);

  useEffect(() => {
    if (uid && profiles.length === 0 && !isLoading) {
      fetchRandomUsers(uid);
    }
  }, [uid, profiles.length, isLoading, fetchRandomUsers]);

  return { profiles, isLoading, error, refresh };
}
