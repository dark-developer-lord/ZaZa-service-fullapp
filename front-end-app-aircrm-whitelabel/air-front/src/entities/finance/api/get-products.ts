import { useQuery } from 'react-query'
import { FoodItem } from '@entities/products'
import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

export const useGetProducts = () => {
  return useQuery({
      queryKey: [ApiKeys.Products.getFoods],
      queryFn: getQuery<DataPagination<FoodItem>>(Api.getFoods),
      keepPreviousData: true,
  })
}