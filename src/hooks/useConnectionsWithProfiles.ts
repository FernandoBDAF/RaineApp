import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getConnectionsByConnectionUserUid } from '../services/firebase/connections';
import { getUserProfiles } from '../services/firebase/users';
import type { Connection } from '../types/connection';
import type { UserProfile } from '../types/user';

export interface ConnectionsWithProfiles {
  connection: Connection | undefined;
  connectionDocId: string | undefined;
  profiles: UserProfile[];
  profileMapByUid: Record<string, UserProfile>;
  connectionUids: string[];
  isLoading: boolean;
  isProfilesLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Busca as conexões do usuário e os perfis dos usuários conectados em cascata.
 * Um único hook orquestra as duas requisições: primeiro conexões, depois perfis (quando há connectionDetailsList).
 */
export function useConnectionsWithProfiles(uid: string | undefined): ConnectionsWithProfiles {
  const connectionsQuery = useQuery({
    queryKey: ['connections', uid],
    queryFn: async () => getConnectionsByConnectionUserUid(uid ?? ''),
    enabled: !!uid
  });

  const connectionData = connectionsQuery.data ?? undefined;
  const connection = connectionData?.connection ?? undefined;
  const connectionDocId = connectionData?.id ?? undefined;

  const uids =
    connection?.connectionDetailsList?.map((c) => c.userConnectedUid).filter(Boolean) ?? [];
  const uidsKey =
    uids.length > 0
      ? uids
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .join(',')
      : '';

  const profilesQuery = useQuery({
    queryKey: ['connection-profiles', uid, uidsKey],
    queryFn: () => getUserProfiles(uids),
    enabled: !!uid && uids.length > 0
  });

  const profiles = useMemo(() => profilesQuery.data ?? [], [profilesQuery.data]);
  const profileMapByUid = useMemo(
    () => Object.fromEntries(profiles.map((p) => [p.uid, p])),
    [profiles]
  );

  return {
    connection,
    connectionDocId,
    profiles,
    profileMapByUid,
    connectionUids: uids,
    isLoading: connectionsQuery.isLoading,
    isProfilesLoading: profilesQuery.isFetching && !profilesQuery.isLoading,
    isError: connectionsQuery.isError ?? false,
    refetch: () => {
      connectionsQuery.refetch();
    }
  };
}
