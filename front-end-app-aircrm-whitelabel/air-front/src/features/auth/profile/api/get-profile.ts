import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import {
  getLSLoginSource,
  getSaasProfile,
  getToken,
  Profile,
  useGetPermissions,
  useProfile,
  VendorProfile,
  EmployeeProfile,
  SaasProfile,
} from '@shared/auth'

export const useGetProfile = () => {
  const permissionQuery = useGetPermissions()
  const loginSource = getLSLoginSource()
  const saasProfile = getSaasProfile()

  // Determine the correct profile endpoint based on login source
  const getProfileEndpoint = () => {
    const apiPaths = getApiPaths()
    if (loginSource === 'vendor-employee') {
      return (apiPaths as any).employeeProfile
    }
    return (apiPaths as any).profile
  }

  const query = useQuery(ApiKeys.Auth.profile, {
    queryFn: getQuery<{data: Profile | VendorProfile | EmployeeProfile} | EmployeeProfile>(getProfileEndpoint()),
    enabled: Boolean(getToken()) && loginSource !== 'saas'
  })
  const setProfile = useProfile((profile) => profile.setProfile)

  useEffect(() => {
    if (loginSource === 'saas' && saasProfile) {
      setProfile(saasProfile, 'saas')
    }
  }, [loginSource, saasProfile, setProfile])

  useEffect(() => {
    if (query.isSuccess && query.data) {
      let profileData: Profile | VendorProfile | EmployeeProfile | SaasProfile

      if (loginSource === 'vendor-employee') {
        profileData = query.data as EmployeeProfile
      } else {
        profileData = (query.data as {data: Profile | VendorProfile}).data
      }

      setProfile(profileData, getLSLoginSource()!)
    }
  }, [query, setProfile])

  return {
    ...query,
    isFetching: query.isFetching || permissionQuery.isFetching,
  }
}
