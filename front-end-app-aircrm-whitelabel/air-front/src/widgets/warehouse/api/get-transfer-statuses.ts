import { useQuery } from 'react-query'
import { ApiKeys, getQuery, getApiPaths } from '@shared/api'

export interface TransferStatus {
  value: string
  label: string
}

interface TransferStatusesResponse {
  data: TransferStatus[]
}

export const useGetTransferStatuses = (type?: string, role?: string) => {
  const params = new URLSearchParams()
  if (type) {
    params.set('type', type)
  }
  if (role) {
    params.set('role', role)
  }

  const url = type
    ? `${getApiPaths().getTransferStatuses}?${params.toString()}`
    : getApiPaths().getTransferStatuses

  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getTransferStatuses, type, role],
    queryFn: getQuery<TransferStatusesResponse>(url),
    enabled: !!type, // Only fetch when type is provided
  })
}

