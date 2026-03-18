import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

export interface VendorItem {
  id: number
  name: string
  phone: string
  vendor_number?: string
}

interface VendorsResponse {
  data: VendorItem[]
}

export const useSearchVendors = (search: string) => {
  const params = new URLSearchParams()
  if (search.trim()) {
    params.set('search', search)
  }

  const url = `${getApiPaths().searchVendors}?${params.toString()}`

  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.searchVendors, search],
    queryFn: getQuery<VendorsResponse>(url),
    enabled: search.trim().length >= 2,
    keepPreviousData: false,
  })
}

