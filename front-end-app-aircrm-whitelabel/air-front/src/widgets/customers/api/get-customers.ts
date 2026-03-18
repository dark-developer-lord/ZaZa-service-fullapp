import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'

import { CustomerItem } from '@entities/customer'
import { getApiPaths, Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetCustomers = (actionUrl?: string | null) => {
  const { paginationModel, searchValue } = useStore()
  const [searchParams] = useSearchParams()

  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }

  if (searchValue.trim()) {
    params.search = searchValue
  }

  // Add filter parameters from URL
  const birthday = searchParams.get('birthday')
  const type = searchParams.get('type')

  if (birthday) {
    params.birthday = birthday
  }

  if (type) {
    params.type = type
  }

  const urlParams = new URLSearchParams(params)

  // Use action URL if provided, otherwise use default customer API
  let url: string
  if (actionUrl) {
    // Parse the action URL and add pagination params
    const urlObj = new URL(actionUrl, window.location.origin)
    urlObj.searchParams.set('page', (paginationModel.page + 1).toString())
    urlObj.searchParams.set('per_page', paginationModel.pageSize.toString())
    url = urlObj.toString().replace(window.location.origin, '')
  } else {
    url = `${getApiPaths().getCustomers}?${urlParams.toString()}`
  }

  return useQuery({
    queryFn: getQuery<DataPagination<CustomerItem>>(url),
    queryKey: [ApiKeys.Customers.getCustomers, url],
    keepPreviousData: true,
  })
}
