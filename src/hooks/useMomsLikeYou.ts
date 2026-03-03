import { useCallback, useEffect, useRef } from 'react';
import { useMomsLikeYouStore } from '../store/momsLikeYouStore';

/**
 * Ensures moms-like-you data is loaded and provides refresh.
 * Fetches once when uid is available. Uses a ref to avoid re-fetching when
 * the result is empty (e.g. DB has only the logged-in user) - otherwise
 * profiles.length === 0 && !isLoading would trigger an infinite loop.
 */
export function useMomsLikeYou(uid: string | undefined) {
  const hasFetchedRef = useRef(false);
  const lastUidRef = useRef<string | undefined>(undefined);
  const { profiles, isLoading, error, fetchRandomUsers } = useMomsLikeYouStore();

  const refresh = useCallback(() => {
    if (uid) {
      fetchRandomUsers(uid);
    }
  }, [uid, fetchRandomUsers]);

  useEffect(() => {
    if (!uid) return;
    if (lastUidRef.current !== uid) {
      hasFetchedRef.current = false;
      lastUidRef.current = uid;
    }
    if (!hasFetchedRef.current && !isLoading) {
      hasFetchedRef.current = true;
      fetchRandomUsers(uid);
    }
  }, [uid, isLoading, fetchRandomUsers]);

  return { profiles, isLoading, error, refresh };
}
