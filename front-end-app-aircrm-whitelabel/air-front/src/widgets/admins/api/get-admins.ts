import { useQuery } from 'react-query'

import { Admin } from '@entities/admin'
import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetAdmins = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${Api.getAdmins}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<Admin>>(url),
    queryKey: [ApiKeys.Admins.getAdmins, url],
    keepPreviousData: true,
  })
}
