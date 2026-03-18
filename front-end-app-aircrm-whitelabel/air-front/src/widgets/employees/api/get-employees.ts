import { useQuery } from 'react-query'

import { Admin } from '@entities/admin'
import { ApiKeys, DataPagination, getQuery, VendorApi } from '@shared/api'

import { useStore } from '../model/store'

export const useGetEmployees = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${VendorApi.getEmployees}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<Admin>>(url),
    queryKey: [ApiKeys.Employees.getEmployees, url],
    keepPreviousData: true,
  })
}
