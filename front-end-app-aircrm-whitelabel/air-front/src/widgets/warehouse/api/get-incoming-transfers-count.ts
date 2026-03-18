import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery, DataPagination } from '@shared/api'
import { TransferItem } from '@entities/warehouse'

interface CountResponse {
  count: number
}

/**
 * Hook to get the count of incoming transfers
 * Uses minimal pagination to get total count efficiently
 * Can be updated to use dedicated count endpoint when available
 */
export const useGetIncomingTransfersCount = () => {
  // Use minimal pagination (per_page=1) just to get the total count from pagination metadata
  const url = `${getApiPaths().getIncomingTransfers}?page=1&per_page=1`

  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getIncomingTransfersCount],
    queryFn: async () => {
      // Try to use dedicated count endpoint if available
      const countEndpoint = getApiPaths().getIncomingTransfersCount
      if (countEndpoint) {
        try {
          const response = await getQuery<CountResponse>(countEndpoint)()
          return response.count || 0
        } catch (error) {
          // Fallback to pagination approach if count endpoint doesn't exist yet
        }
      }
      
      // Fallback: get total from pagination metadata
      const response = await getQuery<DataPagination<TransferItem>>(url)()
      return (response as any).total || 0
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })
}
