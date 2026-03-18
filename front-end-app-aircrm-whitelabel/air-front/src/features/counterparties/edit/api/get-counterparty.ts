import { useQuery } from 'react-query'

import { Counterparty } from '@entities/counterparty'
import { ApiKeys, getQuery, VendorApi } from '@shared/api'

export const useGetCounterparty = (id: number | null) => {
  const url = `${VendorApi.getCounterparty_}${id}`

  return useQuery({
    queryFn: getQuery<{ data: Counterparty }>(url),
    queryKey: [ApiKeys.Counterparties.getCounterparty, id],
    enabled: !!id,
  })
}

