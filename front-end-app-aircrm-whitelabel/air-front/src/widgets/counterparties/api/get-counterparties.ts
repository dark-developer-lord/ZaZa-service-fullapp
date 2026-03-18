import { useQuery } from 'react-query'

import { Counterparty } from '@entities/counterparty'
import { ApiKeys, DataPagination, getQuery, VendorApi } from '@shared/api'

import { useStore } from '../model/store'

export const useGetCounterparties = () => {
  const { paginationModel, searchValue } = useStore()
  
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  
  if (searchValue.trim()) {
    params.search = searchValue
  }

  const urlParams = new URLSearchParams(params)
  const url = `${VendorApi.getCounterparties}?${urlParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<Counterparty>>(url),
    queryKey: [ApiKeys.Counterparties.getCounterparties, url],
    keepPreviousData: true,
  })
}

