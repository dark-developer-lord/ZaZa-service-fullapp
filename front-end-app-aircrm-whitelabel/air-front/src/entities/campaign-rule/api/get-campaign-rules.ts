import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery } from '@shared/api'

import { CampaignRule } from '../model/types'

export const useGetCampaignRules = (
  options?: UseQueryOptions<
    DataWrap<CampaignRule>,
    unknown,
    DataWrap<CampaignRule>,
    ApiKeys.Campaigns[]
  >,
) => {
  return useQuery({
    queryKey: [ApiKeys.Campaigns.getCampaignRules],
    queryFn: getQuery<DataWrap<CampaignRule>>(Api.getCampaignRules),
    ...options,
  })
}
