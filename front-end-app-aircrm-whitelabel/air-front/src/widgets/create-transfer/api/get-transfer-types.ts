import { useQuery } from 'react-query'
import { ApiKeys, getQuery, getApiPaths } from '@shared/api'

export interface TransferType {
  value: string
  label: string
}

interface TransferTypesResponse {
  data: TransferType[]
}

export const useGetTransferTypes = () => {
  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getTransferTypes],
    queryFn: getQuery<TransferTypesResponse>(getApiPaths().getTransferTypes),
  })
}

