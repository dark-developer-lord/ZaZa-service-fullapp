import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '../api'
import { OrderStatusType } from './order-status'

export const useOrdersCounts = () => {
  return useQuery({
    queryKey: [ApiKeys.Common.navOrdersCount],
    queryFn: getQuery<Record<OrderStatusType | 'all', number>>(
      getApiPaths().navOrdersCount,
    ),
    refetchOnMount: false,
  })
}
