import { Box, useTheme } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { axisClasses } from '@mui/x-charts/ChartsAxis'

import { ChartStatistic } from '@entities/statistics'

const chartSetting = {
  height: 340,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
    width: '100%',
  },
}

const valueFormatter = (value: number | null) => `${value} сомони`

interface Props {
  isFetching: boolean
  data?: ChartStatistic[]
}

export const Chart = ({ data, isFetching }: Props) => {
  const { palette } = useTheme()
  return (
    <Box>
      <BarChart
        dataset={data || []}
        loading={isFetching}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'month',
          },
        ]}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            hidden: true,
          },
          axisLine: {
            stroke: palette.grey[500],
            strokeOpacity: 0.5,
          },
        }}
        series={[{ dataKey: 'total', label: 'Заработано', valueFormatter }]}
        borderRadius={24}
        colors={[palette.success.main]}
        {...chartSetting}
      />
    </Box>
  )
}
