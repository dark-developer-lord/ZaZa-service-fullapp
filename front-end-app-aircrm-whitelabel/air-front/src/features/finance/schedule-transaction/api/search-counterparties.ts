import { useQuery } from 'react-query'

import { ApiKeys, getQuery, VendorApi } from '@shared/api'

export interface CounterpartySearchResult {
  id: number
  counterparty: string
  name: string
  address: string
  requisite: string
  phone: string
  type: string
  type_label: string
  balance: string
  status: string
  status_label: string
  photo: string | null
}

export const useSearchCounterparties = (searchTerm: string, type?: string) => {
  const params = new URLSearchParams()

  if (searchTerm) {
    params.set('search', searchTerm)
  }

  if (type) {
    params.set('type', type)
  }

  const url = `${VendorApi.searchCounterparties}?${params.toString()}`

  return useQuery({
    queryKey: [ApiKeys.Counterparties.searchCounterparties, searchTerm, type],
    queryFn: getQuery<{ data: CounterpartySearchResult[] }>(url),
    enabled: searchTerm.length >= 2, // Only search when user has typed at least 2 characters
    refetchOnMount: false,
  })
}

