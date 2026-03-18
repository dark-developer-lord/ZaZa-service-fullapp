import { Box, Grid } from '@mui/material'

import { LastOrders } from '@widgets/last-orders'
import { LayoutContent } from '@widgets/layout'
import { StatisticChart } from '@widgets/statistic-chart'
import { Statistics } from '@widgets/statistics'

import { TopFoods } from '../../widgets/top-foods'

export const Page = () => {
  return (
    <Box>
      <LayoutContent
      title="Показатели"
      >
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Statistics />
          </Grid>
          <Grid
            item
            xs={8}
          >
            <StatisticChart />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <LastOrders />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TopFoods />
          </Grid>
        </Grid>
      </LayoutContent>
    </Box>
  )
}
