import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { Zone } from '../model/zone'

export const useGetZones = (options?: UseQueryOptions<Zone[]>) => {
  return useQuery({
    queryKey: [ApiKeys.Common.zones],
    queryFn: getQuery<Zone[]>(Api.getZones),
    refetchOnMount: false,
    ...options,
  })
}
