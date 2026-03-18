import { useQuery } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery } from '@shared/api'

import { AdminRole } from '../model/types'

export const useGetAdminRoles = () => {
  return useQuery({
    queryKey: [ApiKeys.Admins.getAdminRoles],
    queryFn: getQuery<DataWrap<AdminRole>>(Api.getAdminRoles),
    refetchOnMount: false,
  })
}
