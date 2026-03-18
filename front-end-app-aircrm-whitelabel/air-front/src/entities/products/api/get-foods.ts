import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { Food } from '../../finance/model/food'

interface Props {
  search: string
  warehouseId?: number | null
  categories: number[]
  page?: number
  perPage?: number
  options?: UseQueryOptions<DataPagination<Food>>
}

export const useGetFoods = ({
  search,
  categories,
  warehouseId,
  options,
  page,
  perPage,
}: Props) => {
  return useQuery({
    queryKey: [
      ApiKeys.Common.restaurantFoods,
      { search, warehouseId, categories, page, perPage },
    ],
    queryFn: getQuery(
      getApiPaths().restaurantFoods_ +
      warehouseId +
        queryToParams({ search, categories, page, perPage }),
    ),
    enabled: Boolean(warehouseId),
    ...options,
  })
}

const queryToParams = ({
  search,
  categories,
  page,
  perPage,
}: Omit<Props, 'options' | 'warehouseId'>) => {
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
  categories.forEach((category) => {
    query.append('category_ids[]', category.toString())
  })
  return query.toString() ? `?${query.toString()}` : ''
}
