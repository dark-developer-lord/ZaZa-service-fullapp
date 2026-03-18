import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import {
  StoreItem
} from '../model/store'

interface Props {
    search: string
    page?: number
    perPage?: number
    options?: UseQueryOptions<DataPagination<StoreItem>>
  }

export const useGetStores = ({  
    search,
    options,
    page,
    perPage,
}: Props) => {
  return useQuery({
    queryKey: [ApiKeys.Stores.getStores, { search, page, perPage }],
    queryFn: getQuery(Api.getStores + queryToParams({ search, page, perPage })),
    refetchOnMount: false,
    ...options,
  })
}

const queryToParams = ({
    search,
    page,
    perPage,
  }: Omit<Props, 'options' | 'restaurantId'>) => {
    const query = new URLSearchParams()
    if (search.trim() !== '') {
      query.set('search', search)
    }
    if (page) {
      query.append('page', page.toString())
    }
    if (perPage) {
      query.append('per_page', perPage.toString())
    }
    return query.toString() ? `?${query.toString()}` : ''
  }