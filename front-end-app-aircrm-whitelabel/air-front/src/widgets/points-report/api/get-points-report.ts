import { useQuery } from 'react-query'

import { PointReport } from '@entities/points-report'
import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetPointsReport = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${Api.getPointsReport}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<PointReport>>(url),
    queryKey: [ApiKeys.Common.getPointsReport, url],
    keepPreviousData: true,
  })
}
