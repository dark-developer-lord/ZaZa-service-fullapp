import { useState, useEffect, useMemo } from 'react';
import { useProfile } from '@shared/auth';
import { useQueries } from 'react-query';
import { getQuery } from '@shared/api';

const platforms = ['instagram', 'whatsapp', 'messenger'];

export const useGetStatus = () => {
  const { profile } = useProfile()
  const [shouldPoll, setShouldPoll] = useState(true)

  // Memoize the queries configuration to ensure it's always an array
  const queriesConfig = useMemo(() => {
    if (!Array.isArray(platforms)) return []
    return platforms.map(platform => ({
      queryFn: getQuery(`/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${platform}`),
      queryKey: [`/messengers/checkConnectionStatus?store_id=${profile?.id}&platform=${platform}`],
      enabled: Boolean(profile?.id),
      refetchInterval: shouldPoll ? 3000 : 0,
    }))
  }, [profile?.id, shouldPoll])

  // Check status for all platforms (react-query v3 expects an array, not an object)
  const queries = useQueries(queriesConfig)

  // Return true if all platform checks have completed
  const allCompleted =
    Array.isArray(queries) &&
    queries.length > 0 &&
    queries.every((query) => query && !query.isLoading && !query.isFetching)
  
  useEffect(() => {
    if (allCompleted && shouldPoll) {
      setShouldPoll(false)
    }
  }, [allCompleted, shouldPoll])
  
  return !shouldPoll
}
