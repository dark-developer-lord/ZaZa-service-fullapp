import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { FoodEdit } from '../../finance/model/food'

export const useGetProduct = (id?: string) => {
  const params = useParams()
  const productId = id || Number(params.id)
  return useQuery({
    queryKey: [ApiKeys.Products.getProduct_ + productId],
    queryFn: getQuery<{ data: FoodEdit }>(getApiPaths().getProduct_ + productId),
    enabled: Boolean(productId),
  })
}
