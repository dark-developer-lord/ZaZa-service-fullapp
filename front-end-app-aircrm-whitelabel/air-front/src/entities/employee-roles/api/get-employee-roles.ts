import { useQuery } from 'react-query'

import { ApiKeys, DataWrap, getQuery, VendorApi } from '@shared/api'

import { EmployeeRole } from '../model/types'

export const useGetEmployeeRoles = () => {
  return useQuery({
    queryKey: [ApiKeys.Employees.getEmployeeRoles],
    queryFn: getQuery<DataWrap<EmployeeRole>>(VendorApi.getEmployeeRoles),
    refetchOnMount: false,
  })
}
