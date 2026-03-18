import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery } from '@shared/api'

import { Campaign } from '../model/types'

export const useGetCampaigns = (
  options?: UseQueryOptions<
    DataWrap<Campaign>,
    unknown,
    DataWrap<Campaign>,
    ApiKeys.Campaigns[]
  >,
) => {
  return useQuery({
    queryKey: [ApiKeys.Campaigns.getCampaigns],
    queryFn: getQuery<DataWrap<Campaign>>(Api.getCampaigns),
    ...options,
  })
}
