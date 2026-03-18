import { useQuery } from 'react-query'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { CourierShow } from '../model/courier'

export const useGetOperator = (courierId?: number) => {
  return useQuery({
    queryKey: [ApiKeys.Couriers.getCourier_ + courierId],
    queryFn: getQuery<{ data: CourierShow }>(Api.getCourier_ + courierId),
    enabled: Boolean(courierId),
  })
}
