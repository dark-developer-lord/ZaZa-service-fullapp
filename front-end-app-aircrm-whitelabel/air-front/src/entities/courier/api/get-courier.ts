import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { CourierShow } from '../model/courier'

export const useGetCourier = (courierId?: number) => {
  return useQuery({
    queryKey: [ApiKeys.Couriers.getCourier_ + courierId],
    queryFn: getQuery<{ data: CourierShow }>(getApiPaths().getCourier_ + courierId),
    enabled: Boolean(courierId),
  })
}
