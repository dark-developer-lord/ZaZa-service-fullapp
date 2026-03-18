import { useQuery } from 'react-query'

import { useStatisticStore } from '@features/statistics-dropdown'
import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { Statistics } from '../index'

export const useGetStatistics = () => {
  const activeKey = useStatisticStore((state) => state.activeKey)
  const { data, isFetching, isRefetching } = useQuery({
    queryKey: [ApiKeys.Common.statistics, activeKey],
    queryFn: getQuery<Statistics>(
      getApiPaths().statistics_ + '?duration=' + activeKey,
    ),
    refetchOnMount: false,
  })

  return {
    data,
    isFetching,
    isRefetching,
  }
}
