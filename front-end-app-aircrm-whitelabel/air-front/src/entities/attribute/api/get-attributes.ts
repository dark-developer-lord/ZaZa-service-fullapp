import { useQuery, UseQueryOptions } from 'react-query'

import { ApiKeys, DataWrap, getApiPaths, getQuery } from '@shared/api'

import { Attribute } from '../model/types'

export const useGetAttributes = (
  options?: UseQueryOptions<
    DataWrap<Attribute>,
    unknown,
    DataWrap<Attribute>,
    ApiKeys.Attributes[]
  >,
) => {
  return useQuery({
    queryKey: [ApiKeys.Attributes.getAttributes],
    queryFn: getQuery<DataWrap<Attribute>>(getApiPaths().getAttributes),
    ...options,
  })
}
