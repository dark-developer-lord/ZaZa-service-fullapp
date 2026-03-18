import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { OrderAccepted } from '../model/order-accepted'

export const useGetAccepted = (orderId?: number) => {
  const params = useParams()
  const id = orderId || params.id
  return useQuery({
    queryKey: [ApiKeys.Orders.getAccepted_ + id],
    queryFn: getQuery<{ data: OrderAccepted[] }>(
      getApiPaths().getReceiver_ + id,
    ),
    refetchOnMount: false,
    keepPreviousData: false,
  })
}
