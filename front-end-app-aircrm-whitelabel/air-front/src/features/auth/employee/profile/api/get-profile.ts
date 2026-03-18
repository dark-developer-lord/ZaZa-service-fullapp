import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { ApiKeys, VendorApi, getQuery } from '@shared/api'
import {
  getLSLoginSource,
  getToken,
  Profile,
  useProfile,
} from '@shared/auth'

export const useGetProfile = () => {
  const query = useQuery(ApiKeys.Auth.profile, {
    queryFn: getQuery<{data: Profile}>(VendorApi.employeeProfile),
    enabled: Boolean(getToken()) && getLSLoginSource() === 'vendor-employee'
  })
  const setProfile = useProfile((profile) => profile.setProfile)

  useEffect(() => {
    if (query.isSuccess) {
      setProfile(query.data?.data, getLSLoginSource()!)
    }
  }, [query, setProfile])

  return {
    ...query,
  }
}
