import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery } from '@shared/api'

import { Banner } from '../model/types'

export const useGetBanners = (
  options?: UseQueryOptions<
    DataWrap<Banner>,
    unknown,
    DataWrap<Banner>,
    ApiKeys.Banners[]
  >,
) => {
  return useQuery({
    queryKey: [ApiKeys.Banners.getBanners],
    queryFn: getQuery<DataWrap<Banner>>(Api.getBanners),
    ...options,
  })
}
