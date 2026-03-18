import { useQuery } from 'react-query'

import { getApiPaths, ApiKeys, getQuery } from '@shared/api'

import { CustomerItem } from '../model/customer-type'

export const useGetCustomer = (customerId: string | number) => {
  const url = `${getApiPaths().getCustomers}/${customerId}`

  return useQuery({
    queryFn: getQuery<{ data: CustomerItem }>(url),
    queryKey: [ApiKeys.Customers.getCustomers, customerId],
    enabled: !!customerId,
  })
}
