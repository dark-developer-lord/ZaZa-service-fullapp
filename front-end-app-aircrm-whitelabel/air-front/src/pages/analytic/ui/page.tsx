import { Box, Grid, useMediaQuery, useTheme } from '@mui/material'

import { LayoutContent } from '@widgets/layout'
import { StatisticChart } from '@widgets/statistic-chart'
import { Marginality } from '@widgets/analytic'

import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'

export const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <Box>
      <LayoutContent
        title="Аналитика"
        breadcrumbs={[
          {
            label: 'Отчеты',
            name: 'analytic'
          },
          {
            label: 'Аналитика',
            name: 'analytic',
          },
        ]}
        rightSlot={ <SystemAnalyticDropdown /> }
      >
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
        >
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
            <Marginality />
          </Grid>
        </Grid>
      </LayoutContent>
    </Box>
  )
}