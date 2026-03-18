import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { OrderShow } from '../model/order-show-types'

export const useGetOrder = (orderId?: number) => {
  const params = useParams()
  const id = orderId || params.id

  return useQuery({
    queryKey: [ApiKeys.Orders.getOrder_ + id],
    queryFn: getQuery<{ data: OrderShow }>(getApiPaths().getOrder_ + id),
    refetchOnMount: false,
    keepPreviousData: false,
  })
}
