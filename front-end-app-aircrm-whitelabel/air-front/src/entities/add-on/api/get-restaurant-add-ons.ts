import { useQuery } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery, VendorApi } from '@shared/api'
import { useGetLoginSource } from '@shared/auth'

import { AddOnItem } from '../model/types'

export const useGetRestaurantAddOns = (restaurantId?: number) => {
  const loginSource = useGetLoginSource()
  return useQuery({
    queryKey: [ApiKeys.AddOns.getRestaurantAddOns_ + restaurantId],
    queryFn: getQuery<DataWrap<AddOnItem>>(
      loginSource === 'admin'
        ? Api.getRestaurantAddOns_ + restaurantId
        : VendorApi.getAddOns,
    ),
    enabled: Boolean(restaurantId),
    refetchOnMount: false,
  })
}
