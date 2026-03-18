import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { ArrivalItemEdit } from '../model/warehouse'

export const useGetArrival = (id?: string) => {
  const params = useParams()
  const receiptId = id || Number(params.id)
  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getReceipt_ + receiptId],
    queryFn: getQuery<{ data: ArrivalItemEdit }>(getApiPaths().getReceipt_ + receiptId),
    enabled: Boolean(receiptId),
  })
}
