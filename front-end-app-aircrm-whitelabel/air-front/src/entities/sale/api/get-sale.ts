import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { SaleShow } from '../model/sale-show-type'

export const useGetSale = (orderId?: number) => {
  const params = useParams()
  const id = orderId || params.id

  return useQuery({
    queryKey: [ApiKeys.Orders.getOrder_ + id],
    queryFn: getQuery<{ data: SaleShow }>(getApiPaths().getSale_ + id),
    refetchOnMount: false,
    keepPreviousData: false,
  })
}
