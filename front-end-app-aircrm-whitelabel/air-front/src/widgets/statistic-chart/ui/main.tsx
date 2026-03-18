import { useQuery } from 'react-query'
import { LoadingButton } from '@mui/lab'
import { Stack, Typography } from '@mui/material'

import { ChartStatistic } from '@entities/statistics'
import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { Board } from '@shared/ui'

import { SellStatistic } from '../api/response-type'
import { transformData } from '../lib/transform-data'
import { Chart } from './chart'
import { StatisticTotal } from './statistic-total'

export const Main = () => {
  const { isFetching, data, refetch, error } = useQuery({
    queryKey: [ApiKeys.Common.statisticsChart],
    queryFn: getQuery<SellStatistic>(getApiPaths().statisticChart),
  })

  if (error) {
    return (
      <Board
        sx={{
          minHeight: 420,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h5"
          mb={2}
        >
          Произошла ошибка при загрузки
        </Typography>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
        >
          Повторно загрузить
        </LoadingButton>
      </Board>
    )
  }

  let statistics: ChartStatistic[] = []
  if (data) {
    statistics = transformData(data.total_sell)
  }

  return (
    <Board
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction="row"
        spacing="16px"
      >
        <StatisticTotal
          label="Всего заработанно"
          value={data?.year}
          isLoading={isFetching}
        />
        <StatisticTotal
          label="За этот месяц"
          value={data?.month}
          isLoading={isFetching}
        />
        <StatisticTotal
          label="За сегодня"
          value={data?.today}
          isLoading={isFetching}
        />
      </Stack>
      <Chart
        data={statistics}
        isFetching={isFetching}
      />
    </Board>
  )
}
